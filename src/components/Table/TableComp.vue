<script lang="ts" setup>
const props = defineProps({
  header: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  }
})

const editTableOperation = [
  {
    type: 'item',
    label: '收藏',
    icon: '/src/assets/icons/starOutlineIcon.svg'
  },
  {
    type: 'item',
    label: '移除记录',
    icon: '/src/assets/icons/swipOutlineIcon.svg'
  },
  {
    type: 'item',
    label: '浏览器打开',
    icon: '/src/assets/icons/newTabOutlineIcon.svg'
  }
]

const hoveredDocument = ref<number | null>(null)

const header = computed(() => {
  return props.header.map((item) => ({ label: item }))
})

const handleMouseEnter = (documentId: number): void => {
  if (hoveredDocument.value !== documentId) {
    hoveredDocument.value = documentId
  }
}
const handleMouseLeave = (documentId: number): void => {
  if (hoveredDocument.value === documentId) {
    hoveredDocument.value = null
  }
}
</script>

<template>
  <table class="TableComp_wrap">
    <thead v-if="header.length">
      <tr>
        <th v-for="(item, index) in header" :key="'header' + index">{{ item.label }}</th>
      </tr>
    </thead>
    <tbody v-if="props.type === 'dashboard'">
      <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
        <td class="item-title">
          <div>
            <img :src="document.icon" alt="" />
            <div class="item-title-right">
              <el-tooltip effect="light" :content="document.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                <span>{{ document.title }}</span>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :show-arrow="false">
                <span class="editIcon">
                  <img v-show="hoveredDocument === document.id" src="@/assets/icons/editIcon.svg" alt="" />
                </span>
              </el-tooltip>
            </div>
          </div>
        </td>
        <td class="item-user">
          <span class="username">{{ document.username }}</span>
          <span class="divider">/</span>
          <span class="library">{{ document.library }}</span>
        </td>
        <td class="item-time">
          <span>{{ document.time }}</span>
        </td>
        <td class="item-operation">
          <LibraryOperationPopver :menuItems="editTableOperation" :width="126">
            <span>
              <img v-show="hoveredDocument === document.id" src="@/assets/icons/moreIcon1_after.svg" alt="" />
            </span>
          </LibraryOperationPopver>
        </td>
      </tr>
    </tbody>
    <tbody v-if="props.type === 'star'">
      <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
        <td class="item-title">
          <div>
            <img :src="document.icon" alt="" />
            <div class="item-title-right">
              <el-tooltip effect="light" :content="document.title" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                <span>{{ document.title }}</span>
              </el-tooltip>
            </div>
          </div>
        </td>
        <td class="item-user">
          <span class="username">{{ document.username }}</span>
          <span class="divider">/</span>
          <span class="library">{{ document.library }}</span>
        </td>
        <td class="item-time">
          <span>{{ document.time }}</span>
        </td>
        <td class="item-operation">
          <span v-if="props.type === 'star'"><img src="@/assets/icons/startIcon_select.svg" alt="" /></span>
        </td>
      </tr>
    </tbody>
    <tbody v-if="props.type === 'team'">
      <tr class="docItem" v-for="document in props.data" :key="document.id" @mouseenter="handleMouseEnter(document.id)" @mouseleave="handleMouseLeave(document.id)">
        <td class="item-title">
          <div>
            <img :src="document.icon" alt="" />
            <div class="item-title-right">
              <el-tooltip effect="light" :content="document.groupname" placement="bottom-start" :show-arrow="false" :offset="0" :show-after="1000">
                <span>{{ document.groupname }}</span>
              </el-tooltip>
            </div>
          </div>
        </td>
        <td class="item-desc">
          <span class="desc">{{ document.description }}</span>
        </td>
        <td class="item-user">
          <span class="username">{{ document.member }}成员</span>
        </td>
        <td class="item-time">
          <span>{{ document.create_datetime }}</span>
        </td>
        <td class="item-operation more">
          <el-tooltip effect="dark" content="取消常用" :offset="6" placement="top" :show-arrow="false">
            <span class="pinIcon">
              <img src="@/assets/icons/pinIcon.svg" alt="" />
            </span>
          </el-tooltip>
          <span class="moreIcon">
            <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.TableComp_wrap {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  tr {
    th {
      padding: 8px 0;
      font-size: 14px;
      color: #8a8f8d;
      text-align: left;
    }
  }
  .docItem {
    height: 65px;
    &:hover {
      background-color: #fafafa;
    }
    td {
      padding: 16px 1px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    .item-title {
      div {
        display: flex;
        align-items: center;
        img {
          width: 24px;
          min-width: 24px;
          height: 24px;
          margin-right: 16px;
        }
        .item-title-right {
          display: flex;
          align-items: center;
          max-width: 100%;
          span {
            font-size: 14px;
            line-height: 32px;
            color: #262626;
            cursor: pointer;
          }
          .editIcon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            margin-left: 12px;
            img {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
        }
      }
    }
    .item-user {
      font-size: 14px;
      color: #8a8f8d;
      height: 65px;
      box-sizing: border-box;
      .library,
      .username {
        &:hover {
          color: #262626;
          cursor: pointer;
        }
      }
      .divider {
        margin: 0 4px;
      }
    }
    .item-desc {
      font-size: 14px;
      color: #8a8f8d;
      height: 65px;
      box-sizing: border-box;
    }
    .item-time {
      min-width: 120px;
      font-size: 14px;
      color: #8a8f8d;
    }
    .item-operation {
      span {
        cursor: pointer;
        width: 34px;
        min-width: 34px;
      }
    }
    .more {
      width: 100px;
      span {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        &:hover {
          background-color: #e7e9e8;
        }
      }
      .moreIcon {
      }
    }
  }
}
</style>
