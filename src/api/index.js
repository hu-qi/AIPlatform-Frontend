import request from "/src/utils/request.js";

// 登录
export const login_auth = (query) => {
  return request({
    url: "user_login_auth/",
    method: "post",
    data: query,
  });
};

//  获得该组用户的权限信息
export const fetchRoledata = () => {
  return request({
    url: "Roledata/",
    method: "get",
  });
};

export const fetchData = (query) => {
  return request({
    url: "./table.json",
    method: "get",
    params: query,
  });
};

export const fetchLoginData = (query) => {
  return request({
    url: "",
    method: "post",
    data: query,
  });
};

export const fetchLoginData_auth = (query) => {
  return request({
    url: "fetchLoginData_auth/",
    method: "post",
    data: query,
  });
};

export const fetchRegisterData = (query) => {
  return request({
    url: "register/",
    method: "post",
    data: query,
  });
};

export const fetchUserInfo = (query) => {
  return request({
    url: "/user_info/",
    method: "get",
    params: query,
  });
};

export const fetchGroup = (query) => {
  return request({
    url: "group_info/",
    method: "get",
    params: query,
  });
};

export const postUserInfo = (query) => {
  return request({
    url: "/user_info/",
    method: "post",
    data: query,
  });
};
export const postUserForget = (query) => {
  return request({
    url: "forget/",
    method: "post",
    data: query,
  });
};

export const fetchDatasetsInfo = (task_type, query) => {
  return request({
    url: task_type + "/dataset/",
    method: "get",
    params: query,
  });
};

export const postLogoutInfo = (query) => {
  return request({
    url: "logout/",
    method: "post",
    data: query,
  });
};

export const postCreateDatasets = (task_type, query) => {
  return request({
    url: task_type + "/dataset/create/",
    method: "post",
    data: query,
  });
};

export const postUploadDatasets = (task_type, query) => {
  return request({
    url: task_type + "/dataset/upload/",
    method: "post",
    data: query,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchLabelGroupInfo = (task_type, query) => {
  return request({
    url: task_type + "/label/group/",
    method: "get",
    params: query,
  });
};

export const postCreateLabelGroup = (task_type, query) => {
  return request({
    url: task_type + "/label/group/create/",
    method: "post",
    data: query,
  });
};

export const postCreateLabel = (task_type, query) => {
  return request({
    url: task_type + "/label/create/",
    method: "post",
    data: query,
  });
};

export const postLabelEdit = (task_type, query) => {
  return request({
    url: task_type + "/label/",
    method: "post",
    data: query,
  });
};

export const postLabelGroupEdit = (task_type, query) => {
  return request({
    url: task_type + "/label/group/",
    method: "post",
    data: query,
  });
};

export const postDatasetsEdit = (task_type, query) => {
  return request({
    url: task_type + "/dataset/",
    method: "post",
    data: query,
  });
};

export const postManualAnnotation = (task_type, query) => {
  return request({
    url: task_type + "/annotation/",
    method: "post",
    data: query,
  });
};

export const getManualAnnotation = (task_type, query) => {
  return request({
    url: task_type + "/annotation/",
    method: "get",
    params: query,
  });
};

export const postAutoAnnotation = (task_type, query) => {
  return request({
    url: task_type + "/auto_annotation/",
    method: "post",
    data: query,
  });
};

export const getModelInfo = (task_type, query) => {
  return request({
    url: task_type + "/model/",
    method: "get",
    params: query,
  });
};

export const postModelInfo = (task_type, query) => {
  return request({
    url: task_type + "/model/",
    method: "post",
    data: query,
  });
};

export const postModelCreate = (task_type, query) => {
  return request({
    url: task_type + "/model/create/",
    method: "post",
    data: query,
  });
};

export const getModelCreate = (task_type) => {
  return request({
    url: task_type + "/model/create/",
    method: "get",
  });
};

export const postModelTrain = (task_type, query) => {
  return request({
    url: task_type + "/model/train/",
    method: "post",
    data: query,
  });
};

export const postModelShow = (task_type, query) => {
  return request({
    url: task_type + "/model/show/",
    method: "post",
    data: query,
  });
};

export const postModelTest = (task_type, query) => {
  return request({
    url: task_type + "/model/test/",
    method: "post",
    data: query,
  });
};

export const postModelLocalDeploy = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/",
    method: "post",
    data: query,
  });
};

export const getModelLocalDeploy = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/",
    method: "get",
    params: query,
  });
};

export const postModelLocalDeployCreate = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/create",
    method: "post",
    data: query,
  });
};

export const postModelLocalDeployDownload = (task_type, query) => {
  return request({
    url: task_type + "/model/local_deploy/download/",
    method: "post",
    data: query,
    responseType: "blob",
  });
};

export const postModelCloudDeploy = (task_type, query) => {
  return request({
    url: task_type + "/model/cloud_deploy/",
    method: "post",
    data: query,
  });
};

export const getModelCloudDeploy = (task_type, query) => {
  return request({
    url: task_type + "/model/cloud_deploy/",
    method: "get",
    params: query,
  });
};

export const postModelCloudDeployCreate = (task_type, query) => {
  return request({
    url: task_type + "/model/cloud_deploy/create",
    method: "post",
    data: query,
  });
};

export const getProjectsInfo = (task_type, query) => {
  return request({
    url: task_type + "/project",
    method: "get",
    params: query,
  });
};
export const postProjectsInfo = (task_type, query) => {
  return request({
    url: task_type + "/project",
    method: "post",
    data: query,
  });
};
export const postCreateProject = (task_type, query) => {
  return request({
    url: task_type + "/project/create/",
    method: "post",
    data: query,
  });
};

export const homepage_getInfo = (query) => {
  return request({
    url: "home_page/",
    method: "post",
    data: query,
  });
};

export const train_result = (task_type, query) => {
  return request({
    url: task_type + "/model/show/",
    method: "post",
    data: query,
  });
};

export const dataset_version = (task_type, query) => {
  return request({
    url: task_type + "/dataset/version/",
    method: "get",
    params: query,
  });
};

export const post_dataset_version = (task_type, query) => {
  return request({
    url: task_type + "/dataset/version/",
    method: "post",
    data: query,
  });
};

export const create_dataset_version = (task_type, query) => {
  return request({
    url: task_type + "/dataset/version/create/",
    method: "post",
    data: query,
  });
};

export const model_version = (task_type, query) => {
  return request({
    url: task_type + "/model/version/",
    method: "get",
    params: query,
  });
};

export const post_model_version = (task_type, query) => {
  return request({
    url: task_type + "/model/version/",
    method: "post",
    data: query,
  });
};

export const create_model_version = (task_type, query) => {
  return request({
    url: task_type + "/model/version/create/",
    method: "post",
    data: query,
  });
};
