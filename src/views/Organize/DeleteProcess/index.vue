<script lang="ts" setup>
import { editSpacesApi } from '@/api/spaces'
import downIcon from '@/assets/icons/organize/downIcon.svg'

const infoStore = useInfoStore()
const spaceItem = ref<any>([
  {
    title: '成员',
    count: '-'
  },
  {
    title: '团队',
    count: '-'
  },
  {
    title: '知识库',
    count: '-'
  },
  {
    title: '文档',
    count: '-'
  }
])
const deleteTime = ref('')
const spaceInfo = ref<any>({})
const isLoading = ref(false)
const loadingText = ref('')

watchEffect(() => {
  if (infoStore.currentMenu === 'deleteProcess') {
    useSpace().getSpaceInfo(Number(infoStore.currentQuery?.sid), (res: any) => {
      if (Reflect.ownKeys(res).length === 0) return
      spaceInfo.value = res
      spaceItem.value[0].count = res.member_count
      const dateObject = new Date(Date.parse(res.update_datetime) + 30 * 24 * 60 * 60 * 1000)
      const year = dateObject.getFullYear()
      const month = String(dateObject.getMonth() + 1).padStart(2, '0')
      const day = String(dateObject.getDate()).padStart(2, '0')
      const hours = String(dateObject.getHours()).padStart(2, '0')
      const minutes = String(dateObject.getMinutes()).padStart(2, '0')
      const seconds = String(dateObject.getSeconds()).padStart(2, '0')
      deleteTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    })
  }
})

const toCancelDelete = () => {
  ElMessageBox.confirm('确认撤销删除吗？', ``, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'submitBtn',
    cancelButtonClass: 'cancelBtn',
    customClass: 'cancelDeleteDialog',
    appendTo: '.DeleteProcess_wrap',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false
  })
    .then(() => {
      editSpaces()
    })
    .catch(() => {})
}

const editSpaces = async () => {
  const params = {
    is_delete: '0',
    spacekey: spaceInfo.value.spacekey,
    spacetype: spaceInfo.value.spacetype,
    spacename: spaceInfo.value.spacename
  }
  let res = await editSpacesApi(params, infoStore.currentQuery?.sid)
  if (res.code === 1000) {
    isLoading.value = true
    loadingText.value = `小黄同学正在恢复【${infoStore.currentQuery.sname}】空间，请稍后...`
    setTimeout(() => {
      loadingText.value = `【${infoStore.currentQuery.sname}】空间已恢复，即将跳转...`
      setTimeout(() => {
        router.push({
          path: `/${spaceInfo.value.spacekey}/dashboard`,
          query: {
            sid: infoStore.currentQuery?.sid,
            sname: spaceInfo.value.spacename
          }
        })
      }, 2000)
    }, 4000)
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <header bg="#fff" h-60px relative z-2 border-b="1px solid #e7e9e8" flex items-center justify-between pl-24px pr-24px>
    <div flex items-center>
      <img w-26px h-26px mr-6px rounded-4px src="@/assets/favicon.ico" />
      <span font-800 text-16px mr-8px> 信安知识库</span>
      <ChangeSpacePopver placement="bottom-start">
        <slot><img :src="downIcon" alt="" /> </slot>
      </ChangeSpacePopver>
    </div>
    <div flex items-center>
      <el-tooltip effect="dark" content="消息中心" placement="bottom">
        <span class="tongzhi" cursor-pointer relative pt-5px pb-5px pr-5px pl-5px line-height-20px h-30px rounded-6px block text-center flex items-center mr-12px>
          <svg-icon iconName="icon-tongzhi" className="tongzhi_svg"></svg-icon>
          <sub class="tongzhi-dot" bg="#117cee" text="#fff" absolute rounded-full top="20%" right="20%" w-8px h-8px></sub>
        </span>
      </el-tooltip>
      <UserPopver />
    </div>
  </header>
  <div class="DeleteProcess_wrap" v-if="!isLoading">
    <div mx-auto w-645px mt-60px border="1px solid #e7e9e8" rounded-5px bg="#fff">
      <img src="https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*Js_NRZRMXegAAAAAAAAAAABkARQnAQ" alt="" />
      <div pb-40px pr-32px pl-32px>
        <h1 text-24px mt-6px text="#262626">"{{ infoStore.currentQuery?.sname }}" 空间已进入删除流程</h1>
        <p mt-8px text-14px text="#262626">删除操作将在 {{ deleteTime }} 生效, 在生效前你可以撤销该操作。</p>
        <div bg="#fafafa" pt-26px pb-26px mt-20px rounded-5px flex justify-between>
          <div class="item" flex flex-col w-full items-center relative v-for="(item, index) in spaceItem" :key="'spaceItem' + index">
            <h2 mb-8px text-14px>
              <span>{{ item.title }}</span>
            </h2>
            <p text-30px text="#262626" font-700>{{ item.count }}</p>
          </div>
        </div>
        <el-button class="cancel" mt-30px @click="toCancelDelete">撤销删除</el-button>
      </div>
    </div>
  </div>
  <Loading v-else :text="loadingText" />
</template>

<style lang="scss" scoped>
.tongzhi {
  &:hover {
    background-color: #eff0f0;
  }
}

.DeleteProcess_wrap {
  .item {
    &::after {
      width: 1px;
      height: 50%;
      background-color: #e7e9e8;
      content: ' ';
      position: absolute;
      top: 25%;
      right: 0;
    }
    &:last-child::after {
      display: none;
    }
  }
  .cancel {
    border: none;
    background-color: #00b968;
    color: #fff;
    border-radius: 8px;
    &:hover {
      color: #fff;
      cursor: pointer;
      background-color: #009456;
    }
  }
  :deep(.el-overlay-message-box) {
    top: -40%;
  }
  :deep(.cancelDeleteDialog) {
    padding: 32px 32px 24px;
    border-radius: 8px;
    .el-message-box__header {
      display: none;
    }
    .el-message-box__message {
      font-size: 16px;
    }
    .submitBtn,
    .cancelBtn {
      margin-left: 8px;
      border-radius: 6px;
      box-shadow: none;
      height: 32px;
      padding: 4px 15px;
      font-size: 14px;
    }
    .submitBtn {
      color: #fff;
      background: #00b96b;
      border-color: #00b96b;
    }
    .cancelBtn {
      color: #262626;
      background: #fff;
      border-color: #e7e9e8;
      &:hover {
        color: #00b96b;
        border-color: #00b96b;
      }
    }
  }
}
</style>
