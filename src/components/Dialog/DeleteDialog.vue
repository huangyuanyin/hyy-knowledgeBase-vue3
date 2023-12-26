<script lang="ts" setup>
import { deleteGroupsApi } from '@/api/groups'
import { deleteLibraryApi } from '@/api/library'
import { deleteSpacesApi } from '@/api/spaces'

const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  deleteInfo: {
    type: Object as any,
    default: () => ({})
  },
  title: {
    type: String,
    default: '删除知识库'
  }
})
const emit = defineEmits(['closeDialog'])

const route = useRoute()
const router = useRouter()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const visible = ref(false)
const inputName = ref('')

watch(
  () => props.isShow,
  (newVal: boolean) => {
    visible.value = newVal
  }
)

// 删除知识库/空间
const toDelete = async (val) => {
  if (inputName.value !== props.deleteInfo.slug) {
    return ElMessage.error('输入的路径名称错误, 请重新输入')
  }
  if (props.title === '删除知识库') {
    const params = {
      space: val.space,
      group: val.group,
      stack: val.stack
    }
    let res = await deleteLibraryApi(val.id, params)
    if (res.code === 1000) {
      closeDialog()
      ElMessage.success('删除成功')
      if (infoStore.currentSidebar === '"DirectorySidebar"') {
        const query = {
          sid: route.query.sid,
          sname: route.query.sname
        }
        router.push({
          path: `/${route.path.split('/')[1]}/dashboard`,
          query: infoStore.currentSpaceType === '组织' ? query : {}
        })
      }
      refreshStroe.setRefreshQuickBookList(true)
      refreshStroe.setRefreshBookStacks(true)
      refreshStroe.setRefreshBookList(true)
    } else {
      ElMessage.error(res.msg)
    }
  } else if (props.title === '删除空间') {
    let res = await deleteSpacesApi(val.id)
    if (res.code === 1000) {
      closeDialog()
      // 两秒后给出删除成功提示，1s后跳转到首页
      setTimeout(() => {
        ElMessage.success('删除成功，即将跳转到首页...')
      }, 1000)
      setTimeout(() => {
        router.push({ path: '/home' })
      }, 2000)
    } else {
      ElMessage.error(res.msg)
    }
  } else if (props.title === '删除团队') {
    let res = await deleteGroupsApi(val.id)
    if (res.code === 1000) {
      closeDialog()
      // 0.5秒后给出删除成功提示，2.5s后跳转到首页
      setTimeout(() => {
        ElMessage.success('删除成功，即将跳转到空间首页...')
      }, 500)
      setTimeout(() => {
        router.push({
          path: `/${route.path.split('/')[1]}/dashboard`,
          query: {
            sid: route.query.sid,
            sname: route.query.sname
          }
        })
      }, 2500)
    } else {
      ElMessage.error(res.msg)
    }
  }
}

const closeDialog = () => {
  visible.value = false
  inputName.value = ''
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="deleteLibraryDialog" v-model="visible" width="520px" @close="closeDialog">
    <template #header="{ titleId, titleClass }">
      <div class="header">
        <h4 :id="titleId" :class="titleClass">{{ props.title }}</h4>
      </div>
    </template>
    <div class="body">
      <div class="desc">
        <div>
          正在{{ props.title }}
          <span class="highlight_name">{{ deleteInfo.name }}</span>
          ，该操作不可逆，一旦操作成功，该{{ props.title.substring(2) }}下的所有内容将会删除。请输入下面内容再次确认操作。
        </div>
      </div>
      <div class="tip">
        请在下方输入框中输入 "<span>{{ props.deleteInfo.slug }}</span
        >"以确认操作
      </div>
      <div class="input">
        <el-input v-model="inputName" :placeholder="props.deleteInfo.slug" />
      </div>
      <div class="button">
        <el-button :disabled="!inputName" :class="[!inputName ? 'is_disabled' : '']" @click="toDelete(deleteInfo)">
          <span class="text">确定删除 {{ props.deleteInfo.name }}</span>
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.deleteLibraryDialog {
  border-radius: 8px;
  .header {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .body {
    font-size: 14px;
    box-sizing: border-box;
    .desc {
      margin-bottom: 16px;
      padding: 15px;
      box-sizing: border-box;
      background-color: #f9efcd;
      border: 1px solid #f5d480;
      border-radius: 6px;
      div {
        font-size: 14px;
        line-height: 24px;
        color: #262626;
        font-variant: tabular-nums;
        font-feature-settings: 'tnum';
        word-wrap: break-word;
        .highlight_name {
          font-size: 14px;
          line-height: 22px;
          color: #df2a3f;
        }
      }
    }
    .tip {
      line-height: 40px;
      color: #262626;
      font-size: 14px;
    }
    .input {
      line-height: 40px;
      font-size: 14px;
      margin-bottom: 16px;
      .el-input__wrapper {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
    }
    .button {
      line-height: 40px;
      font-size: 14px;
      width: 100%;
      .el-button {
        width: 100%;
        border-radius: 6px;
        margin-left: 12px;
        margin-left: 0px;
        .text {
          color: #df2a3f;
        }
        &:hover {
          background-color: #e4495b;
          border-color: #e4495b;
          .text {
            color: #fff;
          }
        }
      }
      .is_disabled {
        &:hover {
          background-color: #fff !important;
          .text {
            color: #df2a3f;
          }
        }
      }
    }
  }
}
</style>
