<script lang="ts" setup>
import NoPermission from '@/views/NoPermission/index.vue'
import { getCollaborationsApi, getArticleCollaborationsApi } from '@/api/collaborations'
// import { getTeamMemberApi } from '@/api/member'
import CommentDrawer from '@/components/Drawer/CommentDrawer/index.vue'
import { ArticleInfo } from '@/type/article'
import { folderMenuItemsData } from '@/data/data'
import { addArticleApi, checkEditPermissionApi, uploadArticleApi } from '@/api/article'
import likeIcon from '@/assets/icons/like.svg'
import likeSelectIcon from '@/assets/icons/like_select.svg'
import topIcon from '@/assets/icons/top.svg'
import commentIcon from '@/assets/icons/article/commentIcon.svg'
import startIconSelect from '@/assets/icons/startIcon_select.svg'
import startIcon from '@/assets/icons/startIcon.svg'
import { throttle } from '@/utils/tool'
import { user, avatar, environmentPrefix } from '@/data/data'

const props = defineProps({
  content: {
    type: String,
    required: false
  },
  isHasPermission: {
    type: Boolean,
    default: true,
    required: false
  },
  isPublish: {
    type: Boolean,
    default: false
  },
  isShowScroll: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['toPublish', 'scrollTo'])

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const isEdit = ref(false)
const moreFeaturesDrawer = ref(false) // 更多功能抽屉
const commentDrawer = ref(false) // 评论抽屉
const isShowLinkDialog = ref(false) // 添加链接弹窗
const isShowSelectTemDialog = ref(false) // 选择模板弹窗
const isShowsGroupDialog = ref(false) // 新建分组弹窗
const groupDialogParent = ref(null) // 新建分组的父级id
const parentId = ref(null) // 添加链接的父级id
const spaceId = ref('') // 当前空间id
const publicType = ref('') // 知识库的公开性
const selectUserList = ref([]) // 可协作人员列表
const userList = ref([]) // 已在的协作人员列表
const itemList = ref([
  {
    label: '收藏',
    icon: '/src/assets/icons/article/starIcon.svg',
    type: 'label'
  },
  {
    label: '协作',
    icon: '/src/assets/icons/article/collaborateIcon.svg',
    type: 'label'
  },
  // {
  //   label: '演示',
  //   icon: '/src/assets/icons/article/presentIcon.svg',
  //   type: 'label'
  // },
  {
    label: '当前编辑者的头像将显示在此',
    icon: avatar.value,
    type: 'img'
  }
])
const buttonList = ref([])
const headers = ref({
  Authorization: localStorage.getItem('token')
})
const titleList = ref([])
const showScroll = ref(false)
const isAlone = ref(false) // 是否是单独的页面
const isEditName = ref<boolean>(false)
const isShowUploadDialog = ref(false)
const docName = ref<string>('')
const docFileName = ref<string>('')
const inputName = ref(null)
const inputFileName = ref(null)
const reFileNameSuffix = ref('')
const isEditPermission = ref(true)
const basePath = import.meta.env.MODE === 'development' ? '' : `${environmentPrefix[import.meta.env.MODE]}#`

const { addCollect } = useCollect()
const { handleLike } = useLike()

watchEffect(() => {
  isAlone.value = ['alone', 'share'].includes(infoStore.currentQuery?.type)
  moreFeaturesDrawer.value = false
  commentDrawer.value = false
  spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : infoStore.currentQuery?.sid
  route.path.split('/').slice(-1)[0] === 'edit' ? (isEdit.value = true) : (isEdit.value = false)
  if (isEdit.value) {
    buttonList.value = [
      {
        label: '分享',
        type: 'default'
      },
      {
        label: '发布',
        type: 'success'
      }
    ]
  } else {
    buttonList.value =
      infoStore.currentMenu === 'file'
        ? [
            {
              label: '分享',
              type: 'default'
            },
            {
              label: '重新上传',
              type: 'success'
            }
          ]
        : [
            {
              label: '分享',
              type: 'default'
            },
            {
              label: '编辑',
              type: 'success'
            }
          ]
  }
  isAlone.value && (itemList.value = itemList.value.filter((item) => item.label === '收藏'))
  if (infoStore.currentSpaceType === '个人') {
    itemList.value = itemList.value.filter((item) => item.label !== '协作')
    // 过滤掉buttonList中的分享
    buttonList.value = buttonList.value.filter((item) => item.label !== '分享')
  }
  if (refreshStroe.isRefreshTitleTreeName) {
    getCategoryTree()
    refreshStroe.setRefreshTitleTreeName(false)
  }
})

watch(
  () => props.isPublish,
  () => {
    if (props.isPublish) {
      editArticle()
      moreFeaturesDrawer.value = false
    }
  }
)

watch(
  () => infoStore.currentQuery?.aid,
  () => {
    if (infoStore.currentMenu === 'title') getCategoryTree()
  }
)

watch(
  () => infoStore.currentQuery?.aname,
  () => {
    if (infoStore.currentMenu === 'title') getCategoryTree()
  }
)

watch(
  () => props.isShowScroll,
  (newVal) => {
    showScroll.value = newVal
  }
)

// 发布文章
function editArticle() {
  const params = {
    title: infoStore.currentQuery?.aname,
    book: infoStore.currentQuery?.lid,
    space: spaceId.value,
    body: props.content
  }
  if (infoStore.currentMenu === 'mind') {
    params['counts'] = Number(sessionStorage.getItem('SIMPLE_MIND_MAP_WORD')) || 0
    params['body'] = localStorage.getItem('SIMPLE_MIND_MAP_DATA') || ''
  }
  useArticle().handleEditArticle(Number(infoStore.currentQuery?.aid), params)
}

function getBookInfo() {
  return {
    id: infoStore.currentQuery?.lid,
    name: infoStore.currentQuery?.lname,
    group: infoStore.currentQuery?.gid,
    groupname: infoStore.currentQuery?.gname
  }
}

function handleAddArticle(title: string, data?) {
  const book = getBookInfo()
  useArticle().handleAddArticle({ book, title }, () => {}, data === null ? null : data)
}

const toAddLink = (data: number) => {
  parentId.value = data
  isShowLinkDialog.value = true
}

const toImportTem = (data: number) => {
  parentId.value = data
  isShowSelectTemDialog.value = true
}

const toHandle = async (item: any) => {
  switch (item.label) {
    case '分享':
      // const url = window.location.href
      // useCopy(url, '分享链接')
      break
    case '发布':
      sessionStorage.removeItem('getSheetData')
      if (route.path.includes('ppt') || route.path.includes('mind')) {
        emit('toPublish', route.path.split('/').slice(-2)[0])
        return
      } else {
        editArticle()
        moreFeaturesDrawer.value = false
      }
      break
    case '编辑':
      await checkEditPermission()
      if (!isEditPermission.value) {
        return ElMessage.error('无编辑权限')
      } else {
        moreFeaturesDrawer.value = false
        const data = {
          id: Number(infoStore.currentQuery?.aid),
          title: infoStore.currentQuery?.aname,
          type: route.path.split('/').slice(-2)[0] !== 'directory' ? route.path.split('/').slice(-2)[0] : route.path.split('/').slice(-1)[0]
        }
        useLinkHooks().handleArticleTypeLink(data, true)
      }
      break
    case '已收藏':
    case '收藏':
      if (!(infoStore.currentArticleInfo as ArticleInfo)?.marked) {
        addMarks()
      }
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}

const checkEditPermission = async () => {
  let res = await checkEditPermissionApi(Number(infoStore.currentQuery?.aid))
  if (res.code === 1000) {
    isEditPermission.value = res.data as any
  } else {
    isEditPermission.value = false
    ElMessage.error(res.msg)
  }
}

const addMarks = async () => {
  addCollect(
    infoStore.currentQuery?.aid,
    () => {
      getArticle()
    },
    (infoStore.currentArticleInfo as ArticleInfo).type
  )
}

const cancelMark = () => {
  getArticle()
}

const toCooperate = async () => {
  nextTick(() => {
    getArticleCollaborations()
  })
  await getLibraryDetail()
  await getCollaborations() // 不管public的值为多少，都从知识库成员中取出
  // if (publicType.value === '0') {
  //   await getCollaborations()
  // } else if (publicType.value === '1') {
  //   await getTeamMember()
  // }
}

// const getTeamMember = async () => {
//   const params = {
//     group: route.query.gid as string
//   }
//   const res = await getTeamMemberApi(params)
//   if (res.code === 1000) {
//     selectUserList.value = res.data as any
//     selectUserList.value.forEach((item) => {
//       item.permusername = item.username
//     })
//   } else {
//     ElMessage.error(res.msg)
//   }
// }

const updateArticleCollaborations = (val) => {
  if (val) {
    getArticleCollaborations()
  }
}

const getCollaborations = async () => {
  const params = {
    book: infoStore.currentQuery?.lid
  }
  const res = await getCollaborationsApi(params)
  if (res.code === 1000) {
    selectUserList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getArticleCollaborations = async () => {
  const params = {
    content: infoStore.currentQuery?.aid
  }
  const res = await getArticleCollaborationsApi(params)
  if (res.code === 1000) {
    userList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getLibraryDetail = async () => {
  useBook().getBookInfo(Number(infoStore.currentQuery?.lid), (res: any) => {
    if (Reflect.ownKeys(res).length) {
      publicType.value = res.public
    }
  })
}

const openDrawer = (val) => {
  if (val === 'more') {
    moreFeaturesDrawer.value = !moreFeaturesDrawer.value
    commentDrawer.value = false
  } else {
    if (!localStorage.getItem('isAuth') || localStorage.getItem('isAuth') === 'false') {
      return ElMessage.warning({
        duration: 2000,
        dangerouslyUseHTMLString: true,
        message: `<span>未登录状态，请</span><button style='color:green;margin-left:6px' onclick="to()">前往登录</button>`
      })
    }
    commentDrawer.value = !commentDrawer.value
    moreFeaturesDrawer.value = false
  }
}

const getArticle = async () => {
  useArticle().getArticleDetail(Number(infoStore.currentQuery?.aid))
}

const toCloseDrawer = () => {
  commentDrawer.value = false
  infoStore.currentSidebar === 'DirectorySidebar' && useArticle().getArticleDetail(Number(infoStore.currentQuery?.aid))
}

const toUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('space', spaceId.value)
  formData.append('book', infoStore.currentQuery?.lid)
  formData.append('type', 'file')
  formData.append('title', file.file.name)
  formData.append('creator', user)
  formData.append('parent', infoStore.currentQuery?.aid)
  formData.append('public', '2')
  let res = await uploadArticleApi(formData)
  if (res.code === 1000) {
    ElMessage.success('上传成功')
    refreshStroe.setRefreshBookList(true)
    useLinkHooks().handleArticleTypeLink(res.data as any, false)
  } else {
    ElMessage.error(res.msg)
  }
}

const getCategoryTree = async () => {
  useArticle().handleCategoryTree(Number(infoStore.currentQuery?.aid), 'parent', (res: any) => {
    titleList.value = res
  })
}

const toOpenCommentDrawer = () => {
  if (!localStorage.getItem('isAuth') || localStorage.getItem('isAuth') === 'false') {
    return ElMessage.warning({
      duration: 2000,
      dangerouslyUseHTMLString: true,
      message: `<span>未登录状态，请</span><button style='color:green;margin-left:6px' onclick="to()">前往登录</button>`
    })
  }
  commentDrawer.value = true
}

// @ts-ignore
window.to = () => {
  localStorage.setItem('to', window.location.href)
  router.push({
    path: '/login'
  })
}

const toLink = (type, val?) => {
  switch (type) {
    case 'title':
      router.push({
        path: `${basePath}/directory/${val.type}/${''}`,
        query: {
          sid: infoStore.currentQuery?.sid,
          sname: infoStore.currentQuery?.sname,
          gid: infoStore.currentQuery?.gid,
          gname: infoStore.currentQuery?.gname,
          lid: infoStore.currentQuery?.lid,
          lname: infoStore.currentQuery?.lname,
          aid: val.id,
          aname: val.title
        }
      })
      break
    case 'index':
      if (!localStorage.getItem('isAuth') || localStorage.getItem('isAuth') === 'false') {
        return ElMessage.warning({
          duration: 2000,
          dangerouslyUseHTMLString: true,
          message: `<span>未登录状态，请</span><button style='color:green;margin-left:6px' onclick="to()">前往登录</button>`
        })
      }
      router.push({
        path: '/dashboard',
        query: {
          type: 'index'
        }
      })
      break
    default:
      break
  }
}

const toEdit = () => {
  isEditName.value = true
  if (isEditName.value && infoStore.currentMenu !== 'file') {
    nextTick(() => {
      inputName.value.focus()
      inputName.value.select()
    })
    docName.value = infoStore.currentQuery?.aname
  } else if (isEditName.value && infoStore.currentMenu === 'file') {
    nextTick(() => {
      inputFileName.value.focus()
      inputFileName.value.select()
    })
    const suffix = infoStore.currentQuery?.aname.split('.').pop()
    reFileNameSuffix.value = suffix
    docFileName.value = infoStore.currentQuery?.aname.split('.').slice(0, infoStore.currentQuery?.aname.split('.').length - 1)
  }
}

const handleRename = async () => {
  docFileName.value = docFileName.value + '.' + reFileNameSuffix.value
  if (docName.value === '' && infoStore.currentMenu !== 'file') {
    return ElMessage.warning('文档名不能为空')
  } else if (docFileName.value === '' && infoStore.currentMenu === 'file') {
    return ElMessage.warning('文件名不能为空')
  }
  if (docName.value === infoStore.currentQuery?.aname || docFileName.value === infoStore.currentQuery?.aname) {
    isEditName.value = false
    return
  }
  isEditName.value = false
  await useArticle().handleEditArticle(Number(infoStore.currentQuery?.aid), docName.value || docFileName.value)
  docName.value = ''
  docFileName.value = ''
}

const toOpenTitleDialog = (val) => {
  isShowsGroupDialog.value = true
  groupDialogParent.value = val
}

const toAddTitle = async (val) => {
  const params = {
    title: val[0],
    type: 'title',
    description: val[1],
    parent: groupDialogParent.value,
    book: infoStore.currentQuery.lid,
    space: infoStore.currentQuery.sid,
    public: '2' // 空间所有成员都可以访问
  }
  let res: any = await addArticleApi(params as any)
  if (res.code === 1000) {
    isShowsGroupDialog.value = false
    refreshStroe.setRefreshBookList(true)
    ElMessage.success('新建分组成功')
    const query = {
      sid: infoStore.currentQuery.sid,
      sname: infoStore.currentQuery.sname,
      lid: infoStore.currentQuery.lid,
      lname: infoStore.currentQuery.lname,
      aid: res.data.id,
      aname: res.data.title
    }
    const spaceQuery = {
      gid: infoStore.currentQuery.gid,
      gname: infoStore.currentQuery.gname
    }
    setTimeout(() => {
      router.push({
        path: `${infoStore.currentSpaceType === '个人' ? '' : `/${route.path.split('/')[1]}`}/directory/title/${''}`,
        query: {
          ...(infoStore.currentSpaceType === '个人' ? {} : spaceQuery),
          ...query
        }
      })
    }, 500)
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  if (infoStore.currentMenu === 'title') getCategoryTree()
})
</script>

<template>
  <div class="Container_wrap" v-if="props.isHasPermission">
    <el-container>
      <el-header class="header">
        <div class="header_left">
          <img w-26px h-26px mr-6px rounded-4px cursor-pointer v-if="isAlone" src="@/assets/favicon.ico" @click="toLink('index')" />
          <p cursor-pointer max-w-60vw overflow-hidden text-ellipsis whitespace-nowrap v-if="infoStore.currentMenu !== 'title' && !isEditName" @click="toEdit">
            {{ infoStore.currentQuery?.aname }}
          </p>
          <input
            class="editTitle"
            ref="inputName"
            id="inputName"
            v-if="infoStore.currentMenu !== 'title' && infoStore.currentMenu !== 'file' && isEditName"
            v-model="docName"
            type="text"
            @blur.stop="handleRename"
            @keyup.enter.stop="handleRename"
          />
          <input
            class="editTitle"
            ref="inputFileName"
            id="inputFileName"
            v-if="infoStore.currentMenu !== 'title' && infoStore.currentMenu === 'file' && isEditName"
            v-model="docFileName"
            type="text"
            @blur.stop="handleRename"
            @keyup.enter.stop="handleRename"
          />
          <div v-if="infoStore.currentMenu === 'title'" flex text-14px text="#262626">
            <div flex items-center v-for="(item, index) in titleList" :key="'titleList' + index">
              <h5 line-height-30px cursor-pointer v-if="index !== titleList.length - 1" @click="toLink('title', item)">{{ item.title }}</h5>
              <h5 line-height-30px text="#6a6a73" v-else>{{ item.title }}</h5>
              <em flex items-center justify-center w-30px h-30px ml-0px v-if="index !== titleList.length - 1"><i-ep-ArrowRightBold w-14px h-14px /></em>
            </div>
          </div>
          <span>
            <img src="/src/assets/icons/publicIcon.svg" alt="" />
          </span>
        </div>
        <div class="header_right" v-if="infoStore.currentMenu !== 'title'">
          <template v-if="infoStore.currentQuery?.type !== 'share'">
            <div class="item" v-for="(item, index) in itemList" :key="'itemList' + index">
              <StarPopver
                @cancelMark="cancelMark"
                :startId="(infoStore.currentArticleInfo as ArticleInfo)?.mark_id"
                :tag_mark="(infoStore.currentArticleInfo as ArticleInfo )?.tag_mark"
                :target_type="(infoStore.currentArticleInfo as ArticleInfo )?.type"
                type="article"
              >
                <span v-if="item.label === '收藏' || item.label === '已收藏'" @click="toHandle(item)">
                  <img :src="(infoStore.currentArticleInfo as ArticleInfo )?.marked ? startIconSelect : startIcon" alt="" />
                </span>
              </StarPopver>
              <el-tooltip effect="dark" :content="item.label" placement="bottom" :show-arrow="false">
                <span v-if="item.label === '协作'" @click="toCooperate">
                  <CooperatePopver :selectUserList="selectUserList" :userList="userList" @updateArticleCollaborations="updateArticleCollaborations" />
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" :content="item.label" placement="bottom" :show-arrow="false">
                <span v-if="item.type === 'img' && isEdit" class="img">
                  <img :src="item.icon" alt="" />
                </span>
              </el-tooltip>
            </div>
          </template>
          <template v-if="!isAlone">
            <div class="button" flex v-for="(item, index) in buttonList" :key="'buttonList' + index">
              <SharePopver :aInfo="infoStore.currentArticleInfo">
                <el-button v-if="item.label === '分享'" :type="item.type" @click="toHandle(item)">{{ item.label }}</el-button>
              </SharePopver>
              <el-button v-if="item.label === '编辑' || item.label === '发布'" :type="item.type" @click="toHandle(item)">{{ item.label }}</el-button>
            </div>
          </template>
          <div class="action" v-if="!isEdit">
            <span :class="[commentDrawer ? 'is_active' : 'comment']">
              <img src="/src/assets/icons/article/commentIcon.svg" alt="" @click="openDrawer('comment')" />
            </span>
            <span v-if="!isAlone" :class="[moreFeaturesDrawer ? 'is_active' : '']">
              <img src="/src/assets/icons/article/rightboardIcon.svg" alt="" @click="openDrawer('more')" />
            </span>
          </div>
          <span class="rightboardIcon" :class="[moreFeaturesDrawer ? 'is_active' : '']" v-if="isEdit" @click="openDrawer('more')">
            <img src="/src/assets/icons/article/rightboardIcon.svg" alt="" />
          </span>
        </div>
        <div class="header_right" v-else>
          <div class="button" flex>
            <StarPopver
              @cancelMark="cancelMark"
              :startId="(infoStore.currentArticleInfo as ArticleInfo)?.mark_id"
              :tag_mark="(infoStore.currentArticleInfo as ArticleInfo )?.tag_mark"
              :target_type="(infoStore.currentArticleInfo as ArticleInfo )?.type"
              type="article"
            >
              <span min-w-32px min-h-32px mr-8px flex items-center justify-center cursor-pointer @click="toHandle({ label: '收藏' })">
                <img w-20px h-20px :src="(infoStore.currentArticleInfo as ArticleInfo )?.marked ? startIconSelect : startIcon" alt="" />
              </span>
            </StarPopver>
            <el-upload :http-request="toUpload" :headers="headers" :show-file-list="false" action="">
              <el-button mr-16px>上传</el-button>
            </el-upload>
            <AddOperationPopver
              :menu-items="folderMenuItemsData"
              trigger="click"
              :parent="Number(infoStore.currentQuery?.aid)"
              @toAddDoc="handleAddArticle('文档', Number(infoStore.currentQuery?.aid))"
              @toAddSheet="handleAddArticle('表格', Number(infoStore.currentQuery?.aid))"
              @toAddPPT="handleAddArticle('幻灯片', Number(infoStore.currentQuery?.aid))"
              @toAddMindmap="handleAddArticle('脑图', Number(infoStore.currentQuery?.aid))"
              @toAddGroup="toOpenTitleDialog(Number(infoStore.currentQuery?.aid))"
              @toAddLink="toAddLink(Number(infoStore.currentQuery?.aid))"
              @toImportTem="toImportTem(Number(infoStore.currentQuery?.aid))"
              @toImportFile=";(parentId = Number(infoStore.currentQuery?.aid)) && (isShowUploadDialog = true)"
            >
              <el-button type="success">新建</el-button>
            </AddOperationPopver>
          </div>
        </div>
      </el-header>
      <el-main class="body">
        <div v-if="!moreFeaturesDrawer && !commentDrawer && !isEdit">
          <el-tooltip effect="dark" content="回到顶部" placement="left" :show-arrow="false" :hide-after="0">
            <div class="pix3" flex items-center justify-center rounded="50%" color="#585a5a" cursor-pointer v-if="showScroll" @click="emit('scrollTo', 0)">
              <img w-20px h-20px :src="topIcon" alt="" />
            </div>
          </el-tooltip>
          <div
            class="pix"
            flex
            items-center
            justify-center
            rounded="50%"
            color="#585a5a"
            cursor-pointer
            v-if="infoStore.currentMenu !== 'title' && infoStore.currentQuery?.type !== 'share'"
            @click="() => throttle(() => handleLike(), 500)"
          >
            <img w-20px h-20px :src="(infoStore.currentArticleInfo as ArticleInfo)?.liked ? likeSelectIcon : likeIcon" alt="" />
            <div class="counts" v-if="(infoStore.currentArticleInfo as ArticleInfo)?.likes_count">
              {{ (infoStore.currentArticleInfo as ArticleInfo)?.likes_count }}
            </div>
          </div>
          <div class="pix2" flex items-center justify-center rounded="50%" color="#585a5a" cursor-pointer @click="toOpenCommentDrawer">
            <img w-20px h-20px :src="commentIcon" alt="" />
            <div class="counts" v-if="(infoStore.currentArticleInfo as ArticleInfo)?.comments_count">{{ (infoStore.currentArticleInfo as ArticleInfo)?.comments_count }}</div>
          </div>
        </div>
        <slot></slot>
        <MoreFeaturesDrawer :drawer="moreFeaturesDrawer" :info="(infoStore.currentArticleInfo as ArticleInfo)" />
        <CommentDrawer :drawer="commentDrawer" @toCloseDrawer="toCloseDrawer" />
      </el-main>
    </el-container>
  </div>
  <NoPermission v-if="typeof infoStore.currentArticleInfo === 'string'" type="article" />
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" type="add" :id="null" @closeDialog="isShowLinkDialog = false" />
  <SelectTemDialog :isShow="isShowSelectTemDialog" :parent="parentId" @closeDialog="isShowSelectTemDialog = false" />
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTitle="toAddTitle" title="新建分组" type="title" />
  <UploadFileDialog :isShow="isShowUploadDialog" @closeDialog="isShowUploadDialog = false" :parent="parentId" />
</template>

<style lang="scss" scoped>
.Container_wrap {
  display: flex;
  flex-direction: column;
  .header {
    height: 52px;
    width: -webkit-fill-available;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_left {
      padding: 14px 16px 14px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      p {
        color: #585a5a;
      }
      span {
        margin-left: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 14px;
          height: 14px;
        }
      }
      .editTitle {
        border-radius: 6px;
        border: 1px solid #00b96b;
        box-shadow: none;
        height: 24px;
        outline: none;
        padding: 1px 6px;
        box-sizing: border-box;
        width: 250px;
      }
    }
    &_right {
      display: flex;
      align-items: center;
      .item {
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          &:hover {
            background-color: #eff0f0;
          }
        }
        img {
          width: 20px;
          height: 20px;
          border-radius: 14px;
        }
        .img {
          margin-right: 8px;
          &:hover {
            background-color: #fff;
          }
          img {
            width: 24px;
            height: 24px;
          }
        }
      }
      .button {
        margin-left: 8px;
        .el-button {
          border-radius: 6px;
        }
      }
      .action {
        position: relative;
        height: 32px;
        border-radius: 8px;
        border: 1px solid #d8dad9;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px;
        box-sizing: border-box;
        span {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          img {
            width: 16px;
            height: 16px;
          }
          &:hover {
            background-color: #eff0f0;
          }
        }
        .is_active {
          background-color: #eff0f0;
        }
        .comment {
          position: relative;
          em {
            position: absolute;
            right: 0px;
            top: -2px;
            color: red;
            font-size: 12px;
            font-weight: 700;
          }
        }
      }
      .rightboardIcon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        cursor: pointer;
        border-radius: 6px;
        &:hover {
          background-color: #eff0f0;
        }
      }
      .is_active {
        background-color: #eff0f0;
      }
    }
  }
  .body {
    width: 100%;
    flex: 1;
    .pix3 {
      bottom: 200px !important;
    }
    .pix,
    .pix2,
    .pix3 {
      border: 0px;
      position: fixed;
      bottom: 140px;
      z-index: 999999999;
      width: 42px !important;
      height: 42px !important;
      box-shadow: 0 1px 4px -2px rgba(0, 0, 0, 0.13), 0 2px 8px 0 rgba(0, 0, 0, 0.08), 0 8px 16px 4px rgba(0, 0, 0, 0.04);
      background-color: #fafafa;
      right: 25px;
      img {
        width: 20px;
        height: 20px;
      }

      .counts {
        position: absolute;
        right: -6px;
        top: -6px;
        width: 22px;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-size: 12px;
        color: red;
        background-color: #fff;
        border: 1px solid #e7e9e8;
      }
      &:hover {
        background-color: #e7e9e8;
      }
    }
    .pix2 {
      bottom: 80px;
    }
  }
  .el-main {
    padding: 0;
  }
}
</style>
