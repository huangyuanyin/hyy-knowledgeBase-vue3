<script lang="ts" setup>
import NoPermission from '@/views/NoPermission/index.vue'
import { getCollaborationsApi, getArticleCollaborationsApi } from '@/api/collaborations'
// import { getTeamMemberApi } from '@/api/member'
import CommentDrawer from '@/components/Drawer/CommentDrawer/index.vue'
import { addMarksApi } from '@/api/marks'
import { ArticleInfo } from '@/store/info'

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
  }
})
const emit = defineEmits(['toPublish'])

const route = useRoute()
const infoStore = useInfoStore()
const name = ref('')
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || '@/assets/img/img.jpg')
const isEdit = ref(false)
const moreFeaturesDrawer = ref(false) // 更多功能抽屉
const commentDrawer = ref(false) // 评论抽屉
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

watchEffect(() => {
  moreFeaturesDrawer.value = false
  commentDrawer.value = false
  spaceId.value = infoStore.currentSpaceType === '个人' ? JSON.parse(localStorage.getItem('personalSpaceInfo')).id : (route.query.sid as string)
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
    buttonList.value = [
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
  if (route.query.aname) {
    name.value = route.query.aname as string
  }
  if (props.isPublish) {
    editArticle()
    moreFeaturesDrawer.value = false
  }
})

// 发布文章
function editArticle() {
  const params = {
    title: name.value,
    book: route.query.lid as string,
    space: spaceId.value,
    body: props.content
  }
  useArticle().handleEditArticle(Number(route.query.aid), params)
}

const toHandle = (item: any) => {
  switch (item.label) {
    case '分享':
      // const url = window.location.href
      // useCopy(url, '分享链接')
      break
    case '发布':
      if (route.path.includes('ppt') || route.path.includes('mind')) {
        emit('toPublish', route.path.split('/').slice(-2)[0])
        return
      } else {
        editArticle()
        moreFeaturesDrawer.value = false
      }
      break
    case '编辑':
      moreFeaturesDrawer.value = false
      const data = {
        id: Number(route.query.aid),
        title: route.query.aname as String,
        type: route.path.split('/').slice(-2)[0]
      }
      useLinkHooks().handleArticleTypeLink(data, true)
      break
    case '已收藏':
    case '收藏':
      if (!(infoStore.currentArticleInfo as ArticleInfo).marked) {
        addMarks()
      }
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}

const addMarks = async () => {
  const params = {
    target_type: (infoStore.currentArticleInfo as ArticleInfo).type,
    target_id: route.query.aid as string,
    space: route.query.sid as string
  }
  let res = await addMarksApi(params)
  if (res.code === 1000) {
    ElMessage.success('收藏成功')
    getArticle()
  } else {
    ElMessage.error(res.msg)
  }
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
    book: route.query.lid as string
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
    content: route.query.aid as string
  }
  const res = await getArticleCollaborationsApi(params)
  if (res.code === 1000) {
    userList.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

const getLibraryDetail = async () => {
  useBook().getBookInfo(Number(route.query.lid), (res: any) => {
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
    commentDrawer.value = !commentDrawer.value
    moreFeaturesDrawer.value = false
  }
}

const getArticle = async () => {
  useArticle().getArticleDetail(Number(route.query.aid))
}

const toCloseDrawer = () => {
  commentDrawer.value = false
}
</script>

<template>
  <div class="Container_wrap" v-if="props.isHasPermission">
    <el-container>
      <el-header class="header">
        <div class="header_left">
          <label>{{ name }}</label>
          <span>
            <img src="/src/assets/icons/publicIcon.svg" alt="" />
          </span>
        </div>
        <div class="header_right">
          <div class="item" v-for="(item, index) in itemList" :key="'itemList' + index">
            <StarPopver
              @cancelMark="cancelMark"
              :startId="(infoStore.currentArticleInfo as ArticleInfo).mark_id"
              :tag_mark="(infoStore.currentArticleInfo as ArticleInfo ).tag_mark"
              type="article"
            >
              <span v-if="item.label === '收藏' || item.label === '已收藏'" @click="toHandle(item)"> <img :src="item.icon" alt="" /></span>
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
          <div class="button" v-for="(item, index) in buttonList" :key="'buttonList' + index">
            <SharePopver :aInfo="infoStore.currentArticleInfo">
              <el-button v-if="item.label === '分享'" :type="item.type" @click="toHandle(item)">{{ item.label }}</el-button>
            </SharePopver>
            <el-button v-if="item.label !== '分享'" :type="item.type" @click="toHandle(item)">{{ item.label }}</el-button>
          </div>
          <div class="action" v-if="!isEdit">
            <span :class="[commentDrawer ? 'is_active' : 'comment']">
              <img src="/src/assets/icons/article/commentIcon.svg" alt="" @click="openDrawer('comment')" />
              <em v-if="(infoStore.currentArticleInfo as ArticleInfo).comments_count">{{ (infoStore.currentArticleInfo as ArticleInfo).comments_count }}</em>
            </span>
            <span :class="[moreFeaturesDrawer ? 'is_active' : '']">
              <img src="/src/assets/icons/article/rightboardIcon.svg" alt="" @click="openDrawer('more')" />
            </span>
          </div>
          <span class="rightboardIcon" :class="[moreFeaturesDrawer ? 'is_active' : '']" v-else @click="openDrawer('more')">
            <img src="/src/assets/icons/article/rightboardIcon.svg" alt="" />
          </span>
        </div>
      </el-header>
      <el-main class="body">
        <slot></slot>
        <MoreFeaturesDrawer :drawer="moreFeaturesDrawer" :info="(infoStore.currentArticleInfo as ArticleInfo)" />
        <CommentDrawer :drawer="commentDrawer" @toCloseDrawer="toCloseDrawer" />
      </el-main>
    </el-container>
  </div>
  <NoPermission v-if="typeof infoStore.currentArticleInfo === 'string'" type="article" />
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
      label {
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
        width: 64px;
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
  }
  .el-main {
    padding: 0;
  }
}
</style>
