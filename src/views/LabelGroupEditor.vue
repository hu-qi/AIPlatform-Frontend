<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 标签组： {{ LabelGroupName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-button
      type="primary"
      @click="createLabel"
    >
      添加标签
    </el-button>

    <div class="container">
      <el-table
        ref="multipleTable"
        :data="labelData"
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
          prop="name"
          label="标签名"
          align="center"
        />
        <!--<el-table-column prop="annotation_status" label="已标注样本数量" align="center"></el-table-column>-->
        <!--<el-table-column prop="desc" label="描述" align="center"></el-table-column>-->
        <el-table-column
          label="操作"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
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
    </div>

    <el-dialog
      v-model="createVisible"
      title="创建新标签"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="标签名称">
          <el-input v-model="newLabelname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addLabel"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editVisible"
      title="编辑标签名"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="标签名称">
          <el-input v-model="newLabelname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editLabel"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import {
  fetchLabelGroupInfo,
  postCreateLabel,
  postLabelEdit,
} from "../api/index";
import { useRouter } from "vue-router";
export default {
  name: "LabelGroupEditor",
  setup() {
    let labelData = ref([]);
    let LabelGroupName = localStorage.getItem("labelGroupName");
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    //let labelGroupIndex = localStorage.getItem('labelGroupNameIndex');
    console.log(LabelGroupName);
    onUnmounted(() => {
      console.log("unmounted!");
      localStorage.removeItem("labelGroupName");
      console.log(localStorage.getItem("labelGroupName"));
    });

    const getlabelInfo = () => {
      console.log("标签组编辑初始化");
      console.log(username);
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        let obj1 = JSON.parse(res.data.labels[LabelGroupName]);
        console.log(obj1);
        let length = obj1.length;
        for (var i = 0; i < length; i++) {
          labelData.value.push({
            id: i,
            name: obj1[i].fields.name,
          });
        }
      });
    };
    getlabelInfo();
    let newLabelname = ref("");
    const editVisible = ref(false);
    const createVisible = ref(false);
    const createLabel = () => {
      console.log("创建新标签"); //待填写
      createVisible.value = true;
    };

    const addLabel = () => {
      console.log("请求添加标签"); //待填写
      console.log(newLabelname.value._rawValue);
      if (newLabelname.value == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postCreateLabel(
        task_type,
        qs.stringify({
          name: newLabelname.value,
          username: username,
          group_name: LabelGroupName,
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          createVisible.value = false;
          labelData.value = [];
          getlabelInfo();
          /*labelData.value.push({
                                id: labelData.value.length,
                                name: newLabelname,
                            });*/
        } else {
          ElMessage.error(res.msg);
        }
      });
    };
    //修改标签
    let localIndex = 0;
    const handleEdit = (index, row) => {
      //newLabelname = '';
      editVisible.value = true;
      localIndex = index;
      console.log("编辑标签"); //待填写
    };
    const editLabel = () => {
      console.log("修改标签名"); //待填写
      //console.log(typeof(labelData.value[localIndex].name));
      if (newLabelname.value == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postLabelEdit(
        task_type,
        qs.stringify({
          name: labelData.value[localIndex].name,
          new_name: newLabelname.value,
          username: username,
        }),
      ).then((res) => {
        //console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          labelData.value = [];
          getlabelInfo();
        } else {
          ElMessage.error(res.msg);
        }
      });
      editVisible.value = false;
    };
    //删除
    const handleDelete = (index, row) => {
      console.log("删除"); //待填写
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          postLabelEdit(
            task_type,
            qs.stringify({
              name: labelData.value[index].name,
              username: username,
              delete: 1,
            }),
          ).then((res) => {
            //console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              labelData.value = [];
              getlabelInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };

    return {
      labelData,
      LabelGroupName,
      newLabelname,
      createLabel,
      editVisible,
      addLabel,
      handleEdit,
      createVisible,
      editLabel,
      handleDelete,
    };
  },
};
</script>

<style scoped></style>
