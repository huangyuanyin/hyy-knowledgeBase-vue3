<script lang="ts" setup>
const safeList = ref([])
const loginType = {
  1: '后台登录',
  2: '用户登录'
}

const { loginLog, getloginLog } = useLog()

onMounted(async () => {
  await getloginLog()
  safeList.value = loginLog.value
})
</script>

<template>
  <div class="Safety_wrap">
    <div text-20px text="#262626" font-600 line-height-28px mb-24px>安全日志</div>
    <div class="box">
      <h3 mb-16px text-16px text="#262626">安全记录</h3>
      <el-table :data="safeList" style="width: 100%" stripe>
        <el-table-column prop="date" label="登录类型" width="120">
          <template #default="{ row }">
            <span>{{ loginType[row.login_type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="登录ip" width="150" />
        <el-table-column prop="agent" label="登录详情" />
        <el-table-column prop="create_datetime" label="登录时间" width="200" />
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Safety_wrap {
  margin: auto;
  max-width: 1080px;

  .box {
    max-width: 768px;
    :deep(.el-table__body-wrapper) {
      .cell {
        display: flex;
        align-items: center;
        height: 50px;
      }
    }
  }
}
</style>
