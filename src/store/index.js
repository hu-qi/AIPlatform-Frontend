import { createStore } from "vuex";
import getters from "/src/store/getters.js";
import { getInfo } from "/src/api/user_permission.js";
import { fetchLoginData_auth, fetchLoginData } from "/src/api/index.js";
import { logout } from "/src/api/user_permission.js";
import {
  getToken,
  setToken,
  removeToken,
  setTokenName,
  getTokenName,
} from "/src/utils/auth.js";
import router from "/src/router/index.js";
import { resetRouter } from "/src/router/index.js";
import qs from "qs";
//import { TextModes } from "@vue/compiler-core";
import { filterAsyncRoutes } from "/src/store/modules/permission.js";
import { asyncRouterMap } from "/src/router/index.js";
import { constantRouterMap } from "/src/router/index.js";

export default createStore({
  state: {
    //存储基本数据
    //  原内容
    tagsList: [],
    collapse: false,

    //  新增的user.js的内容
    token: getToken(),
    name: "",
    avatar: "",
    introduction: "",
    roles: [],

    //  新增的permiss.js的内容
    routes: [],
    addRoutes: [],
  },
  mutations: {
    //store中更改state数据状态的唯一方法（mutations必须是同步函数）
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
    },
    setTagsItem(state, data) {
      state.tagsList.push(data);
    },
    clearTags(state) {
      state.tagsList = [];
    },
    closeTagsOther(state, data) {
      state.tagsList = data;
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i];
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data.$router.push(state.tagsList[i + 1].path);
          } else if (i > 0) {
            data.$router.push(state.tagsList[i - 1].path);
          } else {
            data.$router.push("/");
          }
          state.tagsList.splice(i, 1);
          break;
        }
      }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data;
    },

    //  mutations of user.js
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_TASK_PERMISSION: (state, task_permission) => {
      state.task_permission = task_permission;
    },

    //  mutations of permisssion.js

    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRouterMap.concat(routes);
    },
  },
  actions: {
    //  actions of user.js
    //  user login
    login({ commit }, userInfo) {
      const { username, password } = userInfo;
      console.log("your loginuserinfo is", userInfo);
      return new Promise((resolve, reject) => {
        fetchLoginData(
          qs.stringify({ username: username.trim(), password: password }),
        )
          .then((response) => {
            console.log("your login response is", response);
            const { token } = response;
            console.log("your token is", token);
            commit("SET_TOKEN", token);
            setToken(token);
            localStorage.setItem("ms_username", username);
            localStorage.setItem("admin_projectname", username);

            console.log("your group_name is", response.data.user.group);
            localStorage.setItem("group_name", response.data.user.group);
            //localStorage.setItem("task_type", param.task_type);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    login_auth({ commit }, userInfo) {
      const { username } = userInfo;
      console.log("your loginuserinfo is", userInfo);
      return new Promise((resolve, reject) => {
        fetchLoginData_auth(qs.stringify({ username: username.trim() }))
          .then((response) => {
            console.log("your login response is", response);
            const { token } = response;
            console.log("your token is", token);
            commit("SET_TOKEN", token);
            setToken(token);
            localStorage.setItem("ms_username", username);
            localStorage.setItem("admin_projectname", username);

            console.log("your group_name is", response.data.user.group);
            localStorage.setItem("group_name", response.data.user.group);
            //localStorage.setItem("task_type", param.task_type);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    //  get user info
    getInfo({ commit, state }) {
      console.log("-----", state.token);
      let ll = getTokenName();
      console.log("-----", ll);
      commit("SET_TOKEN", ll);
      localStorage.setItem("ms_username", ll);
      localStorage.setItem("admin_projectname", ll);

      return new Promise((resolve, reject) => {
        getInfo(
          qs.stringify({
            username: state.token,
            token: state.token,
          }),
        )
          .then((response) => {
            const { data } = response;
            console.log("data = ", data);

            /* console.log('|||||||||||||||||||||||||||')
                    console.log('store.index.js : data = ', data) */

            if (!data) {
              reject("Verification failed, please Login again.");
            }
            console.log("the data you get is", data);
            const { roles, name, avatar, introduction, task_permission } = data;
            console.log(roles);
            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject("getInfo: roles must be a non-null array!");
            }
            commit("SET_ROLES", roles);
            commit("SET_NAME", name);
            commit("SET_AVATAR", avatar);
            commit("SET_INTRODUCTION", introduction);
            commit("SET_TASK_PERMISSION", task_permission);
            console.log("task_permission = ", task_permission);

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    //  logout and clean cookie
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            console.log("log_test has run");
            commit("SET_TOKEN", "undefined");
            commit("SET_ROLES", []);
            removeToken();
            resetRouter();

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            //dispatch('tagsView/delAllViews', null, { root: true })

            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // remove token
    resetToken({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        removeToken();
        resolve();
      });
    },

    //  dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
      const token = role + "-token";
      commit("SET_TOKEN", token);
      setToken(token);
      const { roles } = await dispatch("getInfo");
      resetRouter();
      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("generateRoutes", roles, {
        root: true,
      });
      // dynamically add accessible routes
      router.addRoutes(accessRoutes);
    },

    //  actions of permission.js
    generateRoutes({ commit }, roles) {
      return new Promise((resolve) => {
        let accessedRoutes;
        //console.log("this user role is ", roles)
        //localStorage.setItem("task_type", param.task_type);
        localStorage.setItem("roles", roles);
        if (roles.includes("admin")) {
          //console.log("this user is admin")
          accessedRoutes = asyncRouterMap || [];
        } else {
          //console.log("this user is not admin")
          accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles);
        }
        commit("SET_ROUTES", accessedRoutes);
        //console.log(this.state.routes)
        resolve(accessedRoutes);
      });
    },
  }, //包含异步操作（请求API方法）、回调函数提交mutaions更改state数据状态，使之可以异步

  modules: {}, // 模块化Vuex（将store分割成不同的模块）
  getters,
});
