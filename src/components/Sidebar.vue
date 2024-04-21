<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu
            :key="item.index"
            :index="item.index"
          >
            <template #title>
              <i :class="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :key="subItem.index"
                :index="subItem.index"
              >
                <template #title>
                  {{ subItem.title }}
                </template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :key="subItem.index"
                :index="subItem.index"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            :key="item.index"
            :index="item.index"
          >
            <i :class="item.icon" />
            <template #title>
              {{ item.title }}
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup() {
    const items = [
      {
        //首页
        icon: "el-icon-lx-calendar",
        index: "/Homepage",
        title: "首页",
      },
      /*
            {//工程管理相关
                icon: "el-icon-lx-calendar",
                index: "0",
                title: "工程管理",
                subs:[
                    {
                        index: "/Projects",
                        title: "工程管理",
                    }
                ]
            },
            */
      {
        //数据集相关
        icon: "el-icon-lx-calendar",
        index: "1",
        title: "数据中心",
        subs: [
          {
            index: "/Datasets",
            title: "我的数据",
          },
          {
            index: "/DatasetsPublic",
            title: "公共数据",
          } /*,
                    {
                        index: "/Test",
                        title: "Test",
                    }*/,
        ],
      },
      {
        //模型相关
        icon: "el-icon-lx-calendar",
        index: "2",
        title: "模型中心",
        subs: [
          {
            index: "/MyModel",
            title: "我的模型",
          },
          {
            index: "/MyModelPublic",
            title: "公共模型",
          },
        ],
      },
      {
        //部署相关
        icon: "el-icon-lx-calendar",
        index: "3",
        title: "部署中心",
        subs: [
          {
            index: "/CloudDeployment",
            title: "云部署",
          },
          {
            index: "/LocalDeployment",
            title: "本地部署",
          },
          {
            index: "/CloudDeployment_public",
            title: "公共云部署",
          },
          {
            index: "/LocalDeployment_public",
            title: "公共本地部署",
          },
        ],
      },
      {
        //配置相关
        icon: "el-icon-lx-calendar",
        index: "4",
        title: "配置中心",
        subs: [
          {
            index: "/user",
            title: "个人信息",
          },
          {
            index: "/Platform",
            title: "平台设置",
          },
        ],
      },

      {
        //配置相关
        icon: "el-icon-lx-calendar",
        index: "5",
        title: "任务管理",
        subs: [
          {
            index: "/Task_training",
            title: "训练任务",
          },
          {
            index: "/Task_Annotation",
            title: "标注任务",
          },
          {
            index: "/Task_Test",
            title: "测试任务",
          },
        ],
      },
    ];

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    let nowrole = store.getters.roles;
    console.log("nowrole = ", nowrole);

    if (nowrole.includes("超级管理员")) {
      items[4].subs.push({
        //项目权限相关
        icon: "el-icon-lx-calendar",
        index: "/root",
        title: "组织管理",
      });
      items[4].subs.push({
        //项目权限相关
        icon: "el-icon-lx-calendar",
        index: "/admin",
        title: "用户管理",
      });
    } else if (nowrole.includes("组管理员")) {
      items[4].subs.push({
        //项目权限相关
        icon: "el-icon-lx-calendar",
        index: "/admin",
        title: "用户管理",
      });
    }

    if (nowrole.includes("超级管理员")) {
      items[0] = {
        //首页
        icon: "el-icon-lx-calendar",
        index: "/Homepage_root",
        title: "首页",
      };
    } else if (nowrole.includes("组管理员")) {
      items[0] = {
        //首页
        icon: "el-icon-lx-calendar",
        index: "/Homepage_admin",
        title: "首页",
      };
    }

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    return {
      items,
      onRoutes,
      collapse,
      nowrole,
    };
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 170px;
}
.sidebar > ul {
  height: 100%;
}
</style>
