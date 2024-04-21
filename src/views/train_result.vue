<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 模型： {{ ModelName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <span class="dialog-footer">
      <!-- <el-button type="primary" @click="getTrainInfo">查看</el-button> -->
      <el-button
        type="primary"
        @click="download_getTrainInfo"
      >下载日志</el-button>
    </span>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>损失函数</span>
        </div>
      </template>
      <div
        id="loss"
        class="grid-content bg-purple"
        :style="{ width: '1000px', height: '280px' }"
      />
    </el-card>

    <el-card
      v-if="acc_bool"
      class="box-card"
    >
      <template #header>
        <div class="card-header">
          <span>准确率</span>
        </div>
      </template>
      <div
        id="acc"
        class="grid-content bg-purple"
        :style="{ width: '1000px', height: '280px' }"
      />
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted, onUpdated } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import { postModelTest } from "../api/index";
// import Schart from "vue-schart";
import * as echarts from "echarts";
import { train_result } from "../api/index";
import fileDownload from "js-file-download";
export default {
  name: "ModelTesting",
  components: {
    // Schart,
  },
  setup() {
    let ModelName = localStorage.getItem("look_model_name");
    console.log("ModelName = ", ModelName);
    let task_type = localStorage.getItem("task_type");

    let acc_bool = true;

    const getTrainInfo = () => {
      train_result(
        task_type,
        qs.stringify({
          username: localStorage.getItem("ms_username"),
          model_name: ModelName,
        }),
      ).then((res) => {
        console.log("res = ", res);
        let dict = {};
        if (res.data.training_status == "训练中") {
          dict = res.data.training_log;
        } else {
          dict = res.data.training_log.train;
        }
        console.log("dict=", dict);
        if (
          res.data.task_type == "图像分类" ||
          res.data.task_type == "动作分类" ||
          res.data.task_type == "文本分类"
        ) {
          acc_bool = true;
          drawLine(dict);
        } else if (
          res.data.task_type == "目标检测" ||
          res.data.how_to_train == "8"
        ) {
          acc_bool = true;
          drawLine_1(dict);
        } else if (
          res.data.task_type == "图像分割" ||
          res.data.how_to_train == "9"
        ) {
          acc_bool = false;
          drawLine_1(dict);
        }
      });
    };

    const download_getTrainInfo = () => {
      train_result(
        task_type,
        qs.stringify({
          username: localStorage.getItem("ms_username"),
          model_name: ModelName,
          is_download: 1,
        }),
      ).then((res) => {
        console.log("res = ", res);
        fileDownload(res, "train_log.zip");
        let dict = res.data.training_log.train;
        //drawLine(dict);
      });
    };

    const drawLine = (dict) => {
      /*console.log(dict);
                console.log(typeof(dict));*/
      let epoch = [];
      let time = [];
      let w_lr = [];
      let train_loss = [];
      let valid_loss = [];
      let train_top1 = [];
      let train_top5 = [];
      let valid_top1 = [];
      let valid_top5 = [];
      console.log("dict = ", dict);

      for (var i in dict) {
        if (parseInt(i)) {
          //console.log(parseInt(i))
          //console.log(typeof(i))
          /* console.log('element = ', dict[i].w_lr)
                    console.log('train_loss = ', dict[i].train_loss)
                    console.log('valid_loss = ', dict[i].valid_loss)
                    console.log('train_top1 = ', dict[i].train_top1)
                    console.log('train_top5 = ', dict[i].train_top5)
                    console.log('valid_top1 = ', dict[i].train_top1)
                    console.log('valid_top5 = ', dict[i].train_top5) */
          epoch.push(i);
          w_lr.push(dict[i].w_lr);
          train_loss.push(dict[i].train_loss);
          valid_loss.push(dict[i].valid_loss);
          train_top1.push(dict[i].train_top1);
          train_top5.push(dict[i].train_top5);
          valid_top1.push(dict[i].valid_top1);
          valid_top5.push(dict[i].valid_top5);
        }
      }
      //console.log(epoch)

      let myChart1 = echarts.init(document.getElementById("loss"));
      //console.log(document.getElementById('fix'));
      console.log("绘制图表");
      // 绘制图表
      //loss
      myChart1.setOption({
        title: { text: "损失函数" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          //data: labels,
          data: epoch,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "训练损失",
            type: "line",
            data: train_loss,
          },
          {
            name: "验证损失",
            type: "line",
            data: valid_loss,
          },
        ],
      });

      //acc
      let myChart2 = echarts.init(document.getElementById("acc"));
      //console.log(document.getElementById('fix'));
      console.log("绘制图表");
      // 绘制图表
      myChart2.setOption({
        title: { text: "准确率" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          //data: labels,
          data: epoch,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "训练top1",
            type: "line",
            data: train_top1,
          },
          {
            name: "训练top5",
            type: "line",
            data: train_top5,
          },
          {
            name: "验证top1",
            type: "line",
            data: valid_top1,
          },
          {
            name: "验证top5",
            type: "line",
            data: valid_top5,
          },
        ],
      });
    };

    const drawLine_1 = (dict) => {
      /*console.log(dict);
                console.log(typeof(dict));*/
      let epoch = [];
      let time = [];
      let w_lr = [];
      let train_loss = [];
      let valid_mAP = [];
      console.log("dict = ", dict);

      for (var i in dict) {
        if (parseInt(i)) {
          epoch.push(i);
          w_lr.push(dict[i].w_lr);
          train_loss.push(dict[i].train_loss);
          valid_mAP.push(dict[i].valid_mAP);
        }
      }
      //console.log(epoch)

      let myChart1 = echarts.init(document.getElementById("loss"));
      //console.log(document.getElementById('fix'));
      console.log("绘制图表");
      // 绘制图表
      //loss
      myChart1.setOption({
        title: { text: "损失函数" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          //data: labels,
          data: epoch,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "训练损失",
            type: "line",
            data: train_loss,
          },
        ],
      });

      //acc
      let myChart2 = echarts.init(document.getElementById("acc"));
      //console.log(document.getElementById('fix'));
      console.log("绘制图表");
      // 绘制图表
      myChart2.setOption({
        title: { text: "准确率" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          //data: labels,
          data: epoch,
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "验证mAP",
            type: "line",
            data: valid_mAP,
          },
        ],
      });
    };

    //drawLine();
    return {
      ModelName,
      fits: "scale-down",

      getTrainInfo,
      download_getTrainInfo,
      acc_bool,
    };
  },
  mounted() {
    //this.drawLine();
    this.getTrainInfo();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = echarts.init(document.getElementById("fix"));
      // 绘制图表
      myChart1.setOption({
        title: { text: "整改场所排名（总次数）" },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: [
            "场所4",
            "场所6",
            "场所10",
            "场所1",
            "场所8",
            "场所5",
            "场所9",
            "场所7",
            "场所2",
            "场所3",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
        series: [
          {
            name: "次数",
            type: "bar",
            itemStyle: {
              normal: {
                //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    "#C1232B",
                    "#B5C334",
                    "#FCCE10",
                    "#E87C25",
                    "#27727B",
                    "#FE8463",
                    "#9BCA63",
                    "#FAD860",
                    "#F3A43B",
                    "#60C0DD",
                    "#D7504B",
                    "#C6E579",
                    "#F4E001",
                    "#F0805A",
                    "#26C0C0",
                  ];
                  return colorList[params.dataIndex];
                },
                //以下为是否显示，显示位置和显示格式的设置了
                label: {
                  show: true,
                  position: "right",
                  //                             formatter: '{c}'
                  formatter: "{c}",
                },
              },
            },
            //设置柱的宽度，要是数据太少，柱子太宽不美观~
            barWidth: 10,
            data: [
              0.55, 0.66, 0.1, 0.11, 0.11, 0.112, 0.112, 0.115, 0.12, 0.15,
            ],
          },
        ],
      });
    },
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
</style>
