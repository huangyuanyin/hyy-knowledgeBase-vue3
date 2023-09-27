import { bookstackParams, bookstackRes } from './type'

export function getBookStacksApi(params?: bookstackParams) {
  return http.get<bookstackRes>('bookstacks/', { params }, 'base')
}
