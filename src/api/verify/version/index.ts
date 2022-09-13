import request from '/@/utils/request';
// 查询版本列表
export function listVersion(query:any) {
	return request({
		url: '/api/v1/version/list',
		method: 'get',
		params: query
	})
}

// 新建版本
export function addVersion(params:any) {
	return request({
		url: '/api/v1/version/add',
		method: 'post',
		data: params,
	})
}

// 删除版本
export function delVersion(query:any) {
	return request({
		url: '/api/v1/version/del?id=' + query,
		method: 'delete',
	})
}

// 更新版本
export function editVersion(data:any) {
	return request({
		url: '/api/v1/version/edit',
		method: 'put',
		data: data
	})
}

// 发布版本
export function releaseVersion(data:any) {
	return request({
		url: '/api/v1/version/release',
		method: 'put',
		data: data
	})
}