<template>
  <div class="login-wrap">
    <div class="ms-register">
      <div class="ms-title">
        忘记密码
      </div>
      <el-form
        ref="login"
        :model="user"
        :rules="rules"
        label-width="100px"
        class="ms-content"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="user.username"
            placeholder="username"
          >
            <template #prepend>
              <el-button icon="el-icon-user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="user.email"
            placeholder="email"
          >
            <template #prepend>
              <el-button icon="el-icon-message" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="concern()"
          >
            发送密码至邮箱
          </el-button>
          <el-button
            type="primary"
            @click="cancel()"
          >
            取消
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { fetchRegisterData, postUserForget } from "../api/index";
import qs from "qs";
export default {
  setup() {
    console.log(localStorage.getItem("ms_username"));
    const router = useRouter();
    const user = reactive({
      username: "",
      password: "",
      password2: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      wechat: "",
      nickname: "",
    });
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
    };
    const concern = () => {
      postUserForget(
        qs.stringify({ username: user.username, email: user.email }),
      ).then((res) => {
        console.log("发送邮件");
        console.log(res);
        if (res.code == "200") {
          ElMessage.success(res.msg);
          router.push("/login");
        } else {
          ElMessage.success(res.msg);
        }
      });
    };
    const cancel = () => {
      console.log("取消");
      router.push("/login");
    };
    return {
      user,
      rules,
      concern,
      cancel,
    };
  },
};
</script>
<!--在 CSS 中，类选择器以一个点"."号显示-->
<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #303133ff;
  border-bottom: 1px solid #ddd;
}
.ms-register {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 30%;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 40%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
