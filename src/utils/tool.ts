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
