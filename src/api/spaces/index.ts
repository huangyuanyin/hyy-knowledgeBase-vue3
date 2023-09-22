import { spacesRes } from './type'

export function getSpacesApi() {
  return http.get<spacesRes>('spaces/', {}, 'base')
}
