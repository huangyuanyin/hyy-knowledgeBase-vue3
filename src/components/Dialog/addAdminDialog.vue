<script lang="ts" setup>
import { editSpacepermissionsApi, getSpacepermissionsApi } from '@/api/spacepermissions'

const props = defineProps({
  isShow: Boolean,
  selectMember: Array // 已添加的成员
})
const emit = defineEmits(['closeDialog'])

const infoStore = useInfoStore()
const avatar = 'http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('xinAn-userInfo') || '{}').avatar
const dialogVisible = ref(false)
const loading = ref(false)
const inputValue = ref('')
const list = ref([])
const memberOptions = ref([])

watch(
  () => props.isShow,
  async (newVal: boolean) => {
    if (newVal) {
      dialogVisible.value = newVal
      inputValue.value = ''
      getSpacepermissions()
    }
  }
)

const handleClose = async () => {
  dialogVisible.value = false
  emit('closeDialog', false)
}

const remoteMethod = (query: string) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      memberOptions.value = list.value.filter((item) => {
        return item.permusername.toLowerCase().includes(query.toLowerCase()) || item.user.name.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    memberOptions.value = []
  }
}

const getSpacepermissions = async () => {
  const params = {
    space: infoStore.currentQuery?.sid,
    permtype: '1' // 0：管理员  1：成员
  }
  let res = await getSpacepermissionsApi(params)
  if (res.code === 1000) {
    list.value = res.data || ([] as any)
  } else {
    ElMessage.error(res.msg)
  }
}

const toAddAdmin = (val) => {
  editSpacepermissions(val.id, val.permusername)
}

const editSpacepermissions = async (id, permusername) => {
  const params = {
    space: infoStore.currentQuery?.sid,
    permusername,
    permtype: '0'
  }
  let res = await editSpacepermissionsApi(id, params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    emit('closeDialog', true)
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <el-dialog class="addAdminDialog" v-model="dialogVisible" title="添加管理员" width="520" :before-close="handleClose">
    <el-select
      class="selectAdmin"
      v-model="inputValue"
      filterable
      remote
      placeholder="输入姓名、昵称 进行搜索"
      :remote-method="remoteMethod"
      :loading="loading"
      no-data-text="未搜索到结果"
    >
      <el-option v-for="item in memberOptions" :key="item.permusername" :label="item.permusername" :value="item.permusername">
        <div class="options" @click="toAddAdmin(item)">
          <img class="icon" :src="'http://10.4.150.56:8032/' + item.user.avatar || avatar" alt="" />
          <span class="name">{{ item.user.nickname }}</span>
          <span class="dept">（{{ item.user.dept_name }}）</span>
        </div>
      </el-option>
    </el-select>
  </el-dialog>
</template>

<style lang="scss" scoped>
.options {
  display: flex;
  align-items: center;
  .icon {
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
  .name {
    color: #262626;
    font-size: 14px;
    margin-left: 12px;
  }
  .dept {
    margin-left: 18px;
    color: #8a8f8d;
  }
}
</style>

<style lang="scss">
.selectAdmin {
  width: 100%;
  .el-select__wrapper {
    border: 1px solid #0bd07d !important;
    box-shadow: none !important;
    border-radius: 6px !important;
  }
  .el-input__wrapper {
  }
  .el-select__input {
    margin-left: 0px !important;
  }
}
</style>
