export interface BookSettingParams {
  book?: string
}

export interface BookSettingData {
  book: string
}

interface BookSetting {
  id: number
  book: number
  doc_viewport: string
  enable_comment: string
  enable_auto_publish: string
  [key: string]: any
}

export interface BookSettingRes {
  code: number
  data: BookSetting
  msg?: string
}
