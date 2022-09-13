import request from '/@/utils/request';

// 在线列表
export function listCardSession(query:any) {
	return request({
		url: '/api/v1/card-session/list',
		method: 'get',
		params: query
	})
}