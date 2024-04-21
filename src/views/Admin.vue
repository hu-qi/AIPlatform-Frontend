<template>
  <div>
    <!-- 顶部按钮和图标 -->
    <el-button
      type="primary"
      @click="createUser"
    >
      创建用户
    </el-button>
    <el-button
      type="primary"
      @click="createBatchUser"
    >
      批量创建用户
    </el-button>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades" /> 权限管理
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
          label="用户名称"
          align="center"
        />
        <el-table-column
          prop="roles_type"
          label="身份"
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
              @click="handleRolesSet(scope.$index, scope.row)"
            >
              权限配置
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

    <!-- 编辑弹出框 创建新用户-->
    <el-dialog
      v-model="editVisible"
      title="创建用户"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="用户名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="form.twopassword"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>

        <!-- 权限分配复选框 -->
        <el-form-item label="任务权限">
          <el-checkbox v-model="create_check1">
            模型
          </el-checkbox>
          <el-checkbox v-model="create_check2">
            数据
          </el-checkbox>
          <el-checkbox v-model="create_check3">
            部署
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="adduser"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 批量创建用户-->
    <el-dialog
      v-model="batcheditVisible"
      title="批量创建用户"
      width="30%"
    >
      <el-form label-width="100px">
        <el-form-item label="用户名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <div class="block">
          <span class="demonstration">创建数量</span>
          <el-slider v-model="value1" />
        </div>
        <!-- 权限分配复选框 -->
        <el-form-item label="任务权限">
          <el-checkbox v-model="create_check1">
            模型
          </el-checkbox>
          <el-checkbox v-model="create_check2">
            数据
          </el-checkbox>
          <el-checkbox v-model="create_check3">
            部署
          </el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batcheditVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="adduser"
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
        <el-form-item label="用户名称">
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
import { user_info } from "../api/admin";
import { usercreate, userdelete, usernamechange } from "../api/admin";
export default {
  name: "Datasets",
  setup() {
    const create_check1 = ref(true);
    const create_check2 = ref(false);
    const create_check3 = ref(false);

    //  创建用户权限部分代码

    let value1 = ref(20);

    //-----------------------------------------------------------------------

    //  创建用户
    const editVisible = ref(false);
    const createUser = () => {
      console.log("创建用户"); //待填写
      editVisible.value = true;
      value1.value = 0;
    };

    let form = reactive({
      num_users: "",
      name: "",
      group: "",
      email: "",
      password: "",
      twopassword: "",
      first_name: "",
      last_name: "",
      phone: "",
      wechat: "",
      nickname: "",
      desc: "",
    });

    form.group = localStorage.getItem("group_name");
    console.log("form.group = ", form.group);

    const adduser = () => {
      console.log(
        create_check1.value,
        create_check2.value,
        create_check3.value,
      );
      console.log("nums = ", value1.value);
      if (form.password != form.twopassword) {
        ElMessage.error("两次密码不同");
      } else {
        usercreate(
          qs.stringify({
            num_users: value1.value,
            username: form.name,
            group: form.group,
            password: form.password,
            email: form.email,
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            wechat: form.wechat,
            nickname: form.nickname,
            data: create_check1.value,
            model: create_check2.value,
            deploy: create_check3.value,
          }),
        ).then((res) => {
          console.log(res);
          if (res.code == "200") {
            ElMessage.success(res.msg);
          } else {
            ElMessage.error(res.msg);
          }
        });
        router.go(0);
      }
    };

    const batcheditVisible = ref(false);
    const createBatchUser = () => {
      console.log("批量创建用户"); //待填写
      batcheditVisible.value = true;
    };

    //-------------------------------------------------------------------
    //获取数初始信息
    let tableData = ref([]);
    let roles_type = localStorage.getItem("roles");
    console.log("roles_type = ", roles_type);
    const router = useRouter();
    console.log("---=----", localStorage.getItem("group_name"));
    user_info({
      group_name: localStorage.getItem("group_name"),
      cur_username: localStorage.getItem("ms_username"),
    }).then((res) => {
      console.log("res = ", res);
      let obj = res.data.groupuserinfo;
      console.log("res.data.groupuserinfo = ", obj);

      length = obj.length;
      console.log("length = ", length);
      for (let i = 0; i < length; i++) {
        console.log(obj[i]);
        tableData.value.push({
          id: i,
          name: obj[i].username,
          roles_type: obj[i].description,
        });
      }
      console.log("---------------------------------");
    });

    //  操作函数
    //  名字修改
    let newName = ref("");
    let nowname;
    const nameVisible = ref(false);
    const handleChangeName = (index, row) => {
      console.log("用户名 = ", newName);
      //  nowname是在这修改的
      nowname = row.name;
      nameVisible.value = true;
    };

    const namechange = () => {
      console.log("用户名 = ", newName);
      usernamechange(
        qs.stringify({
          cur_username: nowname,
          username: newName.value,
        }),
      ).then((res) => {
        console.log("namechange res = ", res);
        router.go(0);
      });
    };
    //  项目权限配置
    const handleRolesSet = (index, row) => {
      console.log("row.id = ", row.id, " row.name = ", row.name);
      // admin_projectname保存的是对应的需要更改项目权限的用户名字
      localStorage.setItem("admin_projectname", row.name);
      console.log(localStorage.getItem("admin_projectname"));
      router.push("/index2");
    };

    const handleDelete = (index, row) => {
      console.log("row.id = ", row.id, " row.name = ", row.name);
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        userdelete(
          qs.stringify({
            username: row.name,
            cur_username: localStorage.getItem("ms_username"),
            delete: 1,
          }),
        ).then((res) => {
          console.log("delete res = ", res);
        });
        router.go(0);
      });
    };

    return {
      form,
      tableData,
      createUser,
      editVisible,
      value1,

      adduser,
      createBatchUser,
      batcheditVisible,

      handleChangeName,
      nameVisible,
      newName,
      namechange,
      nowname,
      handleRolesSet,

      handleDelete,

      create_check1,
      create_check2,
      create_check3,
    };
  },
};
</script>

<style scoped></style>
