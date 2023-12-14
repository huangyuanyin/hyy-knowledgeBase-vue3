<script lang="ts" setup>
import { editArticleApi } from '@/api/article'
import { OperationPopoverProps } from '@/type/operationPopoverType'

const props = withDefaults(defineProps<OperationPopoverProps>(), {
  placement: 'bottom-start',
  width: 420,
  trigger: 'click',
  hideAfter: 100,
  showArrow: false,
  aInfo: {}
})

const route = useRoute()
const aId = route.query.aid
const sharePopverRef = ref(null)
const publicType = ref('0')
const currentPage = ref('0')
const indexed_level = ref(false)
const copyLink = ref('')
const operaList = ref([
  {
    label: '分享范围',
    value: '空间所有成员可访问',
    icon: '/src/assets/icons/sharePopver/1.svg'
  },
  {
    label: '密码访问',
    value: '无密码',
    icon: '/src/assets/icons/sharePopver/2.svg'
  },
  {
    label: '允许空间内搜索',
    value: '关闭',
    icon: '/src/assets/icons/sharePopver/3.svg'
  },
  {
    label: '关闭空间分享',
    value: '',
    icon: '/src/assets/icons/sharePopver/4.svg'
  }
])
const publicTypeList = [
  {
    label: '该知识库所有成员可访问',
    value: '1'
  },
  {
    label: '空间所有成员可访问',
    value: '2'
  }
]

watchEffect(() => {
  currentPage.value = '0'
  publicType.value = props.aInfo.public
  copyLink.value = window.location.href
})

watch(
  () => props.aInfo,
  (newVal) => {
    if (newVal.indexed_level === '1') {
      operaList.value[2].value = '开启'
      indexed_level.value = true
    } else {
      operaList.value[2].value = '关闭'
      indexed_level.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => publicType.value,
  () => {
    if (publicType.value === '1') {
      operaList.value[0].value = '该知识库所有成员可访问'
    } else {
      operaList.value[0].value = '空间所有成员可访问'
    }
  },
  {
    immediate: true
  }
)

const toChangePublic = (type: string) => {
  editArticle(type)
}

const toHandle = (item: any) => {
  switch (item.label) {
    case '分享范围':
      currentPage.value = '1'
      break
    case '关闭空间分享':
      toChangePublic('0')
      break
    case '允许空间内搜索':
      currentPage.value = '2'
      break
    default:
      ElMessage.warning('功能暂未开放，敬请期待')
      break
  }
}

const changeLevel = async () => {
  const params = {
    title: props.aInfo.title,
    book: props.aInfo.book,
    space: props.aInfo.space,
    indexed_level: indexed_level.value ? '1' : '0'
  }
  const res = await editArticleApi(Number(aId), params)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    publicType.value = res.data.public
    operaList.value[2].value = indexed_level.value ? '开启' : '关闭'
  } else {
    ElMessage.error(res.msg)
  }
}

const editArticle = async (val) => {
  const params = {
    title: props.aInfo.title,
    book: props.aInfo.book,
    space: props.aInfo.space,
    public: val
  }
  const res = await editArticleApi(Number(aId), params)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    publicType.value = res.data.public
  } else {
    ElMessage.error(res.msg)
  }
}

const toCopy = () => {
  sharePopverRef.value && sharePopverRef.value.hide()
  useCopy(copyLink.value, '分享链接')
}
</script>

