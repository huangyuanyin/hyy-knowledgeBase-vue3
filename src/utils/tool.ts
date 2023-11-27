export function debounce(fn, wait = 1000) {
  let timeout = null
  if (timeout !== null) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(fn, wait)
}

export function getBase64Image(img: File): Promise<string> {
  return new Promise(function (resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: any) => void) {
    let reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(img)
    reader.onload = function () {
      imgResult = reader.result as string
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
