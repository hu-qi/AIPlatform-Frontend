<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 数据集： {{ DatasetsName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        type="primary"
        @click="handleAutoAnnotation"
      >
        自动标注
      </el-button>
    </div>

    <div id="app">
      <div id="vs" />
    </div>

    <div align="center">
      <span>
        <el-button
          type="danger"
          @click="manualAnnotation"
        >标注</el-button>
        <el-select
          v-model="VideoData.labelGroup"
          style="margin-left: 10px"
          :placeholder="current_label_group"
          @change="selectLabelGroup"
        >
          <el-option
            v-for="item in labelGroupData"
            :key="item.name"
            :value="item.name"
          />
        </el-select>
        <el-select
          v-model="VideoData.annotation"
          style="margin-left: 10px"
          :placeholder="current_label"
        >
          <el-option
            v-for="item in labelData"
            :key="item.name"
            :value="item.name"
          />
        </el-select>
      </span>
    </div>
    <div
      align="center"
      style="margin-top: 10px"
    >
      <span>
        <el-button
          type="primary"
          @click="previousImg"
        >上一个</el-button>
        <el-button
          type="primary"
          @click="nextImg"
        >下一个</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted, onUpdated, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  getManualAnnotation,
  fetchLabelGroupInfo,
  postManualAnnotation,
  postAutoAnnotation,
} from "../api/index";
import Player from "xgplayer";
export default {
  name: "ShowAnnotationImage",
  setup() {
    let DatasetsName = localStorage.getItem("current_datasets_name");
    let task_type = localStorage.getItem("task_type");
    const current_label = ref(localStorage.getItem("current_label"));
    const current_label_group = ref(localStorage.getItem("current_label"));
    const VideoData = reactive({
      current_data_id: localStorage.getItem("current_data_id"),
      labelGroup: "",
      annotation: "",
      text_data: localStorage.getItem("text"),
      label: "",
    });

    onMounted(() => {
      previousImg();
    });

    let username = localStorage.getItem("ms_username");
    const router = useRouter();
    onUnmounted(() => {
      console.log("unmounted!");
      localStorage.removeItem("current_datasets_name");
      localStorage.removeItem("current_img_url");
      localStorage.removeItem("current_data_id");
      localStorage.removeItem("current_label");
      localStorage.removeItem("current_label_group");
      console.log(localStorage.getItem("labelGroupName"));
    });
    /*onUpdated(() => {
                console.log("updated");
            })*/

    onMounted(() => {});

    //
    const handleAutoAnnotation = (index, row) => {
      console.log("自动标注");
      // 二次确认删除
      ElMessageBox.confirm("确认进行自动标注吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postAutoAnnotation(
            localStorage.getItem("auto_anno_tasktype"),
            qs.stringify({
              name: localStorage.getItem("auto_anno_name"),
              username: localStorage.getItem("auto_anno_username"),
              cover_annotation: 1,
            }),
          ).then((res) => {
            console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              //getDatasetsInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };
    //

    const labelGroupData = ref([{}]);
    let labelData = ref([{}]);
    const getlabelGroupInfo = () => {
      console.log("标签组信息");
      //console.log(localStorage.getItem('ms_username'));
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        console.log(obj);
        let length = obj.length;
        for (let i = 0; i < length; i++) {
          labelGroupData.value.push({
            id: i,
            name: obj[i].fields.name,
          });
        }
      });
    };
    getlabelGroupInfo();

    const previousImg = () => {
      console.log("上一个");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: VideoData.current_data_id,
        next: 0,
        previous: 1,
      }).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          VideoData.imgURL = res.data.data_url;
          VideoData.current_data_id = res.data.current_data_id;
          VideoData.text_data = res.data.text_data;
          VideoData.label = res.data.label;
          VideoData.annotation = res.data.label;
          VideoData.labelGroup = res.data.label_group;
          console.log("此时id = ", VideoData.current_data_id);
          console.log(VideoData.imgURL);
        } else {
          ElMessage.error(res.msg);
        }
      });
      setTimeout(function () {
        let player = new Player({
          id: "vs",
          url: VideoData.imgURL,
        });
        console.log("video url= ", VideoData.imgURL);
        console.log("--------------------------");
      }, 1000);
    };
    const nextImg = () => {
      console.log("下一个");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: VideoData.current_data_id,
        next: 1,
        previous: 0,
      }).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          VideoData.imgURL = res.data.data_url;
          VideoData.current_data_id = res.data.current_data_id;
          current_label_group.value = res.data.label_group;
          current_label.value = res.data.label;
          VideoData.text_data = res.data.text_data;
          VideoData.label = res.data.label;
          VideoData.annotation = res.data.label;
          VideoData.labelGroup = res.data.label_group;
          console.log("此时id = ", VideoData.current_data_id);
          console.log(VideoData.imgURL);
        } else {
          ElMessage.error(res.msg);
        }
      });

      setTimeout(function () {
        let player = new Player({
          id: "vs",
          url: VideoData.imgURL,
        });
        console.log("video url= ", VideoData.imgURL);
        console.log("--------------------------");
      }, 1000);
    };

    const selectLabelGroup = () => {
      console.log("选中了标签组");
      //const temp = ref([{}]);
      labelData.value = [];
      VideoData.annotation = "";
      console.log(labelData.value);
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        let obj1 = JSON.parse(res.data.labels[VideoData.labelGroup]);
        //console.log(obj1);
        let length = obj1.length;
        for (let i = 0; i < length; i++) {
          labelData.value.push({
            id: i,
            name: obj1[i].fields.name,
          });
        }
      });
    };

    const manualAnnotation = () => {
      console.log("标注");
      //console.log(labelData);
      console.log(VideoData.current_data_id);
      console.log(VideoData.annotation);
      postManualAnnotation(
        task_type,
        qs.stringify({
          name: DatasetsName,
          username: username,
          current_data_id: VideoData.current_data_id,
          label: VideoData.annotation,
        }),
      ).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    return {
      fits: "scale-down" /*['fill', 'contain', 'cover', 'none', 'scale-down']*/,
      DatasetsName,
      previousImg,
      nextImg,
      VideoData,
      labelGroupData,
      username,
      manualAnnotation,
      selectLabelGroup,
      labelData,
      current_label,
      current_label_group,

      handleAutoAnnotation,
    };
  },
};
</script>

<style scoped></style>
