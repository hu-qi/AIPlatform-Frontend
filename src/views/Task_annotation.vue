<template>
  <div>
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
          prop="annotation_size"
          label="已标注样本数量/样本数量"
          align="center"
        />
        <el-table-column
          prop="annotation_status"
          label="标注任务状态"
          align="center"
        />
        <el-table-column
          prop="cover_annotation"
          label="是否覆盖之前的标注"
          align="center"
        />

        <el-table-column
          label="标注操作"
          align="center"
        >
          <template #default="scope">
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
import {
  getDatasetAnnotationInfo,
  postDatasetAnnotationInfo,
} from "../api/Task_api";
export default {
  name: "Datasets",
  setup() {
    let tableData = ref([]);
    let sizeData = [];
    let datanames = [];
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
        let obj = res.data.datasetinfo;
        let length = obj.length;
        console.log("old res", res);
        sizeData.value = reactive([]);
        for (let i = 0; i < length; i++) {
          datanames[i] = obj[i].name;
          sizeData[i] = obj[i].annotation_size + "/" + obj[i].size;
        }
      });
      getDatasetAnnotationInfo(task_type, { username: username }).then(
        (res) => {
          console.log("res = ", res);
          let obj = res.data.datasetinfo;
          let length = obj.length;
          let status = ["已提交", "标注中", "已完成", "异常"];

          tableData.value = reactive([]);
          var size = "";
          var cover = "";
          for (var i = 0; i < length; i++) {
            for (var j = 0; j < datanames.length; j++) {
              if (obj[i].dataset == datanames[j]) {
                size = sizeData[j];
                break;
              }
            }
            if (obj[i].cover_annotation) {
              cover = "是";
            } else {
              cover = "否";
            }
            tableData.value.push({
              id: obj[i].id,
              name: obj[i].dataset,
              task_type: obj[i].task_type,
              annotation_size: size,
              cover_annotation: cover,
              annotation_status: status[obj[i].status],
            });
          }
        },
      );
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
      ElMessageBox.confirm("确定要删除该标注任务吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postDatasetAnnotationInfo(
            task_type,
            qs.stringify({
              task_id: tableData.value[index].id,
              username: username,
              delete: 1,
            }),
          ).then((res) => {
            //console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              // getTableInfo();
              window.location.reload();
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
