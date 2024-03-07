<script lang="ts" setup>
import selectIcon from '@/assets/icons/user/select.svg'

const infoStore = useInfoStore()
const userInfo = JSON.parse(localStorage.getItem('xinAn-userInfo')) || {}
const isShowPasswordDialog = ref(false)
const account = ref([
  {
    type: 'phone',
    text: '手机号码',
    value: userInfo.expire
  },
  {
    type: 'email',
    text: '邮箱',
    value: `已绑定`
  },
  {
    type: 'password',
    text: '账户密码',
    value: '已设置，可通过账户密码登录'
  }
])

const toOpera = (type: string) => {
  switch (type) {
    case 'password':
      isShowPasswordDialog.value = true
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}
</script>

<template>
  <div class="Account_wrap">
    <div text-20px text="#262626" font-600 line-height-28px mb-24px>账号管理</div>
    <div class="box">
      <h3 mb-16px text-16px text="#262626">账号绑定</h3>
      <div>
        <div bg="#fafafa" rounded-8px pt-16px pb-16px pl-16px pr-16px mb-0px mt-16px flex items-center v-for="(item, index) in account" :key="'account' + index">
          <img w-26px h-26px mr-14px :src="selectIcon" alt="" />
          <div flex items-center justify-between flex-1>
            <div flex flex-col items-start justify-between>
              <p text-14px text="#262626">{{ item.text }}</p>
              <span text-14px text="#8a8f8d" mt-6px>{{ item.value }}</span>
            </div>
            <button class="button" text-14px mr-16px cursor-pointer border="1px solid #e7e9e8" bg="#fff" rounded-6px h-24px pl-7px pr-7px @click="toOpera(item.type)">更改</button>
          </div>
        </div>
      </div>
      <div v-if="infoStore.currentQuery.stype === 'organize'">
        <h3 mt-56px text-16px text="#262626">退出空间</h3>
        <div mt-16px>
          <p text-14px text="#585a5a" mb-22px>退出空间后本账号将无法查看该空间，请谨慎操作。</p>
          <button text-14px mr-16px cursor-pointer text="#df2a3f" border="1px solid #df2a3f" bg="#fff" rounded-6px h-32px pl-15px pr-15px pt-4px pb-4px @click="toOpera('exit')">
            退出
          </button>
        </div>
      </div>
      <div mt-16px v-else>
        <button text-14px mr-16px cursor-pointer text="#df2a3f" border="1px solid #df2a3f" bg="#fff" rounded-6px h-32px pl-15px pr-15px pt-4px pb-4px @click="toOpera('exit')">
          退出登录
        </button>
      </div>
    </div>
  </div>
  <PasswordDialog :isShow="isShowPasswordDialog" @closeDialog="isShowPasswordDialog = false" />
</template>

<style lang="scss" scoped>
.Account_wrap {
  margin: auto;
  max-width: 1080px;
  .box {
    max-width: 668px;
  }
  .button {
    &:hover {
      color: #009456;
      border-color: #009456;
    }
  }
}
</style>
