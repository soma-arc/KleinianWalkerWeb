import Vec3 from './geometry/vector3.js';
import Vec2 from './geometry/vector2.js';
import Point3 from './geometry/point3.js';
import Transform from './geometry/transform.js';
import Complex from './2d/complex.js';
import { GetWebGL2Context, CreateSquareVbo, AttachShader,
         LinkProgram, CreateRGBATextures, CreateStaticVbo } from './glUtils.js';
import Canvas from './canvas.js';
import { Hsv2rgb } from './util.js';
import Scene3d from './3d/scene3d.js';
import Quaternion from './3d/quaternion.js';

const RENDER_FRAG = require('./shaders/render.frag');
const RENDER_VERT = require('./shaders/render.vert');

export default class Canvas2D extends Canvas {
    constructor(canvasId, scene2d) {
        super(canvasId);
        this.scene2d = scene2d;
        this.scale = 300;
        this.distScale = 1.25;
        this.translate = new Vec2(0, 0);

        this.mouseState = {
            isPressing: false,
            prevPosition: new Vec2(0, 0),
            button: -1
        };
        this.scene3d = new Scene3d();

        // GrandmaRecipe
        this.t_a = new Complex(1.91, 0.05);
        this.t_b = new Complex(1.91, 0.05);
        //this.t_a = new Complex(-2, 0.0);
        //this.t_b = new Complex(-2, 0.0);
        this.isT_abPlus = true;
        // sakugawaRecipe
        this.z0 = new Quaternion(-1, 0, 0, 0);
        this.thetaA = 0;
        this.thetaB = Math.PI * 0.5;

        this.maxLevel = 15;
        this.threshold = 0.005;

        this.backgroundColor = {
            rgba: { r: 0, g: 0, b: 0, a: 1 },
        };
        this.limitSetColor = {
            rgba: { r: 255, g: 0, b: 0, a: 1 },
        };

        this.coloringMode = 'Monotone';
        this.initialHue = 0.000;
        this.hueStep = 0.0001;
        this.generatorColors = [{ rgba: { r: 255, g: 0, b: 0, a: 1 } },
                                { rgba: { r: 0, g: 255, b: 0, a: 1 } },
                                { rgba: { r: 0, g: 0, b: 255, a: 1 } },
                                { rgba: { r: 255, g: 255, b: 0, a: 1 } }];
        this.rotation = 0;

        this.recipeName = 'GrandmaRecipe';
    }

    init() {
        this.canvas = document.getElementById(this.canvasId);
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;
        this.gl = GetWebGL2Context(this.canvas);
        this.addEventListeners();

        this.compileRenderShader();

        this.preparePoints(this.t_a, this.t_b, this.isT_abPlus, this.maxLevel, this.threshold);
        this.render();
    }

