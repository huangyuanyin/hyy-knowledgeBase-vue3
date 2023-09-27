<script lang="ts" setup>
import { getGroupsApi } from '@/api/groups'
import { getBookStacksApi } from '@/api/bookstacks'

const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog'])

const infoStore = useInfoStore()
const userStore = useUserStore()
const route = useRoute()
const spaceId = ref(route.query.id)
const selectGroupName = ref('')
const teamList = ref([])
const publicList = [
  {
    id: '0',
    label: '仅协作者可访问'
  },
  {
    id: '1',
    label: '空间所有成员可访问'
  }
]
const spaceData = ref({
  name: '',
  stacks: '',
  slug: new Date().getTime().toString(),
  avatar: '',
  description: '',
  creator: userStore.userInfo.nickname,
  public: '1',
  group: '',
  space: spaceId.value
})

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      const { groupsList, getGroups } = await useGroupsApi(getGroupsApi, { space: spaceId.value })
      getGroups()
      teamList.value = groupsList.value
    }
    console.log(`output->infoStore.currentSidebar`, teamList.value)
  }
)

const {
  dialogVisible,
  dialogFormRef: libraryFormRef,
  dialogForm: libraryForm,
  handleClose,
  handleSubmit
} = useFormDialog({ isShow: ref(props.isShow), emit, formData: spaceData.value })

const selectTeam = async (val) => {
  selectGroupName.value = teamList.value.filter((item) => item.id === val)[0].groupname
  const params = {
    group: val,
    space: spaceId.value
  }
  const { bookstacksList, getBookstacks } = await useBookstacksApi(getBookStacksApi, params, false)
  await getBookstacks()
  spaceData.value.stacks = bookstacksList.value.filter((item) => item.is_default === '1')[0].id
  console.log(`output->spaceData.value.stacks`, bookstacksList.value, spaceData.value.stacks, spaceData.value)
}
</script>

<template>
  <el-dialog class="libraryDialog" v-model="dialogVisible" title="新建知识库" width="424" :before-close="handleClose">
    <el-form ref="libraryFormRef" :model="libraryForm" label-width="120px" label-position="top">
      <el-form-item label="基本信息" prop="name">
        <div class="form-name">
          <div class="bookIcon">
            <img src="/src/assets/icons/bookIcon.svg" alt="" />
          </div>
          <el-input v-model="libraryForm.name" placeholder="知识库名称" maxlength="10" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item label="" class="form-description" prop="description">
        <el-input v-model="libraryForm.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="知识库简介（选填）" />
      </el-form-item>
      <el-form-item label="新建至" v-if="infoStore.currentSidebar === 'Sidebar'">
        <el-select v-model="libraryForm.group" prop="public">
          <template #prefix>
            <img class="prefix-icon" src="/src/assets/icons/library/publicIcon.svg" />
          </template>
          <el-option :label="item.author" :value="item.id" v-for="(item, index) in teamList" :key="'teamList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <img :src="item.img" />
                <span style="float: left">{{ item.author }}</span>
              </div>
              <img class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新建至" v-if="infoStore.currentSidebar === 'SpaceSidebar'">
        <el-select v-model="libraryForm.group" prop="group" @change="selectTeam">
          <template #prefix>
            <img v-if="selectGroupName === '公共区'" class="prefix-icon" src="/src/assets/icons/library/publicIcon.svg" />
            <img v-else class="prefix-icon" src="/src/assets/icons/teamIcon.svg" />
          </template>
          <el-option :label="item.groupname" :value="item.id" v-for="(item, index) in teamList" :key="'teamList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <img v-if="item.groupname === '公共区'" src="/src/assets/icons/library/publicIcon.svg" />
                <img v-else :src="item.icon || '/src/assets/icons/teamIcon.svg'" />
                <span style="float: left">{{ item.groupname }}</span>
              </div>
              <img v-if="item.id === libraryForm.group" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公开性" class="public-item" v-if="infoStore.currentSidebar === 'SpaceSidebar'">
        <el-select v-model="libraryForm.public" prop="group">
          <el-option :label="item.label" :value="item.id" v-for="(item, index) in publicList" :key="'publicList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <span style="float: left">{{ item.label }}</span>
              </div>
              <img v-if="item.id === libraryForm.public" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', libraryForm.name ? '' : 'submit-disabled']" type="primary" @click="handleSubmit" :disabled="!libraryForm.name"> 新建 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-public {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .selectIcon {
    width: 14px;
    height: 14px;
    margin-left: 8px;
  }
  &-left {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      // border-radius: 24px;
      margin-right: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
.public-item {
  margin-top: 24px;
}
</style>

<style lang="scss">
.libraryDialog {
  border-radius: 8px;
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .el-form-item {
    margin-bottom: 12px;
    border-radius: 6px;
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 40px;
    border-radius: 6px;
  }
  .form-description {
    margin-bottom: 24px;
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
    .bookIcon {
      border-radius: 4px;
      padding: 6px;
      width: 40px;
      height: 40px;
      border: 1px solid #d8dad9;
      margin-right: 6px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .prefix-icon {
    width: 24px;
    height: 24px;
    border-radius: 24px;
  }
  .library-footer {
    .submit {
      width: 100%;
      height: 40px;
      color: #fff;
      background-color: #00b968;
      border: none;
      border-radius: 6px;
      &:hover {
        cursor: pointer;
        background-color: #009456;
      }
    }
    .submit-disabled {
      cursor: not-allowed !important;
      background-color: #b2eab2 !important;
    }
  }
}
</style>
