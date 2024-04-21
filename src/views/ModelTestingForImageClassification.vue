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

    <span class="dialog-footer">
      <el-button
        class="crop-demo-btn"
        type="primary"
      >选择图片
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
      >测试</el-button>
      <el-button
        type="primary"
        @click="getResult"
      >查看结果</el-button>

      <el-form label-width="100px">
        <el-form-item label="预测标签">
          <el-input
            v-model="prediction"
            style="width: 200px"
            placeholder=""
            :disabled="true"
          />
        </el-form-item>
      </el-form>
    </span>
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
    let task_id = null;
    const imageUrl = ref();
    const prediction = ref();
    const handleChange = (file, FL) => {
      console.log("handleAvatarSuccess");
      console.log(file);
      console.log(FL);
      imageUrl.value = URL.createObjectURL(file.raw);
      console.log(imageUrl.value);
    };

    const imgSrc = ref("");
    let mFile = ref("");
    const setImage = (e) => {
      const file = e.target.files[0];
      mFile.value = file;
      imageUrl.value = URL.createObjectURL(file);
      console.log(file);
      console.log(imageUrl.value);
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
          });
        })
        .catch(() => {});
    };
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
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    const drawLine = (dict) => {
      /*console.log(dict);
                console.log(typeof(dict));*/
      let labels = [];
      let pros = [];
      for (var k in dict) {
        /*console.log(k);
                    console.log(dict[k]);*/
        labels.push(k);
        pros.push(dict[k]);
      }
      labels.reverse();
      pros.reverse();
      console.log(labels);
      console.log(pros);
      let myChart1 = echarts.init(document.getElementById("fix"));
      //console.log(document.getElementById('fix'));
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
      handleChange,
      imageUrl,
      fits: "scale-down",
      setImage,
      testModel,
      getResult,
      prediction,
    };
  },
  mounted() {
    //this.drawLine();
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