    compileRenderShader() {
        this.renderProgram = this.gl.createProgram();
        AttachShader(this.gl, RENDER_VERT,
                     this.renderProgram, this.gl.VERTEX_SHADER);
        AttachShader(this.gl, RENDER_FRAG,
                     this.renderProgram, this.gl.FRAGMENT_SHADER);
        LinkProgram(this.gl, this.renderProgram);
        this.vPositionAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                         'vPosition');
        this.gl.enableVertexAttribArray(this.vPositionAttrib);
        this.vColorAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                      'color');
        this.gl.enableVertexAttribArray(this.vColorAttrib);
        this.getUniformLocations();
    }

    // computeGrandmaLimitSet() {
    //     this.preparePoints(this.t_a, this.t_b, this.isT_abPlus,
    //                        this.maxLevel, this.threshold);
    // }

    preparePoints() {
        if(this.recipeName === 'GrandmaRecipe') {
            [this.points, this.colors, this.firstTags] =
                this.scene2d.computeGrandmaLimitSet(this.t_a, this.t_b, this.isT_abPlus,
                                                    this.maxLevel, this.threshold);
        } else if (this.recipeName === 'SakugawaRecipe') {
            [this.points, this.colors, this.firstTags] =
                this.scene3d.computeSakugawaLimitSet(this.z0, this.thetaA, this.thetaB,
                                                     this.maxLevel, this.threshold);
        }
        this.pointsVbo = CreateStaticVbo(this.gl, this.points);

        if(this.coloringMode === 'Monotone') {
            this.colors = new Array(this.points.length);
            for(let i = 0; i < this.points.length; i += 3) {
                this.colors[i] = this.limitSetColor.rgba.r/255;
                this.colors[i + 1] = this.limitSetColor.rgba.g/255;
                this.colors[i + 2] = this.limitSetColor.rgba.b/255;
            }
        } else if(this.coloringMode === 'FirstGenerator') {
            this.colors = [];
            for(let i = 0; i < this.firstTags.length; i++) {
                const c = this.generatorColors[this.firstTags[i]];
                this.colors.push(c.rgba.r, c.rgba.g, c.rgba.b);
            }
        }
        this.colorsVbo = CreateStaticVbo(this.gl, this.colors);
    }

    changeLimitSetColor() {
        if(this.coloringMode === 'Monotone') {                     
            this.colors = new Array(this.points.length);
            for(let i = 0; i < this.points.length; i += 3) {
                this.colors[i] = this.limitSetColor.rgba.r/255;
                this.colors[i + 1] = this.limitSetColor.rgba.g/255;
                this.colors[i + 2] = this.limitSetColor.rgba.b/255;
            }
        } else if(this.coloringMode === 'Gradation') {
            this.colors = [];
            for(let i = 0; i < this.points.length; i+=4) {
                const rgb = Hsv2rgb(this.initialHue + i * this.hueStep, 1.0, 1.0);
                this.colors.push(rgb.x, rgb.y, rgb.z);
                this.colors.push(rgb.x, rgb.y, rgb.z);
                this.colors.push(rgb.x, rgb.y, rgb.z);
                this.colors.push(rgb.x, rgb.y, rgb.z);
            }
        } else if(this.coloringMode === 'FirstGenerator') {
            this.colors = [];
            for(let i = 0; i < this.firstTags.length; i++) {
                const c = this.generatorColors[this.firstTags[i]];
                this.colors.push(c.rgba.r / 255, c.rgba.g / 255, c.rgba.b / 255);
            }
        }
        this.colorsVbo = CreateStaticVbo(this.gl, this.colors);
    }

    getUniformLocations() {
        const gl = this.gl;
        this.uniLocations = [];
        this.uniLocations.push(gl.getUniformLocation(this.renderProgram, 'u_mvpMatrix'));
    }

    setUniformValues() {
        //console.log(this.functions);
        const gl = this.gl;
        let i = 0;
        gl.uniformMatrix4fv(this.uniLocations[i++],
                            false, this.mvpM.m.elem);
    }
    
    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const gl = this.gl;
        gl.viewport(0, 0, width, height);
        gl.clearColor(this.backgroundColor.rgba.r/255,
                      this.backgroundColor.rgba.g/255,
                      this.backgroundColor.rgba.b/255,
                      this.backgroundColor.rgba.a);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.renderProgram);
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVbo);
        const attStride = 3;
        gl.vertexAttribPointer(this.vPositionAttrib, attStride, this.gl.FLOAT, false, 0, 0);
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorsVbo);
        gl.vertexAttribPointer(this.vColorAttrib, attStride, this.gl.FLOAT, false, 0, 0);

        const modelM = Transform.rotate(this.rotation, new Vec3(0, 1, 0));
        const viewM = Transform.lookAt(new Point3(this.translate.x,
                                                  1, this.translate.y),
                                       new Point3(this.translate.x,
                                                  0, this.translate.y),
                                       new Vec3(0, 0, 1));
        let projectM;
        if(this.recipeName === 'SakugawaRecipe') {
            projectM = Transform.perspective(60, 0.001, 1000);
        } else {
            projectM = Transform.ortho2d(-width / this.scale,
                                         width / this.scale,
                                         -height / this.scale,
                                         height / this.scale,
                                         -1, 1);
        }
        
        this.mvpM = projectM.mult(viewM).mult(modelM);
        this.setUniformValues();

        gl.drawArrays(gl.LINES, 0, this.points.length/3);
        gl.flush();
    }

    /**
     * Calculate screen coordinates from mouse position
     * [0, 0]x[width, height]
     * @param {number} mx
     * @param {number} my
     * @returns {Vec2}
     */
    calcCanvasCoord(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Vec2(2. * (mx - rect.left - this.canvas.width/2) / this.scale,
                        2. * (my - rect.top - this.canvas.height/2) / this.scale);
    }

    mouseWheelListener(event) {
        event.preventDefault();
        if (event.deltaY > 0) {
            this.scale /= this.distScale;
        } else {
            this.scale *= this.distScale;
        }
        this.render();
    }

    mouseDownListener(event) {
        event.preventDefault();
        this.canvas.focus();
        const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
        this.mouseState.button = event.button;

        this.mouseState.prevPosition = mouse;
        this.mouseState.prevTranslate = this.translate;
        this.mouseState.isPressing = true;
    }

    mouseMoveListener(event) {
        event.preventDefault();
        if (!this.mouseState.isPressing) return;
        const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
        if (this.mouseState.button === Canvas.MOUSE_BUTTON_RIGHT) {
            this.translate = new Vec2(this.translate.x - (mouse.x - this.mouseState.prevPosition.x),
                                      this.translate.y + mouse.y - this.mouseState.prevPosition.y);
            this.render();
        }
    }
    
    mouseUpListener(event) {
        this.mouseState.isPressing = false;
        this.mouseState.button = -1;
    }

    save() {
        this.render();
        this.saveImage(this.gl,
                       this.canvas.width,
                       this.canvas.height,
                       'limitset.png');
    }
}
