<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 目标检测数据集：
          {{ DatasetsName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button
        type="primary"
        @click="handleAutoAnnotation"
      >
        自动标注
      </el-button>
    </div>
    <div
      class="container"
      align="center"
    >
      <!--<img :src="imgURL"  v-show="false"/>-->
      <div style="height: 420px">
        <canvas
          v-if="show_canvas"
          id="myCanvas"
          :width="canvas_size.width"
          :height="canvas_size.height"
          style="background: rgba(255, 255, 255, 0)"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        />
      </div>
      <!--<div>
            &lt;!&ndash;<el-card class="box-card" >
                <template #header>
                    <div class="card-header">
                        <span>标注信息</span>
                    </div>
                </template>
                <div v-for="o in rect.length" :key="o" class="text item">
                    <el-color-picker v-model=colors[o-1] show-alpha></el-color-picker>
                    {{rect[o - 1]["annotation"]}}
                </div>
                <div v-for="o in new_rect.length" :key="o" class="text item">
                    <el-color-picker v-model=colors[o+rect.length-1] show-alpha></el-color-picker>
                    {{new_rect[o - 1]["annotation"]}}
                </div>
            </el-card>&ndash;&gt;
            </div>-->
    </div>
    <div
      class="container"
      align="center"
    >
      <span>
        <el-button
          type="danger"
          @click="addAnnotation"
        >添加标注</el-button>
        <el-select
          v-model="imgData.labelGroup"
          style="margin-left: 10px"
          :placeholder="current_label"
          @change="selectLabelGroup"
        >
          <el-option
            v-for="item in labelGroupData"
            :key="item.id"
            :value="item.name"
          />
        </el-select>
        <el-select
          v-model="imgData.annotation"
          style="margin-left: 10px"
          :placeholder="current_label_group"
        >
          <el-option
            v-for="item in labelData"
            :key="item.id"
            :value="item.name"
          />
        </el-select>
      </span>
    </div>
    <div
      class="container"
      align="center"
      style="border-width: 0px"
    >
      <span>
        <el-button
          type="primary"
          @click="previousImg"
        >上一张</el-button>
        <el-button
          type="primary"
          @click="nextImg"
        >下一张</el-button>
        <!--<el-button type="primary" @click="updateCanvas">刷新画布</el-button>-->
        <el-button
          type="primary"
          @click="manualAnnotation"
        >完成标注</el-button>
      </span>
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onUnmounted,
  onUpdated,
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  getManualAnnotation,
  fetchLabelGroupInfo,
  postManualAnnotation,
  postAutoAnnotation,
} from "../api/index";
export default {
  name: "AnnotationForObjectDetection",
  setup() {
    let show_canvas = ref(false);
    let DatasetsName = localStorage.getItem("current_datasets_name");
    let task_type = localStorage.getItem("task_type");
    const current_label = ref(localStorage.getItem("current_label"));
    const current_label_group = ref(localStorage.getItem("current_label"));
    const canvas_size = ref({
      width: 300,
      height: 400,
    });
    const state = ref({
      flag: false,
      img_flag: false,
      x: 50,
      y: 50,
    });
    const rect = ref([]);
    const new_rect = ref([]);
    const imgData = reactive({
      imgURL: localStorage.getItem("current_img_url"),
      current_data_id: localStorage.getItem("current_data_id"),
      labelGroup: "",
      annotation: "",
      color: "",
    });
    //调整canvas大小, 获取框的信息
    const handleImageAndRect = (res) => {
      show_canvas.value = false;
      let img = new Image();
      img.src = imgData.imgURL;
      img.onload = function () {
        let scale = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale;
        rect.value = reactive([]);
        new_rect.value = reactive([]);
        let len = res.data.annotation.length;
        let obj = res.data.annotation;
        console.log(obj);
        for (let i = 0; i < len; i++) {
          rect.value.push({
            sx: obj[i].bbox[0] / scale,
            sy: obj[i].bbox[1] / scale,
            w: obj[i].bbox[2] / scale,
            h: obj[i].bbox[3] / scale,
            annotation: obj[i].category_name,
            color: RandomRGB(),
          });
        }
        show_canvas.value = true;
        setTimeout(createCanvas, 1000);
      };
    };
    const RandomRGB = () => {
      let r = Math.floor(Math.random() * 256).toString();
      let g = Math.floor(Math.random() * 256).toString();
      let b = Math.floor(Math.random() * 256).toString();
      let alpha = (0.8).toString();
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      return "rgba(${r},${g},${b},${alpha})";
    };

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

    let username = localStorage.getItem("ms_username");
    const router = useRouter();
    onUnmounted(() => {
      console.log("unmounted!");
      localStorage.removeItem("current_datasets_name");
      localStorage.removeItem("current_img_url");
      localStorage.removeItem("current_data_id");
      localStorage.removeItem("current_label");
      localStorage.removeItem("current_label_group");
      localStorage.removeItem("res");
      console.log(localStorage.getItem("labelGroupName"));
    });
    const labelGroupData = ref([{}]);
    let labelData = ref([{}]);
    const getlabelGroupInfo = () => {
      console.log("标签组信息");
      //console.log(localStorage.getItem('ms_username'));
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        //console.log(obj);
        let length = obj.length;
        for (var i = 0; i < length; i++) {
          labelGroupData.value.push({
            id: i,
            name: obj[i].fields.name,
          });
        }
      });
    };
    getlabelGroupInfo();

    const previousImg = () => {
      console.log("上一张");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: imgData.current_data_id,
        next: 0,
        previous: 1,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          imgData.imgURL = res.data.data_url;
          imgData.current_data_id = res.data.current_data_id;
          handleImageAndRect(res);
          console.log("查询成功");
          /*setTimeout(createCanvas, 2000);*/
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const nextImg = () => {
      console.log("下一张");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: imgData.current_data_id,
        next: 1,
        previous: 0,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          imgData.imgURL = res.data.data_url;
          imgData.current_data_id = res.data.current_data_id;
          current_label_group.value = res.data.label_group;
          current_label.value = res.data.label;
          handleImageAndRect(res);
          /*setTimeout(createCanvas, 2000);*/
          /*createCanvas();*/
        } else {
          ElMessage.error(res.msg);
        }
      });
    };

    const selectLabelGroup = () => {
      console.log("选中了标签组");
      //const temp = ref([{}]);
      labelData.value = [];
      imgData.annotation = "";
      //console.log(labelData.value);
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        let obj1 = JSON.parse(res.data.labels[imgData.labelGroup]);
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
      console.log("完成标注");
      //console.log(labelData);
      //console.log( imgData.current_data_id);
      //console.log(imgData.annotation);
      let rect_data = [];
      let len = new_rect.value.length;
      let img = new Image();
      img.src = imgData.imgURL;
      let scale = img.height / canvas_size.value.height;
      for (let i = 0; i < len; i++) {
        rect_data.push({
          category_name: new_rect.value[i].annotation,
          bbox: [
            Math.round(new_rect.value[i].sx * scale),
            Math.round(new_rect.value[i].sy * scale),
            Math.round(new_rect.value[i].w * scale),
            Math.round(new_rect.value[i].h * scale),
          ],
        });
      }
      console.log(rect_data);
      postManualAnnotation(
        task_type,
        qs.stringify({
          name: DatasetsName,
          username: username,
          current_data_id: imgData.current_data_id,
          label: JSON.stringify(rect_data),
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
    const addAnnotation = () => {
      console.log("添加标注");
      let len = new_rect.value.length;
      if (len > 0) {
        new_rect.value[len - 1].annotation = imgData.annotation;
        const canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.fillStyle = new_rect.value[len - 1].color;
        ctx.textBaseline = "bottom";
        ctx.fillText(
          new_rect.value[len - 1].annotation,
          new_rect.value[len - 1].sx,
          new_rect.value[len - 1].sy,
        );
      }
    };
    const mousedown = (e) => {
      console.log("mouse down @@@@@@@@@@@@@@@@@@@@@@@@");
      state.value.x = e.offsetX;
      state.value.y = e.offsetY;
      state.value.flag = true;
      new_rect.value.push({
        sx: e.offsetX,
        sy: e.offsetY,
        w: 0,
        h: 0,
        annotation: "",
        color: RandomRGB(),
      });
    };
    const mouseup = (e) => {
      console.log("mouse up @@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      state.value.flag = false;
      let len = new_rect.value.length;
      new_rect.value[len - 1].w = e.offsetX - new_rect.value[len - 1].sx;
      new_rect.value[len - 1].h = e.offsetY - new_rect.value[len - 1].sy;
      //console.log(new_rect.value[len - 1]);
    };
    const mousemove = (e) => {
      //console.log("mouse move");
      drawRect(e);
    };
    const drawOriginalRect = () => {
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      //ctx.strokeStyle = '#ff2e1d';
      ctx.lineWidth = 2;
      let x = state.value.x,
        y = state.value.y;
      for (let i = 0; i < rect.value.length; i++) {
        ctx.strokeStyle = rect.value[i].color;
        ctx.strokeRect(
          rect.value[i].sx,
          rect.value[i].sy,
          rect.value[i].w,
          rect.value[i].h,
        );
        ctx.font = '15px "微软雅黑"';
        ctx.fillStyle = rect.value[i].color;
        ctx.textBaseline = "bottom";
        ctx.fillText(
          rect.value[i].annotation,
          rect.value[i].sx,
          rect.value[i].sy,
        );
      }
    };
    const drawRect = (e) => {
      //console.log("drawRect");
      if (state.value.flag == true) {
        const canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        //console.log(ctx);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawOriginalRect();
        ctx.beginPath();
        //ctx.strokeStyle = '#ff2e1d';
        ctx.lineWidth = 2;
        let x = state.value.x,
          y = state.value.y;
        createCanvas();
        for (let i = 0; i < new_rect.value.length - 1; i++) {
          ctx.strokeStyle = new_rect.value[i].color;
          ctx.strokeRect(
            new_rect.value[i].sx,
            new_rect.value[i].sy,
            new_rect.value[i].w,
            new_rect.value[i].h,
          );
          ctx.font = '15px "微软雅黑"';
          ctx.fillStyle = new_rect.value[i].color;
          ctx.textBaseline = "bottom";
          ctx.fillText(
            new_rect.value[i].annotation,
            new_rect.value[i].sx,
            new_rect.value[i].sy,
          );
        }
        ctx.strokeStyle = new_rect.value[new_rect.value.length - 1].color;
        ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y);
      }
    };
    const createCanvas = () => {
      console.log("createCanvas");
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //console.log(ctx);
      let img = new Image();
      img.src = imgData.imgURL;

      if (state.value.flag == true) {
        ctx.drawImage(
          img,
          0,
          0,
          canvas_size.value.width,
          canvas_size.value.height,
        );
        drawOriginalRect();
      } else {
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            canvas_size.value.width,
            canvas_size.value.height,
          );
          drawOriginalRect();
        };
      }
    };
    onBeforeMount(() => {});
    onMounted(() => {
      console.log("onMounted");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: imgData.current_data_id,
        next: 0,
        previous: 0,
      }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          handleImageAndRect(res);
          /*setTimeout(createCanvas, 2000);*/
          createCanvas();
        } else {
          ElMessage.error(res.msg);
        }
      });
    });
    onBeforeUpdate(() => {
      //createCanvas();
    });
    return {
      fits: "scale-down" /*['fill', 'contain', 'cover', 'none', 'scale-down']*/,
      DatasetsName,
      previousImg,
      nextImg,
      imgData,
      labelGroupData,
      username,
      manualAnnotation,
      selectLabelGroup,
      labelData,
      current_label,
      current_label_group,
      mousedown,
      mouseup,
      mousemove,
      addAnnotation,
      canvas_size,
      rect,
      new_rect,
      show_canvas,
      handleAutoAnnotation,
    };
  },
};
</script>

<style scoped>
#myCanvas {
  background-color: #c7d8d9;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  position: absolute;
  width: 300px;
  right: 10px;
  top: 30px;
}
</style>
