<script lang="ts" setup>
import rightArrowIcon from '@/assets/icons/rightArrowIcon.svg'
import edit from '@/assets/icons/public/edit.svg'
import deleteIcon from '@/assets/icons/public/delete.svg'
import { editGroupsApi } from '@/api/groups'

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  type: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update'])

const isEdit = ref(false) // 是否为编辑状态
const bulletinValue = ref('')
const toolbar = ref('')

watch(
  () => props.info,
  (newVal) => {
    bulletinValue.value = newVal.body
  },
  {
    immediate: true
  }
)

watchEffect(() => {
  toolbar.value = 'blocks fontsize bold  align bullist numlist  lineheight  link  hr  tableofcontents tableofcontentsupdate | emoticons image fullscreen  preview autolink  '
})

const editGroups = async () => {
  const params = {
    space: props.info.space as string,
    groupkey: props.info.groupkey,
    groupname: props.info.groupname,
    body: bulletinValue.value
  }
  let res = await editGroupsApi(params, props.info.id)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    isEdit.value = false
    emit('update')
  } else {
    ElMessage.error(res.msg)
  }
}

const toCancel = () => {
  isEdit.value = false
  bulletinValue.value = props.info.body
}

const toDelete = () => {
  ElMessageBox.confirm(
    `<span class="confirm-title">确认删除 空间公告 吗？</span>
  <span class="confirm-content">清空后不可复原</span>
  `,
    '',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      confirmButtonClass: 'submitBtn',
      cancelButtonClass: 'cancelBtn',
      customClass: 'deleteArticleDialog',
      type: 'warning',
      showClose: false,
      dangerouslyUseHTMLString: true
    }
  )
    .then(() => {
      bulletinValue.value = ''
      editGroups()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作'
      })
    })
}
</script>

<template>
  <div class="Announcement_wrap">
    <div class="announcement" v-if="!isEdit && !bulletinValue" @click="isEdit = true">
      <div>{{ props.type === 'public' ? '管理员可以添加面向全体成员的公告信息' : '管理员可以添加自定义内容，向 全体团队成员展示' }}</div>
      <img :src="rightArrowIcon" alt="" />
    </div>
    <div class="announcement edit" v-if="isEdit">
      <TinyMCE v-model="bulletinValue" :resize="true" height="500px" :toolbar="toolbar" body-style="body { margin: 1rem 2% 1rem 2% }" />
      <div class="operation">
        <el-button class="submit" @click="editGroups">确定</el-button>
        <el-button text @click="toCancel">取消</el-button>
      </div>
    </div>
    <div class="announcement preview" v-if="!isEdit && bulletinValue">
      <div class="operation">
        <span @click="isEdit = true">
          <img :src="edit" alt="" />
        </span>
        <span @click="toDelete">
          <img :src="deleteIcon" alt="" />
        </span>
      </div>
      <TinyMCE v-model="bulletinValue" :readonly="true" :resize="true" height="20vh" :toolbar="toolbar" body-style="body { margin: 1rem 2% 1rem 2% }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Announcement_wrap {
  .announcement {
    margin-top: 20px;
    height: 57px;
    border-radius: 8px;
    color: #bec0bf;
    border: 1px dashed #d8dad9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      color: #bec0bf;
      cursor: pointer;
      font-size: 14px;
      font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
    }
    img {
      transform: rotate(180deg);
    }
  }
  .edit {
    height: 550px !important;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    border: none;
    :deep(.tox-tinymce) {
      border: 1px solid #e7e9e8;
      border-radius: 4px;
    }
    .operation {
      margin-top: 20px;
      .submit {
        color: #fff;
        background-color: #00b968;
        border: none;
        border-radius: 6px;
        &:hover {
          cursor: pointer;
          background-color: #009456;
        }
      }
    }
  }
  .preview {
    height: auto;
    border: none;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    margin-top: 0px;
    .operation {
      cursor: pointer;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      z-index: 100;
      border: 1px solid #e7e9e8;
      border-radius: 16px;
      width: 70px;
      height: 25px;
      padding: 4px 12px;
      box-sizing: border-box;
      color: #585a5a;
      opacity: 0;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 16px;
          min-width: 16px;
          height: 16px;
          // 翻转
          transform: rotate(360deg);
        }
      }
    }
    &:hover {
      .operation {
        opacity: 1;
      }
    }
    :deep(.markdown-body) {
      max-height: 28vh;
      border: none;
      .v-note-show {
        color: #333;
        font-size: 13px;
      }
      &:hover {
        .v-show-content {
          background-color: #fafafa !important;
        }
      }
    }
  }
  :deep(.v-note-wrapper) {
    min-height: 50px;
  }
}
</style>
