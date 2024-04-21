import axios from "axios";
const service = axios.create({
  // "development" === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  baseURL: "https://shanhu.hpccube.com:50331",
  timeout: 500000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  },
);

service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject();
  },
);

export default service;
