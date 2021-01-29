import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
const router = new VueRouter({
    scrollBehavior: () => ({
        x: 0,
        y: 0,
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
})

// 注册全局钩子用来拦截路由
router.beforeEach((to, from, next) => {
    console.log(to);
    console.log(from);
    // // 取消其他路由的请求
    // store.commit('user/CLEAR_REQUEST');
    // // 获取用户 Token 与 Root
    // const { token, root } = store.state.user;
    // if (to.meta.guest) return next();
    // // 若没有 token，所有页面重定向至登录页
    // if (to.path !== '/' && !token) return next({ path: '/' });
    // // 若存在 token，登陆页重定向至首页
    // if (to.path === '/' && token) return next({ path: config.project.index });
    // // 若无权限访问页面，重定向至 404
    // if (to.meta.root && !root) return next({ path: '404' });
    // 路由正常跳转
    return next();
});

export default router;
