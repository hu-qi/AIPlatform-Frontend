import request from "../utils/request";

export const get_project_permission = (task_type, query) => {
  return request({
    url: task_type + "/project_permission/",
    method: "get",
    params: query,
  });
};

export const post_project_permission = (task_type, query) => {
  return request({
    url: task_type + "/project_permission/",
    method: "post",
    data: query,
  });
};

export const dataset_permission = (task_type, query) => {
  return request({
    url: task_type + "/dataset/permission/",
    method: "get",
    params: query,
  });
};

export const model_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/permission/",
    method: "get",
    params: query,
  });
};

export const cloud_deploy_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/cloud_deploy/permission/",
    method: "get",
    params: query,
  });
};

export const local_deploy_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/permission/",
    method: "get",
    params: query,
  });
};

export const post_dataset_permission = (task_type, query) => {
  return request({
    url: task_type + "/dataset/permission/",
    method: "post",
    data: query,
  });
};

export const post_model_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/permission/",
    method: "post",
    data: query,
  });
};

export const post_cloud_deploy_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/cloud_deploy/permission/",
    method: "post",
    data: query,
  });
};

export const post_local_deploy_permission = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/permission/",
    method: "post",
    data: query,
  });
};
