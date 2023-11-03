<script lang="ts" setup>
const emit = defineEmits(['toPublish'])

const route = useRoute()
const name = ref('')
const avatar = ref('http://10.4.150.56:8032/' + JSON.parse(localStorage.getItem('user')).userInfo.avatar || '@/assets/img/img.jpg')
const isEdit = ref(false)
const spaceType = ref('') // 当前空间类型
const spaceId = ref('') // 当前空间id
const itemList = [
  {
    label: '收藏',
    icon: '/src/assets/icons/article/starIcon.svg',
    type: 'label'
  },
  {
    label: '协作',
    icon: '/src/assets/icons/article/collaborateIcon.svg',
    type: 'label'
  },
  {
    label: '演示',
    icon: '/src/assets/icons/article/presentIcon.svg',
    type: 'label'
  },
  {
    label: '当前编辑者的头像将显示在此',
    icon: avatar.value,
    type: 'img'
  }
]
const buttonList = ref([])

watchEffect(() => {
  spaceType.value = route.path.split('/')[1] === 'directory' ? '个人' : '组织'
  spaceId.value = spaceType.value === '个人' ? (localStorage.getItem('personalSpaceId') as string) : (route.query.sid as string)
  route.path.split('/').slice(-1)[0] === 'edit' ? (isEdit.value = true) : (isEdit.value = false)
  if (isEdit.value) {
    buttonList.value = [
      {
        label: '分享',
        type: 'default'
      },
      {
        label: '发布',
        type: 'success'
      }
    ]
  } else {
    buttonList.value = [
      {
        label: '分享',
        type: 'default'
      },
      {
        label: '编辑',
        type: 'success'
      }
    ]
  }
  if (route.query.aname) {
    name.value = route.query.aname as string
  }
})

const toHandle = (item: any) => {
  switch (item.label) {
    case '分享':
      break
    case '发布':
      const params = {
        title: name.value,
        book: route.query.lid,
        space: spaceId.value,
        body: ''
      }
      emit('toPublish', params)
      break
    case '编辑':
      const data = {
        type: route.path.split('/').slice(-2)[0],
        id: route.query.aid,
        title: route.query.aname
      }
      useAddArticleAfterToLink(route, router, spaceType.value, data, true)
      break
    default:
      break
  }
}

onMounted(() => {})
</script>

<template>
  <div class="Container_wrap">
    <el-container>
      <el-header class="header">
        <div class="header_left">
          <label>{{ name }}</label>
          <span>
            <img src="/src/assets/icons/publicIcon.svg" alt="" />
          </span>
        </div>
        <div class="header_right">
          <div class="item" v-for="(item, index) in itemList" :key="'itemList' + index">
            <el-tooltip effect="dark" :content="item.label" placement="bottom" :show-arrow="false">
              <span v-if="item.type === 'label'">
                <img :src="item.icon" alt="" />
              </span>
              <span v-else class="img">
                <img :src="item.icon" alt="" />
              </span>
            </el-tooltip>
          </div>
          <div class="button" v-for="(item, index) in buttonList" :key="'itemList' + index">
            <el-button :type="item.type" @click="toHandle(item)">{{ item.label }}</el-button>
          </div>
          <div class="action" v-if="isEdit">
            <span><img src="/src/assets/icons/article/commentIcon.svg" alt="" /></span>
            <span><img src="/src/assets/icons/article/rightboardIcon.svg" alt="" /></span>
          </div>
          <span class="rightboardIcon" v-else><img src="/src/assets/icons/article/rightboardIcon.svg" alt="" /></span>
        </div>
      </el-header>
      <el-main class="body">
        <slot></slot>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.Container_wrap {
  .header {
    height: 52px;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_left {
      padding: 14px 16px 14px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      label {
        color: #585a5a;
      }
      span {
        margin-left: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
    &_right {
      display: flex;
      align-items: center;
      .item {
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          &:hover {
            background-color: #eff0f0;
          }
        }
        img {
          width: 20px;
          height: 20px;
        }
        .img {
          margin-right: 8px;
          &:hover {
            background-color: #fff;
          }
          img {
            width: 24px;
            height: 24px;
          }
        }
      }
      .button {
        margin-left: 8px;
        .el-button {
          border-radius: 6px;
        }
      }
      .action {
        position: relative;
        width: 64px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid #d8dad9;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px;
        box-sizing: border-box;
        span {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 6px;
          img {
            width: 16px;
            height: 16px;
          }
          &:hover {
            background-color: #eff0f0;
          }
        }
      }
      .rightboardIcon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
        cursor: pointer;
        border-radius: 6px;
        &:hover {
          background-color: #eff0f0;
        }
      }
    }
  }
  .body {
    width: 100%;
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .el-main {
    padding: 0;
  }
}
</style>