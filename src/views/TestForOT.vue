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
      class="container"
      align="center"
    >
      <!-- <div>
                <canvas id="myCanvas" :width=canvas_size.width :height=canvas_size.height style="background: #080b0b"></canvas>
            </div> -->
      <!-- <el-button class="crop-demo-btn" type="primary">
                <input class="crop-input" type="file" name="vedio" accept=".zip, .mp4" @change="SetVideo"/>
            </el-button> -->
      <!-- <el-button @click="Display(0)">播放</el-button>
            <el-button @click="Display(1)">暂停</el-button> -->
      <!-- <el-button type="primary" @click="TestModel">测试</el-button> -->
      <!-- <el-button type="primary" @click="showResult">查看结果</el-button> -->

      <videoPlay
        ref="aplayVideo"
        v-bind="videoData"
        @play="onPlay"
      />

      <!-- <div>
                <video ref="videoPlayer" controls autoplay>
                <source :src="videoUrl" type="video/mp4">
                </video>
            </div> -->
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
  postModelTest,
} from "../api/index";
import { postModelTestResult } from "../api/Task_api";

// 视频组件
import "vue3-video-play/dist/style.css";
import { videoPlay } from "vue-video-play";

export default {
  name: "TestingForObjectTracking",
  components: {
    // 注册成为子组件
    videoPlay,
  },
  setup() {
    let videoData = reactive({
      width: "70%", //播放器高度
      height: "70%", //播放器高度
      color: "#409eff", //主题色
      title: "测试结果", //视频名称
      webFullScreen: false, //网页全屏
      speed: true, //是否支持快进快退
      currentTime: 0, //跳转到固定播放时间(s)
      muted: false, //静音
      autoPlay: true, //自动播放
      loop: false, //循环播放
      mirror: false, //镜像画面
      control: true, //是否显示控制器
      ligthOff: false, //关灯模式
      volume: 0.3, //默认音量0-1
      // src: '/home/jingkun/AIPlatform/AIPlatform/backend/track_ffpmeg/code_1.mp4',
      // src: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4', //视频源
      src: "https://shanhu.hpccube.com:50331/dataset/user_data/root/root/tmp_preds/20230717220103/code_1.mp4",
      poster: "", //封面
      speedRate: [1.0, 1.25, 1.5, 2.0], // 可选的播放速度
      controlBtns: [
        "audioTrack", //音轨切换按钮
        "quality", //视频质量切换按钮
        "speedRate", //速率切换按钮
        "volume", //音量
        "setting", //设置
        "pip", //画中画按钮
        "pageFullScreen", //网页全屏按钮
        "fullScreen", //全屏按钮
      ], //显示所有按钮,
    });

    let task_type = localStorage.getItem("task_type");
    let ModelName = localStorage.getItem("model_name");
    let task_id = localStorage.getItem("task_test_id");
    const canvas_size = ref({
      width: 600,
      height: 400,
    });
    let mFile = ref("");
    let cur_res = reactive("");
    let imgData = reactive({
      imgURL: "",
      labelGroup: "",
      annotation: "",
      images: [],
      preload: false,
      cur_draw: 0,
      img_width: 100,
      img_height: 100,
      bbox: [],
      category_name: [],
      scale: 1,
      colors: {},
      display: false,
      chosen_annotation: "",
      frame_num: 0,
      obj_ids: [], //JSON.parse(localStorage.getItem('obj_ids')),
      ids: [],
      max_obj_id: 0,
      cur_frame: 1,
    });
    const InitImgData = () => {
      imgData = {
        imgURL: cur_res.data.data_url,
        current_data_id: 0,
        labelGroup: "",
        images: {},
        preload: false,
        cur_draw: 0,
        img_width: 100,
        img_height: 100,
        annotation: cur_res.data.result,
        bbox: [],
        category_name: [],
        scale: 1,
        colors: {},
        display: false,
        chosen_annotation: "",
        frame_num: 0,
        obj_ids: cur_res.data.obj_ids,
        ids: [],
        max_obj_id: 0,
        cur_frame: 1,
      };
      videoData = {
        width: "70%", //播放器高度
        height: "70%", //播放器高度
        color: "#409eff", //主题色
        title: "测试结果", //视频名称
        webFullScreen: false, //网页全屏
        speed: true, //是否支持快进快退
        currentTime: 0, //跳转到固定播放时间(s)
        muted: false, //静音
        autoPlay: true, //自动播放
        loop: false, //循环播放
        mirror: false, //镜像画面
        control: true, //是否显示控制器
        ligthOff: false, //关灯模式
        volume: 0.3, //默认音量0-1
        // src: '/home/jingkun/AIPlatform/AIPlatform/backend/track_ffpmeg/code_1.mp4',
        src: cur_res.data.data_url, //视频源
        poster: "", //封面
        speedRate: [1.0, 1.25, 1.5, 2.0], // 可选的播放速度
        controlBtns: [
          "audioTrack", //音轨切换按钮
          "quality", //视频质量切换按钮
          "speedRate", //速率切换按钮
          "volume", //音量
          "setting", //设置
          "pip", //画中画按钮
          "pageFullScreen", //网页全屏按钮
          "fullScreen", //全屏按钮
        ], //显示所有按钮,
      };
      console.log(videoData);
    };
    const SetVideo = (e) => {
      const file = e.target.files[0];
      mFile.value = file;

      // 测试微信视频不经过处理的url是否可以，可以

      // 视频编码没问题的话可以直接在线显示
      videoData.src = URL.createObjectURL(file);
    };
    const TestModel = () => {
      console.log("测试模型");
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
          });
        })
        .catch(() => {
          console.log("catch");
        });
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
          // 现在的测试结果显示：视频编码没问题的话可以直接赋新的url来展示测试后的视频结果
          videoData.src = res.data.data_url;

          // 原先的测试结果显示，可以不管
          // cur_res = res;
          // InitImgData();
          // LoadImages();
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const RandomRGB = () => {
      let r = Math.floor(Math.random() * 256).toString();
      let g = Math.floor(Math.random() * 256).toString();
      let b = Math.floor(Math.random() * 256).toString();
      let alpha = (0.8).toString();
      return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
      return "rgba(${r},${g},${b},${alpha})";
    };
    const AdjustCanvasSize = () => {
      let scale = imgData.img_height / canvas_size.value.height;
      imgData.scale = scale;
      canvas_size.value.width = imgData.img_width / scale;
    };
    const AdjustBbox = () => {
      /*let category_num = Object.keys(current_annotation).length;*/
      let current_annotation = imgData.annotation;
      //let img_count = imgData.images.length;
      let img_count = Object.keys(imgData.images).length;
      imgData.bbox = [];
      imgData.category_name = [];
      imgData.colors = {};
      imgData.ids = [];
      for (let i = 0; i < imgData.obj_ids.length; i++) {
        imgData.colors[imgData.obj_ids[i]] = RandomRGB();
        imgData.max_obj_id = Math.max(imgData.max_obj_id, imgData.obj_ids[i]);
      }
      for (let j = 0; j < img_count; j++) {
        imgData.bbox.push([]);
        imgData.category_name.push([]);
        imgData.ids.push([]);
        let category_num = Object.keys(current_annotation[j + 1]).length;
        for (let key in current_annotation[j + 1]) {
          imgData.ids[j].push(key);
        }
        for (let i = 0; i < category_num; i++) {
          let obj_id = imgData.ids[j][i];
          imgData.bbox[j].push(current_annotation[j + 1][obj_id].bbox);
          imgData.category_name[j].push(
            current_annotation[j + 1][obj_id].category_name,
          );
          for (let k = 0; k < 4; k++) {
            imgData.bbox[j][i][k] = imgData.bbox[j][i][k] / imgData.scale;
          }
        }
      }
    };
    const LoadImages = () => {
      let count = 0;
      let length = imgData.imgURL.length;
      imgData.frame_num = length;
      for (let i = 0; i < length; i++) {
        const img = new Image();
        img.src = imgData.imgURL[i];
        img.onload = () => {
          // imgData.images.push(img);
          imgData.images[i] = img;
          count++;
          if (count == length) {
            ElMessage.success("数据加载成功");
            imgData.img_width = img.width;
            imgData.img_height = img.height;
            AdjustCanvasSize();
            AdjustBbox();
            setTimeout(DrawCurrentImage, 2000);
          }
        };
      }
    };
    const DrawOriginalRect = () => {
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = 2;
      let category_num = imgData.category_name[imgData.cur_draw].length;
      for (let i = 0; i < category_num; i++) {
        /*ctx.strokeStyle = colors.value[i];*/
        ctx.strokeStyle = imgData.colors[imgData.ids[imgData.cur_draw][i]];
        /*ctx.strokeRect(rect.value[i].sx, rect.value[i].sy, rect.value[i].w, rect.value[i].h);*/
        ctx.font = '15px "微软雅黑"';
        ctx.fillStyle = imgData.colors[imgData.ids[imgData.cur_draw][i]];
        ctx.textBaseline = "bottom";
        ctx.fillText(
          imgData.category_name[imgData.cur_draw][i],
          imgData.bbox[imgData.cur_draw][i][0],
          imgData.bbox[imgData.cur_draw][i][1],
        );
        ctx.strokeRect(
          imgData.bbox[imgData.cur_draw][i][0],
          imgData.bbox[imgData.cur_draw][i][1],
          imgData.bbox[imgData.cur_draw][i][2],
          imgData.bbox[imgData.cur_draw][i][3],
        );
      }
    };
    const DrawImages = () => {
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let img_max_index = Object.keys(imgData.images).length - 1;
      ctx.drawImage(
        imgData.images[imgData.cur_draw],
        0,
        0,
        canvas_size.value.width,
        canvas_size.value.height,
      );
      DrawOriginalRect();
      if (imgData.cur_draw < img_max_index) {
        imgData.cur_draw++;
        imgData.cur_frame = imgData.cur_draw + 1;
        if (imgData.display == true) setTimeout(DrawImages, 42);
      } else {
        imgData.cur_draw = 0;
        imgData.cur_frame = imgData.cur_draw + 1;
        DrawCurrentImage();
        imgData.display = false;
      }
    };
    const DrawCurrentImage = () => {
      console.log("DrawCurrentImage");
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        imgData.images[imgData.cur_draw],
        0,
        0,
        canvas_size.value.width,
        canvas_size.value.height,
      );
      DrawOriginalRect();
    };
    const Display = (op) => {
      if (op == 0) {
        imgData.display = true;
        console.log("imgData", imgData);
        DrawImages();
      }
      if (op == 1) {
        imgData.display = false;
      }
    };

    return {
      canvas_size,
      SetVideo,
      TestModel,
      Display,
      ModelName,
      showResult,

      videoData,
    };
  },
  mounted() {
    this.showResult();
  },
};
</script>

<style scoped>
.crop-demo-btn {
  position: relative;
}
/*.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}*/
</style>
