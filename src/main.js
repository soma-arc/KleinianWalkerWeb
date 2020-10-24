import Vue from 'vue';
import Root from './vue/root.vue';

window.addEventListener('load', () => {
    const d = {};
    const vueRoot = new Vue({
        el: '#root',
        data: d,
        render: (h) => {
            return h('root', { 'props': d });
        },
        components: { 'root': Root }
    });
});
