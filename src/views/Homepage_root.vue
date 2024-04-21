<template>
  <div>
    <el-row :gutter="20">
      <template>
        <div
          id="mychart"
          class="echart"
          :style="myChartStyle"
        />
      </template>

      <el-col :span="24">
        <el-row
          :gutter="20"
          class="mgb20"
        >
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-1">
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ tableData[0] }}
                  </div>
                  <div>数据集（全平台）</div>
                </div>
              </div>
              <div class="block">
                <span class="demonstration" />
                <el-carousel
                  trigger="click"
                  height="150px"
                >
                  <el-carousel-item
                    v-for="item in 5"
                    :key="item"
                  >
                    <div class="grid-content grid-con-1">
                      <div class="grid-cont-right">
                        <div class="grid-num">
                          {{ tableData[item] }}
                        </div>
                        <div>{{ tabletask[item] }}</div>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-2">
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ tableModel[0] }}
                  </div>
                  <div>模型（全平台）</div>
                </div>
              </div>
              <div class="block">
                <span class="demonstration" />
                <el-carousel
                  trigger="click"
                  height="150px"
                >
                  <el-carousel-item
                    v-for="item in 5"
                    :key="item"
                  >
                    <div class="grid-content grid-con-1">
                      <div class="grid-cont-right">
                        <div class="grid-num">
                          {{ tableModel[item] }}
                        </div>
                        <div>{{ tabletask[item] }}</div>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-3">
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ tableDeployment[0] }}
                  </div>
                  <div>部署（全平台）</div>
                </div>
              </div>
              <div class="block">
                <span class="demonstration" />
                <el-carousel
                  trigger="click"
                  height="150px"
                >
                  <el-carousel-item
                    v-for="item in 5"
                    :key="item"
                  >
                    <div class="grid-content grid-con-1">
                      <div class="grid-cont-right">
                        <div class="grid-num">
                          {{ tableDeployment[item] }}
                        </div>
                        <div>{{ tabletask[item] }}</div>
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          class="mgb20"
        >
          <el-col :span="8" />
          <el-col :span="8">
            <el-card
              shadow="hover"
              :body-style="{ padding: '0px' }"
            >
              <div class="grid-content grid-con-3">
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ totaluser }}
                  </div>
                  <div>总人数（全平台）</div>
                </div>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    {{ totalgroup }}
                  </div>
                  <div>组织（全平台）</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" />
        </el-row>
      </el-col>
    </el-row>

    <el-row
      :gutter="20"
      class="mgb20"
    >
      <el-col :span="8">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0px' }"
        >
          <div class="grid-content grid-con-1">
            <div class="grid-cont-right">
              <div class="grid-num">
                {{ tableData_others[0] }}
              </div>
              <div>数据集</div>
            </div>
          </div>
          <div class="block">
            <span class="demonstration" />
            <el-carousel
              trigger="click"
              height="150px"
            >
              <el-carousel-item
                v-for="item in 5"
                :key="item"
              >
                <div class="grid-content grid-con-1">
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ tableData_others[item] }}
                    </div>
                    <div>{{ tabletask[item] }}</div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0px' }"
        >
          <div class="grid-content grid-con-2">
            <div class="grid-cont-right">
              <div class="grid-num">
                {{ tableModel_others[0] }}
              </div>
              <div>模型</div>
            </div>
          </div>
          <div class="block">
            <span class="demonstration" />
            <el-carousel
              trigger="click"
              height="150px"
            >
              <el-carousel-item
                v-for="item in 5"
                :key="item"
              >
                <div class="grid-content grid-con-1">
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ tableModel_others[item] }}
                    </div>
                    <div>{{ tabletask[item] }}</div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card
          shadow="hover"
          :body-style="{ padding: '0px' }"
        >
          <div class="grid-content grid-con-3">
            <div class="grid-cont-right">
              <div class="grid-num">
                {{ tableDeployment_others[0] }}
              </div>
              <div>部署</div>
            </div>
          </div>
          <div class="block">
            <span class="demonstration" />
            <el-carousel
              trigger="click"
              height="150px"
            >
              <el-carousel-item
                v-for="item in 5"
                :key="item"
              >
                <div class="grid-content grid-con-1">
                  <div class="grid-cont-right">
                    <div class="grid-num">
                      {{ tableDeployment_others[item] }}
                    </div>
                    <div>{{ tabletask[item] }}</div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import imgurl from "../assets/img/img.jpg";
