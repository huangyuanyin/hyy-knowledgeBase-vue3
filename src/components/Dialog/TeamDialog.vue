<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'
import { FormInstance } from 'element-plus'
import { addGroupsApi } from '@/api/groups'

interface ListItem {
  value: string
  label: string
}

const props = defineProps({
  isShow: Boolean
})

const emit = defineEmits(['closeDialog'])

const route = useRoute()
const infoStore = useInfoStore()
const dialogVisible = ref(false)
const loadingMember = ref(false)
const options = ref<ListItem[]>([])
const list = ref([
  {
    value: 'Alabama',
    label: 'Alabama'
  },
  {
    value: 'Alaska',
    label: 'Alaska'
  },
  {
    value: 'Arizona',
    label: 'Arizona'
  },
  {
    value: 'Arkansas',
    label: 'Arkansas'
  },
  {
    value: 'California',
    label: 'California'
  },
  {
    value: 'Colorado',
    label: 'Colorado'
  },
  {
    value: 'Connecticut',
    label: 'Connecticut'
  },
  {
    value: 'Delaware',
    label: 'Delaware'
  },
  {
    value: 'Florida',
    label: 'Florida'
  },
  {
    value: 'Georgia',
    label: 'Georgia'
  },
  {
    value: 'Hawaii',
    label: 'Hawaii'
  },
  {
    value: 'Idaho',
    label: 'Idaho'
  },
  {
    value: 'Illinois',
    label: 'Illinois'
  },
  {
    value: 'Indiana',
    label: 'Indiana'
  },
  {
    value: 'Iowa',
    label: 'Iowa'
  },
  {
    value: 'value:Kansas',
    label: 'label:Kansas'
  },
  {
    value: 'value:Kentucky',
    label: 'label:Kentucky'
  },
  {
    value: 'value:Louisiana',
    label: 'label:Louisiana'
  },
  {
    value: 'value:Maine',
    label: 'label:Maine'
  },
  {
    value: 'value:Maryland',
    label: 'label:Maryland'
  },
  {
    value: 'value:Massachusetts',
    label: 'label:Massachusetts'
  },
  {
    value: 'value:Michigan',
    label: 'label:Michigan'
  },
  {
    value: 'value:Minnesota',
    label: 'label:Minnesota'
  },
  {
    value: 'value:Mississippi',
    label: 'label:Mississippi'
  },
  {
    value: 'value:Missouri',
    label: 'label:Missouri'
  },
  {
    value: 'value:Montana',
    label: 'label:Montana'
  },
  {
    value: 'value:Nebraska',
    label: 'label:Nebraska'
  },
  {
    value: 'value:Nevada',
    label: 'label:Nevada'
  },
  {
    value: 'value:New Hampshire',
    label: 'label:New Hampshire'
  },
  {
    value: 'value:New Jersey',
    label: 'label:New Jersey'
  },
  {
    value: 'value:New Mexico',
    label: 'label:New Mexico'
  },
  {
    value: 'value:New York',
    label: 'label:New York'
  },
  {
    value: 'value:North Carolina',
    label: 'label:North Carolina'
  },
  {
    value: 'value:North Dakota',
    label: 'label:North Dakota'
  },
  {
    value: 'value:Ohio',
    label: 'label:Ohio'
  },
  {
    value: 'value:Oklahoma',
    label: 'label:Oklahoma'
  },
  {
    value: 'value:Oregon',
    label: 'label:Oregon'
  },
  {
    value: 'value:Pennsylvania',
    label: 'label:Pennsylvania'
  },
  {
    value: 'value:Rhode Island',
    label: 'label:Rhode Island'
  },
  {
    value: 'value:South Carolina',
    label: 'label:South Carolina'
  },
  {
    value: 'South Dakota',
    label: 'South Dakota'
  },
  {
    value: 'Tennessee',
    label: 'Tennessee'
  },
  {
    value: 'Texas',
    label: 'Texas'
  },
  {
    value: 'Utah',
    label: 'Utah'
  },
  {
    value: 'Vermont',
    label: 'Vermont'
  },
  {
    value: 'Virginia',
    label: 'Virginia'
  },
  {
    value: 'Washington',
    label: 'Washington'
  },
  {
    value: 'West Virginia',
    label: 'West Virginia'
  },
  {
    value: 'Wisconsin',
    label: 'Wisconsin'
  },
  {
    value: 'Wyoming',
    label: 'Wyoming'
  }
])
const teamFormRef = ref<FormInstance>()
const teamForm = reactive({
  groupname: '',
  groupkey: '',
  space: String(route.query.sid),
  members: [],
  description: ''
})

