import CryptoJS from 'crypto-js'

export function encryp(key, iv, data: any) {
  if (typeof data === 'object') {
    // 如果传入的data是json对象，先转义为json字符串
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log('error:', error)
    }
  }
  // 统一将传入的字符串转成UTF8编码
  const dataHex = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)) // 需要加密的数据
  console.log(`output->dataHex`, dataHex)
  const keyHex = CryptoJS.enc.Utf8.parse(key) // 秘钥
  const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
  const encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7
  })
  let encryptedVal = encrypted.ciphertext.toString()
  return encryptedVal //  返回加密后的值
}