import {
  fetchDatasetsInfo,
  postCreateDatasets,
  postUploadDatasets,
  postDatasetsEdit,
  postAutoAnnotation,
  getManualAnnotation,
  homepage_getInfo,
} from "../api/index";
import { toRaw } from "vue";
import * as echarts from "echarts";
import { range } from "lodash";
export default {
  name: "HomePageRoot",
  setup() {
    const tabletask = ref([]);
    const tableData = ref([]);
    const tableModel = ref([]);
    const tableDeployment = ref([]);
    const tableGroup = ref([]);

    tableData.value = reactive([]);
    tableModel.value = reactive([]);
    tableDeployment.value = reactive([]);
    tableGroup.value = reactive([]);

    const tableData_others = ref([]);
    const tableModel_others = ref([]);
    const tableDeployment_others = ref([]);
    const tableGroup_others = ref([]);
    tableData_others.value = reactive([]);
    tableModel_others.value = reactive([]);
    tableDeployment_others.value = reactive([]);
    tableGroup_others.value = reactive([]);

    const store = useStore(); // 该方法用于返回store 实例

    tabletask.value.push(" ");
    tabletask.value.push("图像分类");
    tabletask.value.push("目标检测");
    tabletask.value.push("目标跟踪");
    tabletask.value.push("文本分类");
    tabletask.value.push("图像分割");

    let totalgroup = ref();
    let totaluser = ref();

    const gethomepageInfo = () => {
      homepage_getInfo(
        qs.stringify({
          username: store.state.token,
          token: store.state.token,
        }),
      ).then((response) => {
        console.log("response = ", response.data);

        tableData.value.push(response.data.root.dataset.所有任务);
        tableData.value.push(response.data.root.dataset.图像分类);
        tableData.value.push(response.data.root.dataset.目标检测);
        tableData.value.push(response.data.root.dataset.目标跟踪);
        tableData.value.push(response.data.root.dataset.文本分类);
        tableData.value.push(response.data.root.dataset.图像分割);

        tableModel.value.push(response.data.root.model.所有任务);
        tableModel.value.push(response.data.root.model.图像分类);
        tableModel.value.push(response.data.root.model.目标检测);
        tableModel.value.push(response.data.root.model.目标跟踪);
        tableModel.value.push(response.data.root.model.文本分类);
        tableModel.value.push(response.data.root.model.图像分割);

        tableDeployment.value.push(
          response.data.root.clouddeployment.所有任务 +
            response.data.root.localdeployment.所有任务,
        );
        tableDeployment.value.push(
          response.data.root.clouddeployment.图像分类 +
            response.data.root.localdeployment.图像分类,
        );
        tableDeployment.value.push(
          response.data.root.clouddeployment.目标检测 +
            response.data.root.localdeployment.目标检测,
        );
        tableDeployment.value.push(
          response.data.root.clouddeployment.目标跟踪 +
            response.data.root.localdeployment.目标跟踪,
        );
        tableDeployment.value.push(
          response.data.root.clouddeployment.文本分类 +
            response.data.root.localdeployment.文本分类,
        );
        tableDeployment.value.push(
          response.data.root.clouddeployment.图像分割 +
            response.data.root.localdeployment.图像分割,
        );

        tableGroup.value.push(response.data.root.dataset.图像分类);
        tableGroup.value.push(response.data.root.dataset.目标检测);
        tableGroup.value.push(response.data.root.dataset.目标跟踪);
        tableGroup.value.push(response.data.root.dataset.文本分类);
        tableGroup.value.push(response.data.root.dataset.图像分割);

        totalgroup.value = response.data.root.group;
        totaluser.value = response.data.root.user;
        //others

        tableData_others.value.push(response.data.others.dataset.所有任务);
        tableData_others.value.push(response.data.others.dataset.图像分类);
        tableData_others.value.push(response.data.others.dataset.目标检测);
        tableData_others.value.push(response.data.others.dataset.目标跟踪);
        tableData_others.value.push(response.data.others.dataset.文本分类);
        tableData_others.value.push(response.data.others.dataset.图像分割);

        tableModel_others.value.push(response.data.others.model.所有任务);
        tableModel_others.value.push(response.data.others.model.图像分类);
        tableModel_others.value.push(response.data.others.model.目标检测);
        tableModel_others.value.push(response.data.others.model.目标跟踪);
        tableModel_others.value.push(response.data.others.model.文本分类);
        tableModel_others.value.push(response.data.others.model.图像分割);

        tableDeployment_others.value.push(
          response.data.others.clouddeployment.所有任务 +
            response.data.others.localdeployment.所有任务,
        );
        tableDeployment_others.value.push(
          response.data.others.clouddeployment.图像分类 +
            response.data.others.localdeployment.图像分类,
        );
        tableDeployment_others.value.push(
          response.data.others.clouddeployment.目标检测 +
            response.data.others.localdeployment.目标检测,
        );
        tableDeployment_others.value.push(
          response.data.others.clouddeployment.目标跟踪 +
            response.data.others.localdeployment.目标跟踪,
        );
        tableDeployment_others.value.push(
          response.data.others.clouddeployment.文本分类 +
            response.data.others.localdeployment.文本分类,
        );
        tableDeployment_others.value.push(
          response.data.others.clouddeployment.图像分割 +
            response.data.others.localdeployment.图像分割,
        );
      });
    };

    console.log("-----");
    gethomepageInfo();

    return {
      /* gethomepageInfo, */
      tabletask,
      tableData,
      tableModel,
      tableDeployment,
      tableGroup,
      tableData_others,
      tableModel_others,
      tableDeployment_others,
      tableGroup_others,

      totalgroup,
      totaluser,
    };
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.grid-num {
  font-size: 30px;
  font-weight: bold;
}
.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}
.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}
.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}
.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}
.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}
.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}
.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}
.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}
.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}
.user-info-list span {
  margin-left: 70px;
}
.mgb20 {
  margin-bottom: 20px;
}
.todo-item {
  font-size: 14px;
}
.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
.schart {
  width: 100%;
  height: 300px;
}
</style>
