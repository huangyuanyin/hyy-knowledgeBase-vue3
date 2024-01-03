import { AttachmentParams, AttachmentData, AttachmentRes } from './type'

export function getAttachmentApi(params: AttachmentParams) {
  return http.get<AttachmentRes>(`article/attachments/`, { params }, 'base')
}

// export function updateBookSettingApi(id: number, data: BookSettingData) {
//   return http.put<AttachmentRes>(`book/settings/${id}/`, data, 'base')
// }
