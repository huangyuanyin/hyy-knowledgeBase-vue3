<script lang="ts" setup>
import publicTagIcon from '@/assets/icons/publicTagIcon.svg'
import likeIcon from '@/assets/icons/article/likeIcon.svg'
import lookIcon from '@/assets/icons/article/lookIcon.svg'
import empty from '@/assets/img/empty.png'
import imgaeIcon from '@/assets/img/image.png'
import { getBookStacksApi } from '@/api/bookstacks'

interface BookGroup {
  id: number
  name: string
  is_default: string
}

const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const bookGroup = ref([])
const cBookList = ref([])
const bookList = ref([])
const groupInfo = ref({
  groupname: '',
  groupkey: ''
}) // 公共区团队信息
const toolbar = ref('')
const moduleType = ref('info')
const selectedList = ref([])

const { bookList: list, getBookList } = useBook()
const { commonBookList, getCommonList, findCommonItem } = useCommon()
const { articleList, getDocList } = useArticle()

watchEffect(() => {
  toolbar.value = 'blocks fontsize bold  align bullist numlist  lineheight  link  hr  tableofcontents tableofcontentsupdate | emoticons image fullscreen  preview autolink  '
  if (refreshStroe.isRefreshQuickBookList) {
    nextTick(async () => {
      await initHandle()
    })
  }
  if (refreshStroe.isRefreshPublicBookStacks) {
    nextTick(async () => {
      await initHandle()
      refreshStroe.setRefreshPublicBookStacks(false)
    })
  }
})

const initHandle = async () => {
  await getBookStacks()
  await getLibrary()
  await getCommonBookList()
}

const updateBulletin = () => {
  getGroupsDetail()
}

// 获取当前空间下公共区的知识库分组列表
const getBookStacks = async () => {
  const params = {
    space: infoStore.currentQuery?.sid,
    group: infoStore.currentQuery?.gid
  }
  let res = await getBookStacksApi(params)
  if (res.code === 1000) {
    bookGroup.value = res.data as unknown as BookGroup[]
  }
}

// 获取当前空间下的常用知识库列表
const getCommonBookList = async () => {
  await getCommonList('book')
  cBookList.value = commonBookList.value
  findCommonItem('book', bookList.value)
}

// 获取当前空间下公共区的知识库列表
const getLibrary = async () => {
  await getBookList({
    space: infoStore.currentQuery?.sid,
    group: infoStore.currentQuery?.gid
  })
  bookList.value = list.value
}

const getGroupsDetail = async () => {
  useTeam().getTeamInfo(Number(infoStore.currentQuery?.gid), (res: any) => {
    if (Reflect.ownKeys(res).length) {
      groupInfo.value = res
    }
  })
}

const getArticleList = async () => {
  await getDocList({
    space: infoStore.currentQuery?.sid,
    is_selective: '1'
  })
  selectedList.value = articleList.value
}

const changeModule = (val: string) => {
  moduleType.value = val
}

const toLink = (type: string, val) => {
  if (type === 'srticle') {
    return ElMessage({
      message: '暂未开放',
      type: 'warning'
    })
    router.push({
      path: `/${infoStore.currentSpaceInfo.spacekey}/directory/${val.target_type}`,
      query: {
        sid: val.space,
        sname: infoStore.currentQuery?.sname,
        lid: val.book,
        lname: val.book_name,
        gid: val.group,
        gname: val.group_name,
        aid: val.id,
        aname: val.title
      }
    })
  } else {
    return ElMessage({
      message: '暂未开放',
      type: 'warning'
    })
  }
}

onMounted(async () => {
  await getGroupsDetail()
  await getBookStacks()
  await getLibrary()
  await getCommonBookList()
  await getArticleList()
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
      moduleGenre="info"
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
      @changeModule="changeModule"
    />
    <template v-if="moduleType === 'info'">
      <Announcement :info="groupInfo" @update="updateBulletin" type="public" />
      <div class="content">
        <SwitchModuleItem moduleType="operation">
          <template v-slot:left><span class="title">知识库</span></template>
        </SwitchModuleItem>
        <LibraryTable title="知识库" :commonList="cBookList" :group="bookGroup" @getBookStacks="getBookStacks" />
      </div>
    </template>
    <template v-else>
      <div mt-24px mr="5%" v-if="selectedList.length">
        <div mb-32px pb-20px flex mb-20px border-b="1px solid #f4f5f5" v-for="(item, index) in selectedList" :key="'selectedList' + index">
          <img w-28px h-28px rounded-14px mr-12px :src="imgaeIcon" alt="" />
          <div>
            <span mt-3px mb-16px block>{{ item.creator_name }}</span>
            <div>
              <span mb-12px font-700 text="18px" block cursor-pointer @click="toLink('srticle', item)">{{ item.title }}</span>
              <p>
                {{
                  '十分庆幸自己在互联网外还有一个角色“内容创作者”，让我每隔一两年关于“写作”的话题都可以拿出来重新讲一讲。（毕竟从17年那个冬天开始写字，到现在也有六七十万字的“成果”。）如果说居住的房子是容纳身体的吃穿住，我们要收纳、打扫、整理，用鸡毛掸子掸一掸落在家居上的灰尘，把家具重新摆弄。那'
                }}
              </p>
              <div flex mt-12px items-center>
                <img w-24px h-24px cursor-pointer :src="likeIcon" alt="" @click="toLink('star', item)" />
                <span ml-4px text="#8a8f8d" text-14px mt-6px line-height-24px>{{ item.likes_count }}</span>
                <div flex items-center mt-6px ml-22px text="#8a8f8d" text-14px line-height-24px cursor-pointer @click="toLink('srticle', item)">
                  <img :src="lookIcon" w-16px h-16px alt="" mr-4px />
                  <span>查看原文</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <Empty text="暂无精选文章，快去推荐吧" height="600px" :img="empty" />
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.Public_wrap {
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