watch(
  () => props.isShow,
  (newVal: boolean) => {
    dialogVisible.value = newVal
    teamForm.groupkey = uuidv4().replace(/-/g, '')
  }
)

const remoteMethod = (query: string) => {
  if (query) {
    loadingMember.value = true
    setTimeout(() => {
      loadingMember.value = false
      options.value = list.value.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

const handleSubmit = async () => {
  try {
    await teamFormRef.value.validate()
    addGroups()
  } catch (error) {
    // error
  }
}

// 新增团队
const addGroups = async () => {
  let res = await addGroupsApi(teamForm)
  if (res.code === 1000) {
    handleClose()
    ElMessage.success('团队创建成功')
    setTimeout(() => {
      router.push({
        path: `/${infoStore.currentSpaceName}/team/book`,
        query: {
          sid: route.query.sid,
          sname: route.query.sname,
          gid: res.data.id,
          gname: res.data.groupname
        }
      })
    }, 1000)
  } else {
    ElMessage.error(res.msg)
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const handleClose = async () => {
  resetForm(teamFormRef.value)
  dialogVisible.value = false
  emit('closeDialog', false)
}
</script>

<template>
  <el-dialog class="teamDialog" v-model="dialogVisible" title="新建团队" width="424" :before-close="handleClose">
    <p>和成员一起进行项目协作和知识管理</p>
    <el-form ref="teamFormRef" :model="teamForm" label-width="120px" label-position="top">
      <el-form-item label="基本信息" prop="groupname">
        <div class="form-name">
          <div class="bookIcon">
            <img src="/src/assets/icons/teamIcon.svg" alt="" />
          </div>
          <el-input v-model="teamForm.groupname" placeholder="团队名称" maxlength="10" show-word-limit />
        </div>
      </el-form-item>
      <el-form-item label="" class="form-description" prop="description">
        <el-input v-model="teamForm.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="团队简介" />
      </el-form-item>
      <el-form-item class="form-member">
        <template #label>
          <div class="label">
            <span>添加成员</span>
            <el-button link type="primary">+ 批量添加</el-button>
          </div>
        </template>
        <el-select
          v-model="teamForm.members"
          multiple
          filterable
          clearable
          remote
          reserve-keyword
          collapse-tags
          collapse-tags-tooltip
          placeholder="输入成员名字搜索添加"
          :remote-method="remoteMethod"
          :loading="loadingMember"
          :teleported="false"
          :max-collapse-tags="4"
        >
          <el-option v-for="(item, index) in options" :key="'options' + index" :label="item.label" :value="item.value">
            <div class="item">
              <span class="img">
                <img src="/src/assets/img/img.jpg" alt="" />
              </span>
              <div class="info">
                <span class="label">
                  {{ item.label }}
                  <span class="nickname">({{ item.value }})</span>
                </span>
                <span class="value">{{ item.value }}</span>
              </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="library-footer">
        <el-button :class="['submit', teamForm.groupname ? '' : 'submit-disabled']" type="primary" @click="handleSubmit" :disabled="!teamForm.groupname"> 新建 </el-button>
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
:deep(.el-select-dropdown__item) {
  height: 62px;
}
.item {
  height: 100%;
  margin-bottom: 4px;
  border-radius: 6px;
  color: #262626;
  padding: 0 8px;
  display: flex;
  align-items: center;
  img {
    width: 32px;
    min-width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span {
      display: flex;
      align-items: center;
    }
    .label {
      color: #262626;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
    }
    .nickname,
    .value {
      color: #8a8f8d;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
    }
    .nickname {
      margin-left: 6px;
    }
  }
}
</style>

<style lang="scss">
.teamDialog {
  border-radius: 8px;
  p {
    margin-top: -20px;
    margin-bottom: 28px;
    color: #8a8f8d;
    font-size: 14px;
  }
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
  .form-member {
    margin-bottom: 24px;
    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-form-item__label {
      padding-right: 0px;
    }
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
