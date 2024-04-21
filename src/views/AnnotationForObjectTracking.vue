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
          style="background: #0a0a0a"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        />
      </div>
      <el-button @click="previousVideo">
        上一个视频
      </el-button>
      <el-button @click="Display(0)">
        播放
      </el-button>
      <el-button @click="Display(1)">
        暂停
      </el-button>
      <el-button @click="Display(2)">
        上一帧
      </el-button>
      <el-button @click="Display(3)">
        下一帧
      </el-button>
      <el-button @click="Display(4)">
        跳转至
      </el-button>
      <el-input
        v-model="imgData.cur_frame"
        style="width: 80px; margin-left: 5px"
      />
      /
      <el-input
        style="width: 80px; margin-left: 5px"
        :placeholder="imgData.frame_num"
        disabled
      />
      <!--<p style="font-size: 15px; width: 100px">/{{imgData.frame_num}}帧</p>-->
      <el-button
        style="margin-left: 5px"
        @click="nextVideo"
      >
        下一个视频
      </el-button>
      <div
        align="center"
        style="margin-top: 10px"
      >
        <span>
          <el-button
            type="danger"
            style="margin-right: 5px"
            @click="addAnnotation"
          >添加标注</el-button>
          <el-select
            v-model="imgData.labelGroup"
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
            v-model="chosen_annotation"
            :placeholder="current_label_group"
          >
            <el-option
              v-for="item in labelData"
              :key="item.id"
              :value="item.name"
            />
          </el-select>
          <el-button
            type="primary"
            style="margin-left: 5px"
            @click="manualAnnotation"
          >完成标注</el-button>
        </span>
      </div>
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
  name: "AnnotationForObjectTracking",
  setup() {
    let show_canvas = ref(false);
    let DatasetsName = localStorage.getItem("current_datasets_name");
    let task_type = localStorage.getItem("task_type");
    const canvas_size = ref({
      width: 800,
      height: 400,
    });
    let username = localStorage.getItem("ms_username");
    let chosen_annotation = ref("");
    let imgData = reactive({
      imgURL: JSON.parse(localStorage.getItem("current_img_url")),
      current_data_id: localStorage.getItem("current_data_id"),
      labelGroup: "",
      images: {},
      preload: false,
      cur_draw: 0,
      img_width: 100,
      img_height: 100,
      annotation: JSON.parse(localStorage.getItem("current_annotation")),
      bbox: [],
      category_name: [],
      scale: 1,
      colors: {},
      display: false,
      chosen_annotation: "",
      frame_num: 0,
      obj_ids: JSON.parse(localStorage.getItem("obj_ids")),
      ids: [],
      max_obj_id: 0,
      cur_frame: 1,
    });
    const colors = ref([
      "rgba(255,26,43,0.8)",
      "rgba(10,10,10,0.78)",
      "rgba(255,121,10,0.8)",
      "rgba(12,217,0,0.8)",
      "rgba(49,23,255,0.8)",
      "rgba(252,255,25,0.8)",
      "rgba(199,42,46,0.8)",
      "rgba(206,47,146,0.8)",
      "rgba(206,99,0,0.8)",
      "rgba(85,202,206,0.8)",
    ]);

    const labelGroupData = ref([{}]);
    let labelData = ref([{}]);
    const state = ref({
      flag: false,
      img_flag: false,
      x: 50,
      y: 50,
    });
    const new_rect = ref([]);
    const getlabelGroupInfo = () => {
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

    getlabelGroupInfo();
    const selectLabelGroup = () => {
      //const temp = ref([{}]);
      labelData.value = [];
      imgData.annotation = "";
      //console.log(labelData.value);
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        let obj1 = JSON.parse(res.data.labels[imgData.labelGroup]);
        //console.log(obj1);
        let length = obj1.length;
        for (var i = 0; i < length; i++) {
          labelData.value.push({
            id: i,
            name: obj1[i].fields.name,
          });
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
      let current_annotation = JSON.parse(
        localStorage.getItem("current_annotation"),
      );
      /*let category_num = Object.keys(current_annotation).length;*/
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
      //console.log("imgData.max_obj_id", imgData.max_obj_id);
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
      show_canvas.value = false;
      let count = 0;
      let length = imgData.imgURL.length;
      imgData.frame_num = length;
      for (let i = 0; i < length; i++) {
        const img = new Image();
        img.src = imgData.imgURL[i];
        img.onload = () => {
          imgData.images[i] = img;
          count++;
          if (count == length) {
            ElMessage.success("数据加载成功");
            imgData.img_width = img.width;
            imgData.img_height = img.height;
            AdjustCanvasSize();
            AdjustBbox();
            show_canvas.value = true;
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
      new_rect.value = [];
      if (op == 0) {
        imgData.display = true;
        DrawImages();
      }
      if (op == 1) {
        imgData.display = false;
      }
      if (op == 2) {
        imgData.cur_draw--;
        if (imgData.cur_draw < 0) imgData.cur_draw = 0;
        imgData.cur_frame = imgData.cur_draw + 1;
        DrawCurrentImage();
      }
      if (op == 3) {
        imgData.cur_draw++;
        if (imgData.cur_draw > Object.keys(imgData.images).length - 1)
          imgData.cur_draw = Object.keys(imgData.images).length - 1;
        imgData.cur_frame = imgData.cur_draw + 1;
        DrawCurrentImage();
      }
      if (op == 4) {
        if (imgData.cur_frame < 0 || imgData.cur_frame > imgData.frame_num) {
          imgData.cur_frame = imgData.cur_draw + 1;
          ElMessage.error("帧数范围错误");
          return;
        }
        imgData.cur_draw = imgData.cur_frame - 1;
        DrawCurrentImage();
      }
      console.log(imgData.cur_frame);
    };
    const mousedown = (e) => {
      state.value.x = e.offsetX;
      state.value.y = e.offsetY;
      state.value.flag = true;
      new_rect.value.push({
        sx: e.offsetX,
        sy: e.offsetY,
        w: 0,
        h: 0,
        annotation: "",
        obj_id: new_rect.value.length + imgData.max_obj_id + 1,
        frame_id: imgData.cur_draw,
      });
    };
    const mousemove = (e) => {
      if (state.value.flag == false) return;
      DrawCurrentImage();
      const canvas = document.getElementById("myCanvas");
      let ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = 2;
      let x = state.value.x,
        y = state.value.y;
      for (let i = 0; i < new_rect.value.length - 1; i++) {
        ctx.strokeStyle = colors.value[i];
        ctx.strokeRect(
          new_rect.value[i].sx,
          new_rect.value[i].sy,
          new_rect.value[i].w,
          new_rect.value[i].h,
        );
        ctx.font = '15px "微软雅黑"';
        ctx.fillStyle = colors.value[i];
        ctx.textBaseline = "bottom";
        ctx.fillText(
          new_rect.value[i].annotation,
          new_rect.value[i].sx,
          new_rect.value[i].sy,
        );
      }
      ctx.strokeStyle = colors.value[new_rect.value.length - 1];
      ctx.strokeRect(x, y, e.offsetX - x, e.offsetY - y);
    };
    const mouseup = (e) => {
      state.value.flag = false;
      let len = new_rect.value.length;
      new_rect.value[len - 1].w = e.offsetX - new_rect.value[len - 1].sx;
      new_rect.value[len - 1].h = e.offsetY - new_rect.value[len - 1].sy;
    };
    const addAnnotation = () => {
      console.log("添加标注");
      let len = new_rect.value.length;
      if (len > 0) {
        new_rect.value[len - 1].annotation = chosen_annotation;
        const canvas = document.getElementById("myCanvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.lineWidth = 2;
        /*ctx.strokeRect(rect.value[i].sx, rect.value[i].sy, rect.value[i].w, rect.value[i].h);*/
        ctx.font = '15px "微软雅黑"';
        ctx.fillStyle = colors.value[len - 1];
        ctx.textBaseline = "bottom";
        console.log(new_rect);
        ctx.fillText(
          new_rect.value[len - 1].annotation,
          new_rect.value[len - 1].sx,
          new_rect.value[len - 1].sy,
        );
        ElMessage.success("添加成功");
      }
    };
    const manualAnnotation = () => {
      console.log("完成标注");
      let rect_data = {};
      let len = new_rect.value.length;
      let f_id = imgData.cur_draw + 1;
      let scale = imgData.scale;
      rect_data[f_id] = {};

      for (let i = 0; i < len; i++) {
        let obj_id = new_rect.value[i].obj_id;
        let temp = {
          bbox: [
            Math.round(new_rect.value[i].sx * scale),
            Math.round(new_rect.value[i].sy * scale),
            Math.round(new_rect.value[i].w * scale),
            Math.round(new_rect.value[i].h * scale),
          ],
          active: 1,
          category_name: new_rect.value[i].annotation,
          ratio: 1,
        };
        rect_data[f_id][obj_id] = temp;
      }
      console.log(rect_data);
      postManualAnnotation(
        task_type,
        qs.stringify({
          name: DatasetsName,
          username: username,
          current_data_id: imgData.current_data_id,
          label: JSON.stringify(rect_data),
          relabel: 1,
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
    const InitImgData = () => {
      new_rect.value = [];
      /*imgData = {
                    imgURL: JSON.parse(localStorage.getItem('current_img_url')),
                    current_data_id: localStorage.getItem('current_data_id'),
                    labelGroup:"",
                    annotation: "",
                    images:[],
                    preload: false,
                    cur_draw: 0,
                    img_width:100,
                    img_height:100,
                    annotation: JSON.parse(localStorage.getItem('current_annotation')),
                    bbox:[],
                    category_name:[],
                    scale: 1,
                    colors:{},
                    display:false,
                    chosen_annotation:"",
                    frame_num: 0,
                    obj_ids: JSON.parse(localStorage.getItem('obj_ids')),
                    ids:[],
                    max_obj_id:0,
                    cur_frame: 1,
                }*/

      imgData.imgURL = JSON.parse(localStorage.getItem("current_img_url"));
      imgData.current_data_id = localStorage.getItem("current_data_id");
      imgData.labelGroup = "";
      imgData.annotation = "";
      imgData.images = [];
      imgData.preload = false;
      imgData.cur_draw = 0;
      imgData.img_width = 100;
      imgData.img_height = 100;
      imgData.annotation = JSON.parse(
        localStorage.getItem("current_annotation"),
      );
      imgData.bbox = [];
      imgData.category_name = [];
      imgData.scale = 1;
      imgData.colors = {};
      imgData.display = false;
      imgData.chosen_annotation = "";
      imgData.frame_num = 0;
      imgData.obj_ids = JSON.parse(localStorage.getItem("obj_ids"));
      imgData.ids = [];
      imgData.max_obj_id = 0;
      imgData.cur_frame = 1;

      console.log("新的图片", imgData, imgData.cur_frame);
    };
    const previousVideo = () => {
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
          localStorage.setItem("current_data_id", res.data.current_data_id);
          localStorage.setItem(
            "current_img_url",
            JSON.stringify(res.data.data_url),
          );
          localStorage.setItem(
            "current_annotation",
            JSON.stringify(res.data.annotation),
          );
          localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
          InitImgData();
          LoadImages();
          console.log("查询成功");
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const nextVideo = () => {
      console.log("下一张");
      getManualAnnotation(task_type, {
        name: DatasetsName,
        username: username,
        current_data_id: imgData.current_data_id,
        next: 1,
        previous: 0,
      }).then((res) => {
        if (res.code == 200) {
          console.log("res", res);
          ElMessage.success(res.msg);
          localStorage.setItem("current_data_id", res.data.current_data_id);
          localStorage.setItem(
            "current_img_url",
            JSON.stringify(res.data.data_url),
          );
          localStorage.setItem(
            "current_annotation",
            JSON.stringify(res.data.annotation),
          );
          localStorage.setItem("obj_ids", JSON.stringify(res.data.obj_ids));
          console.log("res2");
          InitImgData();
          LoadImages();
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    onUnmounted(() => {
      console.log("unmounted!");
      localStorage.removeItem("current_datasets_name");
      localStorage.removeItem("current_img_url");
      localStorage.removeItem("current_data_id");
      localStorage.removeItem("current_label");
      localStorage.removeItem("current_label_group");
      localStorage.removeItem("current_annotation");
    });
    onMounted(() => {
      LoadImages();
    });
    return {
      chosen_annotation,
      previousVideo,
      nextVideo,
      manualAnnotation,
      addAnnotation,
      mouseup,
      mousemove,
      mousedown,
      DrawImages,
      Display,
      DatasetsName,
      canvas_size,
      imgData,
      selectLabelGroup,
      labelGroupData,
      labelData,
      show_canvas,
      handleAutoAnnotation,
    };
  },
};
</script>

<style scoped></style>
