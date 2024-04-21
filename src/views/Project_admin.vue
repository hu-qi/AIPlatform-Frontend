<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 单个用户权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-collapse accordion>
      <el-collapse-item title="模型 models">
        <div class="container">
          <el-table
            ref="multipleTable"
            :data="model_tableData"
            border
            class="table"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="55"
              align="center"
            />
            <el-table-column
              prop="name"
              label="模型名称"
              align="centser"
            />
            <el-table-column
              prop="per"
              label="权限"
              align="centser"
            />
            <el-table-column
              label="权限"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-show="model_isGived(scope.$index, scope.row) == false"
                  type="text"
                  @click="handleModel(scope.$index, scope.row)"
                >
                  设置权限
                </el-button>
                <el-button
                  v-show="model_isGived(scope.$index, scope.row) == true"
                  type="text"
                  @click="cancelModel(scope.$index, scope.row)"
                >
                  取消权限
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item title="数据 datasets">
        <div class="container">
          <el-table
            ref="multipleTable"
            :data="dataset_tableData"
            border
            class="table"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="55"
              align="center"
            />
            <el-table-column
              prop="name"
              label="数据集名称"
              align="centser"
            />
            <el-table-column
              prop="per"
              label="权限"
              align="centser"
            />
            <el-table-column
              label="权限"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-show="dataset_isGived(scope.$index, scope.row) == false"
                  type="text"
                  @click="handleDataset(scope.$index, scope.row)"
                >
                  设置权限
                </el-button>
                <el-button
                  v-show="dataset_isGived(scope.$index, scope.row) == true"
                  type="text"
                  @click="cancelDataset(scope.$index, scope.row)"
                >
                  取消权限
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item title="云部署 clouddeployment">
        <div class="container">
          <el-table
            ref="multipleTable"
            :data="cloud_deploy_tableData"
            border
            class="table"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="55"
              align="center"
            />
            <el-table-column
              prop="name"
              label="云部署名称"
              align="centser"
            />
            <el-table-column
              prop="per"
              label="权限"
              align="centser"
            />
            <el-table-column
              label="权限"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-show="
                    cloud_deploy_isGived(scope.$index, scope.row) == false
                  "
                  type="text"
                  @click="handleCloud(scope.$index, scope.row)"
                >
                  设置权限
                </el-button>
                <el-button
                  v-show="cloud_deploy_isGived(scope.$index, scope.row) == true"
                  type="text"
                  @click="cancelCloud(scope.$index, scope.row)"
                >
                  取消权限
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>

      <el-collapse-item title="本地部署 localdeployment">
        <div class="container">
          <el-table
            ref="multipleTable"
            :data="local_deploy_tableData"
            border
            class="table"
            header-cell-class-name="table-header"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="55"
              align="center"
            />
            <el-table-column
              prop="name"
              label="本地部署名称"
              align="centser"
            />
            <el-table-column
              prop="per"
              label="权限"
              align="centser"
            />
            <el-table-column
              label="权限"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-show="
                    local_deploy_isGived(scope.$index, scope.row) == false
                  "
                  type="text"
                  @click="handleLocal(scope.$index, scope.row)"
                >
                  设置权限
                </el-button>
                <el-button
                  v-show="local_deploy_isGived(scope.$index, scope.row) == true"
                  type="text"
                  @click="cancelLocal(scope.$index, scope.row)"
                >
                  取消权限
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  dataset_permission,
  model_permission,
  local_deploy_permission,
  cloud_deploy_permission,
} from "../api/project_permission";
import {
  post_cloud_deploy_permission,
  post_local_deploy_permission,
  post_dataset_permission,
  post_model_permission,
} from "../api/project_permission";
export default {
  name: "Datasets",
  setup() {
    let model_tableData = ref([]);
    let dataset_tableData = ref([]);
    let cloud_deploy_tableData = ref([]);
    let local_deploy_tableData = ref([]);
    //获取数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();

    dataset_permission(task_type, {
      username: localStorage.getItem("admin_projectname"),
      cur_username: localStorage.getItem("ms_username"),
    }).then((res) => {
      //console.log('res = ', res)
      let obj = res.data.dataset_permissions;
      console.log("res.data.dataset_permissions = ", obj);
      length = obj.length;
      for (let i = 0; i < length; i++) {
        dataset_tableData.value.push({
          id: i,
          name: obj[i].dataset.name,
          per: obj[i].permission,
        });
      }
    });
    const dataset_isGived = (index, row) => {
      //console.log('index = ', index)
      return dataset_tableData.value[index].per == true;
    };
    const handleDataset = (index, row) => {
      post_dataset_permission(
        task_type,
        qs.stringify({
          name: dataset_tableData.value[index].name,
          value: 1,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const cancelDataset = (index, row) => {
      post_dataset_permission(
        task_type,
        qs.stringify({
          name: dataset_tableData.value[index].name,
          value: 0,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    /////////////////////////////////////////////////////

    model_permission(task_type, {
      username: localStorage.getItem("admin_projectname"),
      cur_username: localStorage.getItem("ms_username"),
    }).then((res) => {
      //console.log('res = ', res)
      let obj = res.data.model_permissions;
      console.log("res.data.model_permissions = ", obj);
      length = obj.length;
      for (let i = 0; i < length; i++) {
        model_tableData.value.push({
          id: i,
          name: obj[i].model.name,
          per: obj[i].permission,
        });
      }
    });
    const model_isGived = (index, row) => {
      console.log("index = ", index);
      console.log(model_tableData.value[index].per == true);
      return model_tableData.value[index].per == true;
    };
    const handleModel = (index, row) => {
      post_model_permission(
        task_type,
        qs.stringify({
          name: model_tableData.value[index].name,
          value: 1,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const cancelModel = (index, row) => {
      post_model_permission(
        task_type,
        qs.stringify({
          name: model_tableData.value[index].name,
          value: 0,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    /////////////////////////////////////////////////////

    local_deploy_permission(task_type, {
      username: localStorage.getItem("admin_projectname"),
      cur_username: localStorage.getItem("ms_username"),
    }).then((res) => {
      //console.log('res = ', res)
      let obj = res.data.local_deployment_permissions;
      console.log("res.data.local_deployment_permissions = ", obj);
      length = obj.length;
      for (let i = 0; i < length; i++) {
        local_deploy_tableData.value.push({
          id: i,
          name: obj[i].name,
          per: obj[i].permission,
        });
      }
    });
    const cloud_deploy_isGived = (index, row) => {
      return local_deploy_tableData.value[index].per == true;
    };

    const handleCloud = (index, row) => {
      post_cloud_deploy_permission(
        task_type,
        qs.stringify({
          name: local_deploy_tableData.value[index].name,
          value: 1,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const cancelCloud = (index, row) => {
      post_cloud_deploy_permission(
        task_type,
        qs.stringify({
          name: local_deploy_tableData.value[index].name,
          value: 0,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    /////////////////////////////////////////////////////

    cloud_deploy_permission(task_type, {
      username: localStorage.getItem("admin_projectname"),
      cur_username: localStorage.getItem("ms_username"),
    }).then((res) => {
      //console.log('res = ', res)
      let obj = res.data.cloud_deployment_permissions;
      console.log("res.data.cloud_deployment_permissions = ", obj);
      length = obj.length;
      for (let i = 0; i < length; i++) {
        cloud_deploy_tableData.value.push({
          id: i,
          name: obj[i].name,
          per: obj[i].permission,
        });
      }
    });
    const local_deploy_isGived = (index, row) => {
      return cloud_deploy_tableData.value[index].per == true;
    };

    const handleLocal = (index, row) => {
      post_local_deploy_permission(
        task_type,
        qs.stringify({
          name: cloud_deploy_tableData.value[index].name,
          value: 1,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const cancelLocal = (index, row) => {
      post_local_deploy_permission(
        task_type,
        qs.stringify({
          name: cloud_deploy_tableData.value[index].name,
          value: 0,
          username: localStorage.getItem("admin_projectname"),
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };

    return {
      model_tableData,
      dataset_tableData,
      cloud_deploy_tableData,
      local_deploy_tableData,

      dataset_isGived,
      model_isGived,
      cloud_deploy_isGived,
      local_deploy_isGived,

      handleDataset,
      handleLocal,
      handleCloud,
      handleModel,
      cancelDataset,
      cancelModel,
      cancelCloud,
      cancelLocal,
    };
  },
};
</script>

<style scoped></style>
