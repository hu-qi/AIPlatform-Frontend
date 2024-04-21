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
          prop="name"
          label="数据集名称"
          align="centser"
        />
        <el-table-column
          prop="task_type"
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
              @click="createDatasets(scope.$index, scope.row)"
            >
              选择数据集
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
        is_public: 1,
      }).then((res) => {
        console.log(res);
        console.log(typeof res.data.datasetinfo);
        // let obj = JSON.parse(res.data.datasetinfo);
        let length = res.data.datasetinfo.length;
        console.log(length);
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
            name: res.data.datasetinfo[i].name,
            task_type: res.data.datasetinfo[i].task_type,
            size: res.data.datasetinfo[i].size,
            owngroup: res.data.datasetinfo[i].owner,
            owner: res.data.datasetinfo[i].creator,
            share_status: res.data.datasetinfo[i].sharing_level,
          });
        }
        console.log(length);
      });
    };

    getDatasetsInfo();
    //处理创建数据集的编辑框
    const nameVisible = ref(false);
    let form = reactive({
      name: "",
      task_type: "",
      desc: "",
      is_annotation: "已标注",
      is_share: "组织间共享",
    });

    const ShareVisible = ref(false);
    const handleShare = (index, row) => {
      console.log("共享");
      // 二次确认删除
      ShareVisible.value = true;
    };

    // 创建数据集

    const editVisible = ref(false);
    let localIndex;
    const createDatasets = (index, row) => {
      console.log("创建数据集"); //待填写
      localIndex = index;
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
            public_dataset_name: tableData.value[localIndex].name,
            public_dataset_owner: tableData.value[localIndex].owner,
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

    return {
      tableData,
      editVisible,
      form,
      ShareVisible,

      createDatasets,
      addDatasets,
      localIndex,
    };
  },
};
</script>

<style scoped></style>
