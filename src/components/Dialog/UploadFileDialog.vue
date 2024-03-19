<script lang="ts" setup>
import LuckyExcel from 'luckyexcel'
import { handleFileParserApi } from '@/api/file'
import closeIcon from '@/assets/icons/closeIcon.svg'
import { importFileType } from '@/data/data'

const props = defineProps({
  isShow: Boolean,
  parent: null,
  lid: Number,
  lname: String,
  gid: Number,
  gname: String
})

const infoStore = useInfoStore()
const dialogVisible = ref(false)
const isLoading = ref(false)
const currentType = ref('')
const fileList = ref([])
const bookId = ref(null)
const bookName = ref('')
const groupId = ref(null)
const groupName = ref('')

const emit = defineEmits(['closeDialog'])

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    bookId.value = props.lid ? props.lid : infoStore.currentQuery.lid
    bookName.value = props.lname ? props.lname : infoStore.currentQuery.lname
    groupId.value = props.gid ? props.gid : infoStore.currentQuery.gid
    groupName.value = props.gname ? props.gname : infoStore.currentQuery.gname
  }
)

const handleFileParser = async (file) => {
  const formData: any = new FormData()
  formData.append('file', file)
  formData.append('type', currentType.value)
  isLoading.value = true
  const res = await handleFileParserApi(formData)
  const fileSuffix = file.name.split('.').slice(0, -1).join('.')
  if (res.code === 1000) {
    const params = {
      title: fileSuffix,
      type: currentType.value === 'word' ? 'doc' : currentType.value,
      body: res.data,
      parent: props.parent,
      book: bookId.value,
      space: infoStore.currentQuery.sid,
      public: '2' // 空间所有成员都可以访问
    }
    toAddArticle(params)
  } else {
    isLoading.value = false
    ElMessage.error('上传失败')
  }
}

const handleUpload = (file) => {
  switch (currentType.value) {
    case 'word':
      handleFileParser(file.raw)
      break
    case 'sheet':
      isLoading.value = true
      LuckyExcel.transformExcelToLucky(
        file.raw,
        function (exportJson, luckysheetfile) {
          if (!exportJson.sheets.length) return ElMessage.error('文件解析失败')
          const params = {
            title: file.name.split('.').slice(0, -1).join('.'),
            type: 'sheet',
            body: JSON.stringify(exportJson.sheets),
            parent: props.parent,
            book: bookId.value,
            space: infoStore.currentQuery.sid,
            public: '2'
          }
          toAddArticle(params)
        },
        function (error) {
          ElMessage.error('文件解析失败：' + error)
        }
      )
      break
    default:
      break
  }
}

const toAddArticle = (params) => {
  const book = {
    id: bookId.value,
    name: bookName.value,
    group: groupId.value,
    groupname: groupName.value
  }
  useArticle().handleAddArticleApi(book, params, props.parent, (res) => {
    isLoading.value = false
    if (res) {
      ElMessage.success({
        message: '文件上传成功',
        duration: 2000
      })
      handleClose()
    } else {
      ElMessage.error('文件上传失败')
    }
  })
}

const toHandle = (item) => {
  currentType.value = item.type
  if (item.type === 'mind' || item.type === 'ppt') {
    ElMessage.warning('暂不支持脑图和ppt文件导入，敬请期待！')
  }
}

const handleClose = async () => {
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="UploadFileDialog" v-model="dialogVisible" width="640" :show-close="false" :before-close="handleClose">
    <div v-if="!isLoading">
      <div className="flex items-center justify-between">
        <span className="font-700 text-[#262626] text-16px">导入</span>
        <img className="w-16px h-16px cursor-pointer" :src="closeIcon" alt="" @click="handleClose" />
      </div>
      <div className="text-[#8a8f8d] text-12px mt-4px mb-30px">
        点击下方格式进行导入，一次只能导入一个文件，导入非以下指定格式的文件可能存在导入失败、样式不兼容、耗时较长的情况，请耐心等待。
      </div>
      <div>
        <h4 className="text-[rgba(0,0,0,0.85)] text-14px">三方格式</h4>
        <div className="mt-16px mb-16px flex items-center justify-around">
          <div v-for="(item, index) in importFileType" :key="'importFileType' + index" @click="toHandle(item)">
            <el-upload
              v-model:file-list="fileList"
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleUpload"
              :accept="item.accept"
              :disabled="['mind', 'ppt'].includes(item.type)"
            >
              <div className="h-152px w-143px pt-16px pb-20px pl-3px pr-3px flex flex-col items-center cursor-pointer">
                <img className="h-70px w-70px" :src="item.icon" alt="" />
                <span className=" text-[#262626] text-14px line-height-24px text-center">{{ item.title }}</span>
                <span className=" text-[#8a8f8d] text-12px text-center">{{ item.tips }}</span>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
    </div>
    <Loading v-else text="文件解析中，请稍后..." />
  </el-dialog>
</template>

<style lang="scss">
.UploadFileDialog {
  .el-dialog__header {
    display: none;
  }
}
</style>
