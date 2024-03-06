<script lang="ts" setup>
import { getSpacesApi } from '@/api/spaces'
import { environmentPrefix } from '@/data/data'
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom',
  width: 312,
  trigger: 'click',
  hideAfter: 200,
  showArrow: false,
  menuItems: () => [] as MenuItem[],
  currentSider: ''
})

const route = useRoute()
const infoStore = useInfoStore()
const refreshStroe = useRefreshStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const icon = ref('')
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || '@/assets/img/img.jpg')
const adminInfo = ref<any>('')
const isShowsSpaceDialog = ref(false)
const changeSpacePopverRef = ref<any>(null)
const spacesList = ref([])
const spaces = ref([
  {
    name: '个人',
    type: 'personal',
    list: []
  },
  {
    name: '空间',
    type: 'organize',
    list: []
  }
])
const spaceReverse = ref([
  {
    name: '空间',
    type: 'organize',
    list: []
  },
  {
    name: '个人',
    type: 'personal',
    list: []
  }
])
const loading = ref(false)
const basePath = import.meta.env.MODE === 'development' ? '#/' : `${environmentPrefix[import.meta.env.MODE]}#/`

const initData = () => {
  if (infoStore.currentSidebar === 'SpaceSidebar') {
    icon.value = infoStore.currentSpaceInfo.icon || '/src/assets/icons/spaceIcon.svg'
    adminInfo.value = JSON.parse(sessionStorage.getItem('xinAn-spaceInfo')).user
  }
}

const toShow = async () => {
  await initData()
  await getSpaces()
}

// 获取当前用户下所能访问的空间
const getSpaces = async () => {
  loading.value = true
  const params = {
    permusername: user
    // is_delete: '0' // 0:未删除 1:已删除
  }
  let res = await getSpacesApi(params)
  loading.value = false
  if (res.code === 1000) {
    spacesList.value = res.data as any
    spaces.value[0].list = res.data.filter((item) => item.spacetype === 'personal')
    spaces.value[1].list = res.data.filter((item) => item.spacetype === 'organization')
    spaceReverse.value[0].list = res.data.filter((item) => item.spacetype === 'organization')
    spaceReverse.value[1].list = res.data.filter((item) => item.spacetype === 'personal')
    if (infoStore.currentMenu === 'deleteProcess') {
      spaceReverse.value[0].list = spaceReverse.value[0].list.filter((item) => item.id != infoStore.currentQuery?.sid)
    }
  }
}

const toLink = (type, val?) => {
  switch (type) {
    case 'personal':
      router.push('/dashboard')
      break
    case 'organize':
      if (val.is_delete === '1') {
        router.push({
          path: `/${val.spacekey}/organize/deleteProcess`,
          query: {
            sname: val.spacename,
            sid: val.id
          }
        })
      } else {
        router.push({
          path: `/${val.spacekey}/dashboard`,
          query: {
            sname: val.spacename,
            sid: val.id
          }
        })
        // fix 切换空间，左侧常用列表不刷新
        setTimeout(() => {
          location.reload()
        }, 500)
        refreshStroe.setRefreshQuickBookList(true)
      }
      break
    case 'add':
      router.push(`/${val.spacekey}/organize/dashboard`)
      break
    case 'set':
      router.push({
        path: `/${infoStore.currentSpaceInfo.spacekey}/organize/dashboard`,
        query: route.query
      })
      break
    case 'member':
      window.open(`${basePath}${infoStore.currentSpaceInfo.spacekey}/organize/addressBook?sid=${infoStore.currentQuery.sid}&sname=${infoStore.currentQuery.sname}`)
      break
    default:
      break
  }
  changeSpacePopverRef.value && changeSpacePopverRef.value.hide()
}
</script>