<template>
  <el-popover
    ref="sharePopverRef"
    popper-class="sharePopver"
    :placement="props.placement"
    :width="props.width"
    :trigger="props.trigger"
    :hide-after="props.hideAfter"
    :show-arrow="props.showArrow"
  >
    <template #reference>
      <slot></slot>
    </template>
    <div class="box" v-if="currentPage === '0'">
      <h1 v-if="publicType === '0'">当前文档为私密，仅自己和协作者可访问</h1>
      <h1 v-if="publicType === '1'">当前文档为公开，该知识库所有成员可访问</h1>
      <h1 v-if="publicType === '2'">当前文档为公开，空间所有成员可访问</h1>
      <li>
        <div class="left">
          <div class="icon">
            <img src="/src/assets/icons/sharePopver/metaAvatarIcon.svg" alt="" />
          </div>
          <div class="content">
            <span>添加协作者</span>
            <p>通过链接，邀请对方加入协作</p>
          </div>
        </div>
        <div class="right">
          <el-tooltip effect="dark" content="查看所有协作者" placement="top" :show-arrow="false">
            <span>
              <img src="/src/assets/icons/sharePopver/userIcon.svg" alt="" />
            </span>
          </el-tooltip>
        </div>
      </li>
      <li>
        <div class="left">
          <div class="icon public">
            <img src="/src/assets/icons/sharePopver/publicIcon.svg" alt="" />
          </div>
          <div class="content">
            <span>公开分享</span>
            <p>开启后，分享范围内所有成员可访问</p>
          </div>
        </div>
        <div class="right" v-if="publicType === '0'">
          <el-button @click="toChangePublic('2')">公开</el-button>
        </div>
      </li>
      <div class="opera" v-if="publicType !== '0'">
        <div class="copyLink">
          <el-input :placeholder="copyLink" disabled></el-input>
          <el-button @click="toCopy">复制链接</el-button>
        </div>
        <div class="opera-box" v-for="(item, index) in operaList" :key="'operaList' + index">
          <div class="item" :class="[!item.value ? 'close' : '']" @click="toHandle(item)">
            <span class="item-left"><img :src="item.icon" alt="" />{{ item.label }}</span>
            <span class="item-right" v-if="item.value">{{ item.value }}<img src="/src/assets/icons/sharePopver/right.svg" alt="" /></span>
          </div>
        </div>
      </div>
    </div>
    <div class="box" v-if="currentPage === '1'">
      <div class="back" @click="currentPage = '0'"><img src="/src/assets/icons/sharePopver/back.svg" alt="" />分享范围</div>
      <p class="tip">默认分享范围是空间所有成员。可以选择分享给互联网所有人，内容需符合相关法律法规及语雀 服务协议 约定。</p>
      <div class="public-item" v-for="(item, index) in publicTypeList" :key="'publicTypeList' + index" @click="toChangePublic(item.value)">
        <span>{{ item.label }}</span>
        <img v-if="publicType === item.value" src="/src/assets/icons/sharePopver/select.svg" alt="" />
      </div>
    </div>
    <div class="box" v-if="currentPage === '2'">
      <div class="back" @click="currentPage = '0'"><img src="/src/assets/icons/sharePopver/back.svg" alt="" />允许空间内搜索</div>
      <p class="tip">开启后，空间成员可在空间里搜索到当前内容（如果开启了密码，则搜索设置无效）</p>
      <div class="public-item">
        <span>允许空间内搜索</span>
        <el-switch v-model="indexed_level" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #8a8f8d" @change="changeLevel" />
      </div>
    </div>
  </el-popover>
</template>
<style lang="scss" scoped>
.sharePopver {
  .box {
    h1 {
      margin-bottom: 20px;
      font-size: 14px;
      color: #262626;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      .left {
        width: 256px;
        display: flex;
        align-items: center;
        .icon {
          margin-right: 12px;
          height: 44px;
          width: 44px;
          border-radius: 8px;
          background-color: #4b73b3;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 22px;
            min-width: 22px;
            height: 22px;
          }
        }
        .public {
          background-color: #23ad73 !important;
        }
        .content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 44px;
          span {
            font-size: 14px;
            color: #262626;
          }
          p {
            font-size: 12px;
            color: #8a8f8d;
            line-height: 20px;
          }
        }
      }
      .right {
        span {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #262626;
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: 'tnum', 'tnum';
          position: relative;
          display: inline-block;
          line-height: 1;
          background: #f4f5f5;
          border-radius: 50%;
          padding: 6px;
          border: 0.5px solid #eff0f0;
          cursor: pointer;
          img {
            width: 16px;
            min-width: 16px;
            height: 16px;
          }
        }
        .el-button {
          height: 32px;
          border-radius: 6px;
          &:hover {
            cursor: pointer;
            color: #009456;
            border-color: #009456;
            background-color: #fff;
          }
        }
      }
    }
    // 第一个li没有margin-top
    li:first-child {
      margin-top: 0;
    }
    .opera {
      margin-top: 16px;
      padding-top: 16px;
      background-color: #fafafa;
      border-radius: 8px;
      .copyLink {
        width: 380px;
        padding: 0 12px 4px 12px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .el-input {
          // width: 228px;
          margin-right: 8px;
        }
        .el-button {
          height: 32px;
          border-radius: 6px;
          &:hover {
            cursor: pointer;
            color: #009456;
            border-color: #009456;
            background-color: #fff;
          }
        }
      }
      .opera-box {
        padding: 6px;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          height: 42px;
          box-sizing: border-box;
          &-left {
            color: #262626;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            img {
              margin-right: 12px;
              width: 16px;
              height: 16px;
            }
          }
          &-right {
            display: flex;
            align-items: center;
            cursor: pointer;
            color: #8a8f8d;
            font-size: 14px;
            img {
              margin-left: 2px;
              transform: rotate(-90deg);
            }
          }
          &:hover {
            background-color: #eff0f0;
            border-radius: 8px;
            cursor: pointer;
          }
        }
        .close {
          span {
            color: #df2a3f;
          }
          &:hover {
            background-color: #fbe4e7 !important;
          }
        }
      }
    }
    .back {
      text-align: left;
      display: inline-flex;
      align-items: center;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      color: #262626;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        transform: rotate(90deg);
      }
    }
    .tip {
      margin-top: 12px;
      color: #585a5a;
      font-size: 14px;
    }
    .public-item {
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;
      color: #262626;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>

<style lang="scss">
.sharePopver {
  padding: 20px !important;
}
</style>
