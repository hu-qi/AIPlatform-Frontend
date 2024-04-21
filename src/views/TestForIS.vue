<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 模型： {{ ModelName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div
      id="canvasContainer"
      class="container"
      style="height: 420px"
    >
      <div id="outCanvas">
        <canvas
          id="myCanvas"
          :width="canvas_size.width"
          :height="canvas_size.height"
          style="z-index: 0"
          class="myCanvas"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        />
        <canvas
          v-if="show_canvas_1"
          id="myCanvas_1"
          :width="canvas_size.width"
          :height="canvas_size.height"
          style="z-index: 90"
          class="myCanvas"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted, onUpdated, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import { postModelTest } from "../api/index";
import { postModelTestResult } from "../api/Task_api";
// import Schart from "vue-schart";
import * as echarts from "echarts";
export default {
  name: "ModelTestingForImageSegmentation",
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
    let show_canvas_1 = ref(false);
    let show_canvas = ref(true);
    const imgData = reactive({
      maskURL: localStorage.getItem("current_mask_url"),
      imgURL: localStorage.getItem("current_img_url"),
    });
    let ModelName = localStorage.getItem("model_name");
    let task_type = localStorage.getItem("task_type");
    let task_id = localStorage.getItem("task_test_id");
    let file_url = localStorage.getItem("file_url");

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
    const RandomRGB = () => {
      let r = Math.floor(Math.random() * 256).toString();
      let g = Math.floor(Math.random() * 256).toString();
      let b = Math.floor(Math.random() * 256).toString();
      let alpha = (0.8).toString();
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      return "rgba(${r},${g},${b},${alpha})";
    };

    const setImage = (e) => {
      console.log(e);

      imageUrl.value = file_url;
      let img = new Image();
      imgData.imgURL = imageUrl.value;
      img.src = imageUrl.value;
      console.log("img.src in setImage", img.src);
      img.onload = () => {
        scale.value = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale.value;
        rect.value = reactive([]);
        console.log("图片已加载");
        setTimeout(() => {
          drawCanvas(img);
        }, 1000);
      };
    };

    //调整canvas大小, 获取框的信息
    const handleImageAndRect = (res) => {
      show_canvas.value = false;
      let img = new Image();
      img.src = imgData.imgURL;
      console.log("di", img.src);
      img.onload = function () {
        let scale = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale;
        show_canvas.value = true;
        setTimeout(createCanvas, 1000);
      };
    };

    //画原图
    const createCanvas = () => {
      canvasCenter();
      console.log("createCanvas");
      const canvas = document.getElementById("myCanvas");
      console.log("di,canvas", canvas);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //console.log(ctx);
      let img = new Image();
      img.src = imgData.imgURL;
      console.log("di,createCanvas", img.src);
      ctx.drawImage(
        img,
        0,
        0,
        canvas_size.value.width,
        canvas_size.value.height,
      );
    };

    //画掩码
    const createMask = () => {
      canvasCenter();
      console.log("createMask");
      const canvas = document.getElementById("myCanvas_1");
      console.log("di,mask", canvas);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      //console.log(ctx);
      let img = new Image();
      img.src = imgData.maskURL;
      // img.setAttribute("crossOrigin",'Anonymous')
      console.log("di,createMask", img.src);
      ctx.drawImage(
        img,
        0,
        0,
        canvas_size.value.width,
        canvas_size.value.height,
      );
    };
    // 画掩码
    const handleDrawMask = (res) => {
      show_canvas_1.value = false;
      let img = new Image();
      console.log("res didididi", res.data.result.colored_label_url);
      img.src = res.data.result.colored_label_url;
      img.onload = function () {
        let scale = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale;
        rect.value = reactive([]);
        // new_rect.value = reactive([]);
        show_canvas_1.value = true;
        setTimeout(createMask, 1000);
      };
    };

    //图片居中
    const canvasCenter = () => {
      let container = document.getElementById("canvasContainer");
      let canvas = document.getElementById("outCanvas");
      canvas.style.marginLeft =
        ((container.offsetWidth - canvas_size.value.width) / 2).toString() +
        "px";
    };

    const drawCanvas = (img) => {
      /*img.onload = function () {*/
      canvasCenter();
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      console.log("画图中", canvas.width, canvas.height);
      console.log(img, img.width, img.height);
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
      imageUrl.value = file_url;
      let img = new Image();
      imgData.imgURL = imageUrl.value;
      img.src = imageUrl.value;
      img.onload = () => {
        scale.value = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale.value;
        rect.value = reactive([]);
        console.log("图片已加载");
        setTimeout(() => {
          drawCanvas(img);
        }, 1000);
      };
      let rq = new FormData();
      rq.append("username", localStorage.getItem("ms_username"));
      rq.append("task_id", task_id);
      console.log(rq);
      postModelTestResult(task_type, rq).then((res) => {
        console.log(res);
        if (res.data) {
          imgData.maskURL = res.data.result.colored_label_url;
          handleDrawMask(res);
          let img = new Image();
          img.src = imageUrl.value;
          drawCanvas(img);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    onMounted(() => {
      canvasCenter();
      showResult();
    });
    return {
      ModelName,
      imageUrl,
      fits: "scale-down",
      setImage,
      score,
      predUrl,
      canvas_size,
      canvasKey,
      showResult,
      rect,
      colors,
      createCanvas,
      createMask,
      imgData,
      handleDrawMask,
      show_canvas_1,
      handleImageAndRect,
      canvasCenter,
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
.myCanvas {
  position: absolute;
  /* background-color: #0a0a0a; */
}
</style>