<template>
  <el-popover
    ref="changeSpacePopverRef"
    popper-class="changeSpacePopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
    @show="toShow"
  >
    <template #reference>
      <span class="arrowDownIcon" cursor-pointer>
        <slot> <img src="@/assets/icons/arrowRightIcon.svg" alt="" /> </slot>
      </span>
    </template>
    <div class="changeSpac_Wrap">
      <template v-if="props.currentSider === 'Sidebar'">
        <template v-if="!loading">
          <div v-for="(item, index) in spaces" :key="'spaces' + index">
            <div class="space_wrap">
              <h4>{{ item.type === 'personal' ? '个人' : '空间' }}</h4>
              <div class="menuItem_wrap">
                <div class="menuItem" v-for="space in item.list" :key="space.id" @click="toLink(item.type, item.type === 'personal' ? null : space)">
                  <div class="left">
                    <div class="img">
                      <img v-if="item.type === 'personal'" :src="avatar" />
                      <img class="spaceIcon" v-else :src="space.icon || '/src/assets/icons/spaceIcon.svg'" alt="" />
                    </div>
                    <div class="content">
                      <p>{{ space.spacename }}</p>
                      <p class="tag" v-if="item.type === 'personal'">我自己</p>
                      <p class="member" v-else>{{ space.member_count + 1 || 1 }}成员</p>
                    </div>
                  </div>
                  <div class="right" v-if="item.type === 'personal'">
                    <img src="@/assets/icons/selectIcon.svg" alt="" />
                  </div>
                </div>
              </div>
              <div class="menuItem" @click="isShowsSpaceDialog = true" v-if="item.type === 'organize'">
                <div class="left">
                  <img class="addIcon" src="@/assets/icons/addIcon2.svg" alt="" />
                  <div class="content">
                    <span>创建空间</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <Loading v-else />
      </template>
      <template v-if="props.currentSider === 'SpaceSidebar' || infoStore.currentSidebar === 'noSidebar'">
        <div class="card" v-if="infoStore.currentSidebar !== 'noSidebar'">
          <div class="header">
            <img :src="icon" alt="" />
            <div class="title">
              <span>{{ infoStore.currentSpaceInfo.spacename }}</span>
              <!-- <p>享受标准版空间权益</p> -->
            </div>
          </div>
          <div class="card-content">
            <div class="content" v-if="infoStore.isSpaceAdmin == 'true'">
              <!-- <div class="type">
                <span>标准版</span>
                <span>升级</span>
              </div> -->
              <div class="member">
                <div class="member-left">
                  <div class="count">
                    <span>成员数</span>
                    <span
                      ><span style="color: #262626">{{ infoStore.currentSpaceInfo.member_count + 1 }}</span> /10000</span
                    >
                  </div>
                  <div class="line">
                    <el-progress :percentage="10" :show-text="false" color="#8a8f8d"></el-progress>
                  </div>
                </div>
                <span class="member-right" @click="toLink('member')">邀请成员</span>
              </div>
              <div class="admin">
                <span>创建人</span>
                <el-popover placement="bottom-end" :width="282" trigger="hover" :show-arrow="false" :hide-after="0">
                  <template #reference>
                    <img cursor-pointer :src="'http://10.4.150.56:8032/' + adminInfo.avatar" />
                  </template>
                  <div pl-6px>
                    <div flex items-center>
                      <img w-44px h-44px :src="'http://10.4.150.56:8032/' + adminInfo.avatar" alt="" />
                      <p ml-15px text="#262626" text-18px min-h-44px line-height-44px>{{ adminInfo.name }}</p>
                    </div>
                    <div>
                      <div mt-16px mb-16px w-full h-1px style="background-color: rgba(0, 0, 0, 0.04)"></div>
                      <span>{{ adminInfo.dept_name }}</span> / <span>{{ adminInfo.post_name }}</span>
                    </div>
                  </div>
                </el-popover>
              </div>
              <div class="button" @click="toLink('set')">
                <img class="settingIcon" src="/src/assets/icons/settingIcon.svg" alt="" />
                <img class="settingIcon_active" src="/src/assets/icons/settingIcon_active.svg " alt="" />
                <span>空间管理</span>
              </div>
            </div>
            <div class="content-member" v-else>
              <div class="admin">
                <span>创建人</span>
                <el-popover placement="bottom-end" :width="282" trigger="hover" :show-arrow="false" :hide-after="0">
                  <template #reference>
                    <img cursor-pointer :src="'http://10.4.150.56:8032/' + adminInfo.avatar" />
                  </template>
                  <div pl-6px>
                    <div flex items-center>
                      <img w-44px h-44px :src="'http://10.4.150.56:8032/' + adminInfo.avatar" alt="" />
                      <p ml-15px text="#262626" text-18px min-h-44px line-height-44px>{{ adminInfo.name }}</p>
                    </div>
                    <div>
                      <div mt-16px mb-16px w-full h-1px style="background-color: rgba(0, 0, 0, 0.04)"></div>
                      <span>{{ adminInfo.dept_name }}</span> / <span>{{ adminInfo.post_name }}</span>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="divider"></div>
          </div>
        </div>
        <template v-if="!loading">
          <div v-for="(item, index) in spaceReverse" :key="'spaces' + index">
            <div class="space_wrap">
              <h4>{{ item.type === 'personal' ? '个人' : '空间' }}</h4>
              <div class="menuItem_wrap" :style="{ 'max-height': infoStore.isSpaceAdmin == 'true' ? '312px' : '364px' }">
                <div class="menuItem" v-for="space in item.list" :key="space.id" @click="toLink(item.type, item.type === 'personal' ? null : space)">
                  <div class="left">
                    <div class="img">
                      <img v-if="item.type === 'personal'" :src="avatar" />
                      <img class="spaceIcon" v-else :src="space.icon || '/src/assets/icons/spaceIcon.svg'" alt="" />
                    </div>
                    <div class="content">
                      <p>{{ space.spacename }}</p>
                      <p class="tag" v-if="item.type === 'personal'">我自己</p>
                      <p class="member" v-else>{{ space.member_count + 1 || 1 }}成员</p>
                    </div>
                  </div>
                  <div class="right" v-if="infoStore.currentQuery?.sid == space.id">
                    <img src="@/assets/icons/selectIcon.svg" alt="" />
                  </div>
                </div>
              </div>
              <div class="menuItem" @click="isShowsSpaceDialog = true" v-if="item.type === 'organize'">
                <div class="left">
                  <img class="addIcon" src="@/assets/icons/addIcon2.svg" alt="" />
                  <div class="content">
                    <span>创建空间</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <Loading v-else />
      </template>
    </div>
  </el-popover>
  <SpaceDialog :isShow="isShowsSpaceDialog" @closeDialog="isShowsSpaceDialog = false"></SpaceDialog>
