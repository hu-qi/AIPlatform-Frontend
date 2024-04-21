import { createRouter, createWebHashHistory } from "vue-router";
import Home from "/src/views/Home.vue";

export const constantRouterMap = [
  // 在这里切换第一个页面是有无auth的welcome界面
  {
    path: "/",
    // redirect: '/login'
    redirect: "/welcome",
  },
  // {
  //     path: '/',
  //     redirect: '/welcome_auth'
  // },
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/user",
        name: "user",
        meta: {
          title: "个人中心",
        },
        component: () => import("/src/views/User.vue"),
      },
      /*{
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器'
                },
                component: () => import ('../views/Editor.vue')
            },*/ {
        //Datasets
        path: "/Datasets",
        name: "Datasets",
        meta: {
          title: "数据集管理",
        },
        component: () => import("/src/views/Datasets.vue"),
      },
      {
        //LabelGroup
        path: "/LabelGroup",
        name: "LabelGroup",
        meta: {
          title: "标签组管理",
        },
        component: () => import("/src/views/LabelGroup.vue"),
      },
      {
        //LabelGroupEditor
        path: "/LabelGroupEditor",
        name: "LabelGroupEditor",
        meta: {
          title: "编辑标签组",
        },
        component: () => import("/src/views/LabelGroupEditor.vue"),
      },
      {
        //LabelGroup
        path: "/Test",
        name: "Test",
        meta: {
          title: "测试",
        },
        component: () => import("/src/views/Test.vue"),
      },
      {
        //ShowAnnotationImage
        path: "/ShowAnnotationImage",
        name: "ShowAnnotationImage",
        meta: {
          title: "手工标注数据（图像分类）",
        },
        component: () => import("/src/views/ShowAnnotationImage.vue"),
      },
      {
        //AnnotationForObjectDetection
        path: "/AnnotationForObjectDetection",
        name: "AnnotationForObjectDetection",
        meta: {
          title: "手工标注数据（目标检测）",
        },
        component: () => import("/src/views/AnnotationForObjectDetection.vue"),
      },
      {
        //AnnotationForObjectDetection
        path: "/AnnotationForObjectTracking",
        name: "AnnotationForObjectTracking",
        meta: {
          title: "手工标注数据（目标跟踪）",
        },
        component: () => import("/src/views/AnnotationForObjectTracking.vue"),
      },
      {
        //AnnotationForImageSegmentation
        path: "/AnnotationForImageSegmentation",
        name: "AnnotationForImageSegmentation",
        meta: {
          title: "手工标注数据（图像分割）",
        },
        component: () =>
          import("/src/views/AnnotationForImageSegmentation.vue"),
      },
      {
        //AnnotationFortextcls
        path: "/AnnotationForTextClassification",
        name: "AnnotationForTextClassification",
        meta: {
          title: "手工标注数据（文本分类）",
        },
        component: () =>
          import("/src/views/AnnotationForTextClassification.vue"),
      },
      {
        //AnnotationFortextcls
        path: "/AnnotationForActionRecognition",
        name: "AnnotationForActionRecognition",
        meta: {
          title: "手工标注数据（视频分类）",
        },
        component: () =>
          import("/src/views/AnnotationForActionRecognition.vue"),
      },
      {
        //模型
        path: "/MyModel",
        name: "MyModel",
        meta: {
          title: "我的模型",
        },
        component: () => import("/src/views/MyModel.vue"),
      },
      {
        //公共模型
        path: "/MyModelPublic",
        name: "MyModelPublic",
        meta: {
          title: "公共模型",
        },
        component: () => import("/src/views/MyModelPublic.vue"),
      },
      {
        //模型测试-图像分类
        path: "/ModelTestingForImageClassification",
        name: "/ModelTestingForImageClassification",
        meta: {
          title: "测试模型",
        },
        component: () =>
          import("/src/views/ModelTestingForImageClassification.vue"),
      },
      {
        //模型测试-目标检测
        path: "/ModelTestingForObjectDetection",
        name: "/ModelTestingForObjectDetection",
        meta: {
          title: "测试模型",
        },
        component: () =>
          import("/src/views/ModelTestingForObjectDetection.vue"),
      },
      {
        //模型测试-目标跟踪
        path: "/ModelTestingForObjectTracking",
        name: "/ModelTestingForObjectTracking",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/ModelTestingForObjectTracking.vue"),
      },
      {
        //模型测试-图像分割
        path: "/ModelTestingForImageSegmentation",
        name: "/ModelTestingForImageSegmentation",
        meta: {
          title: "测试模型",
        },
        component: () =>
          import("/src/views/ModelTestingForImageSegmentation.vue"),
      },
      {
        //模型测试-文本分类
        path: "/ModelTestingForTextClassification",
        name: "/ModelTestingForTextClassification",
        meta: {
          title: "测试模型",
        },
        component: () =>
          import("/src/views/ModelTestingForTextClassification.vue"),
      },
      {
        //模型测试-视频分类
        path: "/ModelTestingForActionRecognition",
        name: "/ModelTestingForActionRecognition",
        meta: {
          title: "测试模型",
        },
        component: () =>
          import("/src/views/ModelTestingForActionRecognition.vue"),
      },
      {
        //Test
        path: "/Test",
        name: "Test",
        meta: {
          title: "测试",
        },
        component: () => import("/src/views/Test.vue"),
      },
      {
        path: "/Projects",
        name: "Projects",
        meta: {
          title: "工程管理",
        },
        component: () => import("/src/views/Projects.vue"),
      },
      {
        path: "/Homepage",
        name: "Homepage",
        meta: {
          title: "首页",
        },
        component: () => import("/src/views/Homepage.vue"),
      },
      {
        path: "/CloudDeployment",
        name: "CloudDeployment",
        meta: {
          title: "云部署",
        },
        component: () => import("/src/views/CloudDeployment.vue"),
      },
      {
        path: "/LocalDeployment",
        name: "LocalDeployment",
        meta: {
          title: "本地部署",
        },
        component: () => import("/src/views/LocalDeployment.vue"),
      },
      {
        path: "/Platform",
        name: "Platform",
        meta: {
          title: "平台设置",
        },
        component: () => import("/src/views/platform.vue"),
      },
      {
        path: "/DatasetsPublic",
        name: "DatasetsPublic",
        meta: {
          title: "公共数据",
        },
        component: () => import("/src/views/DatasetsPublic.vue"),
      },
      {
        path: "/EditionControl",
        name: "EditionControl",
        meta: {
          title: "版本控制",
        },
        component: () => import("/src/views/EditionControl.vue"),
      },
      {
        path: "/train_result",
        name: "train_result",
        meta: {
          title: "训练结果",
        },
        component: () => import("/src/views/train_result.vue"),
      },
      {
        path: "/LocalDeployment_public",
        name: "LocalDeployment_public",
        meta: {
          title: "公共本地部署",
        },
        component: () => import("/src/views/LocalDeployment_public.vue"),
      },
      {
        path: "/CloudDeployment_public",
        name: "CloudDeployment_public",
        meta: {
          title: "公共云部署",
        },
        component: () => import("/src/views/CloudDeployment_public.vue"),
      },

      {
        path: "/datasets_version",
        name: "datasets_version",
        meta: {
          title: "数据集版本管理",
        },
        component: () => import("/src/views/Datasets_version.vue"),
      },
      {
        path: "/model_version",
        name: "model_version",
        meta: {
          title: "模型版本管理",
        },
        component: () => import("/src/views/MyModel_version.vue"),
      },
      {
        path: "/Task_training",
        name: "Task_training",
        meta: {
          title: "训练任务管理",
        },
        component: () => import("/src/views/Task_training.vue"),
      },
      {
        path: "/Task_Annotation",
        name: "Task_Annotation",
        meta: {
          title: "标注任务管理",
        },
        component: () => import("/src/views/Task_annotation.vue"),
      },
      {
        path: "/Task_Test",
        name: "Task_Test",
        meta: {
          title: "测试任务管理",
        },
        component: () => import("/src/views/Task_testing.vue"),
      },
      {
        //模型测试查看-图像分类
        path: "/TestForIC",
        name: "/TestForIC",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/TestForIC.vue"),
      },
      {
        //模型测试查看-目标检测
        path: "/TestForOD",
        name: "/TestForOD",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/TestForOD.vue"),
      },
      {
        //模型测试查看-图像分割
        path: "/TestForIS",
        name: "/TestForIS",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/TestForIS.vue"),
      },
      {
        //模型测试查看-动作识别
        path: "/TestForAR",
        name: "/TestForAR",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/TestForAR.vue"),
      },
      {
        //模型测试查看-文本分类
        path: "/TestForTC",
        name: "/TestForTC",
        meta: {
          title: "测试模型",
        },
        component: () => import("/src/views/TestForTC.vue"),
      },
      {
        //模型测试查看-目标跟踪
        path: "/TestForOT",
        name: "/TestForOT",
        meta: {
          title: "目标跟踪",
        },
        component: () => import("/src/views/TestForOT.vue"),
      },
    ],
  },
  {
    path: "/welcome_auth",
    name: "welcome_auth",
    meta: {
      title: "首页",
    },
    component: () => import("/src/views/Welcome_auth.vue"),
  },
  {
    path: "/welcome",
    name: "welcome",
    meta: {
      title: "首页",
    },
    component: () => import("/src/views/Welcome.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("/src/views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      title: "注册",
    },
    component: () => import("/src/views/Register.vue"),
  },
  /*{
        path: "/empty",
        name: "Empty",
        meta: {
            title: '注册'
        },
        component: () => import ("../views/Empty.vue")
    },*/ {
    path: "/forgetPassword",
    name: "ForgetPassword",
    meta: {
      title: "忘记密码",
    },
    component: () => import("/src/views/ForgetPassword.vue"),
  },
];

