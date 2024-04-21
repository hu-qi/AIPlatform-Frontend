<template>
  <div>
    <el-button
      type="primary"
      @click="createProject"
    >
      创建工程
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 工程管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 编辑弹出框 创建新工程-->
    <el-dialog
      v-model="editVisible"
      title="创建工程"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="工程名称">
          <el-input v-model="new_project.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addProject"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="nameVisible"
      title="修改工程名"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="新的工程名">
          <el-input v-model="newName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="NameProject"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.add_datasets"
      title="添加数据集"
      width="50%"
    >
      <div>
        <el-form label-width="150px">
          <el-form-item label="新的数据集名称">
            <el-input
              v-model="new_project.new_datasets"
              style="width: 30%"
            />
            <el-button
              type="primary"
              style="margin-left: 10%"
              @click="AddDatasets(0)"
            >
              创建新的数据集
            </el-button>
          </el-form-item>
          <el-form-item label="已有数据集">
            <el-select
              v-model="new_project.chosen_datasets"
              style="width: 30%"
              @change="TEST"
            >
              <el-option
                v-for="item in datasetsGroup"
                :key="item.id"
                :value="item.name"
              />
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 10%"
              @click="AddDatasets(1)"
            >
              选择已有数据集
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.upload"
      title="上传数据"
      width="30%"
    >
      <div style="text-align: center">
        <el-select
          v-model="new_project.is_annotation"
          style="margin-bottom: 10px"
          placeholder="是否标注"
        >
          <el-option
            key="1"
            label="已标注"
            value="已标注"
          />
          <el-option
            key="2"
            label="未标注"
            value="未标注"
          />
        </el-select>
        <el-upload
          class="upload-demo"
          action="#"
          multiple
          :http-request="uploadFiles"
          :file-list="fileList"
          :on-change="onUploadChange"
          :auto-upload="false"
          limit="1"
          :on-progress="uploadProcess"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            点击选择文件
          </div>
          <template #tip>
            <div
              class="el-upload__tip"
              style="text-align: center"
            >
              每次只能上传一个文件（zip/jpg/png...）
            </div>
          </template>

          <!--<el-progress :percentage="uploadPercent" :color="customColors"></el-progress>-->
        </el-upload>
        <div style="align-items: center">
          <el-button
            style="margin-top: 10px; align-items: center"
            size="small"
            type="success"
            @click="submitUpload"
          >
            上传到服务器
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.annotation"
      title="标注数据"
      width="30%"
    >
      <div style="align-items: center; align-content: center">
        <el-button
          type="primary"
          @click="Annotation(0)"
        >
          手工标注
        </el-button>
        <el-button
          type="primary"
          @click="Annotation(1)"
        >
          自动标注
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.add_model"
      title="添加模型"
      width="50%"
    >
      <div>
        <el-form label-width="150px">
          <el-form-item label="新的模型名称">
            <el-input
              v-model="new_project.new_model"
              style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="训练方法">
            <el-select
              v-model="new_project.how_to_train"
              style="width: 50%"
              placeholder=""
            >
              <el-option
                v-for="item in method"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 10%"
              @click="AddModel(0)"
            >
              创建新的模型
            </el-button>
          </el-form-item>

          <el-form-item label="已有模型">
            <el-select
              v-model="new_project.chosen_model"
              style="width: 50%"
              @change="TEST"
            >
              <el-option
                v-for="item in modelsGroup"
                :key="item.id"
                :value="item.name"
              />
            </el-select>
            <el-button
              type="primary"
              style="margin-left: 10%"
              @click="AddModel(1)"
            >
              选择已有模型
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.train"
      title="训练模型"
      width="30%"
    />
    <el-dialog
      v-model="dialog_visible.test"
      title="测试模型"
      width="30%"
    />
    <el-dialog
      v-model="dialog_visible.deploy"
      title="部署模型"
      width="30%"
    >
      <div style="align-items: center; align-content: center">
        <el-button
          type="primary"
          @click="Deploy(0)"
        >
          本地部署
        </el-button>
        <el-button
          type="primary"
          @click="Deploy(1)"
        >
          云部署
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="dialog_visible.undeploy"
      title="部署模型"
      width="30%"
    >
      <div style="align-items: center; align-content: center">
        <el-button
          type="primary"
          @click="Deploy(0)"
        >
          本地部署
        </el-button>
        <el-button
          type="primary"
          @click="Deploy(2)"
        >
          取消云部署
        </el-button>
      </div>
    </el-dialog>
    <!--  -->
    <div
      v-if="show_table"
      class="el-collapse"
    >
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="project in projectsGroup"
          :key="project.id"
        >
          <template #title>
            <!--<div style="font-size: 15px">
                            {{"&#160; &#160;工程名："+project.project_name + "   创建时间：" + project.time_created + "上次修改时间：" +  project.last_fixed}}
                        </div>-->
            <div style="font-size: 15px; width: 30%; text-align: left">
              {{ "&#160;&#160;工程名：" + project.project_name }}
            </div>
            <div style="font-size: 12px; width: 30%; color: gray">
              {{ "创建时间：" + project.time_created }}
            </div>
            <div style="font-size: 12px; width: 30%; color: gray">
              {{ "上次修改时间：" + project.last_fixed }}
            </div>
            <!--<el-button type="info" icon="el-icon-close" color="black" @click="DeleteProject(project)"></el-button>-->
            <div style="width: 8%">
              <i
                class="el-icon-edit"
                style="color: #0a0a0a; width: 50%"
                @click="EditProject(project, 0)"
              />
              <i
                class="el-icon-close"
                style="color: #0a0a0a; width: 50%"
                @click="DeleteProject(project)"
              />
            </div>
          </template>
          <div
            style="text-align: center; margin-top: 20px; margin-bottom: 50px"
          >
            <el-button
              v-show="project.show[0]"
              type="success"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[0]"
              @click="EditProject(project, 1)"
            >
              添加数据集
            </el-button>
            <el-button
              v-show="project.show[1]"
              type="success"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[1]"
              @click="EditProject(project, 2)"
            >
              上传数据
            </el-button>
            <el-button
              v-show="project.show[2]"
              type="success"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[2]"
              @click="EditProject(project, 3)"
            >
              标注数据
            </el-button>
            <el-button
              v-show="project.show[3]"
              type="warning"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[3]"
              @click="EditProject(project, 4)"
            >
              添加模型
            </el-button>
            <el-button
              v-show="project.show[4]"
              type="warning"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[4]"
              @click="EditProject(project, 5)"
            >
              训练模型
            </el-button>
            <el-button
              v-show="project.show[5]"
              type="warning"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[5]"
              @click="EditProject(project, 6)"
            >
              测试模型
            </el-button>
            <el-button
              v-show="project.show[6]"
              type="danger"
              style="width: 12%; text-align: center; font-size: 18px"
              :disabled="project.disable[6]"
              @click="EditProject(project, 7)"
            >
              部署模型
            </el-button>
          </div>
          <div
            style="text-align: center; margin-top: 50px; margin-bottom: 20px"
          >
            <el-collapse
              v-show="true"
              style="width: 100%"
            >
              <el-collapse-item
                title="详细信息"
                name="1"
              >
                <template #title />
                <p
                  v-show="project.show2[0] == false"
                  style="font-size: 12px; color: gray; text-align: left"
                >
                  {{ "&#160; &#160;未选择数据集" }}
                </p>

                <div
                  v-show="project.show2[0]"
                  style="text-align: left"
                >
                  <p style="font-size: 12px; color: gray">
                    <span style="width: 20%; display: block; float: left">
                      {{
                        "&#160; &#160;数据集名：" + project.chosen_datasets.name
                      }}
                    </span>
                    <span style="width: 80%; display: block; float: left">
                      {{
                        "&#160; &#160;已标注数量/总数量：" +
                          project.chosen_datasets.annotation_size +
                          "/" +
                          project.chosen_datasets.size
                      }}
                    </span>
                    <!--<span style="width:200px;display: block;float: left">
                                            {{"&#160"}}
                                        </span>
                                        <span style="width:200px;display: block;float: left">
                                            {{"&#160"}}
                                        </span>-->
                  </p>
                </div>
                <div
                  v-show="project.show2[1] == false"
                  style="text-align: left"
                >
                  <p style="font-size: 12px; color: gray; text-align: left">
                    <span style="width: 200px; display: block; float: left">
                      {{ "&#160; &#160;未选择模型" }}
                    </span>
                  </p>
                </div>

                <div
                  v-show="project.show2[1]"
                  style="text-align: left"
                >
                  <p style="font-size: 12px; color: gray">
                    <span style="width: 20%; display: block; float: left">
                      {{ "&#160; &#160;模型名：" + project.chosen_model.name }}
                    </span>
                    <span style="width: 30%; display: block; float: left">
                      {{
                        "&#160; &#160;训练方法：" +
                          project.chosen_model.how_to_train
                      }}
                    </span>
                    <span style="width: 20%; display: block; float: left">
                      {{
                        "&#160; &#160;训练状态：" +
                          project.chosen_model.training_status
                      }}
                    </span>
                    <span style="width: 20%; display: block; float: left">
                      {{
                        "&#160; &#160;部署状态：" +
                          project.chosen_model.local_deployment_status +
                          "/" +
                          project.chosen_model.cloud_deployment_status
                      }}
                    </span>
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import fileDownload from "js-file-download";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  fetchDatasetsInfo,
  getModelInfo,
  postCreateProject,
  getProjectsInfo,
  postProjectsInfo,
  postCreateDatasets,
  postUploadDatasets,
  getManualAnnotation,
  postAutoAnnotation,
  getModelCreate,
  postModelCreate,
  postModelTrain,
  postModelLocalDeploy,
  postModelLocalDeployDownload,
  postModelCloudDeploy,
} from "../api/index";
export default {
  setup() {
    let projectsGroup = ref([]);
    let show_table = ref(false);
    let new_project = reactive({
      name: "",
      new_datasets: "",
      chosen_datasets: "",
      datasets_desc: "",
      is_annotation: "未标注",
      how_to_train: "",
      new_model: "",
      chosen_model: "",
      model_desc: "",
    });
    const method = ref([]);
    let dialog_visible = reactive({
      add_datasets: false,
      upload: false,
      annotation: false,
      add_model: false,
      train: false,
      test: false,
      deploy: false,
      chosen_project: null,
      undeploy: false,
    });
    let datasetsGroup = ref([]);
    let modelsGroup = ref([]);
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const editVisible = ref(false);
    const nameVisible = ref(false);
    let newName = ref();
    let targetName = ref();
    let chosen_datasets = reactive({
      name: "",
      size: 0,
      annotation_size: 0,
    });
    let chosen_model = reactive({
      name: "",
      training_status: "未训练",
      how_to_train: "暂无",
    });
    let fileList = ref([]);
    let lastFile = ref();
    const getDatasetsInfo = () => {
      fetchDatasetsInfo(task_type, {
        username: localStorage.getItem("ms_username"),
      }).then((res) => {
        let obj = JSON.parse(res.data.datasetinfo);
        let length = obj.length;
        //console.log(JSON.parse(res.data.datasetinfo)[0].fields.name);
        datasetsGroup.value = reactive([]);
        for (let i = 0; i < length; i++) {
          datasetsGroup.value.push({
            id: i,
            name: obj[i].fields.name,
            task_type: obj[i].fields.task_type,
            size: obj[i].fields.size,
            annotation_size: obj[i].fields.annotation_size,
            annotation_status: obj[i].fields.annotation_status,
            desc: obj[i].fields.description,
          });
        }
      });
    };
    const getModelsInfo = () => {
      getModelInfo(task_type, { username: username }).then((res) => {
        //console.log(res);
        let obj = JSON.parse(res.data.modelinfo);
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
        modelsGroup.value = reactive([]);
        for (let i = 0; i < length; i++) {
          modelsGroup.value.push({
            id: i,
            name: obj[i].fields.name,
            training_status: TRAINING_STATUS[obj[i].fields.training_status],
            how_to_train: obj[i].fields.how_to_train,
            cloud_deployment_status:
              CLOUD_DEPLOYMENT_STATUS[obj[i].fields.cloud_deployment_status],
            local_deployment_status:
              LOCAL_DEPLOYMENT_STATUS[obj[i].fields.local_deployment_status],
          });
        }
      });
    };
    const initProjectsInfo = () => {
      show_table.value = false;
      getDatasetsInfo();
      getModelsInfo();
      getModelCreate(task_type).then((res) => {
        //console.log(res);
        method.value = reactive([]);
        let obj = res.data;
        let length = obj.length;
        for (let i = 0; i < length; i++) {
          method.value.push({ label: obj[i][1], value: obj[i][0] });
        }
        //console.log(method);
      });
      getProjectsInfo(task_type, { username: username }).then((res) => {
        //console.log(res);
        let obj = res.data.projectinfo;
        //console.log(obj);
        let length = obj.length;
        projectsGroup.value = reactive([]);
        for (let i = 0; i < length; i++) {
          projectsGroup.value.push({
            project_name: obj[i].name,
            temp_datasets: obj[i].dataset,
            temp_model: obj[i].model,
            time_created: obj[i].time_created,
            last_fixed: obj[i].last_fixed,
            chosen_datasets: {
              name: obj[i].dataset,
              size: 0,
              annotation_size: 0,
            },
            disable: [true, true, true, true, true, true, true],
            show: [true, true, true, true, true, true, true],
            show2: [false, false],
            chosen_model: {
              name: obj[i].model,
              training_status: "未选择",
              how_to_train: "未选择",
              cloud_deployment_status: "未云部署",
              local_deployment_status: "未本地部署",
            },
          });
          let length1 = datasetsGroup.value.length;
          for (let j = 0; j < length1; j++) {
            if (
              datasetsGroup.value[j].name ==
              projectsGroup.value[i].chosen_datasets.name
            ) {
              projectsGroup.value[i].chosen_datasets.annotation_size =
                datasetsGroup.value[j].annotation_size;
              projectsGroup.value[i].chosen_datasets.size =
                datasetsGroup.value[j].size;
              break;
            }
          }
          let length2 = modelsGroup.value.length;
          for (let j = 0; j < length2; j++) {
            if (
              modelsGroup.value[j].name ==
              projectsGroup.value[i].chosen_model.name
            ) {
              projectsGroup.value[i].chosen_model.how_to_train =
                modelsGroup.value[j].how_to_train;
              projectsGroup.value[i].chosen_model.training_status =
                modelsGroup.value[j].training_status;
              projectsGroup.value[i].chosen_model.cloud_deployment_status =
                modelsGroup.value[j].cloud_deployment_status;
              projectsGroup.value[i].chosen_model.local_deployment_status =
                modelsGroup.value[j].local_deployment_status;
              break;
            }
          }
          if (
            projectsGroup.value[i].chosen_model.name == "" &&
            projectsGroup.value[i].chosen_datasets.size == 0
          ) {
            projectsGroup.value[i].disable[0] = false;
          }
          if (
            projectsGroup.value[i].chosen_model.name == "" &&
            projectsGroup.value[i].chosen_datasets.name != ""
          )
            projectsGroup.value[i].disable[1] = false;
          if (
            projectsGroup.value[i].chosen_model.name == "" &&
            projectsGroup.value[i].chosen_datasets.name != "" &&
            projectsGroup.value[i].chosen_datasets.size > 0
          ) {
            projectsGroup.value[i].disable[2] = false;
          }
          if (
            projectsGroup.value[i].chosen_datasets.size > 0 &&
            projectsGroup.value[i].chosen_datasets.size ==
              projectsGroup.value[i].chosen_datasets.annotation_size
          ) {
            if (
              projectsGroup.value[i].chosen_model.training_status != "已训练" &&
              projectsGroup.value[i].chosen_model.training_status != "训练中"
            ) {
              projectsGroup.value[i].disable[3] = false;
            }
          }
          if (
            projectsGroup.value[i].chosen_model.name != "" &&
            projectsGroup.value[i].chosen_model.training_status != "已训练" &&
            projectsGroup.value[i].chosen_model.training_status != "训练中"
          ) {
            projectsGroup.value[i].disable[4] = false;
          }
          if (projectsGroup.value[i].chosen_model.training_status == "已训练") {
            projectsGroup.value[i].disable[5] = false;
          }
          if (projectsGroup.value[i].chosen_model.training_status == "已训练") {
            projectsGroup.value[i].disable[6] = false;
          }
          if (projectsGroup.value[i].chosen_datasets.name != "")
            projectsGroup.value[i].show2[0] = true;
          if (projectsGroup.value[i].chosen_model.name != "")
            projectsGroup.value[i].show2[1] = true;
        }
      });
      show_table.value = true;
    };
    initProjectsInfo();
    const ChooseDatasets = (project) => {
      let p_size = projectsGroup.value.length;
      let length = datasetsGroup.value.length;
      for (let k = 0; k < p_size; k++) {
        if (projectsGroup.value[k] == project) {
          for (let i = 0; i < length; i++) {
            if (
              datasetsGroup.value[i].name ==
              projectsGroup.value[k].temp_datasets
            ) {
              break;
            }
          }
          break;
        }
      }
    };
    const ChooseModel = (project) => {
      let p_size = projectsGroup.value.length;
      let length = modelsGroup.value.length;
      for (let k = 0; k < p_size; k++) {
        if (projectsGroup.value[k] == project) {
          for (let i = 0; i < length; i++) {
            if (
              modelsGroup.value[i].name == projectsGroup.value[k].temp_model
            ) {
              break;
            }
          }
          break;
        }
      }
    };
    const createProject = () => {
      console.log("创建工程"); //待填写
      editVisible.value = true;
    };
    const addProject = () => {
      if (new_project.name == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postCreateProject(
        task_type,
        qs.stringify({
          name: new_project.name,
          username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        console.log(res);
        if (res.code == "200") {
          ElMessage.success(res.msg);
          editVisible.value = false;
          router.go(0);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const ChangeDatasets = (project) => {
      let p_size = projectsGroup.value.length;
      for (let k = 0; k < p_size; k++) {
        if (projectsGroup.value[k] == project) {
          postProjectsInfo(
            task_type,
            qs.stringify({
              name: projectsGroup.value[k].project_name,
              username: localStorage.getItem("ms_username"),
              dataset: projectsGroup.value[k].temp_datasets,
            }),
          ).then((res) => {
            if (res.code == "200") {
              ElMessage.success(res.msg);
              router.go(0);
            } else {
              ElMessage.error(res.msg);
            }
          });
          break;
        }
      }
    };
    const ChangeModel = (project) => {
      let p_size = projectsGroup.value.length;
      for (let k = 0; k < p_size; k++) {
        if (projectsGroup.value[k] == project) {
          postProjectsInfo(
            task_type,
            qs.stringify({
              name: projectsGroup.value[k].project_name,
              username: localStorage.getItem("ms_username"),
              model: projectsGroup.value[k].temp_model,
            }),
          ).then((res) => {
            console.log(res);
            if (res.code == "200") {
              ElMessage.success(res.msg);
              router.go(0);
            } else {
              ElMessage.error(res.msg);
            }
          });
          break;
        }
      }
    };
    const DeleteProject = (project) => {
      console.log("delete");
      ElMessageBox.confirm("确认删除工程吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          console.log("确定删除");
          let p_size = projectsGroup.value.length;
          for (let k = 0; k < p_size; k++) {
            if (projectsGroup.value[k] == project) {
              console.log(projectsGroup.value[k].project_name);
              postProjectsInfo(
                task_type,
                qs.stringify({
                  name: projectsGroup.value[k].project_name,
                  username: localStorage.getItem("ms_username"),
                  delete: 1,
                }),
              ).then((res) => {
                if (res.code == "200") {
                  ElMessage.success(res.msg);
                  router.go(0);
                } else {
                  ElMessage.error(res.msg);
                }
              });
            }
          }
        })
        .catch(() => {});
    };
    const EditProject = (project, op) => {
      dialog_visible.chosen_project = project;
      if (op == 0) {
        console.log("edit");
        nameVisible.value = true;
        targetName.value = project.project_name;
        console.log(targetName.value);
      }
      if (op == 1) {
        dialog_visible.add_datasets = true;
      }
      if (op == 2) {
        dialog_visible.upload = true;
      }
      if (op == 3) {
        dialog_visible.annotation = true;
      }
      if (op == 4) {
        dialog_visible.add_model = true;
      }
      if (op == 5) {
        ElMessageBox.confirm("确定要训练模型吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            postModelTrain(
              task_type,
              qs.stringify({
                model_name: dialog_visible.chosen_project.chosen_model.name,
                username: username,
                dataset_name:
                  dialog_visible.chosen_project.chosen_datasets.name,
              }),
            ).then((res) => {
              console.log(res);
              if (res.code == 200) {
                ElMessage.success(res.msg);
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
      if (op == 6) {
        ElMessageBox.confirm("确定要进行测试吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            localStorage.setItem(
              "model_name",
              dialog_visible.chosen_project.chosen_model.name,
            );
            console.log(localStorage.getItem("model_name"));
            if (task_type == "image classification")
              router.push("/ModelTestingForImageClassification");
            if (task_type == "object detection")
              router.push("/ModelTestingForObjectDetection");
            if (task_type == "object tracking")
              router.push("/ModelTestingForObjectTracking");
            if (task_type == "image segmentation")
              router.push("/ModelTestingForImageSegmentation");
          })
          .catch(() => {});
      }
      if (op == 7) {
        if (
          dialog_visible.chosen_project.chosen_model.cloud_deployment_status ==
          "未云部署"
        )
          dialog_visible.deploy = true;
        else dialog_visible.undeploy = true;
      }
    };
    const NameProject = () => {
      postProjectsInfo(
        task_type,
        qs.stringify({
          name: targetName.value,
          username: localStorage.getItem("ms_username"),
          new_name: newName.value,
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          router.go(0);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const AddDatasets = (op) => {
      console.log("before adding");
      console.log(projectsGroup);
      if (op == 0) {
        if (new_project.new_datasets == "") {
          ElMessage.error("名称不能为空");
          return;
        }
        postCreateDatasets(
          task_type,
          qs.stringify({
            name: new_project.new_datasets,
            username: localStorage.getItem("ms_username"),
            description: new_project.new_datasets,
          }),
        ).then((res) => {
          if (res.code == "200") {
            ElMessage.success(res.msg);
            getDatasetsInfo();
            new_project.chosen_datasets = new_project.new_datasets;
            postProjectsInfo(
              task_type,
              qs.stringify({
                name: dialog_visible.chosen_project.project_name,
                username: localStorage.getItem("ms_username"),
                dataset: new_project.chosen_datasets,
              }),
            ).then((res) => {
              if (res.code == "200") {
                ElMessage.success(res.msg);
                initProjectsInfo();
                console.log("after adding");
                console.log(projectsGroup);
                dialog_visible.add_datasets = false;
              } else {
                ElMessage.error(res.msg);
              }
            });
            dialog_visible.add_datasets = false;
          } else {
            ElMessage.error(res.msg);
          }
        });
        console.log("确认创建数据集"); //待填写
      }
      if (op == 1) {
        postProjectsInfo(
          task_type,
          qs.stringify({
            name: dialog_visible.chosen_project.project_name,
            username: localStorage.getItem("ms_username"),
            dataset: new_project.chosen_datasets,
          }),
        ).then((res) => {
          console.log(res);
          if (res.code == "200") {
            ElMessage.success(res.msg);
            dialog_visible.add_datasets = false;
            initProjectsInfo();
          } else {
            ElMessage.error(res.msg);
          }
        });
      }
    };
    const UploadDatsasets = () => {};
    const Annotation = (op) => {
      if (op == 0) {
        ElMessageBox.confirm("确认进行手工标注吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            getManualAnnotation(task_type, {
              name: dialog_visible.chosen_project.chosen_datasets.name,
              username: username,
              current_data_id: 0,
              next: 0,
              previous: 0,
            }).then((res) => {
              if (res.code == 200) {
                ElMessage.success(res.msg);

                localStorage.setItem(
                  "current_data_id",
                  res.data.current_data_id,
                );
                localStorage.setItem(
                  "current_datasets_name",
                  dialog_visible.chosen_project.chosen_datasets.name,
                );
                localStorage.setItem("current_label", res.data.label);
                localStorage.setItem(
                  "current_label_group",
                  res.data.label_group,
                );
                if (task_type == "image classification")
                  router.push("/ShowAnnotationImage");
                if (task_type == "object detection") {
                  localStorage.setItem("current_img_url", res.data.data_url);
                  router.push("/AnnotationForObjectDetection");
                }
                if (task_type == "object tracking") {
                  localStorage.setItem(
                    "current_img_url",
                    JSON.stringify(res.data.data_url),
                  );
                  localStorage.setItem(
                    "current_annotation",
                    JSON.stringify(res.data.annotation),
                  );
                  localStorage.setItem(
                    "obj_ids",
                    JSON.stringify(res.data.obj_ids),
                  );
                  router.push("/AnnotationForObjectTracking");
                }
                if (task_type == "image segmentation") {
                  localStorage.setItem(
                    "current_img_url",
                    JSON.stringify(res.data.data_url),
                  );
                  localStorage.setItem(
                    "current_annotation",
                    JSON.stringify(res.data.annotation),
                  );
                  localStorage.setItem(
                    "obj_ids",
                    JSON.stringify(res.data.obj_ids),
                  );
                  router.push("/AnnotationForImageSegmentation");
                }
                if (task_type == "action recognition") {
                  localStorage.setItem(
                    "current_img_url",
                    JSON.stringify(res.data.data_url),
                  );
                  localStorage.setItem(
                    "current_annotation",
                    JSON.stringify(res.data.annotation),
                  );
                  localStorage.setItem(
                    "obj_ids",
                    JSON.stringify(res.data.obj_ids),
                  );
                  router.push("/AnnotationForActionRecognition");
                }
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
      if (op == 1) {
        ElMessageBox.confirm("确认进行自动标注吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            postAutoAnnotation(
              task_type,
              qs.stringify({
                name: dialog_visible.chosen_project.chosen_datasets.name,
                username: username,
                cover_annotation: 1,
              }),
            ).then((res) => {
              console.log(res);
              if (res.code == 200) {
                ElMessage.success(res.msg);
                initProjectsInfo();
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
    };
    const AddModel = (op) => {
      if (op == 0) {
        if (new_project.new_model == "") {
          ElMessage.error("名称不能为空");
          return;
        }
        postModelCreate(
          task_type,
          qs.stringify({
            name: new_project.new_model,
            username: username,
            how_to_train: new_project.how_to_train,
            description: new_project.new_model,
          }),
        ).then((res) => {
          if (res.code == "200") {
            ElMessage.success(res.msg);
            new_project.chosen_model = new_project.new_model;
            postProjectsInfo(
              task_type,
              qs.stringify({
                name: dialog_visible.chosen_project.project_name,
                username: localStorage.getItem("ms_username"),
                model: new_project.chosen_model,
              }),
            ).then((res) => {
              console.log(res);
              if (res.code == "200") {
                ElMessage.success(res.msg);
                initProjectsInfo();
              } else {
                ElMessage.error(res.msg);
              }
            });

            getModelsInfo();
            dialog_visible.add_model = false;
          } else {
            ElMessage.error(res.msg);
          }
        });
      }
      if (op == 1) {
        postProjectsInfo(
          task_type,
          qs.stringify({
            name: dialog_visible.chosen_project.project_name,
            username: localStorage.getItem("ms_username"),
            model: new_project.chosen_model,
          }),
        ).then((res) => {
          console.log(res);
          if (res.code == "200") {
            ElMessage.success(res.msg);
            dialog_visible.add_model = false;
            initProjectsInfo();
          } else {
            ElMessage.error(res.msg);
          }
        });
      }
    };
    const Deploy = (op) => {
      if (op == 0) {
        ElMessageBox.confirm("确认进行本地部署吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            postModelLocalDeploy(
              task_type,
              qs.stringify({
                username: username,
                model_name: dialog_visible.chosen_project.chosen_model.name,
              }),
            ).then((res) => {
              //console.log(typeof(res));
              if (res.code == "200") {
                ElMessage.success(res.msg);
                initProjectsInfo();
                postModelLocalDeployDownload(
                  task_type,
                  qs.stringify({
                    username: username,
                    model_name: dialog_visible.chosen_project.chosen_model.name,
                  }),
                ).then((res2) => {
                  fileDownload(res2, "local_deploy.zip");
                });
                dialog_visible.deploy = false;
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
      if (op == 1) {
        ElMessageBox.confirm("确认进行云部署吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            postModelCloudDeploy(
              task_type,
              qs.stringify({
                username: username,
                model_name: dialog_visible.chosen_project.chosen_model.name,
              }),
            ).then((res) => {
              if (res.code == "200") {
                ElMessage.success(res.msg);
                dialog_visible.deploy = false;
                initProjectsInfo();
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
      if (op == 2) {
        ElMessageBox.confirm("确认取消云部署吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            postModelCloudDeploy(
              task_type,
              qs.stringify({
                username: username,
                model_name: dialog_visible.chosen_project.chosen_model.name,
              }),
            ).then((res) => {
              if (res.code == "200") {
                ElMessage.success(res.msg);
                dialog_visible.deploy = false;
              } else {
                ElMessage.error(res.msg);
              }
            });
          })
          .catch(() => {});
      }
    };
    const onUploadChange = (file, FL) => {
      console.log("文件状态改变"); //待填写
      fileList.value = FL;
      lastFile.value = file;
      //console.log(fileList);
    };
    const submitUpload = () => {
      console.log("提交上传"); //待填写
      console.log(localStorage.getItem("ms_username"));
      let fd = new FormData();
      fileList.value.forEach((item) => {
        //文件信息中raw才是真的文件
        fd.append("file", item.raw);
        console.log(item.raw);
      });
      fd.append("username", localStorage.getItem("ms_username"));
      fd.append("name", dialog_visible.chosen_project.chosen_datasets.name);
      if (new_project.is_annotation == "已标注")
        fd.append("is_annotation_data", 1);
      else fd.append("is_annotation_data", 0);
      ElMessage.success("上传中，请稍等");
      postUploadDatasets(task_type, fd).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          initProjectsInfo();
        } else {
          //console.log(res.code);
          ElMessage.error(res.msg);
        }
      });
    };
    const TEST = () => {
      console.log(new_project.chosen_datasets);
    };
    return {
      Deploy,
      onUploadChange,
      submitUpload,
      AddDatasets,
      TEST,
      UploadDatsasets,
      Annotation,
      AddModel,
      NameProject,
      EditProject,
      nameVisible,
      newName,
      ChooseDatasets,
      datasetsGroup,
      chosen_datasets,
      projectsGroup,
      modelsGroup,
      chosen_model,
      ChooseModel,
      createProject,
      new_project,
      editVisible,
      addProject,
      ChangeDatasets,
      ChangeModel,
      DeleteProject,
      dialog_visible,
      method,
      show_table,
    };
  },
};
</script>
<style scoped>
.el-collapse-item {
  width: 90%;
  position: relative;
  left: 5%;
  border: 2px solid #0a0a0a;
  text-align: center;
}
/*.el-collapse-item .el-collapse-item__header{*/
/*    font-size: 22px;*/
/*}*/
/*.text-test{*/
/*    font-size: 22px;*/
/*}*/
.layout {
  float: left;
  width: 30%;
  height: 300px;
  text-align: center;
  align-items: center;
  left: 2%;
  position: relative;
  margin: 10px;
  border: 1px solid #c7d8d9;
}
.layout2 {
  float: left;
  width: 100%;
  text-align: center;
  align-items: center;
  left: 2%;
  position: relative;
  margin: 10px;
}
/*.el-select{*/

/*}*/
</style>
