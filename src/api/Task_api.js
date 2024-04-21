import request from "/src/utils/request.js";

export const getTaskTrainingInfo = (task_type, query) => {
  return request({
    url: task_type + "/TaskTraining/",
    method: "get",
    params: query,
  });
};

export const getDatasetAnnotationInfo = (task_type, query) => {
  return request({
    url: task_type + "/DatasetAnnotation/",
    method: "get",
    params: query,
  });
};

export const getTaskTestingInfo = (task_type, query) => {
  return request({
    url: task_type + "/TaskTesting/",
    method: "get",
    params: query,
  });
};

export const postTestIC = (task_type, query) => {
  return request({
    url: task_type + "/TaskTesting/",
    method: "post",
    params: query,
  });
};

export const postTaskTrainingInfo = (task_type, query) => {
  return request({
    url: task_type + "/TaskTraining/",
    method: "post",
    data: query,
  });
};

export const postDatasetAnnotationInfo = (task_type, query) => {
  return request({
    url: task_type + "/DatasetAnnotation/",
    method: "post",
    data: query,
  });
};

export const postTaskTestingInfo = (task_type, query) => {
  return request({
    url: task_type + "/TaskTesting/",
    method: "post",
    data: query,
  });
};

// 测试结果轮询接口
export const postModelTestResult = (task_type, query) => {
  return request({
    url: task_type + "/model/test_result/",
    method: "post",
    data: query,
  });
};
