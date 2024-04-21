<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 模型： {{ ModelName }}
        </el-breadcrumb-item>
        <i class="el-icon-lx-cascades" /> 测试任务id: {{ task_id }}
      </el-breadcrumb>
    </div>
    <div
      class="demo-image__preview"
      align="center"
    >
      <el-image
        style="width: 500px; height: 300px"
        :src="imageUrl"
        :fit="fits"
        :lazy="true"
      />
    </div>

    <div class="container">
      <span>
        <div
          id="fix"
          class="grid-content bg-purple"
          :style="{ width: '500px', height: '280px' }"
        />
      </span>
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
  name: "ModelTesting",
  components: {
    // Schart,
  },
  setup() {
    let ModelName = localStorage.getItem("model_name");
    let task_type = localStorage.getItem("task_type");
    let task_id = localStorage.getItem("task_test_id");
    let file_url = localStorage.getItem("file_url");
    const imageUrl = ref();
    const prediction = ref();

    const getResult = () => {
      console.log("hererer");
      let rq = new FormData();
      rq.append("username", localStorage.getItem("ms_username"));
      rq.append("task_id", task_id);
      console.log(rq);
      postModelTestResult(task_type, rq).then((res) => {
        console.log(res);
        if (res.data) {
          prediction.value = res.data.result.prediction;
          let dict = res.data.result.distribution[0];
          drawLine(dict);
          imageUrl.value = file_url;
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const drawLine = (dict) => {
      let labels = [];
      let pros = [];
      for (var k in dict) {
        labels.push(k);
        pros.push(dict[k]);
      }
      labels.reverse();
      pros.reverse();
      console.log(labels);
      console.log(pros);
      let myChart1 = echarts.init(document.getElementById("fix"));
      console.log("绘制图表");
      // 绘制图表
      myChart1.setOption({
        title: { text: "预测概率" },
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
          data: labels,
          /*data:['场所4','场所6','场所10','场所1','场所8','场所5','场所9','场所7','场所2','场所3'],*/
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
                  formatter: "{c}",
                },
              },
            },
            //设置柱的宽度，要是数据太少，柱子太宽不美观~
            barWidth: 10,
            /*data: [0.55, 0.66, 0.100, 0.110, 0.110, 0.112, 0.112, 0.115, 0.120, 0.1512]*/
            data: pros,
          },
        ],
      });
    };
    //drawLine();
    return {
      ModelName,
      imageUrl,
      fits: "scale-down",
      getResult,
      prediction,
      task_id,
      file_url,
    };
  },
  mounted() {
    this.getResult();
  },
  methods: {},
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
