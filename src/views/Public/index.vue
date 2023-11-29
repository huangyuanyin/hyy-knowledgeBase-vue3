<script lang="ts" setup>
import publicTagIcon from '@/assets/icons/publicTagIcon.svg'
import rightArrowIcon from '@/assets/icons/rightArrowIcon.svg'
import edit from '@/assets/icons/public/edit.svg'
import deleteIcon from '@/assets/icons/public/delete.svg'
import { getBookStacksApi } from '@/api/bookstacks'
import { editGroupsApi, getGroupsDetailApi } from '@/api/groups'
import { getLibraryApi } from '@/api/library'
import { getQuickLinksApi } from '@/api/quickLinks'

interface BookGroup {
  id: number
  name: string
  is_default: string
}

const route = useRoute()
const refreshStroe = useRefreshStore()
const spaceId = ref('') // 当前空间id
const groupId = ref('') // 当前公共区id
const bookGroup = ref([])
const commonList = ref([])
const libarayList = ref([])
const groupInfo = ref({
  groupname: '',
  groupkey: ''
}) // 公共区团队信息
const isEdit = ref(false) // 是否为编辑状态
const bulletinValue = ref('') // 公告内容
const toolbar = ref('')

watchEffect(() => {
  spaceId.value = route.query.sid as string
  groupId.value = route.query.gid as string
  toolbar.value = 'blocks fontsize bold  align bullist numlist  lineheight  link  hr  tableofcontents tableofcontentsupdate | emoticons image fullscreen  preview autolink  '
})

watch(
  () => refreshStroe.isRefreshQuickBookList,
  async (newVal) => {
    if (newVal) {
      await getBookStacks()
      await getLibrary()
      await getQuickLinks()
    }
  }
)

const toCancel = () => {
  isEdit.value = false
  getGroupsDetail()
}

const toDelete = () => {
  ElMessageBox.confirm(
    `<span class="confirm-title">确认删除 空间公告 吗？</span>
  <span class="confirm-content">清空后不可复原</span>
  `,
    '',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      confirmButtonClass: 'submitBtn',
      cancelButtonClass: 'cancelBtn',
      customClass: 'deleteArticleDialog',
      type: 'warning',
      showClose: false,
      dangerouslyUseHTMLString: true
    }
  )
    .then(() => {
      bulletinValue.value = ''
      editGroups()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}

// 获取当前空间下公共区的知识库分组列表
const getBookStacks = async () => {
  const params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data as unknown as BookGroup[]
  }
}

// 获取当前空间下的常用知识库列表
const getQuickLinks = async () => {
  const params = {
    target_type: 'book',
    space: spaceId.value
  }
  let res = await getQuickLinksApi(params)
  if (res.code === 1000) {
    commonList.value = res.data || ([] as any)
    // 遍历知识库列表和常用知识库列表，如果id和target_id相同，就把is_common设置为true,否则设置为false
    libarayList.value.forEach((item) => {
      item.is_common_id = null
      commonList.value.forEach((val) => {
        if (item.id === Number(val.target_id)) {
          item.is_common_id = val.id
        }
      })
    })
  }
}

// 获取当前空间下公共区的知识库列表
const getLibrary = async () => {
  let params = {}
  params = {
    space: spaceId.value,
    group: groupId.value
  }
  let res = await getLibraryApi(params)
  if (res.code === 1000) {
    libarayList.value = res.data || ([] as any)
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
      grouping: true
    })
  }
}

