import { ElNotification } from 'element-plus'
import 'element-plus/es/components/notification/style/css'
import cb3 from 'vue-clipboard3'

const { toClipboard } = cb3()

export const useCopy = (text, title = '链接') => {
  toClipboard(text)
    .then(() => {
      ElNotification({
        type: 'success',
        title: `${title}已复制到剪切板`,
        duration: 2000,
        offset: 150
      })
    })
    .catch((error) => {
      console.log(error)
    })
}
