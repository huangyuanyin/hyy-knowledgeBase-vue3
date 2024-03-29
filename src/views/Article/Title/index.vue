<script lang="ts" setup>
import documentIcon from '@/assets/icons/documentIcon.svg'
import formIcon from '@/assets/icons/formIcon.svg'
import mindmapIcon from '@/assets/icons/mindmapIcon.svg'
import pptIcon from '@/assets/icons/pptIcon.svg'
import moreIcon from '@/assets/icons/more.svg'
import folderIcon from '@/assets/icons/folder.svg'
import shareIcon from '@/assets/icons/share.svg'
import fileImg from '@/assets/img/file.png'
import linkIcon from '@/assets/icons/linkType.svg'
import editIcon from '@/assets/icons/edit.svg'
import Container from '../Components/Container.vue'
import { folderMenuItemsData } from '@/data/data'
import { ArticleInfo } from '@/type/article'
import { addArticleApi, uploadArticleApi } from '@/api/article'
import { user } from '@/data/data'

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const aid = ref<number>(null)
const body = ref('')
const list = ref<ArticleInfo[]>([])
const isShowLinkDialog = ref<boolean>(false)
const isHandleTitleDialog = ref<boolean>(false)
const isShowSelectTemDialog = ref<boolean>(false)
const isShowsGroupDialog = ref<boolean>(false)
const isShowUploadDialog = ref<boolean>(false)
const groupDialogParent = ref<number>(null)
const parentId = ref<number>(null)
const contentType = ref({
  doc: documentIcon,
  sheet: formIcon,
  mind: mindmapIcon,
  ppt: pptIcon,
  title: folderIcon,
  file: fileImg,
  links: linkIcon
})
const headers = ref({
  Authorization: localStorage.getItem('token')
})

watchEffect(() => {
  aid.value = Number(infoStore.currentQuery?.aid)
  // list.value = infoStore.currentArticleTreeInfo && getList(aid.value, infoStore.currentArticleTreeInfo)
  if (infoStore.currentMenu === 'title') {
    useArticle().getArticleDetail(aid.value)
    nextTick(() => {
      getCategoryTree()
    })
  }
})

// function getList(id: number, data: ArticleInfo[], children: ArticleInfo[] = []) {
//   data.forEach((item) => {
//     if (item.id === id) {
//       children.push(...(item.children || []))
//     } else {
//       if (item.children?.length) {
//         getList(id, item.children, children)
//       }
//     }
//   })
//   return children
// }

function getBookInfo() {
  return {
    id: infoStore.currentQuery?.lid as string,
    name: infoStore.currentQuery?.lname as string,
    group: infoStore.currentQuery?.gid as string,
    groupname: infoStore.currentQuery?.gname as string
  }
}

function handleAddArticle(title: string, data?) {
  const book = getBookInfo()
  useArticle().handleAddArticle({ book, title }, () => {}, data === null ? null : data)
}

const getCategoryTree = async () => {
  useArticle().handleCategoryTree(Number(infoStore.currentQuery?.aid), 'children', (res: any) => {
    list.value = res
  })
}

const toAddLink = (data: number) => {
  parentId.value = data
  isShowLinkDialog.value = true
}

const toImportTem = (data: number) => {
  parentId.value = data
  isShowSelectTemDialog.value = true
}

const toUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('space', infoStore.currentQuery?.sid)
  formData.append('book', infoStore.currentQuery?.lid)
  formData.append('type', 'file')
  formData.append('title', file.file.name)
  formData.append('creator', user)
  formData.append('parent', String(aid.value))
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

const toLink = (val) => {
  switch (val.type) {
    case 'links':
      useArticle().getArticleDetail(Number(val.id), (res: any) => {
        let link = res.body
        if (!res.body.startsWith('http://') && !res.body.startsWith('https://')) {
          link = `https://${link}`
        }
        val.open_windows === '1' ? window.open(link) : (window.location.href = link)
      })
      break
    default:
      useLinkHooks().handleArticleTypeLink(val, false)
      break
  }
}

