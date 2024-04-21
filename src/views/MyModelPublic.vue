<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 我的模型
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <el-table
        ref="multipleTable"
        :data="tableData"
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
          align="center"
        />
        <el-table-column
          prop="how_to_train"
          label="模型"
          align="center"
        />
        <el-table-column
          prop="datasets"
          label="任务类型"
          align="center"
        />
        <el-table-column
          prop="owngroup"
          label="所有组织"
          align="center"
        />
        <el-table-column
          prop="owner"
          label="所有者"
          align="center"
        />
        <el-table-column
          prop="share_status"
          label="共享状态"
          align="center"
        />

        <el-table-column
          label="操作"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              class="red"
              @click="createModel(scope.$index, scope.row)"
            >
              选择模型
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 创建新数据集-->
    <el-dialog
      v-model="editVisible"
      title="创建模型"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="模型名称">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item
          label="描述"
          prop="desc"
        >
          <el-input
            v-model="form.desc"
            type="textarea"
            rows="5"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addModel"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="ShareVisible"
      title="共享"
      width="30%"
    >
      <el-select
        v-model="form.share"
        style="margin-bottom: 10px"
        placeholder=""
      >
        <el-option
          key="1"
          label="组织间共享"
          value="组织间共享"
        />
        <el-option
          key="2"
          label="完全共享"
          value="完全共享"
        />
      </el-select>
    </el-dialog>
  </div>
</template>

