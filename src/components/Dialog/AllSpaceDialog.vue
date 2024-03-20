<script lang="ts" setup>
import { getSpacesApi } from '@/api/spaces'
import closeIcon from '@/assets/icons/closeIcon.svg'

const props = defineProps({
  isShow: Boolean
})

const dialogVisible = ref(false)
const isLoading = ref(false)
const spaceList = ref([])

const emit = defineEmits(['closeDialog'])

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    if (newVal) {
      getSpaces()
    }
  }
)

const handleClose = async () => {
  dialogVisible.value = false
  emit('closeDialog', false)
}

const getSpaces = async () => {
  isLoading.value = true
  const params = {
    is_delete: '0',
    spacetype: 'organization'
  }
  let res = await getSpacesApi(params)
  isLoading.value = false
  if (res.code === 1000) {
    spaceList.value = res.data as any
  }
}
</script>

<template>
  <el-dialog class="AllSpaceDialog" v-model="dialogVisible" width="1000" :show-close="false" :before-close="handleClose">
    <div>
      <div className="flex items-center justify-between">
        <span className="font-700 text-[#262626] text-16px">空间集合</span>
        <img className="w-16px h-16px cursor-pointer" :src="closeIcon" alt="" @click="handleClose" />
      </div>
      <div className="text-[#8a8f8d] text-12px mt-4px mb-30px">该集合下展示本产品下所有的空间列表及其相关信息。</div>
      <div>
        <el-table :data="spaceList" style="width: 100%" empty-text="暂无数据" v-loading="isLoading" stripe max-height="60vh">
          <el-table-column prop="spacename" label="空间名称">
            <template #default="{ row }">
              <div className="flex items-center">
                <img className="w-26px h-26px mr-8px" :src="row.icon" alt="" />
                <span>{{ row.spacename }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="creator_name" label="创建人" width="180" />
          <el-table-column prop="member_count" label="空间成员" width="180">
            <template #default="{ row }">
              <span>{{ row.member_count + 1 }}人</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_datetime" label="创建时间" width="250" />
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.AllSpaceDialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
