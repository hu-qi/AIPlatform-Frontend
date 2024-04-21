<template>
  <div>
    <!--<router-view v-if="isRouterAlive"></router-view>-->
    <el-button
      type="primary"
      @click="createLabelGroup"
    >
      创建标签组
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 标签组管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <el-table
        ref="multipleTable"
        :data="labelGroupData"
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
          label="标签组名称"
          align="center"
        />
        <el-table-column
          prop="task_type"
          label="任务类型"
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
              @click="handleChangeName(scope.$index, scope.row)"
            >
              修改名称
            </el-button>
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
      title="创建标签组"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="标签组名称">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addLabelGroup"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="nameVisible"
      title="编辑标签组名"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="标签组名称">
          <el-input v-model="newLabelname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="nameLabelGroup"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import qs from "qs";
import {
  fetchLabelGroupInfo,
  postCreateLabelGroup,
  postLabelGroupEdit,
} from "../api/index";
import { useRouter } from "vue-router";
export default {
  name: "LabelGroup",
  setup() {
    const labelGroupData = ref([]);
    const isRouterAlive = ref(false);
    let username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const router = useRouter();
    //let importVisible = false;
    //获取标签组初始信息
    let tt = {
      "image classification": "图像分类",
      "object detection": "目标检测",
      "object tracking": "目标跟踪",
    };
    const getlabelGroupInfo = () => {
      console.log("标签组管理初始化");
      fetchLabelGroupInfo(task_type, { username: username }).then((res) => {
        let obj = JSON.parse(res.data.labelgroupinfo);
        let length = obj.length;
        labelGroupData.value = reactive([]);
        for (let i = 0; i < length; i++) {
          labelGroupData.value.push({
            id: i,
            name: obj[i].fields.name,
            task_type: tt[obj[i].fields.task_type],
          });
        }
      });
    };
    getlabelGroupInfo();
    //创建标签组
    const createVisible = ref(false);
    let form = reactive({
      name: "",
      task_type: "",
      desc: "",
    });
    const createLabelGroup = () => {
      console.log("创建标签组"); //待填写
      createVisible.value = true;
    };

    const addLabelGroup = () => {
      console.log("请求添加标签组"); //待填写
      if (form.name == "") {
        ElMessage.error("名称不能为空");
        return;
      }
      postCreateLabelGroup(
        task_type,
        qs.stringify({
          name: form.name,
          username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        if (res.code == "200") {
          ElMessage.success(res.msg);
          /*labelGroupData.value.push({
                                id: tableData.value.length,
                                name: form.name,
                                task_type: 'image classification',
                            });*/
          //router.push('/LabelGroup');
          getlabelGroupInfo();
        } else {
          ElMessage.error(res.msg);
        }
      });
      createVisible.value = false;
    };

    const handleEdit = (index, row) => {
      console.log("编辑标签组"); //待填写
      router.push("/LabelGroupEditor");
      //console.log(index);
      localStorage.setItem("labelGroupName", labelGroupData.value[index].name);
      //localStorage.setItem('labelGroupNameIndex', index);
      //console.log(localStorage.getItem('labelGroupName'));
    };

    //删除
    const handleDelete = (index, row) => {
      console.log("删除"); //待填写
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          //ElMessage.success("删除成功");
          //labelData.value.splice(index, 1);
          postLabelGroupEdit(
            task_type,
            qs.stringify({
              username: username,
              name: labelGroupData.value[index].name,
              delete: 1,
            }),
          ).then((res) => {
            //console.log(res);
            if (res.code == 200) {
              ElMessage.success(res.msg);
              getlabelGroupInfo();
            } else {
              ElMessage.error(res.msg);
            }
          });
        })
        .catch(() => {});
    };
    const nameVisible = ref(false);
    let newLabelname = ref("");
    let localIndex = 0;
    const handleChangeName = (index, row) => {
      console.log("修改标签组名"); //待填写
      localIndex = index;
      nameVisible.value = true;
    };

    const nameLabelGroup = () => {
      console.log("确定修改标签组名"); //待填写
      if (newLabelname.value == "") {
        ElMessage.error("名称不能为空");
        return;
      }

      postLabelGroupEdit(
        task_type,
        qs.stringify({
          name: labelGroupData.value[localIndex].name,
          new_name: newLabelname.value,
          username: username,
        }),
      ).then((res) => {
        //console.log(res);
        if (res.code == 200) {
          ElMessage.success(res.msg);
          getlabelGroupInfo();
        } else {
          ElMessage.error(res.msg);
        }
      });
      nameVisible.value = false;
    };

    return {
      labelGroupData,
      createLabelGroup,
      createVisible,
      form,
      addLabelGroup,
      handleEdit,
      handleDelete,
      handleChangeName,
      nameVisible,
      newLabelname,
      nameLabelGroup,
      isRouterAlive,
    };
  },
};
</script>

<style scoped></style>
