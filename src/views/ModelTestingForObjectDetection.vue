<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 模型： {{ ModelName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--<div class="demo-image__preview" align="center">
            <el-image id="mImg" style="width: 500px; height: 300px" :src="imageUrl" :fit="fits" :lazy='true'></el-image>
        </div>-->

    <!--<span class="dialog-footer">-->
    <el-button
      class="crop-demo-btn"
      type="primary"
    >
      选择图片
      <input
        class="crop-input"
        type="file"
        name="image"
        accept="image/*"
        @change="setImage"
      >
    </el-button>

    <el-button
      type="primary"
      @click="testModel"
    >
      测试
    </el-button>
    <el-button
      type="primary"
      @click="showResult"
    >
      展示结果
    </el-button>
    <!--<el-form label-width="100px">
                <el-form-item label="预测分数">
                    <el-input style="width: 200px" placeholder="" v-model="score" :disabled="true"></el-input>
                </el-form-item>
            </el-form>-->
    <!--</span>-->
    <div
      class="container"
      align="center"
    >
      <canvas
        id="myCanvas"
        :width="canvas_size.width"
        :height="canvas_size.height"
        style="background: #0a0a0a"
      />
      <!--<el-card class="box-card" >
                <template #header>
                    <div class="card-header">
                        <span>标注信息</span>
                    </div>
                </template>
                <div v-for="o in rect.length" :key="o" class="text item">
                    <el-color-picker v-model=colors[o-1] show-alpha></el-color-picker>
                    {{rect[o - 1]["annotation"]}}
                </div>
            </el-card>-->
    </div>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import { postModelTest } from "../api/index";
import { postModelTestResult } from "../api/Task_api";
// import Schart from "vue-schart";
import * as echarts from "echarts";
export default {
  name: "ModelTestingForObjectionDetection",
  components: {
    // Schart,
  },
  setup() {
    const colors = ref([
      "rgba(255,26,43,0.8)",
      "rgba(255,26,43,0.21)",
      "rgba(255,121,10,0.8)",
      "rgba(12,217,0,0.8)",
      "rgba(49,23,255,0.8)",
      "rgba(252,255,25,0.8)",
      "rgba(199,42,46,0.8)",
      "rgba(206,47,146,0.8)",
      "rgba(206,99,0,0.8)",
      "rgba(85,202,206,0.8)",
    ]);
    let ModelName = localStorage.getItem("model_name");
    let task_type = localStorage.getItem("task_type");
    let task_id = null;
    const imageUrl = ref();
    const scale = ref(1);
    const predUrl = ref();
    const score = ref(0);
    const rect = ref([]);
    const canvas_size = ref({
      width: 600,
      height: 400,
    });
    const canvasKey = ref(0);
    const handleChange = (file, FL) => {
      imageUrl.value = URL.createObjectURL(file.raw);
    };
    const RandomRGB = () => {
      let r = Math.floor(Math.random() * 256).toString();
      let g = Math.floor(Math.random() * 256).toString();
      let b = Math.floor(Math.random() * 256).toString();
      let alpha = (0.8).toString();
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      return "rgba(${r},${g},${b},${alpha})";
    };
    const imgSrc = ref("");
    let mFile = ref("");
    const setImage = (e) => {
      console.log(e);
      const file = e.target.files[0];
      mFile.value = file;
      imageUrl.value = URL.createObjectURL(file);
      let img = new Image();
      img.src = imageUrl.value;
      img.onload = () => {
        scale.value = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale.value;
        rect.value = reactive([]);
        drawCanvas(img);
      };
    };
    const getRect = (res) => {
      rect.value = reactive([]);
      let obj = res.data.result;
      let len = res.data.result.boxes.length;
      for (let i = 0; i < len; i++) {
        rect.value.push({
          sx: obj.boxes[i][0] / scale.value,
          sy: obj.boxes[i][1] / scale.value,
          w: obj.boxes[i][2] / scale.value,
          h: obj.boxes[i][3] / scale.value,
          annotation: obj.labels[i],
          color: RandomRGB(),
        });
      }
      console.log(rect);
    };
    const testModel = () => {
      console.log("测试");
      let fd = new FormData();
      fd.append("file", mFile);
      fd.append("username", localStorage.getItem("ms_username"));
      fd.append("model_name", ModelName);
      ElMessageBox.confirm("确认进行测试吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postModelTest(task_type, fd).then((res) => {
            console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              task_id = res.data;
            } else {
              ElMessage.error(res.msg);
            }
            // getRect(res);
            // showResult();
          });
        })
        .catch(() => {});
    };
    const drawCanvas = (img) => {
      /*img.onload = function () {*/
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log("画图中", canvas.width, canvas.height);
      console.log(img);
      let len = rect.value.length;
      ctx.lineWidth = 2;
      for (let i = 0; i < len; i++) {
        ctx.font = '15px "微软雅黑"';
        ctx.fillStyle = rect.value[i].color;
        ctx.textBaseline = "bottom";
        console.log(
          rect.value[i].annotation,
          rect.value[i].sx,
          rect.value[i].sy,
        );
        ctx.fillText(
          rect.value[i].annotation,
          rect.value[i].sx,
          rect.value[i].sy,
        );
        ctx.strokeStyle = rect.value[i].color;
        ctx.strokeRect(
          rect.value[i].sx,
          rect.value[i].sy,
          rect.value[i].w,
          rect.value[i].h,
        );
        /*}*/
      }
    };
    const showResult = () => {
      console.log("hererer");
      let rq = new FormData();
      rq.append("username", localStorage.getItem("ms_username"));
      rq.append("task_id", task_id);
      console.log(rq);
      postModelTestResult(task_type, rq).then((res) => {
        console.log(res);
        if (res.data) {
          getRect(res);
          let img = new Image();
          img.src = imageUrl.value;
          drawCanvas(img);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    return {
      ModelName,
      handleChange,
      imageUrl,
      fits: "scale-down",
      setImage,
      testModel,
      score,
      predUrl,
      canvas_size,
      canvasKey,
      showResult,
      rect,
      colors,
    };
  },
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}
.info-image img {
  width: 100%;
  height: 100%;
}
.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.schart-box {
  display: inline-block;
  margin: 20px;
}
.schart {
  width: 600px;
  height: 400px;
}
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
#myCanvas {
  background-color: #efe3ff;
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
.crop-demo-btn {
  position: relative;
}
</style>