<script>
import fileDownload from "js-file-download";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  getModelInfo,
  postModelCreate,
  postModelInfo,
  postModelTrain,
  postModelLocalDeploy,
  postModelCloudDeploy,
  fetchDatasetsInfo,
  postModelTest,
  postModelLocalDeployDownload,
  getModelCreate,
} from "../api/index";
export default {
  name: "MyModel",
  setup() {
    const tableData = ref([]);
    const datasetsData = ref([]);
    const method = ref([]);
    //获取模型数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const getTableInfo = () => {
      console.log("模型管理初始化");

      getModelInfo(task_type, { username: username, is_public: 1 }).then(
        (res) => {
          console.log("res = ", res);
          let length = res.data.modelinfo.length;
          //console.log(obj);
          let TRAINING_STATUS = {
            untrained: "未训练",
            training: "训练中",
            trained: "已训练",
          };
          let CLOUD_DEPLOYMENT_STATUS = {
            clouddeployed: "已云部署",
            unclouddeployed: "未云部署",
          };
          let LOCAL_DEPLOYMENT_STATUS = {
            localdeployed: "已本地部署",
            unlocaldeployed: "未本地部署",
          };
          tableData.value = reactive([]);
          for (var i = 0; i < length; i++) {
            tableData.value.push({
              id: i,
              name: res.data.modelinfo[i].name,
              how_to_train: res.data.modelinfo[i].how_to_train,
              datasets: res.data.modelinfo[i].task_type,
              owngroup: res.data.modelinfo[i].owner,
              owner: res.data.modelinfo[i].creator,
              share_status: res.data.modelinfo[i].sharing_level,
            });
          }
        },
      );
      //console.log('获取模型信息');
    };
    getTableInfo();
    //处理创建模型的编辑框
    const editVisible = ref(false);
    const nameVisible = ref(false);
    const trainVisible = ref(false);
    let form = reactive({
      name: "",
      how_to_train: "",
      desc: "",
    });

    let localIndex;
    const createModel = (index, row) => {
      console.log("创建模型");
      localIndex = index;
      editVisible.value = true;
    };
    const addModel = () => {
      if (form.name == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postModelCreate(
        task_type,
        qs.stringify({
          name: form.name,
          username: username,
          how_to_train: tableData.value[localIndex].how_to_train,
          description: form.desc,
          public_model_name: tableData.value[localIndex].name,
          public_model_owner: tableData.value[localIndex].owner,
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          tableData.value = [];
          getTableInfo();
          editVisible.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
      console.log("确认创建模型"); //待填写
    };
    // 删除操作
    const handleDelete = (index, row) => {
      console.log("删除");
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postModelInfo(
            task_type,
            qs.stringify({
              name: tableData.value[index].name,
              username: username,
              delete: 1,
            }),
          ).then((res) => {
            //console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              getTableInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };

    const ShareVisible = ref(false);
    const handleShare = (index, row) => {
      console.log("共享");
      // 二次确认删除
      ShareVisible.value = true;
    };

    //训练
    const datasetName = ref();
    const handleModelTrain = (index, row) => {
      console.log("训练模型");
      localIndex = index;
      trainVisible.value = true;
      localName.value = tableData.value[localIndex].name;
    };
    const confirmTrain = () => {
      console.log("确认训练");
      postModelTrain(
        task_type,
        qs.stringify({
          model_name: localName.value,
          username: username,
          dataset_name: datasetName.value,
        }),
      ).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          tableData.value = [];
          getTableInfo();
        } else {
          ElMessage.error(res.msg);
        }
      });
      trainVisible.value = false;
    };
    //测试
    const testVisible = ref(false);
    let fileList = ref([]);
    let lastFile = ref();
    const handleModelTest = (index, row) => {
      console.log("测试模型");
      // 二次确认
      ElMessageBox.confirm("确认进行测试吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          localStorage.setItem("model_name", tableData.value[index].name);
          console.log(localStorage.getItem("model_name"));
          console.log(task_type);
          if (task_type == "image classification")
            router.push("/ModelTestingForImageClassification");
          if (task_type == "object detection")
            router.push("/ModelTestingForObjectDetection");
          if (task_type == "object tracking")
            router.push("/ModelTestingForObjectTracking");
          if (task_type == "image segmentation")
            router.push("/ModelTestingForImageSegmentation");
          if (task_type == "text classification")
            router.push("/ModelTestingForTextClassification");
          if (task_type == "action recognition")
            router.push("/ModelTestingForActionRecognition");
        })
        .catch(() => {});
    };
    //模型部署
    const handleCloudDeploy = (index, row) => {
      console.log("云部署");
      // 二次确认
      ElMessageBox.confirm("确认进行云部署吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postModelCloudDeploy(
            task_type,
            qs.stringify({
              username: username,
              model_name: tableData.value[index].name,
            }),
          ).then((res) => {
            console.log(res);
            if (res.code == "200") {
              ElMessage.success(res.msg);
              getTableInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };
    const handleLocalDeploy = (index, row) => {
      console.log("本地部署");
      // 二次确认
      ElMessageBox.confirm("确认进行本地部署吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postModelLocalDeploy(
            task_type,
            qs.stringify({
              username: username,
              model_name: tableData.value[index].name,
            }),
          ).then((res) => {
            //console.log(typeof(res));
            if (res.code == "200") {
              ElMessage.success(res.msg);
              console.log("本地部署成功");
              getTableInfo();
              postModelLocalDeployDownload(
                task_type,
                qs.stringify({
                  username: username,
                  model_name: tableData.value[index].name,
                }),
              ).then((res2) => {
                fileDownload(res2, "local_deploy.zip");
              });
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };
    const isCloudDeploy = (index, row) => {
      return tableData.value[index].cloud_deployment_status == "已云部署";
    };
    const isTrained = (index, row) => {
      return tableData.value[index].training_status == "已训练";
    };
    return {
      isTrained,
      isCloudDeploy,
      createModel,
      tableData,
      handleDelete,
      editVisible,
      form,
      addModel,
      nameVisible,

      handleModelTrain,
      getTableInfo,
      trainVisible,
      confirmTrain,
      datasetsData,
      datasetName,
      testVisible,
      handleModelTest,
      handleCloudDeploy,
      handleLocalDeploy,
      method,
      handleShare,
      ShareVisible,
    };
  },
};
</script>

<style scoped></style>
