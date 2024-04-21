<template>
  <el-button
    type="primary"
    @click="createversion"
  >
    创建版本
  </el-button>
  <el-table
    ref="multipleTable"
    :data="dataset_tableData"
    border
    class="table"
    header-cell-class-name="table-header"
  >
    <el-table-column
      prop="id"
      label="ID"
      width="55"
      align="center"
    />
    <el-table-column
      prop="version"
      label="版本号"
      align="centser"
    />
    <el-table-column
      prop="commit"
      label="信息"
      align="centser"
    />
    <el-table-column
      label="操作"
      align="center"
    >
      <template #default="scope">
        <el-button
          type="text"
          icon="el-icon-edit"
          @click="handleChangeName(scope.$index, scope.row)"
        >
          修改
        </el-button>
        <el-button
          type="text"
          icon="el-icon-edit"
          @click="selectversion(scope.$index, scope.row)"
        >
          选择
        </el-button>
        <el-button
          type="text"
          icon="el-icon-delete"
          class="red"
          @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="editVisible"
    title="修改版本描述"
    width="30%"
  >
    <el-form label-width="100px">
      <el-form-item
        label="描述"
        prop="desc"
      >
        <el-input
          v-model="form.desc"
          type="textarea"
          rows="5"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="changedec"
        >确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="createVisible"
    title="修改版本描述"
    width="30%"
  >
    <el-form label-width="100px">
      <el-form-item
        label="描述"
        prop="desc"
      >
        <el-input
          v-model="form.desc"
          type="textarea"
          rows="5"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addversion"
        >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import { useRouter } from "vue-router";
import {
  dataset_version,
  post_dataset_version,
  create_dataset_version,
} from "../api/index.js";
export default {
  name: "Datasets",
  setup() {
    let dataset_tableData = ref([]);

    //获取数据集初始信息
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    const editVisible = ref(false);
    const createVisible = ref(false);

    let form = reactive({
      desc: "",
    });

    dataset_version(task_type, {
      dataset_name: localStorage.getItem("dataset_version"),
      username: localStorage.getItem("ms_username"),
    }).then((res) => {
      console.log("res = ", res);
      let obj = res.data.versions;
      //console.log('res.data.dataset_permissions = ',obj)
      length = obj.length;
      for (let i = 0; i < length; i++) {
        dataset_tableData.value.push({
          id: i,
          version: obj[i].version,
          commit: obj[i].description,
        });
      }
    });

    let local_index;
    const handleChangeName = (index, row) => {
      console.log("修改版本描述"); //待填写
      local_index = index;
      editVisible.value = true;
    };

    const changedec = () => {
      post_dataset_version(
        task_type,
        qs.stringify({
          version: dataset_tableData.value[local_index].version,
          dataset_name: localStorage.getItem("dataset_version"),
          username: localStorage.getItem("ms_username"),
          description: form.desc,
        }),
      ).then((res) => {
        //console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };

    // 删除操作
    const handleDelete = (index, row) => {
      console.log("删除");
      local_index = index;
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          post_dataset_version(
            task_type,
            qs.stringify({
              version: dataset_tableData.value[local_index].version,
              dataset_name: localStorage.getItem("dataset_version"),
              username: localStorage.getItem("ms_username"),
              delete: 1,
            }),
          ).then((res) => {
            //console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };

    const createversion = () => {
      createVisible.value = true;
    };

    const addversion = () => {
      create_dataset_version(
        task_type,
        qs.stringify({
          dataset_name: localStorage.getItem("dataset_version"),
          username: localStorage.getItem("ms_username"),
          description: form.desc,
        }),
      );
    };

    const selectversion = (index, row) => {
      post_dataset_version(
        task_type,
        qs.stringify({
          version: dataset_tableData.value[index].version,
          dataset_name: localStorage.getItem("dataset_version"),
          username: localStorage.getItem("ms_username"),
          select: 1,
        }),
      ).then((res) => {
        //console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    };

    return {
      dataset_tableData,
      editVisible,
      handleChangeName,
      form,
      local_index,
      changedec,
      handleDelete,

      createversion,
      createVisible,
      addversion,

      selectversion,
    };
  },
};
</script>

<style scoped></style>
