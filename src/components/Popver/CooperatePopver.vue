<script lang="ts" setup>
import { cooperateLink } from '@/data/data'
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'
import { selectUserInfoApi } from '@/api/user'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 422,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  menuItems: Array as () => MenuItem[]
})

const searchValue = ref('')
const link = ref(cooperateLink)

const userList = ref([])
const selectedUserList = ref([])
const isShowUserOperationPopver = ref(false)

const querySearch = async (queryString: string, cb: (result: any[]) => void): Promise<any> => {
  userList.value = []
  if (queryString) {
    const { selectUserList } = await useSelectUserApi(selectUserInfoApi, { name: queryString })
    userList.value = selectUserList.value
  }
  cb(userList.value)
}

const handleSelect = (item) => {
  selectedUserList.value.push(item)
}

const onShowUserOperationPopver = (val: boolean) => {
  isShowUserOperationPopver.value = val
}
</script>

<template>
  <el-popover
    popper-class="cooperatePopverPopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <div class="cooperate-icon">
        <img src="@/assets/icons/cooperateIcon.svg" alt="" />
      </div>
    </template>
    <div class="box">
      <div class="box-top">
        <span>文档协作者</span>
      </div>
      <div class="box-content">
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
              <div class="value">{{ item.nickname }}</div>
            </template>
          </el-autocomplete>
        </div>
        <div class="userlist-box" v-if="selectedUserList.length">
          <div class="userlist">
            <div class="item" v-for="(item, index) in selectedUserList" :key="'selectedUserList' + index">
              <div class="item-left">
                <img src="@/assets/img/img.jpg" alt="" />
                <span class="nickname">
                  {{ item.nickname }}
                  <span class="name">({{ item.name }})</span>
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
                    <span class="user-dropdown"> 可编辑</span>
                    <img src="@/assets/icons/arrowDownIcon.svg" alt="" />
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <div class="item">
                          <div class="item-left">
                            <span>可编辑</span>
                            <span class="des">拥有文档的编辑权限</span>
                          </div>
                          <div class="item-right">
                            <img src="@/assets/icons/selectIcon.svg" alt="" />
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item disabled>
                        <div class="item disabled">
                          <div class="item-left">
                            <span>可阅读</span>
                            <span class="des">仅拥有只读和评论权限</span>
                          </div>
                        </div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div class="item">
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
        <div class="userlist-empty" v-else>
          <div class="empty">
            <div class="empty-img">
              <img src="@/assets/img/cooperate.png" alt="" />
            </div>
            <p>暂无文档协作者</p>
          </div>
        </div>
        <div class="share">
          <p>拿到链接的人可获得编辑权限</p>
          <div class="share-button">
            <el-input placeholder="输入用户名邀请协作" v-model="link" disabled />
            <el-button type="primary">复制链接</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<style lang="scss" scoped>
.cooperatePopverPopver {
  box-sizing: border-box;
  .box {
    &-top {
      padding: 20px 20px 0 20px;
      span {
        text-align: left;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        cursor: pointer;
      }
    }
  }
  .box-content {
    .search {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
      height: 40px;
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
    .userlist-empty {
      height: 244px;
      padding-top: 40px;
      padding-bottom: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      border-bottom: 1px solid #eff0f0;
      .empty {
        &-img {
          width: 110px;
          height: 110px;
          padding: 15.28px 0 11.68px 12.83px;
          margin-bottom: 16px;
          box-sizing: border-box;
          img {
            width: 97.78px;
            height: 83.04px;
          }
        }
        p {
          color: #8a8f8d;
          font-size: 14px;
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
                  height: 44px;
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
}
</style>

<style lang="scss">
.cooperatePopverPopver {
  padding: 0 !important;
}
.cooperatePopverPopver-search-list {
  padding: 0 8px !important;
  .is-loading {
    box-sizing: border-box;
    width: 100%;
    li {
      height: 50px;
      line-height: 50px;
    }
  }
  ul {
    li {
      box-sizing: border-box;
      height: 48px;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      border-radius: 6px;
      color: #262626;
      padding: 0 8px;
      width: 100%;
      img {
        width: 32px;
        min-width: 32px;
        height: 32px;
        border-radius: 16px;
        margin-right: 12px;
      }
    }
  }
}
</style>