const toCopy = () => {
  useCopy(window.location.href)
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
</script>

<template>
  <div class="Title_wrap" h-100vh>
    <Container :content="JSON.stringify(body)">
      <div w-full flex>
        <div class="list" flex-1 pr-24px pl-24px pt-24px v-if="list?.length">
          <el-table :data="list" stripe class="table" style="width: 100%; overflow-y: auto" max-height="90vh">
            <el-table-column prop="title" label="名称">
              <template #default="{ row }">
                <div flex items-center h-52px cursor-pointer @click="toLink(row)">
                  <img mr-8px w-24px h-24px :src="contentType[row.type]" alt="" />
                  <span line-height-24px>{{ row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" width="200px" />
            <el-table-column prop="update_datetime" label="修改时间" width="250px" />
            <el-table-column label="操作" width="100px">
              <template #default="row">
                <ArticleOeration :data="row.row" :row="row.row">
                  <div rotate-90 flex items-center justify-center cursor-pointer w-24px h-24px class="hover:bg-#d8dada" rounded-6px>
                    <img w-16px h-16px :src="moreIcon" alt="" />
                  </div>
                </ArticleOeration>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="empty" flex-1 v-else flex flex-col items-center justify-center>
          <img w-120px h-120px src="https://lf-scm-cn.feishucdn.com/ccm/pc/web/resource/bear/images/illustration_empty-neutral-no-file.2d63d7ca.svg" alt="" />
          <span mt-16px text-14px w-400px line-height-22px text-center text="#646A73" flex flex-col items-center>
            <span mb-24px>这里空空如也，点击以下按钮增添内容吧！</span>
            <div flex>
              <el-upload :http-request="toUpload" :headers="headers" :show-file-list="false" action="">
                <button
                  w-98px
                  pt-4px
                  pb-4px
                  pl-20px
                  pr-20px
                  flex
                  items-center
                  justify-center
                  box-border
                  h-32px
                  text-14px
                  rounded-6px
                  text="#1456F0"
                  border="1px solid #1456F0"
                  class="hover:bg-#e0e9ff"
                >
                  上传
                </button>
              </el-upload>
              <AddOperationPopver
                :menu-items="folderMenuItemsData"
                trigger="click"
                :parent="aid"
                @toAddDoc="handleAddArticle('文档', aid)"
                @toAddSheet="handleAddArticle('表格', aid)"
                @toAddPPT="handleAddArticle('幻灯片', aid)"
                @toAddMindmap="handleAddArticle('脑图', aid)"
                @toAddGroup="toOpenTitleDialog(aid)"
                @toAddLink="toAddLink(aid)"
                @toImportTem="toImportTem(aid)"
                @toImportFile=";(parentId = aid) && (isShowUploadDialog = true)"
              >
                <button
                  w-98px
                  pt-4px
                  pb-4px
                  pl-20px
                  pr-20px
                  flex
                  items-center
                  justify-center
                  box-border
                  h-32px
                  text-14px
                  rounded-6px
                  text="#fff"
                  bg="#1456F0"
                  border="1px solid #1456F0"
                  class="hover:bg-#336df4"
                  ml-14px
                >
                  新建
                </button>
              </AddOperationPopver>
            </div>
          </span>
        </div>
        <div class="right" ml-24px w-232px bt-12px mr-18px>
          <div flex items-center justify-between mt-8px>
            <span text="#1f2329">{{ (infoStore.currentArticleInfo as ArticleInfo)?.title }}</span>
            <span w-24px h-24px flex items-center justify-center cursor-pointer class="hover:bg-#e8e9e9" rounded-6px @click="isHandleTitleDialog = true">
              <img w-17px h-17px :src="editIcon" alt="" />
            </span>
          </div>
          <div h-143px rounded="6px 6px 0px 0" w-full mt-8px border="1px solid #dee0e3" bg="#f5f6f7" flex items-center justify-center>
            <img w-68px h-68px :src="folderIcon" alt="" />
          </div>
          <button
            w-full
            mt-12px
            mb-16px
            pt-4px
            pb-4px
            pl-20px
            pr-20px
            flex
            items-center
            justify-center
            box-border
            h-32px
            text-14px
            rounded-6px
            text="#1456F0"
            border="1px solid #1456F0"
            class="hover:bg-#e0e9ff"
            @click="toCopy"
          >
            <img w-14px h-14px mr-2px :src="shareIcon" alt="" /> 分享
          </button>
          <span text-12px line-height-24px mt-12px text="#646973">描述</span>
          <div text-14px line-height-24px text="#8f959e">{{ (infoStore.currentArticleInfo as ArticleInfo)?.description || '暂无描述' }}</div>
          <div text-12px line-height-24px mt-12px text="#646973">所有者</div>
          <div text-14px line-height-24px text="#1f2329">{{ (infoStore.currentArticleInfo as ArticleInfo)?.creator_name }}</div>
        </div>
      </div>
    </Container>
  </div>
  <LinkDialog :isShow="isShowLinkDialog" :parent="parentId" type="add" :id="null" @closeDialog="isShowLinkDialog = false" />
  <HandleTitleDialog :isShow="isHandleTitleDialog" @closeDialog="isHandleTitleDialog = false" />
  <SelectTemDialog :isShow="isShowSelectTemDialog" :parent="parentId" @closeDialog="isShowSelectTemDialog = false" />
  <GroupDialog :isShow="isShowsGroupDialog" @closeDialog="isShowsGroupDialog = false" @toAddTitle="toAddTitle" title="新建分组" type="title" />
  <UploadFileDialog :isShow="isShowUploadDialog" @closeDialog="isShowUploadDialog = false" :parent="parentId" />
</template>

<style lang="scss" scoped>
.Title_wrap {
  .empty,
  .list {
    height: calc(100vh - 52px);
  }
}
</style>
