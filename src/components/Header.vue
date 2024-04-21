<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div
      class="collapse-btn"
      @click="collapseChage"
    >
      <i
        v-if="!collapse"
        class="el-icon-s-fold"
      />
      <i
        v-else
        class="el-icon-s-unfold"
      />
    </div>
    <div class="logo">
      人工智能开发平台
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 下拉菜单 -->
        <el-dropdown
          class="user-name"
          trigger="click"
          @command="handleTaskCommand"
        >
          <span class="el-dropdown-link">
            {{ task_type }}
            <i class="el-icon-caret-bottom" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="ImageClassification">
                图像分类
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="ObjectDetection"
              >
                目标检测
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="ObjectTracking"
              >
                目标跟踪
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="ImageSegmentation"
              >
                图像分割
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="TextCls"
              >
                文本分类
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="ActionRecognition"
              >
                动作分类
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <div class="user-avator">
          <img src="../assets/img/img.jpg">
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown
          class="user-name"
          trigger="click"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!--<a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                                <el-dropdown-item>项目仓库</el-dropdown-item>
                            </a>-->
              <el-dropdown-item command="user">
                个人中心
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="loginout"
              >
                退出登录
              </el-dropdown-item>
              <el-dropdown-item
                divided
                command="myrole"
              >
                你的身份是
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { fetchUserInfo, postLogoutInfo } from "../api/index";
import qs from "qs";
import { ElMessage } from "element-plus";
export default {
  setup() {
    let tt = {
      "image classification": "图像分类",
      "object detection": "目标检测",
      "object tracking": "目标跟踪",
      "image segmentation": "图像分割",
      "text classification": "文本分类",
      "action recognition": "动作分类",
    };
    const username = localStorage.getItem("ms_username");
    let task_type = localStorage.getItem("task_type");
    const message = 2;

    const store = useStore();
    const collapse = computed(() => store.state.collapse);
    // 侧边栏折叠
    const collapseChage = () => {
      store.commit("handleCollapse", !collapse.value);
    };

    onMounted(() => {
      if (document.body.clientWidth < 1500) {
        collapseChage();
      }
    });

    // 用户名下拉菜单选择事件
    const router = useRouter();
    const handleCommand = (command) => {
      if (command == "loginout") {
        store.dispatch("logout").then(() => {
          // router.push("/login");
          window.location.href =
            "https://www.scnet.cn/ui/acw/index.html#/my-product/app-platform";
        });
        //router.push("/login");
        localStorage.removeItem("ms_username");
        //router.go(0)
        /* postLogoutInfo(qs.stringify({username: username})).
                    then((res) => {
                        console.log(res);
                });
                localStorage.removeItem("ms_username");
                router.push("/login"); */
      } else if (command == "user") {
        fetchUserInfo().then((res) => {
          console.log(res);
        });
        router.push("/user");
      } else if (command == "myrole") {
        let msg;
        let role = store.getters.roles;
        console.log("role ======", role);
        if (role.includes("超级管理员")) {
          msg = "超级管理员";
        } else if (role.includes("组管理员")) {
          msg = "组管理员";
        } else {
          msg = "普通用户";
        }
        ElMessage.success(msg);
      }
    };

    console.log("task_permission:getter = ", store.getters.task_permission);

    const handleTaskCommand = (command) => {
      if (command == "ImageClassification") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "图像分类");
        router.go(0);
        //router.push("/MyModel");
      } else if (command == "ObjectDetection") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "目标检测");
        router.go(0);
        //router.push("/MyModel");
      } else if (command == "ObjectTracking") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "目标跟踪");
        router.go(0);
      } else if (command == "ImageSegmentation") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "图像分割");
        router.go(0);
      } else if (command == "TextCls") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "文本分类");
        router.go(0);
      } else if (command == "ActionRecognition") {
        localStorage.removeItem("task_type");
        localStorage.setItem("task_type", "动作识别");
        router.go(0);
      }
    };

    return {
      username,
      message,
      collapse,
      collapseChage,
      handleCommand,
      task_type,
      handleTaskCommand,
    };
  },
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 400px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
