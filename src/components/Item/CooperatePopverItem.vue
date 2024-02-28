<script lang="ts" setup>
import { addArticleCollaborationsApi, deleteArticleCollaborationsApi, editArticleCollaborationsApi } from '@/api/collaborations'
import { OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  userList: [],
  selectUserList: [] // 可协作人员列表
})

const infoStore = useInfoStore()
const searchValue = ref('')
const userList = ref([])
const selectedUserList = ref([])
const isShowUserOperationPopver = ref(false)

const emit = defineEmits(['updateArticleCollaborations'])

watchEffect(() => {
  if (props.userList.length) {
    selectedUserList.value = props.userList
  } else {
    selectedUserList.value = []
  }
})

const querySearch = async (queryString: string, cb: (result: any[]) => void): Promise<any> => {
  userList.value = []
  if (queryString) {
    userList.value = props.selectUserList.filter((item) => {
      return (
        (item.permusername && item.permusername.toLowerCase().includes(queryString)) ||
        (item.name && item.name.toLowerCase().includes(queryString)) ||
        (item.username && item.username.toLowerCase().includes(queryString))
      )
    })
    userList.value = userList.value.filter((item) => {
      return !selectedUserList.value.some((selectedItem) => {
        return selectedItem.permusername === item.permusername || selectedItem.username === item.permusername
      })
    })
  }
  cb(userList.value)
}

const handleSelect = (item) => {
  addArticleCollaborations(item.permusername)
}

const toChangeArticlePublic = (type, val) => {
  if (val.role === type) return
  console.log(val)
  editArticleCollaborations(type, val)
}

const editArticleCollaborations = async (role, val) => {
  const params = {
    role, // 0: 可阅读，1: 可编辑
    username: val.username || val.permusername
  }
  const res = await editArticleCollaborationsApi(val.id, params)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    emit('updateArticleCollaborations', true)
  } else {
    ElMessage.error(res.msg)
  }
}

const addArticleCollaborations = async (username) => {
  const params = {
    role: '1', // 0: 可阅读，1: 可编辑
    username: [username],
    content: infoStore.currentQuery.aid as string
  }
  const res = await addArticleCollaborationsApi(params)
  if (res.code === 1000) {
    ElMessage.success('添加成功')
    selectedUserList.value.push(res.data[0] as any)
  }
}

const toDelete = (val) => {
  deleteArticleCollaborations(val)
}

const deleteArticleCollaborations = async (val) => {
  const res = await deleteArticleCollaborationsApi(val.id)
  if (res.code === 1000) {
    ElMessage.success('删除成功')
    selectedUserList.value = selectedUserList.value.filter((item) => {
      return item.permusername !== val.permusername
    })
  } else {
    ElMessage.error(res.msg)
  }
}

const onShowUserOperationPopver = (val: boolean) => {
  isShowUserOperationPopver.value = val
}
</script>

