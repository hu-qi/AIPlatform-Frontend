<template>
  <div>
    <el-button
      type="primary"
      @click="createModel"
    >
      创建模型
    </el-button>
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
          prop="model"
          label="模型"
          align="center"
        />
        <el-table-column
          prop="training_status"
          label="训练状态"
          align="center"
        />

        <!-- <el-table-column prop="cloud_deployment_status" label="云部署状态" align="center"></el-table-column>
                <el-table-column prop="local_deployment_status" label="本地部署状态" align="center"></el-table-column> -->
        <el-table-column
          prop="share_status"
          label="共享状态"
          align="center"
        />
        <el-table-column
          prop="version"
          label="版本"
          align="center"
        />

        <el-table-column
          label="编辑操作"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleChangeName(scope.$index, scope.row)"
            >
              修改名称
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="模型管理"
          align="center"
        >
          <template #default="scope">
            <el-button
              v-show="isTrained(scope.$index, scope.row) == false"
              type="text"
              @click="handleModelTrain(scope.$index, scope.row)"
            >
              训练
            </el-button>
            <el-button
              v-show="isTrained(scope.$index, scope.row) == true"
              type="text"
              @click="handleModelTrain(scope.$index, scope.row)"
            >
              重训练
            </el-button>
            <el-button
              type="text"
              @click="handleModelTest(scope.$index, scope.row)"
            >
              测试
            </el-button>
            <!-- <el-button type="text" @click="handleCloudDeploy(scope.$index, scope.row)" v-show="isCloudDeploy(scope.$index, scope.row) == false">云部署</el-button>
                        <el-button type="text" @click="handleCloudDeploy(scope.$index, scope.row)" v-show="isCloudDeploy(scope.$index, scope.row) == true">取消云部署</el-button>
                        <el-button type="text" @click="handleLocalDeploy(scope.$index, scope.row)">本地部署</el-button> -->
            <el-button
              type="text"
              @click="handleShare(scope.$index, scope.row)"
            >
              共享
            </el-button>
            <el-button
              type="text"
              @click="handleLook(scope.$index, scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              @click="handleVersion(scope.$index, scope.row)"
            >
              版本管理
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
        <el-form-item label="训练方法">
          <el-select
            v-model="form.how_to_train"
            placeholder=""
          >
            <!--<el-option key="1" label="DARTS" value="DARTS"></el-option>
                        <el-option key="2" label="TRAINING_FREE_NAS" value="TRAINING_FREE_NAS"></el-option>
                        <el-option key="3" label="ResNet-152" value="ResNet-152"></el-option>
                        <el-option key="4" label="MobileNet-V2" value="MobileNet-V2"></el-option>
                        <el-option key="5" label="ResNeXt-50-32x4d" value="ResNeXt-50-32x4d"></el-option>-->
            <el-option
              v-for="item in method"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
      v-model="nameVisible"
      title="修改模型名称"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="模型名称">
          <el-input v-model="newName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="nameModel"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="trainVisible"
      title="训练模型"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="模型名称">
          <el-input
            v-model="localName"
            placeholder=""
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="数据集">
          <el-select
            v-model="datasetName"
            placeholder="请选择数据集"
          >
            <el-option
              v-for="item in datasetsData"
              :key="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="超参数">
          <el-input
            v-model="batch_size"
            placeholder="批大小：默认8"
          />
          <el-input
            v-model="lr"
            placeholder="学习率：默认0.01"
          />
          <el-input
            v-model="epochs"
            placeholder="训练代数：默认100代"
          />
          <el-input
            v-model="optimizer"
            placeholder="优化器：默认Adam"
          />
          <el-input
            v-model="lr_scheduler"
            placeholder="学习率调整期：默认cosine"
          />
          <el-input
            v-model="max_time"
            placeholder="最大训练时长：默认100小时"
          />
          <el-input
            v-model="split_ratio"
            placeholder="数据分割比例：默认0.8"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="trainVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="confirmTrain"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="ShareVisible"
      title="共享模型"
      width="30%"
    >
      <el-select
        v-model="newShare"
        style="margin-bottom: 10px"
        placeholder=""
      >
        <el-option
          key="1"
          label="私有"
          value="私有"
        />
        <el-option
          key="2"
          label="组内共享"
          value="组内共享"
        />
        <el-option
          key="4"
          label="公开"
          value="公开"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ShareVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="shareModels"
          >确 定</el-button>
        </span>
      </template>
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
    let batch_size = ref("");
    let lr = ref("");
    let epochs = ref("");
    let optimizer = ref("");
    let lr_scheduler = ref("");
    let max_time = ref("");
    let split_ratio = ref("");

    //获取模型数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const getTableInfo = () => {
      console.log("模型管理初始化");
      getModelCreate(task_type).then((res) => {
        console.log(res);
        method.value = reactive([]);
        let obj = res.data;
        let length = obj.length;
        for (var i = 0; i < length; i++) {
          method.value.push({ label: obj[i][1], value: obj[i][0] });
        }
        console.log(method);
        /*console.log(res.data);
                    console.log(res.data.length);
                    console.log(res.data[0][0]);*/
      });
      getModelInfo(task_type, { username: username }).then((res) => {
        console.log("res = ", res);
        let obj = res.data.modelinfo;
        let length = obj.length;
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
            name: obj[i].name,
            model: obj[i].how_to_train,
            training_status: obj[i].training_status,
            how_to_train: obj[i].how_to_train,
            cloud_deployment_status: obj[i].cloud_deployment_status,
            local_deployment_status: obj[i].local_deployment_status,
            share_status: obj[i].sharing_level,
            version: obj[i].version,
          });
        }
      });
      //console.log('获取模型信息');
      fetchDatasetsInfo(task_type, {
        username: localStorage.getItem("ms_username"),
      }).then((res) => {
        //console.log(res);
        //console.log(typeof(res.data.datasetinfo));
        let obj = res.data.datasetinfo;
        let length = obj.length;
        //console.log(JSON.parse(res.data.datasetinfo)[0].fields.name);
        datasetsData.value = reactive([]);
        for (var i = 0; i < length; i++) {
          datasetsData.value.push({
            id: i,
            name: obj[i].name,
          });
        }
        //console.log(length);
      });
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

    const createModel = () => {
      console.log("创建模型");
      editVisible.value = true;
    };
    const addModel = () => {
      if (form.name == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      console.log(task_type);
      postModelCreate(
        task_type,
        qs.stringify({
          name: form.name,
          username: username,
          how_to_train: form.how_to_train,
          description: form.desc,
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

    //修改名称
    let newName = ref("");
    const localName = ref();
    let localIndex = 0;
    const handleChangeName = (index, row) => {
      console.log("修改模型名"); //待填写
      localIndex = index;
      nameVisible.value = true;
    };

    const nameModel = () => {
      console.log("确定修改模型名"); //待填写
      if (newName.value == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postModelInfo(
        task_type,
        qs.stringify({
          name: tableData.value[localIndex].name,
          username: username,
          new_name: newName.value,
        }),
      ).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          getTableInfo();
        } else {
          ElMessage.error(res.msg);
        }
      });
      nameVisible.value = false;
    };

    //共享模型
    const ShareVisible = ref(false);
    const handleShare = (index, row) => {
      console.log("共享");
      localIndex = index;
      // 二次确认删除
      ShareVisible.value = true;
    };
    let newShare = ref("");
    const shareModels = () => {
      console.log("确定共享数据集"); //待填写
      console.log(newShare); //待填写
      if (newShare.value != "") {
        postModelInfo(
          task_type,
          qs.stringify({
            name: tableData.value[localIndex].name,
            username: username,
            sharing_level: newShare.value,
          }),
        ).then((res) => {
          console.log(res);
          if (res.code == 200) {
            ElMessage.success(res.msg);
            getTableInfo();
          } else {
            ElMessage.error(res.msg);
          }
        });
        ShareVisible.value = false;
      }
    };

    //chakan
    const handleLook = (index, row) => {
      console.log("查看");
      localIndex = index;
      console.log(
        "tableData.value[localIndex].name = ",
        tableData.value[localIndex].name,
      );
      localStorage.setItem("look_model_name", tableData.value[localIndex].name);
      router.push("/train_result");
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
      console.log("lr.value = ", lr.value);
      postModelTrain(
        task_type,
        qs.stringify({
          model_name: localName.value,
          username: username,
          dataset_name: datasetName.value,
          batch_size: batch_size.value,
          lr: lr.value,
          epochs: epochs.value,
          optimizer: optimizer.value,
          lr_scheduler: lr_scheduler.value,
          max_time: max_time.value,
          split_ratio: split_ratio.value,
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
          if (task_type == "图像分类")
            router.push("/ModelTestingForImageClassification");
          if (task_type == "目标检测")
            router.push("/ModelTestingForObjectDetection");
          if (task_type == "目标跟踪")
            router.push("/ModelTestingForObjectTracking");
          if (task_type == "图像分割")
            router.push("/ModelTestingForImageSegmentation");
          if (task_type == "文本分类")
            router.push("/ModelTestingForTextClassification");
          if (task_type == "动作识别")
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

    const handleVersion = (index, row) => {
      localStorage.setItem("model_version", tableData.value[index].name);
      router.push("/model_version");
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
      nameModel,
      handleChangeName,
      newName,
      handleModelTrain,
      getTableInfo,
      trainVisible,
      localName,
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
      shareModels,
      newShare,

      handleLook,
      batch_size,
      lr,
      epochs,
      optimizer,
      lr_scheduler,
      max_time,
      split_ratio,

      handleVersion,
    };
  },
};
</script>

<style scoped></style>
