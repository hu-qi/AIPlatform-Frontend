<template>
  <i class="el-icon-lx-cascades" /> 平台模式
  <el-checkbox v-model="create_check2">
    简便模式
  </el-checkbox>
  <el-checkbox v-model="create_check3">
    专业模式
  </el-checkbox>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  fetchDatasetsInfo,
  postCreateDatasets,
  postUploadDatasets,
  postDatasetsEdit,
  postAutoAnnotation,
  getManualAnnotation,
} from "../api/index";
export default {
  name: "Platform",
  setup() {
    const create_check1 = ref(true);
    const create_check2 = ref(false);
    const create_check3 = ref(false);
    const create_check4 = ref(false);
    const create_check5 = ref(false);

    return {
      create_check2,
      create_check3,
    };
  },
};
</script>

<style scoped></style>
