<script lang="ts" setup>
import { getGroupActiviteApi } from '@/api/groups'
import { contentType, contentTypeName, avatar } from '@/data/data'
import refrehIcon from '@/assets/icons/refresh.svg'

const infoStore = useInfoStore()
const activiteList = ref([])
const operationType = ref({
  updateDoc: '更新了',
  publishDoc: '发布了'
})

const getGroupActivite = async () => {
  let res = await getGroupActiviteApi(infoStore.currentTeamInfo.id)
  if (res.code === 1000) {
    activiteList.value = res.data
    ElMessage({
      message: '动态已更新',
      grouping: true,
      type: 'success'
    })
  }
}

const toLink = (type: string, item: any) => {
  switch (type) {
    case 'link':
      router.push({
        path: `/${infoStore.currentSpaceInfo.spacekey}/directory/${item.target_type}`,
        query: {
          sid: infoStore.currentQuery.sid,
          sname: infoStore.currentQuery.sname,
          gid: item.article.group_id,
          gname: item.article.group_name,
          lid: item.article.book_id,
          lname: item.article.book_name,
          aid: item.target_id,
          aname: item.article.title
        }
      })
      break
    case 'book':
      router.push({
        path: `/${infoStore.currentSpaceInfo.spacekey}/directory/index`,
        query: {
          sid: infoStore.currentQuery.sid,
          sname: infoStore.currentQuery.sname,
          gid: item.article.group_id,
          gname: item.article.group_name,
          lid: item.article.book_id,
          lname: item.article.book_name
        }
      })
      break
  }
}

onMounted(() => {
  getGroupActivite()
})
</script>

<template>
  <div class="Dynamic_wrap">
    <TeamHeader :icon="infoStore.currentTeamInfo.icon" />
    <div flex items-center justify-between mt-32px w-64vw>
      <div text="#262626" text-16px font-600 line-height-24px>团队动态</div>
      <el-tooltip effect="dark" content="更新动态" placement="top" :show-arrow="false">
        <img cursor-pointer :src="refrehIcon" w-20px h-20px alt="" @click="getGroupActivite" />
      </el-tooltip>
    </div>
    <div w-64vw>
      <div pt-24px pb-24px border-b="1px solid #f4f5f5" flex items-start v-for="(item, index) in activiteList" :key="'activiteList' + index">
        <span min-w-28px w-28px h-28px><img w-28px h-28px :src="avatar" alt="" /></span>
        <div ml-20px mt-5px>
          <p text="#585a5a" text-14px>
            <span text="#262626" text-16px font-600 mr-6px> {{ item.creator_name }}</span>
            在
            <span class="book-name" text="#262626" font-500 text-15px mr-6px @click="toLink('book', item)">{{ item.article.book_name }}</span>
            <span mr-10px>{{ operationType[item.type] }}{{ contentTypeName[item.target_type] }}</span>
            <span text="#8a8f8d" text-12px line-height-20px>{{ item.update_datetime }}</span>
          </p>
          <div mt-16px>
            <div text-16px text="#262626" font-600 flex items-center cursor-pointer @click="toLink('link', item)">
              <img :src="contentType['doc']" alt="" mr-8px w-20px h-20px />{{ item.article.title }}
            </div>
            <p mt-12px text="#585a5a" text-14px v-if="item.article_body">
              {{ item.article_body }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Dynamic_wrap {
  width: 100%;
  .book-name {
    &:hover {
      color: #5fa8f6;
      cursor: pointer;
    }
  }
}
</style>
