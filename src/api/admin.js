import request from "/src/utils/request.js";

export const fetchProAdmin = (query) => {
  return request({
    url: "user_admin",
    method: "post",
    data: query,
  });
};

export const usercreate = (query) => {
  return request({
    url: "user_add/",
    method: "post",
    data: query,
  });
};

export const user_info = (query) => {
  return request({
    url: "group_user_info/",
    method: "get",
    params: query,
  });
};

//  删除部分
export const userdelete = (query) => {
  return request({
    url: "group_user_info/",
    method: "post",
    data: query,
  });
};

export const usernamechange = (query) => {
  return request({
    url: "group_user_info/",
    method: "post",
    data: query,
  });
};
