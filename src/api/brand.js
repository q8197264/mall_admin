import request from '@/utils/request'

export function fetchBrandList(query) {
  return request({
    url: '/admin/shop',
    method: 'get',
    params: query
  })
}