const getGroupsDetail = async () => {
  let res = await getGroupsDetailApi(Number(groupId.value))
  if (res.code === 1000) {
    bulletinValue.value = res.data.body
    groupInfo.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const editGroups = async () => {
  const params = {
    space: route.query.sid as string,
    groupkey: groupInfo.value.groupkey,
    groupname: groupInfo.value.groupname,
    body: bulletinValue.value
  }
  let res = await editGroupsApi(params, Number(groupId.value))
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    isEdit.value = false
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(async () => {
  await getGroupsDetail()
  await getBookStacks()
  await getLibrary()
  await getQuickLinks()
})
</script>

<template>
  <div class="Public_wrap">
    <div class="header">
      <span>公共区</span>
      <div class="tag">
        <img :src="publicTagIcon" alt="" />
        <el-tooltip class="box-item" effect="dark" content="公共区内容面向空间所有成员开放" placement="bottom">
          <span>全员可见</span>
        </el-tooltip>
      </div>
    </div>
    <SwitchModuleItem
      :moduleGenre="'info'"
      :moduleGenreData="[
        {
          type: 'info',
          name: '公告信息'
        },
        {
          type: 'article',
          name: '精选文章'
        }
      ]"
    />
    <div class="announcement" v-if="!isEdit && !bulletinValue" @click="isEdit = true">
      <div>管理员可以添加面向全体成员的公告信息</div>
      <img :src="rightArrowIcon" alt="" />
    </div>
    <div class="announcement edit" v-if="isEdit">
      <TinyMCE v-model="bulletinValue" :resize="true" height="500px" :toolbar="toolbar" body-style="body { margin: 1rem 2% 1rem 2% }" />
      <div class="operation">
        <el-button class="submit" @click="editGroups">确定</el-button>
        <el-button text @click="toCancel">取消</el-button>
      </div>
    </div>
    <div class="announcement preview" v-if="!isEdit && bulletinValue">
      <div class="operation">
        <span @click="isEdit = true">
          <img :src="edit" alt="" />
        </span>
        <span @click="toDelete">
          <img :src="deleteIcon" alt="" />
        </span>
      </div>
      <MavonEditor :html="bulletinValue" :navigation="false" />
    </div>
    <div class="content">
      <SwitchModuleItem moduleType="operation">
        <template v-slot:left><span class="title">知识库</span></template>
      </SwitchModuleItem>
      <LibraryTable title="知识库" :commonList="commonList" :group="bookGroup" @getBookStacks="getBookStacks" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Public_wrap {
  max-width: 1585px;
  :deep(.SwitchModuleItem-wrap) {
    margin-bottom: 0px;
  }
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    span {
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      font-weight: 700;
      color: #262626;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    .tag {
      display: flex;
      align-items: center;
      margin-left: 16px;
      border-radius: 6px;
      background-color: #f4f5f5;
      font-size: 12px;
      padding: 5px;
      display: inline-flex;
      height: 22px;
      box-sizing: border-box;
      cursor: pointer;
      img {
        width: 12px;
        height: 12px;
      }
      span {
        line-height: 30px;
        margin-left: 4px;
        font-size: 12px;
        font-weight: 400;
        height: 30px;
      }
    }
  }
  .announcement {
    margin-top: 20px;
    height: 57px;
    border-radius: 8px;
    color: #bec0bf;
    border: 1px dashed #d8dad9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      color: #bec0bf;
      cursor: pointer;
      font-size: 14px;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    img {
      transform: rotate(180deg);
    }
  }
  .edit {
    height: 550px !important;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    border: none;
    :deep(.tox-tinymce) {
      border: 1px solid #e7e9e8;
      border-radius: 4px;
    }
    .operation {
      margin-top: 20px;
      .submit {
        color: #fff;
        background-color: #00b968;
        border: none;
        border-radius: 6px;
        &:hover {
          cursor: pointer;
          background-color: #009456;
        }
      }
    }
  }
  .preview {
    height: auto;
    border: none;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    margin-top: 0px;
    .operation {
      cursor: pointer;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      z-index: 100;
      border: 1px solid #e7e9e8;
      border-radius: 16px;
      width: 70px;
      height: 25px;
      padding: 4px 12px;
      box-sizing: border-box;
      color: #585a5a;
      opacity: 0;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 16px;
          min-width: 16px;
          height: 16px;
          // 翻转
          transform: rotate(360deg);
        }
      }
    }
    &:hover {
      .operation {
        opacity: 1;
      }
    }
    :deep(.markdown-body) {
      border: none;
      &:hover {
        .v-show-content {
          background-color: #fafafa !important;
        }
      }
    }
  }

  .content {
    margin-top: 48px;
    .title {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #000;
    }
  }
}
</style>

<style lang="scss">
.deleteArticleDialog {
  .submitBtn,
  .cancelBtn {
    margin-left: 8px;
    border-radius: 6px;
    box-shadow: none;
    height: 32px;
    padding: 4px 15px;
    font-size: 14px;
    margin-top: 24px;
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
  .confirm-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .confirm-content {
    font-size: 16px;
    color: red;
  }
}
</style>
