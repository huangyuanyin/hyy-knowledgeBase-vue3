import { addLibraryApi } from '@/api/library'
import { FormInstance } from 'element-plus/es/components'
import { useLibraryApi } from './useLibraryApi'

interface RuleForm {
  [key: string]: any
}

interface UseFormDialogOptions {
  isShow: Ref<boolean>
  emit: (event: 'closeDialog', value: boolean) => void
  formData: RuleForm
  formRules?: RuleForm
}

export const useFormDialog = ({ isShow, emit, formData, formRules = {} }: UseFormDialogOptions) => {
  const dialogVisible = ref(false)
  const dialogFormRef = ref<FormInstance>()
  const dialogForm = reactive<RuleForm>(formData)
  const dialogFormRules = formRules

  watch(isShow, (newVal) => {
    dialogVisible.value = newVal
  })

  const handleSubmit = async () => {
    try {
      await dialogFormRef.value.validate()
      const { libraryList, fetchLibrary } = useLibraryApi(addLibraryApi, dialogForm)
      fetchLibrary()
      console.log(`output->dialogForm`, libraryList)
    } catch (error) {
      // error
    }
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  const handleClose = async () => {
    resetForm(dialogFormRef.value)
    dialogVisible.value = false
    emit('closeDialog', false)
  }

  return {
    dialogVisible,
    dialogFormRef,
    dialogForm,
    dialogFormRules,
    handleClose,
    handleSubmit
  }
}
