const getters = {
  token: (state) => state.token,
  avatar: (state) => state.avatar,
  name: (state) => state.name,
  introduction: (state) => state.introduction,
  roles: (state) => state.roles,
  permission_routes: (state) => state.routes,
  task_permission: (state) => state.task_permission,
};
export default getters;
