
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import menu from "@/request/services/menu"
import store from "@/store/index"
// 默认的路由
let routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'homepage',
        component: () => import(/* webpackChunkName: "home" */ '@/views/contentBox/HomePage.vue')
      },
      {
        path: '/personal-center',
        name: 'personalCenter',
        component:() => import(/* webpackChunkName: "home" */ '@/views/user/personal/PersonalCenter.vue') ,
        meta: { id: 'user:center' }
      },
      {
        path: '/error',
        name: 'error',
        component: () => import(/* webpackChunkName: "home" */ '@/views/contentBox/Error.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  }
]
// 创建路由
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes
})

let allRouters = [
  {
    path: '/user',
    name: 'userManage',
    component: 'views/system/user/index.vue',
    meta: { id: 'system:user' }
  },
  {
    path: '/role',
    name: 'roleManage',
    component: 'views/system/role/index.vue',
    meta: { id: 'system:role' }
  },
  {
    path: '/menu',
    name: 'menuManage',
    component: 'views/system/menu/index.vue',
    meta: { id: 'system:menu' }
  },
  {
    path: '/dept',
    name: 'deptManage',
    component: 'views/system/dept/index.vue',
    meta: { id: 'system:dept' }
  },
  {
    path: '/systemLog',
    name: 'systemLog',
    component: 'views/system/log/index.vue',
    meta: { id: 'system:log' }
  },
  {
    path: '/blacklist',
    name: 'blacklist',
    component: 'views/system/blacklist/index.vue',
    meta: { id: 'system:blacklist' }
  },
];
// filterAddRouter(allRouters,permissionIds,'Home');
// 根据权限过滤路由,动态添加路由
function filterAddRouter(allRouters, parentName) {
  for (let route of allRouters) {
    let itemRouter = { ...route };
    router.addRoute(parentName, {
      path: `${itemRouter.path}`,
      name: itemRouter.name,
      component: () => import(`@/${itemRouter.component}`)
    });
    if (itemRouter.children) {
      filterAddRouter(itemRouter.children, tmp.name)
    }
  }
}
let menuSign = false;
// 判断是否已经登录，已登录则增加路由，未登录则跳转至登录页面
function getRouterMenu(next,isInit=true) {
  let username = window.sessionStorage.getItem("username");
  if (username) {
    menuSign = true;
    // 本地运行代码
    filterAddRouter(allRouters, 'Home');
    isInit ? next("/home") : next();
    return;
    // 正式代码
    menu.getMenuByUser( username).then(res => {
      if (res.code == 0) {
         filterAddRouter(res.data.routes, 'Home');
         store.commit("common/setPermissions", res.data.permissions)
         isInit ? next("/home") : next();
      } else {
         next("/login")
      }
    }).catch(() => {
         next("/login");
    })
  } else {
    console.log("lllll", router)
    next("/login")
  }
}
router.beforeEach((to, from, next) => {
  if (from.name == "Login") {
    //  若用户重新登录则加载对应路由
    getRouterMenu(next,false);
  } else if (to.name != "Login") {
    // 若页面不为登录页面时，判断是否已获取菜单，若未获取则去获取菜单
    if (router.hasRoute(to.name)) {
      //  判断是否存在对应页面，若不存在则跳转至404页面
      if (menuSign) {
        next();
      } else {
        getRouterMenu(next)
      }
    } else {
      next("/error")
    }
  } else{
    next();
  }
})


export default router
