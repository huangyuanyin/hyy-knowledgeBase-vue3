// 注意图片的，onload是异步的，如果要封装成工具函数，需要用promise包装一下
export const imgToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth // 使用 naturalWidth 为了保证图片的清晰度
      canvas.height = image.naturalHeight
      canvas.style.width = `${canvas.width / window.devicePixelRatio}px`
      canvas.style.height = `${canvas.height / window.devicePixelRatio}px`
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return null
      }
      ctx.drawImage(image, 0, 0)
      const base64 = canvas.toDataURL('image/png')
      return resolve(base64)
    }
    image.onerror = (err) => {
      return reject(err)
    }
  })
}
