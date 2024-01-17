<script lang="ts" setup>
import { getGroupPermissionsApi, updateGroupPermissionsApi } from '@/api/grouppermissions'

const infoStore = useInfoStore()
const publicType = ref('1')
const groupSettingId = ref(null)
const teamOptions = ref([
  {
    label: '管理员',
    children: [
      {
        label: '管理员拥有所有权限',
        value: null
      }
    ]
  },
  {
    label: '成员',
    children: [
      {
        label: '允许成员新建知识库',
        value: true
      },
      {
        label: '允许成员添加、删除成员',
        value: true
      }
    ]
  },
  {
    label: '只读成员',
    children: [
      {
        label: '仅拥有只读权限',
        value: null
      }
    ]
  }
])
const libraryOptions = ref([
  {
    label: '可管理',
    children: [
      {
        label: '拥有知识库的所有权限',
        value: null
      }
    ]
  },
  {
    label: '可编辑',
    children: [
      {
        label: '允许修改知识库权限',
        value: false
      },
      {
        label: '允许修改知识库设置',
        value: false
      },
      {
        label: '允许导出知识库',
        value: true
      },
      {
        label: '允许公开分享知识库',
        value: false
      },
      {
        label: '允许公开分享文档',
        value: false
      },
      {
        label: '允许导出文档',
        value: true
      }
    ]
  },
  {
    label: '可阅读',
    children: [
      {
        label: '仅拥有只读和评论权限',
        value: null
      }
    ]
  }
])

const toChangeStatus = (type, item) => {
  if (type === 'book') return ElMessage.warning('暂不支持自定义')
  const params = {
    group: infoStore.currentQuery?.gid
  }
  item.label === '允许成员新建知识库' ? (params['create_book'] = item.value ? '1' : '0') : (params['create_mumber'] = item.value ? '1' : '0')
  updateGroupPermissions(params)
}

const getGroupPermissions = async () => {
  const params = {
    group: infoStore.currentQuery?.gid
  }
  const res = await getGroupPermissionsApi(params)
  if (res.code === 1000) {
    const { data } = res
    groupSettingId.value = data[0].id
    teamOptions.value[1].children[0].value = data[0].create_book === '1' ? true : false
    teamOptions.value[1].children[1].value = data[0].create_mumber === '1' ? true : false
  } else {
    ElMessage.error(res.msg)
  }
}

const updateGroupPermissions = async (params) => {
  const res = await updateGroupPermissionsApi(groupSettingId.value, params)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  getGroupPermissions()
})
</script>

<template>
  <div class="Permission_wrap">
    <div class="header">权限</div>
    <div class="box">
      <div class="publicType">
        <h3>公开性</h3>
        <el-radio-group v-model="publicType" class="item">
          <el-radio label="1" size="large">仅团队成员可访问 </el-radio>
          <el-radio disabled label="2" size="large">空间所有成员可访问</el-radio>
        </el-radio-group>
      </div>
      <div class="divider"></div>
      <div class="options">
        <h3>团队权限</h3>
        <div class="item" v-for="(item, index) in teamOptions" :key="'teamOptions' + index">
          <span>{{ item.label }}</span>
          <div class="it" v-for="(it, index) in item.children" :key="'children' + index">
            <div class="left">
              <p>{{ it.label }}</p>
            </div>
            <div class="right" v-if="it.value !== null">
              <el-switch v-model="it.value" class="ml-2" size="large" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bec0bf" @change="toChangeStatus('team', it)" />
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <h3>知识库权限</h3>
        <div class="item" v-for="(item, index) in libraryOptions" :key="'libraryOptions' + index">
          <span>{{ item.label }}</span>
          <div class="it" v-for="(it, index) in item.children" :key="'children' + index">
            <div class="left">
              <p>{{ it.label }}</p>
            </div>
            <div class="right" v-if="it.value !== null">
              <el-switch
                disabled
                v-model="it.value"
                class="ml-2"
                size="large"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #bec0bf"
                @change="toChangeStatus('book', it)"
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
    margin-bottom: 24px;
  }
  .box {
    max-width: 668px;
    .publicType {
      h3 {
        margin-bottom: 16px;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        color: #262626;
      }
      .item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
    }
    .divider {
      margin-top: 28px;
      margin-bottom: 28px;
      display: flex;
      clear: both;
      width: 100%;
      min-width: 100%;
      margin: 24px 0;
      box-sizing: border-box;
      padding: 0;
      color: #262626;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: 'tnum';
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }
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
        span {
          font-size: 14px;
          color: #262626;
          // line-height: 22px;
        }
        .it {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-height: 50px;
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
              color: #8a8f8d;
            }
          }
        }
      }
    }
  }
}
</style>
