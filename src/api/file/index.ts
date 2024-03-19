import { FileParserData, FileParserRes } from './type'

export function handleFileParserApi(data: FileParserData) {
  return http.post<FileParserRes>('file_parser/', data, 'base')
}
