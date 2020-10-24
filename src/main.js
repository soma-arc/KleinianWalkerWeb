import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Root from './vue/root.vue';
import CanvasManager from './canvasManager.js';

window.addEventListener('load', () => {
    Vue.use(Buefy);
    window.Vue = Vue;

    const canvasManager = new CanvasManager('canvas');
    const d = { 'canvasManager': canvasManager };

    /* eslint-disable no-unused-vars */
    const vueRoot = new Vue({
        el: '#app',
        data: d,
        render: (h) => {
            return h('root', { 'props': d });
        },
        components: { 'root': Root }
    });

    canvasManager.init();

    let resizeTimer = setTimeout(canvasManager.resizeCallback, 500);
    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(canvasManager.resizeCallback, 500);
    });

    function renderLoop() {
        canvasManager.renderLoop();
        requestAnimationFrame(renderLoop);
    }
    renderLoop();
});