//  非权限路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap, //路由的数组
});

//  得到用户权限后重设路由

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHashHistory(),
    routes: constantRouterMap,
  });
  router.matcher = newRouter.matcher; // reset router
}

//  需要权限才能进入的网页
export const asyncRouterMap = [
  {
    path: "/admin_test",
    name: "权限测试",
    component: Home,
    meta: { roles: ["组管理员", "超级管理员"] }, //页面需要的权限
    children: [
      {
        path: "/admin",
        name: "权限测试页1",
        component: () => import("/src/views/Admin.vue"),
        meta: { roles: ["组管理员", "超级管理员"], title: "用户管理" }, //页面需要的权限
      },
      {
        path: "/index2",
        name: "权限测试页2",
        component: () => import("/src/views/Project_admin.vue"),
        meta: { roles: ["组管理员", "超级管理员"], title: "权限配置" }, //页面需要的权限
      },
      {
        path: "/root",
        name: "权限测试页3",
        component: () => import("/src/views/Admin_super.vue"),
        meta: { roles: ["超级管理员"], title: "组织管理" }, //页面需要的权限
      },
      {
        path: "/Homepage_root",
        name: "Homepage_root",
        component: () => import("/src/views/Homepage_root.vue"),
        meta: { roles: ["超级管理员"], title: "root首页" }, //页面需要的权限
      },
      {
        path: "/Homepage_admin",
        name: "Homepage_admin",
        component: () => import("/src/views/Homepage_admin.vue"),
        meta: { roles: ["组管理员"], title: "admin首页" }, //页面需要的权限
      },
    ],
  },
  { path: "/wrong", redirect: "/404", hidden: true },
];

// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
/* router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } 
    else if(to.path === '/register'){
        next();
    }
    else if(to.path === '/forgetPassword'){
        next();
    }

    else {
        let token = localStorage.getItem('Authorization');
        
        if (token === null || token === '') {
        next('/login');
        } else {
        next();
        }
    }
}); */

export default router;
