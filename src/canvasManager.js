import Canvas2D from './canvas2d.js';
import Scene2d from './2d/scene2d.js';
import Complex from './2d/complex.js';
import Quaternion from './3d/quaternion.js';

export default class CanvasManager {
    constructor(canvasId){
        //this.scene = scene;
        this.resizeCallback = this.resize.bind(this);
        this.canvas2d = new Canvas2D(canvasId, new Scene2d());

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

    // changeRecipe(recipeName) {
    //     if(recipeName === 'GrandmaRecipe') {
    //         [this.points, this.colors, this.firstTags] = this.scene2d.computeGrandmaLimitSet(t_a, t_b, isT_abPlus, maxLevel, threshold);
    //     } else if (recipeName === 'SakugawaRecipe') {
    //         [this.points, this.colors, this.firstTags] = this.scene3d.computeSakugawaLimitSet(new Quaternion(-1, 0, 0, 0), 0, Math.PI * 0.5,
    //                                                                                       this.maxLevel, this.threshold);
    //     }
    // }
}
