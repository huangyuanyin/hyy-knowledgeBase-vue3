<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'
import { FormInstance } from 'element-plus'
import { getBookStacksApi } from '@/api/bookstacks'
import { addLibraryApi } from '@/api/library'

interface RuleForm {
  [key: string]: any
}

const props = defineProps({
  isShow: Boolean,
  stackId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['closeDialog', 'getBookStacks'])

const route = useRoute()
const infoStore = useInfoStore()
const dataStore = useDataStore()
const refreshStroe = useRefreshStore()
const spaceType = ref('') // 当前空间类型
const spaceId = ref('') // 当前空间id
const selectGroupName = ref('')
const teamList = ref([]) // 当前空间下的全部团队
const stacksList = ref([]) // 知识库分组集合
const publicList = ref([])
const dialogVisible = ref(false)
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || '@/assets/img/img.jpg')
const libraryFormRef = ref<FormInstance>()
const libraryForm = reactive<RuleForm>({
  name: '',
  slug: '',
  avatar: '',
  description: '',
  public: '',
  space: '',
  group: '1',
  stacks: ''
})

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      await handleNewData()
      if (infoStore.currentSidebar === 'SpaceSidebar') {
        teamList.value = dataStore.teamList
        if (libraryForm.stacks === '' || libraryForm.stacks === 'undefined') {
          teamList.value.map(async (it) => {
            if (it.is_default === '1') {
              libraryForm.group = String(it.id)
              selectGroupName.value = it.groupname
              await getBookStacks(it.id)
              libraryForm.stacks = String(stacksList.value.filter((item) => item.is_default === '1')[0]?.id) || ''
            }
          })
        } else {
          await getBookStacks(libraryForm.group)
        }
      } else if (infoStore.currentSidebar === 'Sidebar') {
        teamList.value = [
          {
            id: localStorage.getItem('personalGroupId'),
            img: avatar.value,
            groupname: JSON.parse(localStorage.getItem('userInfo')).name
          }
        ]
        libraryForm.group = teamList.value[0].id
        await getBookStacks(libraryForm.group)
        if (libraryForm.stacks === 'undefined' || libraryForm.stacks === '') {
          libraryForm.stacks = String(stacksList.value.filter((item) => item.is_default === '1')[0]?.id) || ''
        }
      }
    }
  }
)

const handleID = () => {
  sessionStorage.getItem('currentSidebar') === 'Sidebar' ? (spaceType.value = '个人') : (spaceType.value = '组织')
  spaceId.value = spaceType.value === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
}

watchEffect(() => {
  if (props.isShow) {
    handleID()
  }
  if (selectGroupName.value === '公共区' || route.query.gname === '公共区') {
    publicList.value = [
      {
        id: '1',
        label: '空间所有成员可访问'
      }
    ]
    libraryForm.public = '1'
  } else {
    publicList.value = [
      {
        id: '0',
        label: '仅协作者可访问'
      }
    ]
    libraryForm.public = '0'
  }
})

const handleNewData = () => {
  libraryForm.stacks = props.stackId || ''
  console.log(`output->libraryForm.stacks `, libraryForm.stacks)
  libraryForm.slug = uuidv4().replace(/-/g, '')
  libraryForm.group = String(route.query.gid) || ''
  libraryForm.space = spaceId.value
}

const toSubmit = async () => {
  try {
    await libraryFormRef.value.validate()
    await addLibrary()
  } catch (error) {
    console.log(error)
  }
}

const handleResetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const toClose = async () => {
  handleResetForm(libraryFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}

// 如果当前团队与选择的团队不一直被，就默认选中第一个知识库分组
const handleStackId = (val) => {
  if (val === libraryForm.group) {
    if (props.stackId === 'undefined') {
      return (libraryForm.stacks = String(stacksList.value.filter((item) => item.is_default === '1')[0]?.id) || '')
    }
    libraryForm.stacks = props.stackId ? props.stackId : String(stacksList.value.filter((item) => item.is_default === '1')[0].id)
  } else {
    libraryForm.stacks = stacksList.value.filter((item) => item.is_default === '1')[0]?.id || ''
  }
}

// 切换团队
const toSelectTeam = async (val) => {
  selectGroupName.value = teamList.value.filter((item) => item.id == val)[0].groupname
  await getBookStacks(val)
  await handleStackId(val)
}

// 新建知识库
const addLibrary = async () => {
  let res = await addLibraryApi(libraryForm)
  if (res.code === 1000) {
    toClose()
    ElMessage.success('新建成功')
    refreshStroe.setRefreshQuickBookList(true)
    refreshStroe.setRefreshBookStacks(true) // 刷新知识库分组列表
    refreshStroe.setRefreshBookList(true) // 刷新知识库列表
  } else {
    ElMessage.error(res.msg)
  }
}

// 获取知识库分组列表
const getBookStacks = async (val) => {
  const params = {
    space: spaceId.value,
    group: val
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    stacksList.value = res.data as any
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <el-dialog class="libraryDialog" v-model="dialogVisible" title="新建知识库" width="424" :before-close="toClose">
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
            <img class="prefix-icon" :src="avatar" />
          </template>
          <el-option :label="item.groupname" :value="item.id" v-for="(item, index) in teamList" :key="'teamList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <img :src="item.img" />
                <span style="float: left">{{ item.groupname }}</span>
              </div>
              <img class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新建至" v-if="infoStore.currentSidebar === 'SpaceSidebar'">
        <el-select v-model="libraryForm.group" prop="group" @change="toSelectTeam">
          <template #prefix>
            <img v-if="selectGroupName === '公共区'" class="prefix-icon" src="/src/assets/icons/library/publicIcon.svg" />
            <img v-else class="prefix-icon" src="/src/assets/icons/teamIcon.svg" />
          </template>
          <el-option :label="item.groupname" :value="String(item.id)" v-for="(item, index) in teamList" :key="'teamList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <img v-if="item.groupname === '公共区'" src="/src/assets/icons/library/publicIcon.svg" />
                <img v-else :src="item.icon || '/src/assets/icons/teamIcon.svg'" />
                <span style="float: left">{{ item.groupname }}</span>
              </div>
              <img v-if="item.id == libraryForm.group" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
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
      <el-form-item label="分组" class="public-item">
        <el-select v-model="libraryForm.stacks">
          <el-option :label="item.name" :value="String(item.id)" v-for="(item, index) in stacksList" :key="'stacksList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <span style="float: left">{{ item.name }}</span>
              </div>
              <img v-if="item.id == libraryForm.stacks" class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', libraryForm.name ? '' : 'submit-disabled']" type="primary" @click="toSubmit" :disabled="!libraryForm.name"> 新建 </el-button>
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
