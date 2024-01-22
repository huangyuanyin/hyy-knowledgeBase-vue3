<script lang="ts" setup>
import { exportDocApi } from '@/api/article'

const props = defineProps({
  isShow: Boolean,
  type: {
    type: String,
    default: ''
  },
  id: Number
})

const emit = defineEmits(['closeDialog'])

const dialogVisible = ref(false)
const fileTypeList = ref([])

const initData = async () => {
  switch (props.type) {
    case 'doc':
      fileTypeList.value = [
        {
          label: 'Word',
          icon: 'https://gw.alipayobjects.com/zos/basement_prod/408f32c8-8385-4562-b037-c35ea82d2563.svg',
          desc: '.docx .doc'
        },
        {
          label: 'Markdown',
          icon: 'https://gw.alipayobjects.com/zos/basement_prod/759ce648-47b7-46a4-8d56-66247bf923fc.svg',
          desc: '.md .mark .txt .zip...'
        }
      ]
      break
    case 'sheet':
      fileTypeList.value = [
        {
          label: 'Excel',
          icon: 'https://gw.alipayobjects.com/zos/basement_prod/5fdf1f7c-4a2f-4bd0-9d6b-6803b8bb86b6.svg',
          desc: '.xlsx .xls'
        }
      ]
      break
    default:
      break
  }
}

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    dialogVisible.value && initData()
  }
)

const toHandle = (val) => {
  switch (val.label) {
    case 'Word':
      handleDoc()
      break
    case 'Markdown':
      ElMessage.error('暂不支持')
      break
    default:
      ElMessage.error('暂不支持')
      break
  }
}

const handleDoc = async () => {
  let res = await exportDocApi(props.id)
  if (res.code === 1000) {
    window.open(res.data as unknown as string)
    ElMessage.success('导出成功')
    handleClose()
  } else {
    ElMessage.error(res.msg)
  }
}

const handleClose = async () => {
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="linkDialog" v-model="dialogVisible" title="导出" width="520" :before-close="handleClose" :append-to-body="true">
    <div class="list">
      <div class="item" v-for="(item, index) in fileTypeList" :key="'fileTypeList' + index" @click="toHandle(item)">
        <div class="icon">
          <img :src="item.icon" alt="" />
        </div>
        <div class="bottom">
          <div class="label">{{ item.label }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.linkDialog {
  border-radius: 8px;
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .list {
    display: flex;
    .item {
      padding-left: 3px;
      padding-right: 3px;
      height: 152px;
      width: 142px;
      text-align: center;
      padding: 16px 0 20px;
      cursor: pointer;
      .icon {
        width: 70px;
        height: 70px;
        margin: 0 auto;
      }
      .bottom {
        text-align: center;
        line-height: 24px;
        margin-top: 4px;
        .label {
          font-size: 14px;
          color: #262626;
          display: block;
        }
        .desc {
          font-size: 12px;
          line-height: 1;
          color: #8a8f8d;
        }
      }
    }
  }
}
</style>
