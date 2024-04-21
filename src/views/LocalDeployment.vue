<template>
  <div>
    <el-button
      type="primary"
      @click="createLocalDeploy"
    >
      创建本地部署
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 公共模型
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
          prop="deployname"
          label="名称"
          align="center"
        />
        <el-table-column
          prop="name"
          label="模型名称"
          align="center"
        />
        <el-table-column
          prop="share_level"
          label="共享状态"
          align="center"
        />

        <el-table-column
          label="模型管理"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="DownloadDeploy(scope.$index, scope.row)"
            >
              查看
            </el-button>
            <el-button
              type="text"
              @click="handleChangeName(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              @click="handleShare(scope.$index, scope.row)"
            >
              共享
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      v-model="nameVisible"
      title="修改本地部署名称"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="本地部署名称">
          <el-input v-model="newName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="nameLocalDeploy"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewVisible"
      title="模型信息"
      width="30%"
    />

    <!-- 编辑弹出框 创建新数据集-->
    <el-dialog
      v-model="editVisible"
      title="创建本地部署"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="本地部署名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="模型">
          <el-select
            v-model="form.model_name"
            placeholder="请选择模型"
          >
            <el-option
              v-for="item in modelsetdata"
              :key="item.name"
              :value="item.name"
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
            @click="handleCreateLocalDeploy"
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
            @click="shareDeploy"
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
  getModelCreate,
  getModelLocalDeploy,
  postModelLocalDeployCreate,
  postModelLocalDeployDownload,
} from "../api/index";
export default {
  name: "MyModel",
  setup() {
    const tableData = ref([]);
    const modelsetdata = ref([]);
    const method = ref([]);
    const datasetName = ref();
    const modelsetName = ref();
    //获取模型数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const getTableInfo = () => {
      console.log("模型管理初始化");

      getModelInfo(task_type, { username: username }).then((res) => {
        //console.log('res = ', res);
        let obj = res.data.modelinfo;
        let length = obj.length;
        //console.log(obj);
        modelsetdata.value = reactive([]);
        for (var i = 0; i < length; i++) {
          modelsetdata.value.push({
            id: i,
            name: obj[i].name,
          });
        }
        //console.log('modelsetdata = ', modelsetdata.value)
      });

      getModelLocalDeploy(task_type, { username: username }).then((res) => {
        console.log("res = ", res);
        let obj = res.data.localdeployments;
        let length = obj.length;
        console.log("obj = ", obj);
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
            deployname: obj[i].name,
            name: obj[i].model,
            share_level: obj[i].sharing_level,
            //cloud_deployment_status: CLOUD_DEPLOYMENT_STATUS[obj[i].fields.cloud_deployment_status],
            //local_deployment_status: LOCAL_DEPLOYMENT_STATUS[obj[i].fields.local_deployment_status],
          });
        }
      });
      //console.log('获取模型信息');
    };
    getTableInfo();

    // 删除操作
    const handleDelete = (index, row) => {
      console.log("删除");
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postModelLocalDeploy(
            task_type,
            qs.stringify({
              name: tableData.value[index].deployname,
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

    // 改名操作
    let newName = ref("");
    const localName = ref();
    let localIndex = 0;
    const handleChangeName = (index, row) => {
      console.log("修改部署名"); //待填写
      localIndex = index;
      nameVisible.value = true;
    };
    const nameLocalDeploy = () => {
      console.log("确定修改本地部署名"); //待填写
      if (newName.value == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postModelLocalDeploy(
        task_type,
        qs.stringify({
          name: tableData.value[localIndex].deployname,
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

    // 创建操作
    //处理创建本地部署的编辑框
    const editVisible = ref(false);
    const nameVisible = ref(false);
    const trainVisible = ref(false);
    let form = reactive({
      name: "",
      model_name: "",
      desc: "",
    });

    const createLocalDeploy = () => {
      console.log("创建本地部署");
      editVisible.value = true;
    };

    const handleCreateLocalDeploy = () => {
      // 二次确认删除
      if (form.name == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postModelLocalDeployCreate(
        task_type,
        qs.stringify({
          name: form.name,
          username: username,
          description: form.desc,
          model_name: form.model_name,
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
    };

    //共享
    const ShareVisible = ref(false);
    const handleShare = (index, row) => {
      console.log("共享");
      localIndex = index;
      // 二次确认删除
      ShareVisible.value = true;
    };
    let newShare = ref("");
    const shareDeploy = () => {
      console.log("确定共享数据集"); //待填写
      console.log(newShare); //待填写
      if (newShare.value != "") {
        postModelLocalDeploy(
          task_type,
          qs.stringify({
            name: tableData.value[localIndex].deployname,
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

    // 查看操作
    const DownloadDeploy = (index, row) => {
      console.log("查看"); //待填写
      postModelLocalDeployDownload(
        task_type,
        qs.stringify({
          name: tableData.value[index].deployname,
          username: username,
          sharing_level: newShare.value,
        }),
      ).then((res) => {
        //console.log(res);
        fileDownload(res, "local_deploy.zip");
      });
    };

    return {
      tableData,
      handleDelete,
      editVisible,
      form,
      getTableInfo,
      trainVisible,

      method,

      handleCreateLocalDeploy,
      createLocalDeploy,
      modelsetdata,
      modelsetName,

      handleChangeName,
      nameVisible,
      nameLocalDeploy,
      newName,

      ShareVisible,
      handleShare,
      shareDeploy,
      newShare,

      DownloadDeploy,
    };
  },
};
</script>

<style scoped></style>
