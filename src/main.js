import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import * as moment from 'moment';

const PageLogin = () => import('./pages/page-login.vue');
const PageChat = () => import('./pages/page-chat.vue');

const router = new VueRouter({
    routes: [
        {path: '/chat', component: PageChat},
        {path: '*', component: PageLogin}
    ]
});

Vue.filter('fromNow', (value) => moment(value).fromNow());

Vue.config.productionTip = false;

Vue.use(VueRouter);
new Vue({
    render: h => h(App),
    router
}).$mount('#app');
