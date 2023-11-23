import { SpaceSettingParams, SpaceSettingData, SpaceSettingRes } from './type'

export function getSpaceSettingApi(params: SpaceSettingParams) {
  return http.get<SpaceSettingRes>(`space/setting/`, { params }, 'base')
}

export function updateSpaceSettingApi(id: number, data: SpaceSettingData) {
  return http.put<SpaceSettingRes>(`space/setting/${id}/`, data, 'base')
}
