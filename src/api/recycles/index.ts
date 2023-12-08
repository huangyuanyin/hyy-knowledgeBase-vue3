import { recyclesParams, recoverData, recyclesRes } from './type'

export function getSpaceRecyclesApi(params: recyclesParams) {
  return http.get<recyclesRes>('space/recycles/', { params }, 'base')
}

export function recoverSpaceRecyclesApi(id: number) {
  return http.put<recyclesRes>(`space/recycles/restore/${id}/`, {}, 'base')
}

export function deleteSpaceRecyclesApi(id: number) {
  return http.delete<recyclesRes>(`space/recycles/${id}/`, {}, 'base')
}

export function getTeamRecyclesApi(params: recyclesParams) {
  return http.get<recyclesRes>('group/recycles/', { params }, 'base')
}

export function recoverTeamRecyclesApi(id: number) {
  return http.put<recyclesRes>(`group/recycles/restore/${id}/`, {}, 'base')
}

export function deleteTeamRecyclesApi(id: number) {
  return http.delete<recyclesRes>(`group/recycles/${id}/`, {}, 'base')
}

export function getBookRecyclesApi(params: recyclesParams) {
  return http.get<recyclesRes>('book/recycles/', { params }, 'base')
}

export function recoverBookRecyclesApi(id: number, data: recoverData) {
  return http.put<recyclesRes>(`book/recycles/restore/${id}/`, data, 'base')
}

export function deleteBookRecyclesApi(id: number) {
  return http.delete<recyclesRes>(`book/recycles/${id}/`, {}, 'base')
}
