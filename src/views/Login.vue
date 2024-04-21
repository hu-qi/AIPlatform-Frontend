<template>
  <div class="login-wrap">
    <h1 align="center">
      人工智能开发平台
    </h1>
    <div class="ms-login">
      <div class="ms-title">
        登录
      </div>
      <el-form
        ref="login"
        :model="param"
        :rules="rules"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item
          align="center"
          prop="task_type"
        >
          <el-select
            v-model="param.task_type"
            placeholder="任务类型"
          >
            <el-option
              key="1"
              label="图像分类"
              value="图像分类"
            />
            <el-option
              key="2"
              label="目标检测"
              value="目标检测"
            />
            <el-option
              key="3"
              label="图像分割"
              value="图像分割"
            />
            <el-option
              key="4"
              label="文本分类"
              value="文本分类"
            />
            <el-option
              key="5"
              label="命名实体识别"
              value="named entity recognition"
            />
            <el-option
              key="6"
              label="文本实体关系抽取"
              value="relation extracion"
            />
            <el-option
              key="7"
              label="视频分类"
              value="video classification"
            />
            <el-option
              key="8"
              label="目标跟踪"
              value="目标跟踪"
            />
            <el-option
              key="9"
              label="语音识别"
              value="speech recognitio"
            />
            <el-option
              key="10"
              label="声音分类"
              value="audio classification"
            />
            <el-option
              key="11"
              label="时序数据预测"
              value="time series data prediction"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="param.username"
            placeholder="username"
          >
            <template #prepend>
              <el-button icon="el-icon-user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="param.password"
            type="password"
            placeholder="password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="submitForm()"
          >
            登录
          </el-button>
        </div>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="register()"
          >
            注册
          </el-button>
        </div>
        <div class="login-btn">
          <el-button
            type="info"
            @click="forgetPassword()"
          >
            忘记密码
          </el-button>
        </div>
        <!--<p class="login-tips">Tips : 用户名和密码随便填。</p>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { fetchLoginData, fetchUserInfo } from "../api/index";
import qs from "qs";

export default {
  setup() {
    const router = useRouter();
    const param = reactive({
      username: "",
      password: "",
      task_type: "图像分类",
    });
    const store = useStore();
    store.commit("clearTags");
    const rules = {
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      task_type: [
        { required: true, message: "请选择任务类型", trigger: "change" },
      ],
    };
    const login = ref(null);
    const submitForm = () => {
      console.log("you click the button-login");
      //  以下注释代码为原登陆界面代码
      /* fetchLoginData(qs.stringify({username: param.username, password: param.password}))
                .then((res) => {
                    console.log('Login');
                    console.log(res);
                    if (res.code == '200'){
                        ElMessage.success(res.msg);
                        localStorage.setItem("ms_username", param.username);
                        localStorage.setItem("task_type", param.task_type);
                        console.log(localStorage.getItem("task_type"));
                        router.push("/MyModel");
                    }
                    else {
                        ElMessage.error(res.msg);
                    }
                }); */
      localStorage.setItem("task_type", param.task_type);

      // 以下逻辑代码直接写在welcome_auth界面里
      store
        .dispatch("login", {
          username: param.username,
          password: param.password,
        })
        .then(() => {
          let nowrole = store.getters.token;
          console.log("nowrole gogogo = ", nowrole);
          if (nowrole.includes("root")) {
            router.push("/Homepage_root");
          } else if (nowrole.includes("admin")) {
            router.push("/Homepage_admin");
          } else {
            router.push("/Homepage");
          }
        });

      //router.push("/MyModel")
    };

    const register = () => {
      router.push("/register");
      console.log("注册");
    };
    const forgetPassword = () => {
      router.push("/forgetPassword");
      console.log("忘记密码");
    };

    //  未来将要修改的登陆函数部分的代码
    /* const handleLogin = () => {
            store.dispatch('user/login')
                .then(() => {
                    localStorage.setItem("ms_username", param.username);
                    localStorage.setItem("task_type", param.task_type);
                    console.log(localStorage.getItem("task_type"));
                    router.push("/MyModel")
                })
        } */

    return {
      param,
      rules,
      login,
      submitForm,
      register,
      forgetPassword,
    };
  },
  data() {},
  mounted: function () {},
  methods: {},
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
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
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
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
