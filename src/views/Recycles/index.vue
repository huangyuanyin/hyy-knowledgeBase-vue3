<script lang="ts" setup>
import { onMounted } from 'vue'
import { getSpaceRecyclesApi } from '@/api/recycles'

const route = useRoute()

const recycleData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const getSpaceRecycles = async () => {
  const params = {
    space: route.query.sid as string
  }
  let res = await getSpaceRecyclesApi(params)
  if (res.code === 1000) {
  } else {
  }
}

onMounted(() => {
  getSpaceRecycles()
})
</script>

<template>
  <div class="Recycles_wrap">
    <div class="title">回收站</div>
    <div class="box">
      <el-table :data="recycleData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Recycles_wrap {
  min-height: 100%;
  margin-bottom: -26px;
  .title {
    font-size: 18px;
    color: #262626;
    margin-bottom: 22px;
  }
}
</style>
