<script lang="ts" setup>
interface Button {
  type: string
  name: string
}

type ModuleType = 'operation' | 'search'

const props = defineProps<{
  moduleType: ModuleType
  moduleGenreData?: Button[]
  moduleGenre?: string
}>()

if (!props.moduleType) {
  console.error('moduleType is required but not provided.')
}

const moduleGenreLocal = ref(props.moduleGenre)

const changeType = (type: string) => {
  moduleGenreLocal.value = type
}
</script>

<template>
  <div class="SwitchModuleItem-wrap">
    <slot name="left">
      <div class="module-button">
        <label v-for="item in props.moduleGenreData" :key="item.type" :class="[moduleGenreLocal === item.type ? 'module-active' : '']" @click="changeType(item.type)">
          {{ item.name }}
        </label>
      </div>
    </slot>
    <div class="module-operation" v-if="props.moduleType === 'operation'">
      <div class="addIcon">
        <img src="/src/assets/icons/addIcon.svg" alt="" class="moreIcon" />
        <img src="/src/assets/icons/downIcon.svg" alt="" />
      </div>
      <div class="styleIcon">
        <span class="">
          <img src="/src/assets/icons/cardStyleIcon.svg" alt="" class="moreIcon" />
        </span>
        <div class="divider"></div>
        <span>
          <img src="/src/assets/icons/listStyleIcon.svg" alt="" />
        </span>
      </div>
    </div>
    <div class="module-search" v-if="props.moduleType === 'search'">
      <div class="search-item">
        <span>类型 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
      </div>
      <div class="search-item">
        <span>归属 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
      </div>
      <div class="search-item">
        <span>创建者 <img src="/src/assets/icons/downIcon.svg" alt="" /></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SwitchModuleItem-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .module-button {
    padding: 3px;
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 8px;
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      border-radius: 6px;
      min-height: 28px;
      padding: 2px 16px;
      cursor: pointer;
      text-align: center;
      line-height: 28px;
      transition: background-color 0.3s, color 0.3s;
    }
  }
  .module-operation {
    height: 32px;
    display: flex;
    align-items: center;
    .addIcon {
      margin-left: 12px;
      height: 32px;
      width: 64px;
      border-radius: 6px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      line-height: 32px;
      border: 1px solid #e7e9e8;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        border-color: #009456;
      }
      img {
        width: 16px;
        height: 16px;
        margin-top: 7px;
      }
    }
    .styleIcon {
      display: flex;
      align-items: center;
      margin-left: 12px;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
        width: 26px;
        height: 26px;
        &:hover {
          background-color: #eff0f0;
        }
      }
      div {
        display: flex;
        align-items: center;
        border-right: 1px solid #e7e9e8;
        height: 16px;
        position: relative;
        margin: 0 5px;
      }
    }
  }
  .module-active {
    background-color: #fff;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 1px rgba(0, 0, 0, 0.02);
  }
  .module-search {
    display: flex;
    align-items: center;
    .search-item {
      display: flex;
      align-items: center;
      margin-left: 8px;
      span {
        font-size: 14px;
        color: #585a5a;
        padding: 4px;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
