<script lang="ts" setup>
import { getSpaceSettingApi, updateSpaceSettingApi } from '@/api/spaceSetting'

const infoStore = useInfoStore()
const spaceId = ref('')
const spaceSettingId = ref('')
const memberOptions = ref([
  {
    label: '管理员',
    desc: '管理员拥有所有权限',
    children: []
  },
  {
    label: '成员',
    desc: '成员可查看空间下公开、成员可见的内容，可编辑他所在的团队、知识库文档。无法进入空间管理页',
    children: [
      {
        label: '允许团队、知识库通过邀请链接快速添加空间外人员',
        value: false
      },
      {
        label: '允许成员创建团队',
        value: true
      }
    ]
  },
  {
    label: '外部联系人',
    desc: '外部联系人仅可查看自己所在团队、知识库文档',
    children: []
  }
])

watchEffect(() => {
  spaceId.value = infoStore.currentQuery.sid as string
})

const toChangeStatus = (item) => {
  const params = {
    space: spaceId.value
  }
  if (item.label === '允许成员创建团队') {
    params['create_group'] = item.value ? '1' : '0'
    updateSpaceSetting(params)
  }
}

const getSpaceSetting = async () => {
  const params = {
    space: spaceId.value
  }
  const res = await getSpaceSettingApi(params)
  if (res.code === 1000) {
    const { data } = res
    spaceSettingId.value = data[0].id
    memberOptions.value[1].children[1].value = data[0].create_group === '1' ? true : false
  }
}

const updateSpaceSetting = async (params) => {
  const res = await updateSpaceSettingApi(Number(spaceSettingId.value), params)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getSpaceSetting()
})
</script>

<template>
  <div class="Permission_wrap">
    <div class="header">权限设置</div>
    <div class="box">
      <div class="options">
        <h3>成员角色权限设置</h3>
        <div class="item" v-for="(item, index) in memberOptions" :key="'memberOptions' + index">
          <div class="item-header">
            <span>{{ item.label }}</span>
            <span class="desc">{{ item.desc }}</span>
          </div>
          <div class="it" v-for="(it, index) in item.children" :key="'children' + index">
            <div class="left">
              <p>{{ it.label }}</p>
            </div>
            <div class="right" v-if="it.value !== null">
              <el-switch
                :disabled="it.label === '允许成员创建团队' ? false : true"
                v-model="it.value"
                size="large"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bec0bf"
                @change="toChangeStatus(it)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Permission_wrap {
  margin: auto;
  max-width: 1080px;
  .header {
    font-size: 20px;
    color: #262626;
    line-height: 28px;
    font-weight: 500;
    margin-bottom: 28px;
  }
  .box {
    max-width: 668px;
    .options {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #262626;
      }
      .item {
        margin-bottom: 20px;
        &-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          span {
            margin-bottom: 6px;
            font-size: 14px;
            color: #262626;
            line-height: 22px;
          }
          .desc {
            margin-bottom: 16px;
            color: #8a8f8d;
          }
        }
        .it {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-height: 50px;
          margin-top: -10px;
          .left {
            display: flex;
            flex-direction: column;
            span {
              font-size: 14px;
              color: #262626;
            }
            p {
              line-height: 22px;
              margin-top: 3px;
              font-size: 14px;
              color: #262626;
            }
          }
        }
      }
    }
  }
}
</style>
