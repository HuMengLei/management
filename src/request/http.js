import axios from 'axios'
import store from "@/store/index"
import router from "@/router/index"
const instance = axios.create({
	headers: {
		'Content-Type': 'application/json;charset=utf-8'
	}, // 设置传输内容的类型和编码
	withCredentials: false, // 指定某个请求应该发送凭据。允许客户端携带跨域cookie，也需要此配置
	timeout: 60000, // 请求超时时间
});

/**
 * 配置请求地址
 */
instance.defaults.baseURL = process.env.VUE_APP_BASE_API

/*
 * 参数序列化
 * @param data 参数列表
 * @return
 */
function qs(data) {
	if (data) {
		let datas = [];
		Object.keys(data).forEach(function (key) {
			datas.push(key + "=" + data[key]);
		});
		//console.log(data,datas)
		return datas.join("&");
	} else {
		return null
	}

}
/**
 * 请求拦截器
 */
instance.interceptors.request.use(
	config => {
		config.headers.Authorization=window.sessionStorage.getItem("Authorization");
		if(config.url=="/login/check"){
			config.headers.captcha=config.data.captcha;
			config.headers.captchaCode=config.data.captchaCode;
		}
		console.log(config)
		return config
	},
	err => {
		//return err
		return Promise.reject(err)
	}
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
	// 请求成功
	res => {
		// token失效时，返回登录页，清除token和username
		if(res.data.code==202 || res.data.code==401){
			router.push("/login");
			window.sessionStorage.removeItem("username");
			window.sessionStorage.removeItem("Authorization");
		}
		return res;
	},
	// 请求失败
	error => {
		return Promise.reject(error);
	});
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
	return new Promise((resolve, reject) => {
		console.log("访问接口",url, params)
		instance({
			method: 'get',
			url: url,
			params: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"authKey":store.state.common.authKey
			},
			timeout: 60000,
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
			//console.log(err)
		})
	});
}
export function getFile(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'get',
			url: url,
			params: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"authKey":store.state.common.authKey
			},
			timeout: 60000,
			responseType:'blob'
		}).then(res => {
			resolve({
				data:res.data,
				headers:res.headers});
		}).catch(err => {
			reject(err)
			//console.log(err)
		})
	});
}
/** 
 * post方法，对应post请求 请求头为 application/json
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'post',
			url: url,
			params: qs(params),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"authKey":store.state.common.authKey
			},
			timeout: 60000,
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			//console.log(err)
		})
	});
}
/** 
 * post方法，对应post请求 请求头为 application/json
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function postJson(url, data, token,params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'post',
			url: url,
			data: data,
			//params:params,
			headers: {
				'Content-Type': 'application/json',
				"authKey":store.state.common.authKey
			},
			timeout: 60000*5,
			cancelToken: token
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err)
			//console.log(err)
		})
	});
}
/** 
 * post方法，对应post请求 请求头为 application/x-www-form-urlencoded
 * @param {String} url [请求的url地址] 上传文件
 * @param {Object} params [请求时携带的参数] 
 */
export function postFile(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'post',
			url: url,
			data: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				"authKey":store.state.common.authKey
			},
			timeout: 600000,
		}).then(res => {
			resolve(res.data);
		})
			.catch(err => {
				reject(err)
			})
	});
}

/** 
 * put方法，对应put请求 请求头为 application/json
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function put(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'put',
			url: url,
			data: params,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 60000,
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			//console.log(err)
		})
	});
}
/** 
 * del方法，对应delete请求  请求头为 application/x-www-form-urlencoded
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function del(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'delete',
			url: url,
			params: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			timeout: 60000,
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			//console.log(err)
		})
	});
}
/** 
 * delJson方法，对应delete请求  请求头为 application/json
 * @param {String} url [请求的url地址] data:JSON.stringify(params){headers: {'Content-Type': 'application/json;charset=UTF-8'}}
 * @param {Object} params [请求时携带的参数] 
 */
export function delJson(url, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'delete',
			url: url,
			data: params,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 60000,
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			//console.log(err)
		})
	});
}
