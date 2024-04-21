<template>
  <div>
    <!-- 顶部按钮和图标 -->
    <el-button
      type="primary"
      @click="createGroup"
    >
      创建用户组
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 高级权限管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 权限信息显示表格 -->

    <div class="container">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <!-- 表格打印信息 -->
        <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        />
        <el-table-column
          prop="name"
          label="组织名称"
          align="center"
        />
        <el-table-column
          prop="roles_type"
          label="该组织管理者用户名称"
          align="center"
        />
        <el-table-column
          prop="task_promission"
          label="该组织的任务权限"
          align="center"
        />
        <!-- 编辑权限的操作，对应的是按钮，实现函数见下方 -->
        <el-table-column
          label="编辑操作"
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
              @click="handlegroupsSet(scope.$index, scope.row)"
            >
              权限配置
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handletaskSet(scope.$index, scope.row)"
            >
              任务类型
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

    <!-- 编辑弹出框 创建新用户组-->
    <el-dialog
      v-model="editVisible"
      title="创建用户组"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="组织名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="管理者账号">
          <el-input v-model="form.admin" />
        </el-form-item>
        <el-form-item label="管理者密码">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="请确认密码">
          <el-input
            v-model="form.twopassword"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="任务权限">
          <el-checkbox v-model="create_check1">
            图像分类
          </el-checkbox>
          <el-checkbox v-model="create_check2">
            目标检测
          </el-checkbox>
          <el-checkbox v-model="create_check3">
            目标跟踪
          </el-checkbox>
          <el-checkbox v-model="create_check4">
            图像分割
          </el-checkbox>
          <el-checkbox v-model="create_check5">
            文本分类
          </el-checkbox>
        </el-form-item>
        <!-- <el-checkbox v-model="create_check1">图像分类</el-checkbox>
                <el-checkbox v-model="create_check2">目标检测</el-checkbox>
                <el-checkbox v-model="create_check3">目标跟踪</el-checkbox>
                <el-checkbox v-model="create_check4">图像分割</el-checkbox> -->

        <!-- 组织管理者账号 -->

        <!-- <el-form-item label="描述" prop="desc">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addGroup"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 对组织任务权限进行配置 -->
    <el-dialog
      v-model="taskVisible"
      title="任务权限配置"
      width="30%"
    >
      <el-checkbox v-model="check1">
        图像分类
      </el-checkbox>
      <el-checkbox v-model="check2">
        目标检测
      </el-checkbox>
      <el-checkbox v-model="check3">
        目标跟踪
      </el-checkbox>
      <el-checkbox v-model="check4">
        图像分割
      </el-checkbox>
      <el-checkbox v-model="check5">
        文本分类
      </el-checkbox>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="taskVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="addtask"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户名称 -->
    <el-dialog
      v-model="nameVisible"
      title="编辑用户名称"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="组织名称">
          <el-input v-model="newName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="nameVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="namechange"
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
import { useRouter } from "vue-router";
import {
  groupcreate,
  group_info,
  groupdelete,
  groupnamechange,
  grouptaskchange,
} from "../api/user_permission";
import { dataTool } from "echarts";
export default {
  name: "Datasets",
  setup() {
    //  dialog变量
    const editVisible = ref(false);
    const taskVisible = ref(false);
    //  四个任务权限变量
    const check1 = ref(false);
    const check2 = ref(false);
    const check3 = ref(false);
    const check4 = ref(false);
    const check5 = ref(false);

    const create_check1 = ref(true);
    const create_check2 = ref(false);
    const create_check3 = ref(false);
    const create_check4 = ref(false);
    const create_check5 = ref(false);

    const createGroup = () => {
      console.log("创建用户组"); //待填写
      editVisible.value = true;
    };
    let form = reactive({
      name: "",
      admim: "",
      task_permission: "",
      password: "",
      twopassword: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      wechat: "",
      nickname: "",
      desc: "",
    });

    let task2 = "";
    const addGroup = () => {
      if (form.password != form.twopassword) {
        ElMessage.error("两次密码不同");
        onsole.log(create_check1, create_check2, create_check3, create_check4);
      } else {
        console.log(
          create_check1.value,
          create_check2.value,
          create_check3.value,
          create_check4.value,
        );
        task2 = "";
        if (create_check1.value) {
          task2 += "图像分类|";
        }
        if (create_check2.value) {
          task2 += "目标检测|";
        }
        if (create_check3.value) {
          task2 += "目标跟踪|";
        }
        if (create_check4.value) {
          task2 += "图像分割|";
        }
        if (create_check5.value) {
          task2 += "文本分类|";
        }
        console.log("task2", task2);

        groupcreate(
          qs.stringify({
            name: form.name,
            admin: form.admin,
            task_permission: task2,
            password: form.password,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
          }),
        ).then((res) => {
          console.log(res);
          if (res.code == "200") {
            ElMessage.success(res.msg);
            router.go(0);
          } else {
            ElMessage.error(res.msg);
          }
        });
        form.task_permission = "";
      }
    };

    //获取数初始信息
    let tableData = ref([]);

    group_info({ cur_username: localStorage.getItem("ms_username") }).then(
      (res) => {
        let obj = res.data.groupinfo;
        console.log("res.data.groupinfo = ", obj);
        length = obj.length;
        for (let i = 0; i < length; i++) {
          tableData.value.push({
            id: i,
            name: obj[i].name,
            roles_type: obj[i].admin,
            task_promission: obj[i].permissions,
          });
        }
        //console.log('tableData = ', tableData.value[1].task_promission[0])
      },
    );

    const router = useRouter();

    //  操作函数
    // ------------------------------------------------------
    //  名字修改
    let newName = ref("");
    let nowname;
    const nameVisible = ref(false);
    const handleChangeName = (index, row) => {
      nameVisible.value = true;
      nowname = row.name;
      console.log("用户名 = ", nowname, newName);
    };

    let Response_tmp;
    const namechange = () => {
      console.log("用户名 = ", nowname, newName);
      groupnamechange(
        qs.stringify({
          cur_name: nowname,
          new_name: newName.value,
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        console.log("delete res = ", res);
        Response_tmp = res;
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
      //setTimeout(() => {router.go(0);}, 500);

      console.log("Response_tmp = ", Response_tmp);
    };

    // ------------------------------------------------------
    //  用户组单个用户权限配置
    const handlegroupsSet = (index, row) => {
      console.log("row.id = ", row.id, " row.name = ", row.name);
      // group_name保存的是对应的需要更改项目权限的用户名字
      localStorage.setItem("group_name", row.name);
      router.push("/admin");
    };
    //  这里后续需要配置每个用户组下所有用户信息的接口

    //  任务权限配置
    const handletaskSet = (index, row) => {
      console.log("row.id = ", row.id, " row.name = ", row.name);
      nowname = row.name;
      // group_name保存的是对应的需要更改项目权限的用户名字
      taskVisible.value = true;
      console.log("tableData = ", tableData.value[row.id].task_promission);
      let tasklist = ["", "", "", ""];
    };

    let task = "";
    const addtask = () => {
      console.log(check1, check2, check3, check4);

      if (check1.value) {
        task += "图像分类|";
      }
      if (check2.value) {
        task += "目标检测|";
      }
      if (check3.value) {
        task += "目标跟踪|";
      }
      if (check4.value) {
        task += "图像分割|";
      }
      if (check5.value) {
        task += "文本分类|";
      }
      console.log(task);

      grouptaskchange(
        qs.stringify({
          cur_name: nowname,
          task_permission: task,
          cur_username: localStorage.getItem("ms_username"),
        }),
      ).then((res) => {
        console.log("delete res = ", res);
        if (res.code == "200") {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
      task = [];
    };

    //  删除权限
    const handleDelete = (index, row) => {
      console.log("row.id = ", row.id, " row.name = ", row.name);
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        groupdelete(
          qs.stringify({
            cur_name: row.name,
            delete: 1,
            cur_username: localStorage.getItem("ms_username"),
          }),
        ).then((res) => {
          console.log("delete res = ", res);
          if (res.code == "200") {
            ElMessage.success(res.msg);
          } else {
            ElMessage.error(res.msg);
          }
        });
        //router.go(0);
      });
    };

    return {
      Response_tmp,

      form,
      tableData,
      createGroup,
      editVisible,

      addGroup,
      handleChangeName,
      nameVisible,
      newName,
      namechange,
      nowname,
      handlegroupsSet,
      handletaskSet,
      taskVisible,
      check1,
      check2,
      check3,
      check4,
      check5,
      addtask,
      task,
      create_check1,
      create_check2,
      create_check3,
      create_check4,
      create_check5,
      handleDelete,
    };
  },
};
</script>

<style scoped></style>
