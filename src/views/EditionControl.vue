<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 公共数据集管理
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
          prop="version"
          label="版本"
          align="centser"
        />
        <el-table-column
          prop="commit"
          label="commit"
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
              @click="handleSelect(scope.$index, scope.row)"
            >
              选择
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
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
      console.log(localStorage.getItem("ms_username"));
      fetchDatasetsInfo(task_type, {
        username: localStorage.getItem("ms_username"),
      }).then((res) => {
        console.log(res);
        console.log(typeof res.data.datasetinfo);
        let obj = JSON.parse(res.data.datasetinfo);
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

        tableData.value = reactive([]);
        for (let i = 0; i < length; i++) {
          tableData.value.push({
            id: i,
            version: "error:未写入接口！",
            commit: "error:未写入接口！",
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

    const SelectVisible = ref(false);
    const handleSelect = (index, row) => {
      console.log("选择");
      // 二次确认删除
      SelectVisible.value = true;
    };

    const DeleteVisible = ref(false);
    const handleDelete = (index, row) => {
      console.log("删除");
      // 二次确认删除
      DeleteVisible.value = true;
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      });
    };

    return {
      tableData,
      editVisible,
      form,
      SelectVisible,
      handleSelect,
      DeleteVisible,
      handleDelete,
    };
  },
};
</script>

<style scoped></style>
