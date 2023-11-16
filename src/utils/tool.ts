export function debounce(fn, wait = 1000) {
  let timeout = null
  if (timeout !== null) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(fn, wait)
}
