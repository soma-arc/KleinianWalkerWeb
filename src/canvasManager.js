import Canvas2D from './canvas2d.js';
import Scene2d from './2d/scene2d.js';

export default class CanvasManager {
    constructor(canvasId){
        //this.scene = scene;
        this.resizeCallback = this.resize.bind(this);
        this.canvas2d = new Canvas2D(canvasId, new Scene2d);

    }
    
    init() {
        // canvas should be initialize after initializing Vue
        this.canvas2d.init();
    }

    resize() {
        this.canvas2d.resizeCanvas();
        this.canvas2d.render();
    }

    renderLoop() {
        if (this.canvas2d.isRendering) {
            this.canvas2d.render();
        }
    }
}
