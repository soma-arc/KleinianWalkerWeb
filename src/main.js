import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Root from './vue/root.vue';

window.addEventListener('load', () => {
    Vue.use(Buefy);
    window.Vue = Vue;
    
    const d = {};

    /* eslint-disable no-unused-vars */
    const vueRoot = new Vue({
        el: '#app',
        data: d,
        render: (h) => {
            return h('root', { 'props': d g});
        },
        components: { 'root': Root }
    });
});
