<script lang="ts" setup>
import { uploadArticleApi } from '@/api/article'
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 164,
  trigger: 'hover',
  hideAfter: 200,
  showArrow: false,
  menuItems: Array as () => MenuItem[]
})

const emit = defineEmits()

const route = useRoute()
const refreshStroe = useRefreshStore()
const isShowsLibraryDialog = ref(false)
const isShowTeamDialog = ref(false)
const headers = ref({
  Authorization: localStorage.getItem('token')
})

const toHandle = (val) => {
  console.log(`output->val`, val)
  switch (val.label) {
    case '知识库':
      isShowsLibraryDialog.value = true
      break
    case '团队':
      isShowTeamDialog.value = true
      break
    case '文档':
      emit(val.nick, val)
      break
    case '表格':
      emit(val.nick, val)
      break
    case '添加链接':
      emit(val.nick, val)
      break
    case '新建分组':
      emit(val.nick, val)
      break
    case '上传文件':
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}

const toUpload = async (file) => {
  const formData = new FormData()
  formData.append('file', file.file)
  formData.append('space', route.query.sid as string)
  formData.append('book', route.query.lid as string)
  formData.append('type', 'file')
  formData.append('title', file.file.name)
  // formData.append('parent', null)
  let res = await uploadArticleApi(formData)
  if (res.code === 1000) {
    ElMessage.success('上传成功')
    refreshStroe.setRefreshBookList(true)
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <el-popover
    popper-class="addOperationPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot>
        <div class="search-add">
          <i-ep-Plus />
        </div>
      </slot>
    </template>
    <div class="addOperation_Wrap">
      <ul>
        <template v-for="(item, _index) in props.menuItems" :key="'menuItems' + _index">
          <li v-if="item.type === 'item' && item.label !== '上传文件'" @click="toHandle(item)">
            <div class="add-icon">
              <img :src="item.icon as string" alt="" />
            </div>
            <span>{{ item.label }}</span>
          </li>
          <li v-if="item.type === 'item' && item.label === '上传文件'">
            <div class="add-icon">
              <img :src="item.icon as string" alt="" />
            </div>
            <el-upload :http-request="toUpload" :headers="headers" class="upload-demo" action="" :limit="1">
              <el-button type="" link>上传文件</el-button>
            </el-upload>
          </li>
          <li v-else-if="item.type === 'divider'" class="divider"></li>
        </template>
      </ul>
    </div>
  </el-popover>
  <LibraryDialog :isShow="isShowsLibraryDialog" @closeDialog="isShowsLibraryDialog = false" />
  <TeamDialog :isShow="isShowTeamDialog" @closeDialog="isShowTeamDialog = false" />
</template>

<style lang="scss" scoped>
.addOperationPopver {
  padding: 0 !important;

  .addOperation_Wrap {
    padding: 3px 0;
    ul {
      padding: 2px 8px;
      list-style: none;
      li {
        height: 36px;
        line-height: 36px;
        margin: 2px 0;
        display: flex;
        span {
          font-size: 14px;
          color: #262626;
        }
        .add-icon {
          height: 34px;
          width: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 20px;
            min-width: 20px;
            height: 20px;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: #eff0f0;
          border-radius: 6px;
        }
      }
      .divider {
        margin: 4px 12px;
        height: 1px;
        line-height: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
}
.search-add {
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #e7e9e8;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffff;
  box-sizing: border-box;
  svg {
    color: #585a5a;
  }
  &:hover {
    background-color: #eff0f0;
  }
}
</style>

<style lang="scss">
.addOperationPopver {
  padding: 0 !important;
  border-radius: 8px !important;
  .addOperation_Wrap {
    padding: 3px 0;
    ul {
      padding: 2px 8px;
      list-style: none;
      li {
        height: 36px;
        line-height: 36px;
        margin: 2px 0;
        display: flex;
        span {
          font-size: 14px;
          color: #262626;
        }
        .add-icon {
          height: 34px;
          width: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 20px;
            min-width: 20px;
            height: 20px;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: #eff0f0;
          border-radius: 6px;
        }
      }
      .divider {
        margin: 4px 12px;
        height: 1px;
        line-height: 0;
        padding: 0;
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>
