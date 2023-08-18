<script lang="ts" setup>
const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog'])

const publicList = ref([
  {
    author: '就叫小黄好了',
    img: 'src/assets/img/img.jpg',
    public: '1'
  },
  {
    author: '公共区',
    img: 'src/assets/icons/publicArea.svg',
    public: '0'
  }
])

const formData = {
  name: '',
  description: '',
  public: '1'
}

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
  }
)

const { dialogVisible, dialogFormRef: libraryFormRef, dialogForm: libraryForm, handleClose, handleSubmit } = useFormDialog({ isShow: ref(props.isShow), emit, formData })
</script>

<template>
  <el-dialog class="libraryDialog" v-model="dialogVisible" title="新建知识库" width="424" :before-close="handleClose">
    <el-form ref="libraryFormRef" :model="libraryForm" label-width="120px" label-position="top">
      <el-form-item label="基本信息" prop="name">
        <div class="form-name">
          <div class="bookIcon">
            <img src="@/assets/icons/bookIcon.svg" alt="" />
          </div>
          <el-input v-model="libraryForm.name" placeholder="知识库名称" maxlength="10" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item label="" class="form-description" prop="description">
        <el-input v-model="libraryForm.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="知识库简介（选填）" />
      </el-form-item>
      <el-form-item label="新建至">
        <el-select v-model="libraryForm.public" prop="public">
          <template #prefix>
            <img class="prefix-icon" src="@/assets/img/img.jpg" />
          </template>
          <el-option :label="item.author" :value="item.public" v-for="(item, index) in publicList" :key="'publicList' + index">
            <div class="form-public">
              <div class="form-public-left">
                <img :src="item.img" />
                <span style="float: left">{{ item.author }}</span>
              </div>
              <img class="selectIcon" src="@/assets/icons/selectIcon.svg" />
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', libraryForm.name ? '' : 'submit-disabled']" type="primary" @click="handleSubmit" :disabled="!libraryForm.name"> 新建 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form-public {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .selectIcon {
    width: 14px;
    height: 14px;
    margin-left: 8px;
  }
  &-left {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 24px;
      margin-right: 12px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>

<style lang="scss">
.libraryDialog {
  border-radius: 8px;
  .el-dialog__title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
  .el-form-item {
    margin-bottom: 12px;
    border-radius: 6px;
    label {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
    height: 40px;
    border-radius: 6px;
  }
  .form-description {
    margin-bottom: 24px;
  }
  .form-name {
    display: flex;
    align-items: center;
    width: 100%;
    .bookIcon {
      border-radius: 4px;
      padding: 6px;
      width: 40px;
      height: 40px;
      border: 1px solid #d8dad9;
      margin-right: 6px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .prefix-icon {
    width: 24px;
    height: 24px;
    border-radius: 24px;
  }
  .library-footer {
    .submit {
      width: 100%;
      height: 40px;
      color: #fff;
      background-color: #00b968;
      border: none;
      border-radius: 6px;
      &:hover {
        cursor: pointer;
        background-color: #009456;
      }
    }
    .submit-disabled {
      cursor: not-allowed !important;
      background-color: #b2eab2 !important;
    }
  }
}
</style>
