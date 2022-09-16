import request from '/@/utils/request';


// 查询卡密列表
export function listCard(query:any) {
	return request({
		url: '/api/v1/card/list',
		method: 'get',
		params: query
	})
}

// 新增卡密
export function addCard(params:any) {
	return request({
		url: '/api/v1/card/add',
		method: 'post',
		data: params,
	})
}
// 编辑卡密
export function editCard(params:any) {
	return request({
		url: '/api/v1/card/edit',
		method: 'put',
		data: params,
	})
}

// 卡密续费
export function quickRechargeCard(params:any) {
	return request({
		url: '/api/v1/card/quick/recharge',
		method: 'put',
		data: params,
	})
}

// 卡密冻结
export function freezeCard(params:any) {
	return request({
		url: '/api/v1/card/freeze',
		method: 'put',
		data: params,
	})
}

// 卡密解绑
export function unbindCard(params:any) {
	return request({
		url: '/api/v1/card/unbind',
		method: 'put',
		data: params,
	})
}

// 删除卡密
export function delCard(query:any) {
	return request({
		url: '/api/v1/card/del?id=' + query,
		method: 'delete',
	})
}

// 下载导入模板
export function downloadCardTemplate() {
	return request({
		url: '/api/v1/card/download-template',
		method: 'get',
		responseType: 'blob',
	})
}

// 在线列表
export function listCardSession(query:any) {
	return request({
		url: '/api/v1/card-session/list',
		method: 'get',
		params: query
	})
}



