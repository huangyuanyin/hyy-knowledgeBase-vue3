<script lang="ts" setup>
import { getSpacesApi } from '@/api/spaces'
import { MenuItem, OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom',
  width: 312,
  trigger: 'hover',
  hideAfter: 200,
  showArrow: false,
  menuItems: () => [] as MenuItem[],
  currentSider: ''
})

const route = useRoute()
const infoStore = useInfoStore()
const user = JSON.parse(localStorage.getItem('userInfo')).username || ''
const icon = ref('')
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('userInfo')).avatar || '@/assets/img/img.jpg')
const spaceId = ref('') // 当前空间id
const isShowsSpaceDialog = ref(false)
const changeSpacePopverRef = ref<any>(null)
const isSpaceAdmin = ref() // 是否是当前空间管理员
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
const state = reactive({
  currentSpaceName: route.query.sname || ''
})

const initData = () => {
  spaceId.value = route.query.sid as string
  state.currentSpaceName = route.query.sname || ''
  isSpaceAdmin.value = sessionStorage.getItem('isSpaceAdmin')
  if (sessionStorage.getItem('currentSidebar') === 'SpaceSidebar') {
    icon.value = JSON.parse(sessionStorage.getItem('currentSpaceInfo')).icon || '/src/assets/icons/spaceIcon.svg'
  }
}

const toShow = async () => {
  await initData()
  await getSpaces()
}

// 获取当前用户下所能访问的空间
const getSpaces = async () => {
  const params = {
    permusername: user
  }
  let res = await getSpacesApi(params)
  if (res.code === 1000) {
    spacesList.value = res.data as any
    spaces.value[0].list = res.data.filter((item) => item.spacetype === 'personal')
    spaces.value[1].list = res.data.filter((item) => item.spacetype === 'organization')
    spaceReverse.value[0].list = res.data.filter((item) => item.spacetype === 'organization')
    spaceReverse.value[1].list = res.data.filter((item) => item.spacetype === 'personal')
  }
}

const toLink = (type, val?) => {
  console.log(`output->val`, val)
  switch (type) {
    case 'personal':
      router.push('/dashboard')
      break
    case 'organize':
      router.push({
        path: `/${val.spacekey}/dashboard`,
        query: {
          sname: val.spacename,
          sid: val.id
        }
      })
      if (sessionStorage.getItem('currentSidebar') === 'Sidebar') return
      // fix 切换空间，左侧常用列表不刷新
      setTimeout(() => {
        location.reload()
      }, 500)
      break
    case 'add':
      router.push(`/${val.spacekey}/organize/dashboard`)
      break
    case 'set':
      router.push({
        path: `/${infoStore.currentSpaceName}/organize/dashboard`,
        query: route.query
      })
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
      <span class="arrowDownIcon">
        <img src="@/assets/icons/arrowRightIcon.svg" alt="" />
      </span>
    </template>
    <div class="changeSpac_Wrap">
      <template v-if="props.currentSider === 'Sidebar'">
        <div v-for="(item, index) in spaces" :key="'spaces' + index">
          <div class="space_wrap">
            <h4>{{ item.type === 'personal' ? '个人' : '空间' }}</h4>
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
      <template v-if="props.currentSider === 'SpaceSidebar'">
        <div class="card">
          <div class="header">
            <img :src="icon" alt="" />
            <div class="title">
              <span>{{ state.currentSpaceName }}</span>
              <!-- <p>享受标准版空间权益</p> -->
            </div>
          </div>
          <div class="card-content">
            <div class="content" v-if="isSpaceAdmin == 'true'">
              <!-- <div class="type">
                <span>标准版</span>
                <span>升级</span>
              </div> -->
              <div class="member">
                <div class="member-left">
                  <div class="count">
                    <span>成员数</span>
                    <span><span style="color: #262626">1</span>/10</span>
                  </div>
                  <div class="line">
                    <el-progress :percentage="50" :show-text="false" color="#8a8f8d"></el-progress>
                  </div>
                </div>
                <span class="member-right">邀请成员</span>
              </div>
              <div class="admin">
                <span>管理员</span>
                <img :src="avatar" />
              </div>
              <div class="button" @click="toLink('set')">
                <img class="settingIcon" src="/src/assets/icons/settingIcon.svg" alt="" />
                <img class="settingIcon_active" src="/src/assets/icons/settingIcon_active.svg " alt="" />
                <span>空间管理</span>
              </div>
            </div>
            <div class="content-member" v-else>
              <div class="admin">
                <span>管理员</span>
                <img :src="avatar" />
              </div>
            </div>
            <div class="divider"></div>
          </div>
        </div>
        <div v-for="(item, index) in spaceReverse" :key="'spaces' + index">
          <div class="space_wrap">
            <h4>{{ item.type === 'personal' ? '个人' : '空间' }}</h4>
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
              <div class="right" v-if="spaceId == space.id">
                <img src="@/assets/icons/selectIcon.svg" alt="" />
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
