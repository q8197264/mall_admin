import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/goods',
    method: 'get',
    withCredentials: true,
    credentials: 'same-origin',
    params: query
  })
}

export function changeStock(query) {
  return request({
    url: '/admin/stock',
    method: 'put',
    params: query
  })
}

export function fetchGoods(query) {
  return request({
    url: '/admin/goods',
    method: 'get',
    params: query
  })
}

export function fetchSkuList(query) {
  return request({
    url: '/admin/sku',
    method: 'get',
    params: query
  })
}

export function fetchCategory(query) {
  return request({
    url: '/admin/category',
    method: 'get',
    params: query
  })
}

export function publishGoods(query) {
  console.log('start')
  console.log(query)
  var args = {}
  // content: "" //big descr
  args.description = query.content
  // content_short: "" //descr
  args.description = query.content_short
  // image_uri: "" //images
  args.images = query.image_uri
  // title: "asdewqwq" //goods_name
  args.goods_name = query.title
  args.category_ids = query.category_ids.pop()
  console.log(args)
  return request({
    url: '/admin/goods',
    method: 'post',
    params: query
  })
}