</template>

<style lang="scss" scoped>
.arrowDownIcon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  &:hover {
    background-color: #eff0f0;
  }
  img {
    width: 16px;
    height: 16px;
  }
}
</style>

<style lang="scss">
.changeSpacePopver {
  padding: 13px 20px 12px 20px !important;
  box-sizing: border-box;
  .changeSpac_Wrap {
    .space_wrap {
      h4 {
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 12px;
        line-height: 17px;
        color: #8a8f8d;
      }
      .menuItem_wrap {
        max-height: 468px;
        overflow-y: auto;
        // 修改浏览器滚动条样式
        &::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        &::-webkit-scrollbar-track {
          background: rgb(239, 239, 239);
          border-radius: 2px;
        }
        &::-webkit-scrollbar-thumb {
          background: #bfbfbf;
          border-radius: 10px;
          cursor: pointer;
        }
      }
      .menuItem {
        padding: 6px 8px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        &:hover {
          background-color: #eff0f0;
        }
        .left {
          display: flex;
          align-items: center;
          .img {
            width: 32px;
            height: 40px;
            display: flex;
            align-items: center;
            img {
              width: 32px;
              min-width: 32px;
              height: 32px;
              min-height: 32px;
              border-radius: 16px;
              border-color: rgba(0, 0, 0, 0.06);
              border-width: 1px;
              border-style: solid;
            }
            .spaceIcon {
              border-radius: 4px;
            }
          }
          .addIcon {
            height: 34px;
            border: 1px solid #e7e9e8;
            border-radius: 8px;
            padding: 6px;
            background-color: #fff;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            box-sizing: border-box;
          }
          .content {
            margin-left: 14px;
            width: 168px;
            overflow: hidden;
            flex: 1;
            display: flex;
            justify-content: center;
            flex-direction: column;
            p {
              display: block;
              line-height: 20px;
              font-size: 14px;
              color: #262626;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .tag,
            .member {
              font-size: 10px;
              line-height: 14px;
              color: #8a8f8d;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            span {
              font-size: 14px;
              line-height: 20px;
              color: #262626;
            }
          }
        }
      }
    }
    .card {
      .header {
        display: flex;
        margin-top: 14px;
        margin-bottom: 14px;
        img {
          width: 40px;
          min-width: 40px;
          height: 40px;
          border-radius: 4px;
        }
        .title {
          display: flex;
          flex-direction: column;
          flex: 0 1 auto;
          margin-left: 12px;
          width: 100%;
          overflow: hidden;
          span {
            line-height: 22px;
            font-weight: 700;
            color: #262626;
            font-size: 14px;
          }
          p {
            font-size: 12px;
            line-height: 20px;
            color: #8a8f8d;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      &-content {
        height: auto;
        padding: 0;
        .content {
          background: #fafafa;
          border-radius: 6px;
          border: 0;
          padding: 10px 17px;
          display: flex;
          flex-direction: column;
          .type {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 2px 0;
            span {
              color: #262626;
              font-size: 14px;
              line-height: 22px;
            }
          }
          .member {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            margin-bottom: 10px;
            line-height: 22px;
            &-left {
              display: flex;
              flex-direction: column;
              justify-content: center;
              width: 132px;
              .count {
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                  font-size: 12px;
                  color: #8a8f8d;
                }
              }
              .line {
                .el-progress .el-progress-bar__outer {
                  height: 2px !important;
                }
              }
            }
            &-right {
              position: relative;
              top: 6px;
              font-size: 14px;
              cursor: pointer;
              color: #262626;
            }
          }
          .admin {
            display: flex;
            align-items: center;
            span {
              font-size: 12px;
              color: #8a8f8d;
              line-height: 24px;
            }
            img {
              margin-left: 12px;
              width: 16px;
              min-width: 16px;
              height: 16px;
              border-radius: 8px;
            }
          }
          .button {
            margin-top: 16px;
            padding-bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 32px;
            border: 1px solid #e7e9e8;
            background-color: #fff;
            border-radius: 6px;
            cursor: pointer;
            .settingIcon,
            .settingIcon_active {
              width: 16px;
              min-width: 16px;
              height: 16px;
              margin-right: 8px;
            }
            .settingIcon_active {
              display: none;
            }
            span {
              font-size: 14px;
              color: #262626;
              line-height: 30px;
            }
            &:hover {
              border: 1px solid #009456;
              span {
                color: #009456 !important;
              }
              .settingIcon {
                display: none;
              }
              .settingIcon_active {
                display: flex;
              }
            }
          }
        }
        .content-member {
          background: #fafafa;
          border-radius: 6px;
          border: 1px solid #e7e9e8;
          padding: 10px 17px;
          display: flex;
          flex-direction: column;
          .admin {
            display: flex;
            align-items: center;
            span {
              font-size: 12px;
              color: #8a8f8d;
              line-height: 24px;
            }
            img {
              margin-left: 12px;
              width: 16px;
              min-width: 16px;
              height: 16px;
              border-radius: 8px;
            }
          }
        }
        .divider {
          height: 1px;
          overflow: hidden;
          line-height: 0;
          background-color: rgba(0, 0, 0, 0.06);
          margin: 16px 0 0 0;
        }
      }
    }
  }
}
</style>
