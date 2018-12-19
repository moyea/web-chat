import axios from 'axios';
// import AppConfig from '../config';

axios.defaults.withCredentials = false;
axios.defaults.timeout = 10000;
axios.defaults.baseURL = 'http://10.180.4.56:3000';
axios.interceptors.response.use((res) => res, (err) => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误';
                break;
            case 401:
                err.message = '未授权，请登录';
                break;
            case 403:
                err.message = '拒绝访问';
                break;
            case 404:
                err.message = `请求地址出错`;
                break;
            case 408:
                err.message = '请求超时';
                break;
            case 500:
                err.message = '服务器内部错误';
                break;
            case 501:
                err.message = '服务未实现';
                break;
            case 502:
                err.message = '网关错误';
                break;
            case 503:
                err.message = '服务不可用';
                break;
            case 504:
                err.message = '网关超时';
                break;
            case 505:
                err.message = 'HTTP版本不受支持';
                break;
            default:
        }
    }
    return Promise.reject(err);
});

const ErrorInfo = {};

//全局http响应处理
function responseHandler(response) {
    return Promise.resolve(response.data);
}

export default {
    get: (url, config) => axios.get(url, config).then(responseHandler),
    post: (url, data, config) => axios.post(url, data, config).then(responseHandler)
};
