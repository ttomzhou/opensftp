const routes = [{
    path: '/',
    redirect: '/home',
    component: () => import('layouts/main'),
    children: [{
        path: '/home',
        component: () => import('pages/home')
    }, {
        path: '/sftp',
        component: () => import('pages/sftp')
    }]
},

// Always leave this as last one,
// but you can also remove it
{
    path: '*',
    component: () => import('pages/error404')
}]

export default routes
