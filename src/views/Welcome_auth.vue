<template>
  <body
    v-loading.fullscreen.lock="true"
    element-loading-text="页面加载中"
  />

  <div class="ms-title">
    登录
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { login_auth } from "../api/index";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  setup() {
    const router = useRouter();
    // vue获取iframe传递过来的信息
    const getiframeMsg = () => {
      const res = event.data;
      console.log(event);
      if (res.cmd == "myIframe") {
        console.log(res);
        // 在这里实现login功能
        // 从url获取authcode(我记得是authcode)
        url = window.location.href;
        dz_url = url.split("#")[1];
        cs = dz_url.split("?")[1];
        cs_arr = cs.split("&");
        for (var i = 0; i < cs_arr.length; i++) {
          //遍历数组，拿到json对象
          cs[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
        }
        authcode = cs.authcode;

        // 前端向后端发起login_auth请求
        login_auth(authcode).then((res) => {
          console.log(res);
          if (res.code == 200) {
            ElMessage.success(res.msg);
            let nowrole = res.token; // username明文
            console.log("nowrole gogogo = ", nowrole);
            if (nowrole.includes("root")) {
              router.push("/Homepage_root");
            } else if (nowrole.includes("admin")) {
              router.push("/Homepage_admin");
            } else {
              router.push("/Homepage");
            }
          } else {
            ElMessage.error(res.msg);
          }
        });

        // store.dispatch('login', {username: param.username}).then(() => {
        //     let nowrole = store.getters.token;
        //     console.log('nowrole gogogo = ', nowrole)
        //     if(nowrole.includes('root')){
        //         router.push("/Homepage_root")
        //     }
        //     else if(nowrole.includes('admin')){
        //         router.push("/Homepage_admin")
        //     }
        //     else{
        //         router.push("/Homepage")
        //     }
        //     })
      }
      if (res.cmd == "docs") {
        console.log(res);
        router.push("https://shanhu.hpccube.com:8080/pages/9a7ee40fc232253e/");
      }
    };
    // vue向iframe传递信息
    const vueSendMsg = () => {
      const iframeWindow = this.$refs.iframe.contentWindow;
      iframeWindow.postMessage(
        {
          cmd: "myVue",
          params: {
            info: "Vue向iframe传递的消息",
          },
        },
        "*",
      );
    };
    // 触发iframe中的方法
    const iframeMethods = () => {
      this.$refs.iframe.contentWindow.triggerByVue("通过Vue触发iframe中的方法");
    };
    return {
      htmlSrc: "/static/index.html",
      getiframeMsg,
      vueSendMsg,
      iframeMethods,
    };
  },
  data() {
    return {};
  },
  mounted() {
    // window.addEventListener('message',this.getiframeMsg)
    this.login();
  },
  methods: {
    login() {
      const router = useRouter();
      const store = useStore();
      let url = window.location.href;
      let dz_url = url.split("#")[1];
      let cs = dz_url.split("?")[1];
      let cs_arr = cs.split("&");
      let paramsObj = {};
      for (var i = 0; i < cs_arr.length; i++) {
        //遍历数组，拿到json对象
        paramsObj[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
      }
      let token = paramsObj["token"];

      // 前端向后端发起login_auth请求
      let fd = new FormData();
      fd.append("token", token);
      login_auth(fd).then((res) => {
        console.log(res);
        if (res.code == 200) {
          // ElMessage.success(res.msg);
          let nowrole = res.token; // username明文
          console.log("nowrole gogogo = ", nowrole);
          store.dispatch("login_auth", { username: nowrole }).then(() => {
            let nowrole = store.getters.token;
            localStorage.setItem("task_type", "图像分类");
            console.log("nowrole gogogo = ", nowrole);
            if (nowrole.includes("root")) {
              router.push("/Homepage_root");
            } else if (nowrole.includes("admin")) {
              router.push("/Homepage_admin");
            } else {
              router.push("/Homepage");
            }
          });

          // if(nowrole.includes('root')){
          //     router.push("/Homepage_root")
          // }
          // else if(nowrole.includes('admin')){
          //     router.push("/Homepage_admin")
          // }
          // else{
          //     router.push("/Homepage")
          // }
        } else {
          ElMessage.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
