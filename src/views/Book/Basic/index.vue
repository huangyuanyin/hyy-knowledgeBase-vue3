<script lang="ts" setup>
import { coverImages } from '@/data/coverData'
import cover from '@/assets/img/cover/21.png'
import { editLibraryApi } from '@/api/library'
import { FormInstance, FormRules } from 'element-plus'
import { imgToBase64 } from '@/utils/imgToBase64'

interface BookForm {
  name: string
  slug: string
  icon: string
  description: string
  space: string
  group: string
  stacks: string
  cover: string
}

const route = useRoute()
const infoStore = useInfoStore()
const refreshStore = useRefreshStore()
const bookFormRef = ref<FormInstance>()
const bookForm = reactive<BookForm>({
  name: '',
  slug: '',
  icon: '',
  description: '',
  space: infoStore.currentQuery?.sid,
  group: infoStore.currentQuery?.gid,
  stacks: '',
  cover: ''
})
const rules = reactive<FormRules<BookForm>>({
  name: [
    { required: true, message: '请输入知识库名称，长度在 2-50 之间', trigger: 'blur' },
    { min: 2, max: 50, message: '请输入知识库名称，长度在 2-50 之间', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(bookForm))
      editLibrary(params, infoStore.currentQuery?.lid)
    }
  })
}

const editLibrary = async (params, id) => {
  let res = await editLibraryApi(params, id)
  if (res.code === 1000) {
    ElMessage.success('更新成功')
    router.push({
      path: `/${route.path.split('/')[1]}/bookSetting/basic`,
      query: {
        sname: infoStore.currentQuery?.sname,
        sid: infoStore.currentQuery?.sid,
        gid: infoStore.currentQuery?.gid,
        gname: infoStore.currentQuery?.gname,
        lname: (res.data as any).name,
        lid: (res.data as any).id
      }
    })
    refreshStore.setRefreshBookSet(true)
  } else {
    ElMessage.error(res.msg)
  }
}

const getBooksDetail = async (id) => {
  useBook().getBookInfo(id, (res: any) => {
    if (Reflect.ownKeys(res).length) {
      bookForm.name = (res as any).name
      bookForm.slug = (res as any).slug
      bookForm.description = (res as any).description
      bookForm.icon = (res as any).icon
      bookForm.group = (res as any).group
      bookForm.stacks = (res as any).stacks
      bookForm.cover = (res as any).cover
    }
  })
}

const toChangeCover = (item) => {
  bookForm.cover = item
  imgToBase64(bookForm.cover)
    .then((res) => {
      if (res) {
        bookForm.cover = res as string
      }
    })
    .catch((err) => {
      console.log('生成base64错误！', err)
    })
}

const changeIcon = (icon) => {
  bookForm.icon = icon
}

onMounted(() => {
  getBooksDetail(infoStore.currentQuery?.lid)
})
</script>

<template>
  <div class="Basic_wrap">
    <div class="header">知识库信息</div>
    <div class="box">
      <el-form ref="bookFormRef" :model="bookForm" :rules="rules" label-width="120px" class="bookForm" status-icon label-position="top">
        <el-form-item label="图标和名称" prop="name">
          <SelectIconPopver @changeIcon="changeIcon">
            <div class="icon-tag">
              <img :src="bookForm.icon" alt="" />
            </div>
          </SelectIconPopver>
          <el-input v-model="bookForm.name" placeholder="如：就叫小黄好了" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="bookForm.description" type="textarea" rows="4" placeholder="如：产品设计与研发" />
        </el-form-item>
        <el-form-item label="封面">
          <div class="cover" flex h-310px pt-14px pb-14px border="1px solid #dedfe3" rounded-6px w-827px>
            <!-- <el-image :src="cover" fit="contain" />
            <el-button @click="uploadImg"> 重新上传 </el-button> -->
            <div relative w-207px h-full ml-14px pt-35px pb-35px pr-22px pl-22px box-sizing>
              <img absolute top-0px left-0px w-full h-full rounded-6px :src="bookForm.cover || cover" alt="" />
              <h3 relative font-600 text-23px text="#1f2329" line-height-33px tracking-1.5px>{{ bookForm.name }}</h3>
              <p relative text-15px line-height-25px mt-4px tracking-1.5px line-clamp-3 overflow-hidden text-ellipsis break-words>{{ bookForm.description }}</p>
            </div>
            <div relative ml-10px flex flex-col flex-1>
              <div pl-4px>
                <ul>
                  <li w-40px font-700 list-none whitespace-nowrap p-2px px-8px mr-8px rounded-6px bg="#336DF433" text="center 12px #RRGGBB" line-height-20px cursor-pointer>
                    全部
                  </li>
                </ul>
              </div>
              <div flex mt-8px flex-wrap pl-4px pr-3px overflow-auto class="list">
                <div class="coverImg" mt-1px mr-12px mb-12px w-72px h-98px v-for="(item, index) in coverImages" :key="'coverList' + index">
                  <img w-full h-full rounded-6px cursor-pointer :src="item" alt="" @click="toChangeCover(item)" />
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit" @click="submitForm(bookFormRef)"> 更新信息 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Basic_wrap {
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
    .bookForm {
      :deep(.el-form-item__label) {
        line-height: 40px;
      }
      .el-input {
        height: 40px;
        max-width: 448px;
      }
      :deep(.el-form-item.is-error .el-input__wrapper) {
        border-color: #f56c6c;
      }
      :deep(.el-input__wrapper),
      :deep(.el-textarea__inner) {
        border-radius: 6px;
        border: 1px solid #d9d9d9;
        box-shadow: none;
        &:hover {
          border-color: #0bd07d;
        }
      }
      :deep(.el-input-group) {
        .el-input__wrapper {
          border-radius: 0px !important;
        }
      }
      .icon-tag {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
          margin-right: 16px;
          border-radius: 6px;
        }
      }
      .cover {
        .list {
          max-height: 248px;

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
        .coverImg {
          position: relative;
          display: flex;
          align-items: center;
          &:hover {
            &:before {
              content: '';
              position: absolute;
              box-shadow: 0 0 0 1px rgb(20, 86, 240);
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              border-radius: 6px;
              box-sizing: content-box;
            }
          }
        }
      }
      .submit {
        margin-top: 8px;
        color: #fff;
        background-color: #00b968;
        border: none;
        border-radius: 6px;
        &:hover {
          cursor: pointer;
          background-color: #009456;
        }
      }
      .upload {
        height: 59px;
        &-button {
          margin-top: 0px;
          color: #262626;
          border-radius: 6px;
          svg {
            margin-right: 5px;
          }
          &:hover {
            color: #009456;
            border-color: #009456;
            background-color: #fff;
          }
        }
        &-tip {
          margin-top: 0px;
          font-size: 12px;
          color: #8a8f8d;
        }
      }
    }
  }
}
</style>
