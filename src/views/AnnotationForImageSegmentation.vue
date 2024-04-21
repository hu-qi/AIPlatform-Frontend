<template>
  <div>
    <el-row>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades" /> 图像分割数据集：
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
    </el-row>
    <div
      id="canvasContainer"
      class="container"
      style="height: 420px; position: relative"
    >
      <div id="outCanvas">
        <canvas
          v-if="show_canvas"
          id="myCanvas_0"
          :width="canvas_size.width"
          :height="canvas_size.height"
          style="z-index: 0"
          class="myCanvas"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        />
        <canvas
          v-if="show_canvas"
          id="myCanvas"
          :width="canvas_size.width"
          :height="canvas_size.height"
          style="z-index: 20"
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
    <div
      class="container"
      align="center"
    >
      <div class="home-card">
        <div
          v-for="o in anno"
          :key="o"
          class="home-item"
        >
          <el-color-picker
            v-model="o.color"
            :show-alpha="true"
            size="small"
            @change="el_change_color(o.color, o.labelGroup, o.label)"
          />
          {{ o.label }}
        </div>
      </div>
    </div>
    <el-row>
      <el-col
        :span="8"
        :offset="5"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          content="笔刷粗细"
          placement="top"
        >
          <el-slider
            v-model="brush"
            :min="1"
            :max="40"
            show-input
          />
        </el-tooltip>
      </el-col>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="① 选择颜色"
        placement="top"
      >
        <el-col
          :span="1"
          :offset="1"
        >
          <el-color-picker
            v-model="color"
            :show-alpha="true"
            size="small"
            @change="el_change_color_1(color)"
          />
        </el-col>
      </el-tooltip>
      <el-col
        :span="1"
        :offset="2"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          content="保存"
          placement="top"
        >
          <i
            class="el-icon-download"
            style="cursor: pointer; margin-top: 25%"
            @click="savePic"
          />
        </el-tooltip>
      </el-col>
      <el-col
        :span="2"
        :offset="1"
      >
        <el-tooltip
          class="box-item"
          effect="dark"
          content="清空画布"
          placement="top"
        >
          <i
            class="el-icon-delete"
            style="cursor: pointer; margin-top: 13%"
            @click="clearCanvas"
          />
        </el-tooltip>
      </el-col>
    </el-row>

    <div
      class="container"
      align="center"
    >
      <span>
        <!-- <i class="el-icon-question" @click="t_flag = !t_flag" style="cursor:pointer; margin-right:2%"></i> -->
        <el-tooltip
          class="box-item"
          effect="dark"
          content="③ 点击完成添加"
          placement="top"
        >
          <span>
            <el-button
              type="danger"
              :disabled="bt_flag"
              @click="addAnnotation"
            >添加标注</el-button>
          </span>
        </el-tooltip>

        <el-tooltip
          class="box-item"
          effect="dark"
          content="② 选择标注信息"
          placement="top"
        >
          <span>
            <el-select
              v-model="imgData.labelGroup"
              style="margin-left: 10px"
              :placeholder="current_label"
              :disabled="flag"
              @change="selectLabelGroup"
            >
              <el-option
                v-for="item in labelGroupData"
                :key="item.name"
                :value="item.name"
              />
            </el-select>
            <el-select
              v-model="imgData.annotation"
              style="margin-left: 10px"
              :placeholder="current_label_group"
              :disabled="flag"
              @change="selectLabelValue"
            >
              <el-option
                v-for="item in labelData"
                :key="item.name"
                :value="item.name"
              />
            </el-select>
          </span>
        </el-tooltip>
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
import { useStore } from "vuex";
export default {
  name: "AnnotationForImageSegmentation",
  components: {},
  setup() {
    let flag = ref(true);
    let bt_flag = ref(true);
    let t_flag = ref(true);
    let width = ref();
    let height = ref();
    let filename = ref();
    const store = useStore();
    //取色器
    const color = ref("rgba(0,0,0,1)");
    //笔刷大小
    const brush = ref(15);
    let show_canvas = ref(false);
    let show_canvas_1 = ref(false);
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
    //添加标注
    const new_anno = ref([]);
    const anno = ref([]);
    // 画笔
    const current = ref([]);

    let drawing = ref(false);

    const change_color = (e) => {
      console.log(e.hex); // {hex: '#ddd8c3', rgba: 'rgba(221,216,195,0.5849)'}
      color.value = e.rgba;
      console.log("colorvalue", color.value);
    };

    const imgData = reactive({
      maskURL: localStorage.getItem("current_mask_url"),
      imgURL: localStorage.getItem("current_img_url"),
      current_data_id: localStorage.getItem("current_data_id"),
      labelGroup: "",
      annotation: "",
      color: "",
    });

    //图片居中
    const showTip = () => {
      t_flag.value = true;
    };

    const handleAutoAnnotation = (index, row) => {
      console.log("自动标注");
      // 二次标注提示
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

    //图片居中
    const canvasCenter = () => {
      let container = document.getElementById("canvasContainer");
      let canvas = document.getElementById("outCanvas");
      canvas.style.marginLeft =
        ((container.offsetWidth - canvas_size.value.width) / 2).toString() +
        "px";
    };

    //调整canvas大小, 获取框的信息
    const handleImageAndRect = (res) => {
      show_canvas.value = false;
      let img = new Image();
      img.src = imgData.imgURL;
      console.log("di??", img.src);
      height.value = img.height;
      width.value = img.width;
      console.log("高度宽度", height, width);
      img.onload = function () {
        let scale = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale;
        console.log("didi width", canvas_size.value.width);
        rect.value = reactive([]);
        new_rect.value = reactive([]);
        show_canvas.value = true;
        setTimeout(createCanvas, 1000);
      };
    };
    // 画掩码
    const handleDrawMask = (res) => {
      show_canvas_1.value = false;
      let img = new Image();
      img.src = res.data.annotation[0].file_url;
      console.log("di mask", img.src);
      img.onload = function () {
        let scale = img.height / canvas_size.value.height;
        canvas_size.value.width = img.width / scale;
        rect.value = reactive([]);
        new_rect.value = reactive([]);
        show_canvas_1.value = true;
        setTimeout(createMask, 1000);
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
    const labelGroupData = ref([]);
    let labelData = ref([{}]);
    const getlabelGroupInfo = () => {
      console.log("标签组信息");
      //console.log(localStorage.getItem('ms_username'));
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
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
      console.log("上一张", store.state.collapse);
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
          if (res.data.annotation[0]) {
            imgData.maskURL = res.data.annotation[0].file_url;
            current_label_group.value = res.data.label_group;
            current_label.value = res.data.label;
            getLabelInfo(res.data.annotation[0].segments_info);
            handleDrawMask(res);
          }
          imgData.imgURL = res.data.data_url;
          imgData.current_data_id = res.data.current_data_id;
          handleImageAndRect(res);
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
          if (res.data.annotation[0]) {
            imgData.maskURL = res.data.annotation[0].file_url;
            current_label_group.value = res.data.label_group;
            current_label.value = res.data.label;
            getLabelInfo(res.data.annotation[0].segments_info);
            handleDrawMask(res);
          }
          imgData.imgURL = res.data.data_url;
          imgData.current_data_id = res.data.current_data_id;
          handleImageAndRect(res);
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
        console.log("selectLabelGroup", res, imgData.labelGroup);
        let obj = JSON.parse(res.data.labelgroupinfo);
        let obj1 = JSON.parse(res.data.labels[imgData.labelGroup]);
        console.log(obj1);
        let length = obj1.length;
        for (let i = 0; i < length; i++) {
          labelData.value.push({
            id: i,
            name: obj1[i].fields.name,
          });
        }
      });
    };

    const selectLabelValue = () => {
      bt_flag.value = false;
    };

    const manualAnnotation = () => {
      let canvas = document.getElementById("myCanvas_0");
      let a = document.createElement("a");
      a.download = "mask";
      a.href = canvas.toDataURL("image/jpeg");
      console.log("a.href", a.href);
      document.body.appendChild(a);
      // a.click()
      document.body.removeChild(a);
      console.log(width.value, height.value);
      postManualAnnotation(
        task_type,
        qs.stringify({
          name: DatasetsName,
          username: username,
          current_data_id: imgData.current_data_id,
          picBase64: JSON.stringify(a.href),
          label: JSON.stringify(new_anno.value),
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
    //添加标注
    const addAnnotation = () => {
      console.log("添加标注", color.value);
      let arr = color.value.split(",");
      let r = parseInt(arr[0].substr(5));
      let g = parseInt(arr[1]);
      let b = parseInt(arr[2]);
      let id = r + g * 256 + b * 256 * 256;
      new_anno.value.push({
        labelGroup: imgData.labelGroup,
        label: imgData.annotation,
        colorId: id,
      });
      // let c='rgba('+r+","+g+","+b+","+"1)"
      anno.value.push({
        labelGroup: imgData.labelGroup,
        label: imgData.annotation,
        color: color.value,
      });
      ElMessage.success("添加成功");
      flag.value = true;
      bt_flag.value = true;
    };

    //保存图片
    const savePic = () => {
      let canvas = document.getElementById("myCanvas_0");
      let a = document.createElement("a");
      a.download = "mask";
      a.href = canvas.toDataURL("image/jpeg");
      console.log("a.href", a.href);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      postManualAnnotation(
        task_type,
        qs.stringify({
          name: DatasetsName,
          username: username,
          current_data_id: imgData.current_data_id,
          label: JSON.stringify(a.href),
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

    //清空画布
    const clearCanvas = () => {
      let canvas = document.getElementById("myCanvas_1");
      let w = canvas.width;
      let h = canvas.height;
      canvas.width = w;
      canvas.height = h;
      createMask();
      let canvas_0 = document.getElementById("myCanvas_0");
      canvas_0.width = w;
      canvas_0.height = h;
    };

    const mousedown = (e) => {
      console.log("mouse down @@@@@@@@@@@@@@@@@@@@@@@@");
      drawing.value = true;
      current.value.push({
        x: e.offsetX,
        y: e.offsetY,
      });
    };
    const mouseup = (e) => {
      console.log("mouse up @@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      if (!drawing.value) {
        return;
      }
      drawing.value = false;
      const canvas = document.getElementById("myCanvas_1");
      let ctx = canvas.getContext("2d");
    };
    const mousemove = (e) => {
      console.log("mouse move");
      if (!drawing.value) {
        return;
      }
      const canvas = document.getElementById("myCanvas_1");
      const canvas_0 = document.getElementById("myCanvas_0");
      let ctx = canvas.getContext("2d");
      let ctx_0 = canvas_0.getContext("2d");
      let len = current.value.length;
      drawLine(
        current.value[len - 1].x,
        current.value[len - 1].y,
        e.offsetX,
        e.offsetY,
        color.value,
        brush.value,
        ctx,
      );
      drawLine(
        current.value[len - 1].x,
        current.value[len - 1].y,
        e.offsetX,
        e.offsetY,
        color.value,
        brush.value,
        ctx_0,
      );
      current.value[len - 1].x = e.offsetX;
      current.value[len - 1].y = e.offsetY;
    };

    const drawLine = (x0, y0, x1, y1, color, width, ctx) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.closePath();
    };

    const createCanvas = () => {
      canvasCenter();
      console.log("createCanvas");
      const canvas = document.getElementById("myCanvas");
      console.log("di,canvas", canvas);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let img = new Image();
      img.src = imgData.imgURL;
      console.log("di,createCanvas", img.src);
      if (state.value.flag == true) {
        ctx.drawImage(
          img,
          0,
          0,
          canvas_size.value.width,
          canvas_size.value.height,
        );
      } else {
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            canvas_size.value.width,
            canvas_size.value.height,
          );
        };
      }
    };

    const createMask = () => {
      canvasCenter();
      console.log("createMask");
      const canvas = document.getElementById("myCanvas_1");
      console.log("di,mask", canvas);
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //透明度
      ctx.globalAlpha = 0.7;
      let img = new Image();
      img.src = imgData.maskURL;
      img.setAttribute("crossOrigin", "Anonymous");
      console.log("di,createMask", img.src);
      if (state.value.flag == true) {
        ctx.drawImage(
          img,
          0,
          0,
          canvas_size.value.width,
          canvas_size.value.height,
        );
      } else {
        img.onload = function () {
          ctx.drawImage(
            img,
            0,
            0,
            canvas_size.value.width,
            canvas_size.value.height,
          );
        };
      }
    };

    //获取已有颜色和标签
    const getLabelInfo = (d) => {
      anno.value = [];
      new_anno.value = [];
      let len = d.length;
      for (let i = 0; i < len; i++) {
        let colorid = d[i].id;
        let r = colorid % 256;
        let g = ((colorid - r) / 256) % 256;
        let b = ((colorid - r - g * 256) / 256 / 256) % 256;
        console.log("r,g,b", r, g, b);
        // 'rgba(255, 69, 0, 0.68)'
        let c = "rgba(" + r + "," + g + "," + b + "," + "1)";
        console.log(color);
        color.value = c;
        anno.value.push({
          color: c,
          labelGroup: "default",
          label: d[i].category_name,
        });
        new_anno.value.push({
          labelGroup: "default",
          label: d[i].category_name,
          colorId: colorid,
        });
        imgData.labelGroup = "default";
        imgData.annotation = d[i].category_name;
      }
    };

    //elementui 取色器变化
    const el_change_color = (e, g, v) => {
      color.value = e;
      imgData.labelGroup = g;
      imgData.annotation = v;
    };

    //elementui 取色器变化
    const el_change_color_1 = (e, g, v) => {
      color.value = e;
      imgData.labelGroup = g;
      imgData.annotation = v;
      flag.value = false;
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
          imgData.imgURL = res.data.data_url;
          handleImageAndRect(res);
          if (res.data.annotation[0]) {
            filename.value = res.data.annotation[0].file_name;
            localStorage.setItem(
              "current_mask_url",
              res.data.annotation[0].file_url,
            );
            getLabelInfo(res.data.annotation[0].segments_info);
            handleDrawMask(res);
          }
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
      selectLabelValue,
      labelData,
      current_label,
      current_label_group,
      // change,
      mousedown,
      mouseup,
      mousemove,
      addAnnotation,
      canvas_size,
      rect,
      new_rect,
      show_canvas,
      show_canvas_1,
      drawing,
      brush,
      //取色器
      color,
      change_color,
      // colorRgba,
      // 保存图片
      savePic,
      clearCanvas,
      canvasCenter,
      getLabelInfo,
      anno,
      el_change_color,
      el_change_color_1,
      flag,
      bt_flag,
      showTip,
      t_flag,
      width,
      height,
      filename,

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
.myCanvas {
  position: absolute;
}
.home-card {
  width: 100%;
  overflow: hidden;
  padding: 10px 10px;
  display: flex;
  flex-wrap: wrap;
}
.home-item {
  width: calc(25%-30px);
  padding: 0 0 0 20px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
}
/* .slider-demo-block {
        display: flex;
        align-items: center;
    }
    .slider-demo-block .el-slider {
        margin-top: 0;
        margin-left: 12px;
    } */
</style>