<template>
  <div class="CooperatePopverItem_wrap">
    <div class="search">
      <el-autocomplete
        :teleported="false"
        popper-class="cooperatePopverPopver-search-list"
        v-model="searchValue"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        class="inline-input w-50"
        placeholder="输入用户名邀请协作"
        @select="handleSelect"
      >
        <template #default="{ item }">
          <img src="@/assets/img/img.jpg" alt="" />
          <div class="value">{{ item.name }}</div>
          <div class="value">({{ item.permusername }})</div>
        </template>
      </el-autocomplete>
    </div>
    <div class="userlist-box" v-if="selectedUserList.length">
      <div class="userlist">
        <div class="item" v-for="(item, index) in selectedUserList" :key="'selectedUserList' + index">
          <div class="item-left">
            <img src="@/assets/img/img.jpg" alt="" />
            <span class="nickname">
              {{ item.name }}
              <span class="name">({{ item.permusername || item.username }})</span>
            </span>
          </div>
          <div class="item-right">
            <el-dropdown
              :teleported="false"
              ref="userOperationPopverRef"
              trigger="click"
              placement="bottom-end"
              popper-class="userOperation-popver"
              @visible-change="onShowUserOperationPopver"
            >
              <div :class="['role-selector', isShowUserOperationPopver ? 'selected' : '']">
                <span class="user-dropdown">{{ item.role === '1' ? '可编辑' : '可阅读' }}</span>
                <img src="@/assets/icons/arrowDownIcon.svg" alt="" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div class="item" @click="toChangeArticlePublic('1', item)">
                      <div class="item-left">
                        <span>可编辑</span>
                        <span class="des">拥有文档的编辑权限</span>
                      </div>
                      <div class="item-right" v-if="item.role === '1'">
                        <img src="@/assets/icons/selectIcon.svg" alt="" />
                      </div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div class="item" @click="toChangeArticlePublic('0', item)">
                      <div class="item-left">
                        <span>可阅读</span>
                        <span class="des">仅拥有只读和评论权限</span>
                      </div>
                      <div class="item-right" v-if="item.role === '0'">
                        <img src="@/assets/icons/selectIcon.svg" alt="" />
                      </div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div class="item" @click="toDelete(item)">
                      <div class="item-left delete">
                        <span>移除</span>
                        <span class="des">移除该协作者</span>
                      </div>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <Empty text="暂无文档协作者" height="244px" v-else />
    <!-- <div class="share">
          <p>拿到链接的人可获得编辑权限</p>
          <div class="share-button">
            <el-input placeholder="输入用户名邀请协作" v-model="link" disabled />
            <el-button type="primary">复制链接</el-button>
          </div>
        </div> -->
  </div>
</template>

<style lang="scss" scoped>
.CooperatePopverItem_wrap {
  .search {
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    :deep(.el-autocomplete) {
      width: 100%;
      .el-input {
        height: 40px;
      }
      .el-input__wrapper {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
    }
  }
  .userlist-box {
    border-bottom: 1px solid #eff0f0;
    .userlist {
      padding: 0 10px 10px 10px;
      max-height: 244px;
      overflow-y: auto;
      overflow-x: clip;
      .item {
        padding: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-left {
          display: flex;
          align-items: center;
          color: #262626;
          .name {
            color: #8a8f8d;
            margin-left: 3px;
          }
          img {
            width: 32px;
            min-width: 32px;
            height: 32px;
            border-radius: 16px;
            margin-right: 12px;
          }
        }
        &-right {
          display: flex;
          align-items: center;
          height: 32px;
          :deep(.el-dropdown) {
            position: unset;
          }
          :deep(.userOperation-popver) {
            position: unset;
            display: flex;
            align-items: center;
            width: 216px;
            box-sizing: border-box;
            .el-scrollbar {
              width: 100%;
            }
            ul {
              width: 100%;
              padding: 0px;
            }
            li {
              padding: 0 12px;
              .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 0;
                width: 100%;
                &-left {
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: flex-start;
                  color: #262626;
                  font-size: 14px;
                  .des {
                    color: #8a8f8d;
                    font-size: 12px;
                  }
                }
              }
              .delete {
                color: #df2a3f;
              }
              .disabled {
                &:hover {
                  background: #fff;
                }
              }
            }
          }
          .role-selector {
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 26px;
            .user-dropdown {
              display: flex;
              align-items: center;
            }
            img {
              margin-left: 8px;
              width: 16px;
              min-width: 16px;
              height: 16px;
            }
          }
          .selected {
            padding: 2px 0;
            border-radius: 4px;
            color: #8a8f8d;
            background-color: #eff0f0;
            img {
              transform: rotate(-180deg);
              transition: transform 0.3s ease;
            }
          }
        }
      }
    }
  }
  .share {
    padding: 20px;
    border-top: 1px solid #eff0f0;
    p {
      font-size: 14px;
      color: #262626;
    }
    &-button {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      :deep(.el-input) {
        margin-right: 8px;
        height: 40px;
        .el-input__wrapper {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e7e9e8;
          box-shadow: none;
        }
        .el-input__inner {
          color: #bec0bf;
        }
      }
      :deep(.el-button) {
        background: #00b96b;
        border-color: #00b96b;
        height: 40px;
        border-radius: 6px;
        span {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }
      }
    }
  }
}
</style>
