// 常量PC端路由
export const constantsPCRouter = () => {
    return [
        {
            // 登录成功后展示数据的路由
            path: '/',
            meta: {
                title: '首页'
            },
            redirect: '/home',
        },
        {
            path: '/home',
            meta: {
                title: '首页'
            },
            component: () => import('@/views/Home/index.vue')
        },
        {
            path: '/test',
            meta: {
                title: '测试低代码'
            },
            component: () => import('@/packages/Editor/index.vue')
        },
        {
            path: '/login',
            meta: {
                title: '登录'
            },
            component: () => import('@/views/Login/index.vue')
        }

    ]
}