<template>
  <div class="Questionnaire_wrap">
    <div class="content">
      <img src="https://gw.alipayobjects.com/mdn/prod_resou/afts/img/A*193LS7_FoVcAAAAAAAAAAAAAARQnAQ" alt="" />
      <div class="box" v-if="!isSubmit">
        <div class="title">
          <span>数据库使用调查问卷</span>
        </div>
        <div class="tips">
          <p>
            <span>说明：</span>
            <span class="item"> 1、为了快速迭代数据库类产品的测试工作，现收集各个产品使用频率最高的4种数据库，请各位针对每种产品，选择客户使用频率最高的数据库 </span>
            <span class="item"> 2、每个人只能提交一次 </span>
            <span class="item">3、每种产品最多选择4种数据库，可少于4种</span>
          </p>
        </div>
        <div class="table">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="ruleForm" :size="formSize" status-icon label-position="top">
            <div v-for="(products, category) in productData" :key="category">
              <el-form-item :label="category" :prop="category">
                <el-checkbox-group v-model="ruleForm[category]" :max="4">
                  <el-checkbox v-for="product in products" :key="product.id" :label="product.name" :name="product.id" />
                </el-checkbox-group>
                <el-input v-model="products.suggestion" placeholder="建议：如果您有更好的建议请在此处填写" :autosize="{ minRows: 2 }" type="textarea" />
              </el-form-item>
            </div>
            <el-form-item class="button">
              <el-button type="success" @click="submitForm(ruleFormRef)"> 提交 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="box" v-else>
        <el-result icon="success" title="感谢您的提交"></el-result>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { getQuestionApi, addQuestionApi } from '@/api/question/index'

interface Product {
  id: number
  name: string
  title_id: number
  suggestion?: string
}

interface FormData {
  [key: string]: string[]
}

interface QuestionResult {
  title_id: number
  item_ids: (number | null)[]
  suggestion: string
}

const productData = ref<Record<string, Product[]>>({})
const formSize = ref<string>('default')
const ruleFormRef = ref()
const ruleForm = reactive<FormData>({
  CSSP: [],
  NetEDS: [],
  MAuth: [],
  NetPass: [],
  NetCert: [],
  NetCertRA: [],
  NetSeal: []
})
const isSubmit = ref<boolean>(false)

// function validateSelection(input) {
//   return (rule, value) => {
//     if (value.length === 1 && value.includes('其他') && !input.value) {
//       return Promise.reject('最少填写一种数据库')
//     }
//     value = value.filter((it) => it !== '其他')
//     const maxSelection = 3

//     if (value.length > maxSelection) {
//       return Promise.reject('最多选择3种已有产品')
//     } else {
//       return Promise.resolve()
//     }
//   }
// }

const rules = reactive({
  CSSP: [{ required: false, validator: validateSelection, trigger: 'change' }],
  NetEDS: [{ required: false, validator: validateSelection, trigger: 'change' }],
  MAuth: [{ required: false, validator: validateSelection, trigger: 'change' }],
  NetPass: [{ required: false, validator: validateSelection, trigger: 'change' }],
  NetCert: [{ required: false, validator: validateSelection, trigger: 'change' }],
  NetCertRA: [{ required: false, validator: validateSelection, trigger: 'change' }],
  NetSeal: [{ required: false, validator: validateSelection, trigger: 'change' }]
})

function validateSelection(rule, value) {
  const maxSelection = 4
  if (value.length > maxSelection) {
    return Promise.reject('每类产品下最多选择4种已有数据库')
  } else {
    return Promise.resolve()
  }
}

const submitForm = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate((valid: boolean, fields: Record<string, string>) => {
    if (valid) {
      const questionResults: QuestionResult[] = []
      console.log(`output->ruleForm`, productData.value)
      for (const category in productData.value) {
        if (ruleForm[category].length > 0) {
          questionResults.push({
            title_id: productData.value[category][0].title_id,
            item_ids: ruleForm[category].map((selectedProduct) => {
              const product = productData.value[category].find((p) => p.name === selectedProduct)
              return product ? product.id : null
            }),
            suggestion: productData.value[category].suggestion || ''
          })
        }
      }
      addQuestion(questionResults)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const addQuestion = async (question_results) => {
  const params = {
    question_results
  }
  let res = await addQuestionApi(params)
  if (res.code === 1000) {
    isSubmit.value = true
  }
}

const getQuestion = async () => {
  let res = await getQuestionApi()
  if (res.code === 1000) {
    productData.value = res.data
    for (const productCategory in productData.value) {
      if (productData.value.hasOwnProperty(productCategory)) {
        productData.value[productCategory].suggestion = ''
      }
    }
    console.log(`output->productData.value`, productData.value)
  }
}

onMounted(() => {
  getQuestion()
})
</script>

<style lang="scss" scoped>
.Questionnaire_wrap {
  margin-top: 20px;
  background-color: #fff;
  .content {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    img {
      position: absolute;
      top: 72px;
      width: 1338px;
    }
    .box {
      position: relative;
      margin: 24px auto;
      max-width: 676px;
      padding: 56px 48px;
      background: #fff;
      box-shadow: 0 2px 8px -4px rgba(5, 8, 82, 0.04), 0 8px 24px -8px rgba(5, 8, 82, 0.12);
      border-radius: 8px;
      box-sizing: border-box;
      :deep(.el-result) {
        .el-result__title {
          p {
            font-weight: 500;
            font-size: 24px;
            color: #262626;
            line-height: 32px;
            margin-bottom: 32px;
            text-align: center;
            display: inline-block;
            width: 100%;
            font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
              sans-serif;
          }
        }
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 20px;
          color: #585a5a;
          line-height: 22px;
          font-weight: 500;
          margin-bottom: 20px;
          text-align: center;
        }
        .caption {
          font-size: 14px;
          font-weight: 400;
          color: #1677ff;
          cursor: pointer;
        }
      }
      .tips {
        margin-bottom: 40px;
        color: red;
        .item {
          display: flex;
          color: red;
          font-size: 14px;
          margin: 4px 0;
        }
      }
      .table {
        .ruleForm {
          :deep(.el-form-item__label) {
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            font-weight: 800;
          }
          :deep(.el-checkbox__label) {
            font-size: 14px;
            color: #262626;
            padding-right: 8px;
            padding-left: 8px;
          }
          :deep(.el-checkbox__inner) {
            &:hover {
              border-color: #00b96b;
            }
          }
          :deep(.is-disabled) {
            .el-checkbox__inner {
              &:hover {
                border-color: #dcdfe6;
              }
            }
          }
          :deep(.is-checked) {
            .el-checkbox__inner {
              background-color: #00b96b;
              border-color: #00b96b;
            }
          }
          :deep(.el-form-item) {
            margin-bottom: 24px;
          }
          :deep(.el-textarea) {
            margin-top: 6px;
          }
          .button {
            :deep(.el-form-item__content) {
              width: 100%;
              justify-content: center;
            }
          }
        }
      }
    }
  }
}
</style>
