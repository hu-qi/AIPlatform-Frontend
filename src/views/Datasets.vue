<template>
  <div>
    <el-button
      type="primary"
      @click="createDatasets"
    >
      创建数据集
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 数据集管理
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
          label="数据集名称"
          align="center"
        />
        <el-table-column
          prop="task_type"
          label="任务类型"
          align="center"
        />
        <el-table-column
          prop="size"
          label="样本数量"
          align="center"
        />
        <el-table-column
          prop="annotation_size"
          label="已标注样本数量"
          align="center"
        />
        <el-table-column
          prop="annotation_status"
          label="标注状态"
          align="center"
        />
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
          label="标注操作"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-user"
              @click="handleImport(scope.$index, scope.row)"
            >
              上传数据
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleChangeName(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleManualAnnotation(scope.$index, scope.row)"
            >
              标注
            </el-button>
            <!-- <el-button type="text" icon="el-icon-edit"
                                   @click="handleAutoAnnotation(scope.$index, scope.row)">自动标注</el-button> -->
            <el-button
              type="text"
              icon="el-icon-edit"
              class="red"
              @click="handleShare(scope.$index, scope.row)"
            >
              共享
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              class="red"
              @click="handleVersion(scope.$index, scope.row)"
            >
              版本管理
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
      </el-table>
    </div>

    <!-- 编辑弹出框 创建新数据集-->
    <el-dialog
      v-model="editVisible"
      title="创建数据集"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="数据集名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <!--<el-form-item label="数据类型">
                    <el-select v-model="form.task_type" placeholder="">
                        <el-option key="1" label="图像分类" value="image classification"></el-option>
                        <el-option key="2" label="目标检测" value="object detection"></el-option>
                        <el-option key="3" label="图像分割" value="image segmentation"></el-option>
                        <el-option key="4" label="文本分类" value="text classification"></el-option>
                        <el-option key="5" label="命名实体识别" value="named entity recognition"></el-option>
                        <el-option key="6" label="文本实体关系抽取" value="relation extracion"></el-option>
                        <el-option key="7" label="视频分类" value="video classification"></el-option>
                        <el-option key="8" label="目标跟踪" value="object tracking"></el-option>
                        <el-option key="9" label="语音识别" value="speech recognitio"></el-option>
                        <el-option key="10" label="声音分类" value="audio classification"></el-option>
                        <el-option key="11" label="时序数据预测" value="time series data prediction"></el-option>
                    </el-select>
                </el-form-item>-->
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
            @click="addDatasets"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="ShareVisible"
      title="共享数据集"
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
            @click="shareDatasets"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="importVisible"
      title="导入数据集"
      width="50%"
    >
      <div style="text-align: center; margin-bottom: 10px">
        <el-select
          v-model="form.is_annotation"
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
          <!--<template #trigger size="small">
                        <el-button size="large" type="primary" style="">选取文件</el-button>
                    </template>-->
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
      v-model="nameVisible"
      title="编辑数据集名称"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="数据集名称">
          <el-input v-model="newName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="nameDatasets"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  fetchDatasetsInfo,
  postCreateDatasets,
  postUploadDatasets,
  postDatasetsEdit,
  postAutoAnnotation,
  getManualAnnotation,
} from "../api/index";
export default {
  name: "Datasets",
  setup() {
    let tableData = ref([]);
    //获取数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const getDatasetsInfo = () => {
      console.log("数据集管理初始化");
      console.log("ms_username = ", localStorage.getItem("ms_username"));
      fetchDatasetsInfo(task_type, {
        username: localStorage.getItem("ms_username"),
      }).then((res) => {
        console.log("res = ", res);
        let obj = res.data.datasetinfo;
        console.log(obj[0]);
        let length = obj.length;
        //console.log(JSON.parse(res.data.datasetinfo)[0].fields.name);
        let tt = {
          "image classification": "图像分类",
          "object detection": "目标检测",
          "object tracking": "目标跟踪",
          "image segmentation": "图像分割",
          "text classification": "文本分类",
          "video classification": "视频分类",
        };
        let as = {
          finished: "已完成标注",
          unfinished: "未完成标注",
          auto_annotating: "标注中",
        };
        tableData.value = reactive([]);
        for (let i = 0; i < length; i++) {
          tableData.value.push({
            id: i,
            name: obj[i].name,
            task_type: obj[i].task_type,
            size: obj[i].size,
            annotation_size: obj[i].annotation_size,
            annotation_status: [obj[i].annotation_status],
            share_status: obj[i].sharing_level,
            version: obj[i].version,
          });
        }
        console.log(length);
      });
    };

    getDatasetsInfo();
    //处理创建数据集的编辑框
    const editVisible = ref(false);
    const nameVisible = ref(false);
    let form = reactive({
      name: "",
      task_type: "",
      desc: "",
      is_annotation: "已标注",
      is_share: "组织间共享",
    });

    const createDatasets = () => {
      console.log("创建数据集"); //待填写
      editVisible.value = true;
    };
    const addDatasets = () => {
      if (form.name != "") {
        postCreateDatasets(
          task_type,
          qs.stringify({
            name: form.name,
            username: localStorage.getItem("ms_username"),
            description: form.desc,
          }),
        ).then((res) => {
          if (res.code == "200") {
            ElMessage.success(res.msg);
            getDatasetsInfo();
            editVisible.value = false;
          } else {
            ElMessage.error(res.msg);
          }
        });
        console.log("确认创建数据集"); //待填写
      } else {
        ElMessage.error("数据集名不能为空");
      }
    };

    // 删除操作
    const handleDelete = (index, row) => {
      console.log("删除");
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postDatasetsEdit(
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
              getDatasetsInfo();
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
      localIndex = index;
      // 二次确认删除
      ShareVisible.value = true;
    };

    //修改名称
    let newName = ref("");
    let localIndex = 0;
    const handleChangeName = (index, row) => {
      console.log("修改数据集名"); //待填写
      console.log(index); //待填写
      console.log(row); //待填写
      localIndex = index;
      nameVisible.value = true;
    };

    const nameDatasets = () => {
      console.log("确定修改数据集名"); //待填写
      if (newName.value != "") {
        postDatasetsEdit(
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
            getDatasetsInfo();
          } else {
            ElMessage.error(res.msg);
          }
        });
        nameVisible.value = false;
      } else {
        ElMessage.error("数据集名不能为空");
      }
    };

    // 共享
    let newShare = ref("");
    const shareDatasets = () => {
      console.log("确定共享数据集"); //待填写
      console.log(newShare); //待填写
      if (newShare.value != "") {
        postDatasetsEdit(
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
            getDatasetsInfo();
          } else {
            ElMessage.error(res.msg);
          }
        });
        ShareVisible.value = false;
      }
    };

    //文件上传部分

    let fileList = ref([]);
    let lastFile = ref();
    let importIndex = ref(0);
    const importVisible = ref(false);
    const handleImport = (index, row) => {
      console.log("导入数据集"); //待填写
      importIndex.value = index;
      console.log(tableData.value[importIndex].name);
      importVisible.value = true;
    };
    const uploadFiles = (opt) => {
      console.log("上传文件"); //待填写
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
      fd.append("name", tableData.value[importIndex].name);
      if (form.is_annotation == "已标注") fd.append("is_annotation_data", 1);
      else fd.append("is_annotation_data", 0);
      ElMessage.success("上传中，请稍等");
      postUploadDatasets(
        task_type,
        fd /*qs.stringify({username: localStorage.getItem('ms_username'),
                                                name: tableData.value[importIndex].name,
                                                file: fd,
                                                is_annotation_data: 1})*/,
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          getDatasetsInfo();
        } else {
          //console.log(res.code);
          ElMessage.error(res.msg);
        }
      });
    };
    let uploadPercent = ref(0);
    const uploadProcess = (event, file, filelist) => {
      console.log("uploadPercent");
      uploadPercent.value = file.percentage.toFixed(0);
      console.log(uploadPercent);
    };
    //标注
    const handleManualAnnotation = (index, row) => {
      console.log("手工标注");
      console.log(index); //待填写
      console.log(row); //待填写
      console.log(task_type);

      getManualAnnotation(task_type, {
        name: tableData.value[index].name,
        username: username,
        current_data_id: 0,
        next: 0,
        previous: 0,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          console.log("res.data.data_url", res.data.data_url);
          localStorage.setItem("current_data_id", res.data.current_data_id);
          localStorage.setItem(
            "current_datasets_name",
            tableData.value[index].name,
          );
          localStorage.setItem("current_label", res.data.label);
          localStorage.setItem("current_label_group", res.data.label_group);

          localStorage.setItem("auto_anno_tasktype", task_type);
          localStorage.setItem("auto_anno_name", tableData.value[index].name);
          localStorage.setItem("auto_anno_username", username);

          if (task_type == "图像分类") {
            localStorage.setItem("current_img_url", res.data.data_url);
            router.push("/ShowAnnotationImage");
          }
          if (task_type == "目标检测") {
            localStorage.setItem("current_img_url", res.data.data_url);
            router.push("/AnnotationForObjectDetection");
          }
          if (task_type == "目标跟踪") {
            localStorage.setItem(
              "current_img_url",
              JSON.stringify(res.data.data_url),
            );
            localStorage.setItem(
              "current_annotation",
              JSON.stringify(res.data.annotation),
            );
            localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
            router.push("/AnnotationForObjectTracking");
          }
          if (task_type == "图像分割") {
            console.log("-0-");
            localStorage.setItem(
              "current_img_url",
              JSON.stringify(res.data.data_url),
            );
            localStorage.setItem(
              "current_annotation",
              JSON.stringify(res.data.annotation),
            );
            localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
            router.push("/AnnotationForImageSegmentation");
          }
          if (task_type == "文本分类") {
            localStorage.setItem(
              "current_img_url",
              JSON.stringify(res.data.data_url),
            );
            localStorage.setItem(
              "current_annotation",
              JSON.stringify(res.data.annotation),
            );
            localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
            localStorage.setItem("text", JSON.stringify(res.data.text_data));
            router.push("/AnnotationForTextClassification");
          }
          if (task_type == "动作识别") {
            localStorage.setItem(
              "current_img_url",
              JSON.stringify(res.data.data_url),
            );
            localStorage.setItem(
              "current_annotation",
              JSON.stringify(res.data.annotation),
            );
            localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
            router.push("/AnnotationForActionRecognition");
          }
        } else {
          ElMessage.error(res.msg);
        }
      });

      //二次确认
      // ElMessageBox.confirm("确认进行手工标注吗？", "提示", {
      //     type: "warning",
      // })
      //     .then(() => {

      //     })
      //     .catch(() => {});
    };

    const handleAutoAnnotation = (index, row) => {
      console.log("自动标注");
      // 二次确认删除
      ElMessageBox.confirm("确认进行自动标注吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postAutoAnnotation(
            task_type,
            qs.stringify({
              name: tableData.value[index].name,
              username: username,
              cover_annotation: 1,
            }),
          ).then((res) => {
            console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              getDatasetsInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };

    const handleVersion = (index, row) => {
      localStorage.setItem("dataset_version", tableData.value[index].name);
      router.push("/datasets_version");
    };

    return {
      createDatasets,
      tableData,
      handleDelete,
      handleShare,
      handleImport,
      editVisible,
      form,
      addDatasets,
      uploadFiles,
      fileList,
      onUploadChange,
      importVisible,
      submitUpload,
      nameVisible,
      nameDatasets,
      shareDatasets,
      newShare,
      handleChangeName,
      newName,
      handleManualAnnotation,
      handleAutoAnnotation,
      uploadProcess,
      uploadPercent,
      ShareVisible,
      handleVersion,
    };
  },
};
</script>

<style scoped></style>
