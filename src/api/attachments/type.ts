export interface AttachmentParams {
  book?: string
}

export interface AttachmentData {
  book: string
}

interface AttachmentInfo {
  id: number
  book: number
  doc_viewport: string
  enable_comment: string
  enable_auto_publish: string
  [key: string]: any
}

export interface AttachmentRes {
  code: number
  data: AttachmentInfo
  msg?: string
}
