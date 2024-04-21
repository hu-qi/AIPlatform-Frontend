import request from "/src/utils/request.js";

export function getInfo(query) {
  return request({
    url: "/user_role/",
    method: "post",
    data: query,
  });
}

export function getToken() {
  return request({
    url: "/qiniu/upload/token", // 假地址 自行替换
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "get",
  });
}

export const groupcreate = (query) => {
  return request({
    url: "group_create/",
    method: "post",
    data: query,
  });
};

export const group_info = (query) => {
  return request({
    url: "group_info/",
    method: "get",
    params: query,
  });
};

export const groupdelete = (query) => {
  return request({
    url: "group_info/",
    method: "post",
    data: query,
  });
};

export const groupnamechange = (query) => {
  return request({
    url: "group_info/",
    method: "post",
    data: query,
  });
};

export const grouptaskchange = (query) => {
  return request({
    url: "group_info/",
    method: "post",
    data: query,
  });
};
