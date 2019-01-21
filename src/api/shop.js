import request from '@/utils/request'

export function shopSearch(query) {
  return request({
    url: '/admin/shop',
    method: 'get',
    params: query
  })
}
