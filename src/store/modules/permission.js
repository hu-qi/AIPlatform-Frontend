//import { TextModes } from "@vue/compiler-core";
import { constantRouterMap, asyncRouterMap } from "/src/router/index.js";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */

export function hasPermission(roles, route) {
  //console.log('route = ', route, 'route.meta = ', route.meta)
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

//递归生成访问路径

export function filterAsyncRoutes(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route }; // ...代表ES6中的拓展运算符
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes;
      if (roles.includes("admin")) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit("SET_ROUTES", accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
