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

export function disabledControl() {
  document.onkeydown = () => {
    //禁用F12
    if (window.event && window.event.keyCode == 123) {
      return false
      //禁用ctrl+shift+i,
    } else if (window.event.ctrlKey && window.event.shiftKey && window.event.keyCode == 73) {
      return false
      //禁用ctrl+shift+j,
    } else if (window.event.ctrlKey && window.event.shiftKey && window.event.keyCode == 74) {
      return false
      //屏蔽Shift+F10
    } else if (window.event.shiftKey && window.event.keyCode == 121) {
      return false
    }
  }
  document.oncontextmenu = new Function('event.returnValue=false')
}

let timer = null
export function throttle(fn, delay = 300) {
  if (timer == null) {
    timer = setTimeout(() => {
      fn()
      clearTimeout(timer)
      timer = null
    }, delay)
  }
}

export class downloadFile {
  constructor(url) {
    this.url = url
  }
  static judgeType = async (id, type) => {
    switch (type) {
      case 'file':
        // await getForumInfo(id).then((res) => {
        //   if (res.code === 1000) {
        //     let url = process.env.VUE_APP_BASE_URL + '/' + res.data.body
        //     // var elemIF = document.createElement('iframe')
        //     // elemIF.src = url
        //     // elemIF.style.display = 'none'
        //     // document.body.appendChild(elemIF)
        //     this.downloadEvt(url)
        //   }
        // })
        break
      default:
        break
    }
  }
  static downloadEvt(url, fileName = '未知文件') {
    const el = document.createElement('a')
    el.style.display = 'none'
    el.setAttribute('target', '_blank')
    /**
     * download的属性是HTML5新增的属性
     * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
     * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
     * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
     */
    fileName && el.setAttribute('download', fileName)
    el.href = url
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }
}

export const base64UrlEncode = (data) => {
  const encoded = btoa(unescape(encodeURIComponent(data)))
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
