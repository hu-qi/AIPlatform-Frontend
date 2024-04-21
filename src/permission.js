import router from "/src/router/index.js";
import store from "/src/store/index.js";
import { getToken } from "/src/utils/auth.js";
import { setToken } from "/src/utils/auth.js";
import { useStore } from "vuex";
import { login_auth } from "/src/api/index.js";
import { getTokenName } from "/src/utils/auth.js";
import { setTokenName } from "/src/utils/auth.js";

const whiteList = ["/login", "/auth-redirect", "/welcome", "/welcome_auth"]; // redirect whitelist
let test = 2;

router.beforeEach(async (to, from, next) => {
  if (to.path === "/register") {
    next();
  } else if (to.path === "/forgetPassword") {
    next();
  }

  let hasToken = getToken();
  console.log("hastoken: ", hasToken);
  // hasToken = "undefined"
  // if (hasToken != "undefined" && hasToken) {
  //     console.log('')
  // }
  // else{
  //     console.log('11111111111111')
  //     let url = window.location.href
  //     console.log(url)
  //     let dz_url = url.split('#')[1]
  //     let cs = dz_url.split('?')[1]
  //     let cs_arr = cs.split('&')
  //     let paramsObj = {};
  //     for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
  //         paramsObj[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
  //     }
  //     let token = paramsObj['token']
  //     // 前端向后端发起login_auth请求
  //     let fd = new FormData();
  //     fd.append("token", token);
  //     login_auth(fd).
  //         then((res) => {
  //             console.log(res);
  //             if (res.code == 200){
  //                 // ElMessage.success(res.msg);
  //                 let nowrole = res.token;  // username明文
  //                 console.log('nowrole gogogo = ', nowrole)
  //                 store.dispatch('login_auth', {username: nowrole}).then(() => {
  //                     let nowrole = store.getters.token;
  //                     localStorage.setItem("task_type", "图像分类");
  //                     console.log('nowrole gogogo = ', nowrole)
  //                     hasToken = getToken()
  //                 })
  //             }else{
  //                 ElMessage.error(res.msg);
  //             }
  //         })
  // }
  // hasToken = getToken()

  //console.log("hastoken = ", hasToken)
  if (test == 1) {
    hasToken = "undefined";
    test = 2;
  }

  if (hasToken != "undefined" && hasToken) {
    console.log("||||", hasToken);
    console.log("has token");
    if (to.path == "/login") {
      console.log("enter if");
      next({ path: "/Homepage" });
    } else {
      console.log("enter else");
      //next()
      try {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0;
        //console.log('roles = ', store.getters.roles)
        if (hasRoles) {
          //console.log('has roles!')
          next();
        } else {
          //console.log('no roles!')
          const { roles } = await store.dispatch("getInfo");
          //console.log('roles gernerate')
          const accessRoutes = await store.dispatch("generateRoutes", roles);
          console.log("accessRoutes = ", accessRoutes);

          //router.options.routes = accessRoutes

          accessRoutes.forEach((item) => {
            //console.log('addroute":', item)
            router.addRoute(item);
          });

          console.log("to = ", to);
          next({ ...to, replace: true });
          /* if (to.fullPath == '/Homepage'){
                        console.log('to = ', to)
                        console.log('roles ===', roles)
                        if(roles == '超级管理员'){
                            console.log('超级管理员')
                            to.fullPath = '/Homepage_root'
                            next({ ...to, replace: true })
                        }
                    } */
        }
      } catch (error) {
        console.log(error);
        await store.dispatch("resetToken");
        next(`/login?redirect=${to.path}`);
      }
    }
  } else {
    /* has no token*/
    console.log("has no token");
    console.log(window.location.href);
    // let url = window.location.href
    // let dz_url = url.split('#')[1]
    // let cs = dz_url.split('?')[1]
    // let cs_arr = cs.split('&')
    // let paramsObj = {};
    // for(var i=0;i<cs_arr.length;i++){         //遍历数组，拿到json对象
    //     paramsObj[cs_arr[i].split('=')[0]] = cs_arr[i].split('=')[1]
    // }
    // let token = paramsObj['token']
    // let fd = new FormData();
    //     fd.append("token", token);

    // login_auth(fd).
    //     then((res) => {
    //         console.log(res);
    //         if (res.code == 200){
    //             // ElMessage.success(res.msg);
    //             let nowrole = res.token;  // username明文
    //             setToken(token)
    //             setTokenName(res.token)

    //             localStorage.setItem("task_type", "图像分类");
    //             console.log('nowrole gogogo = ', nowrole)
    //             if(nowrole.includes('root')){
    //                 router.push("/Homepage_root")
    //             }
    //             else if(nowrole.includes('admin')){
    //                 router.push("/Homepage_admin")
    //             }
    //             else{
    //                 router.push("/Homepage")
    //             }

    //             // if(nowrole.includes('root')){
    //             //     router.push("/Homepage_root")
    //             // }
    //             // else if(nowrole.includes('admin')){
    //             //     router.push("/Homepage_admin")
    //             // }
    //             // else{
    //             //     router.push("/Homepage")
    //             // }
    //         }else{
    //             ElMessage.error(res.msg);
    //         }
    //     })
    console.log(whiteList.indexOf(to.path) !== -1);
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});
