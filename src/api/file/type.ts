export interface FileParserData {
  type: string
  file: File
}

export interface FileParserRes {
  code: number
  data: any
  msg?: string
}
