<template>
  <div class="wrap">
    <iframe
      ref="iframe"
      :src="htmlSrc"
      width="100%"
      height="100%"
      frameborder="0"
    />
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    // vue获取iframe传递过来的信息
    const getiframeMsg = () => {
      const res = event.data;
      console.log(event);
      if (res.cmd == "myIframe") {
        console.log(res);
        router.push("/login");
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
    return {
      // htmlSrc: "../../static/index.html",
    };
  },
  mounted() {
    window.addEventListener("message", this.getiframeMsg);
  },
  methods: {},
};
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
