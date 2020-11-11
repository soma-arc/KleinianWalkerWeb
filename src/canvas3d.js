import Canvas from './canvas.js';
import Vec2 from './geometry/vector2.js';
import Vec3 from './geometry/vector3.js';
import Point3 from './geometry/point3.js';
import Transform from './geometry/transform.js';
import Quaternion from './3d/quaternion.js';
import SakugawaRecipe from './3d/sakugawaRecipe.js'; 
import DFSOperator from './3d/dfsOperator.js';
import { CameraOnSphere } from './3d/camera.js';
import { GetWebGL2Context, AttachShader, LinkProgram,
         CreateStaticVbo } from './glUtils.js';
import { MobiusOnPoint } from './util.js';
const RENDER_FRAG = require('./shaders/render.frag');
const RENDER_VERT = require('./shaders/render.vert');

export default class Canvas3D extends Canvas {
    constructor(canvasId, scene) {
        super(canvasId);
        this.scene = scene;

        this.camera = new CameraOnSphere(new Vec3(0, 0, 0), Math.PI / 3,
                                         2, new Vec3(0, 1, 0));
        this.cameraDistScale = 1.25;

        this.mouseState = {
            isPressing: false,
            prevPosition: new Vec2(0, 0),
            button: -1
        };

        this.z0 = -1;
        this.thetaA = 0;
        this.thetaB = Math.PI / 2;// + 0.1;
        this.maxLevel = 15;
        this.threshold = 0.001;

        this.orbitStartX = 0;
        this.orbitStartY = 0;
        this.orbitStartHeight = 0;
        this.orbitGenIndex = 3;
        
    }

    init() {
        this.canvas = document.getElementById(this.canvasId);
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;
        this.gl = GetWebGL2Context(this.canvas);

        this.renderProgram = this.gl.createProgram();
        AttachShader(this.gl, RENDER_VERT,
                     this.renderProgram, this.gl.VERTEX_SHADER);
        AttachShader(this.gl, RENDER_FRAG,
                     this.renderProgram, this.gl.FRAGMENT_SHADER);
        LinkProgram(this.gl, this.renderProgram);

        this.vPositionAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                         'vPosition');
        this.gl.enableVertexAttribArray(this.vPositionAttrib);

        this.addEventListeners();

        this.compileRenderShader();

        this.preparePoints(this.z0, this.thetaA, this.thetaB,
                           this.maxLevel, this.threshold);
        this.calcLimitSet();
        this.render();
    }

    preparePoints(z0, thetaA, thetaB, maxLevel, threshold) {
        [this.points, this.colors, this.firstTags] =
            this.scene.computeSakugawaLimitSet(z0, thetaA, thetaB,
                                               maxLevel, threshold);
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

    getUniformLocations() {
        const gl = this.gl;
        this.uniLocations = [];
        this.uniLocations.push(gl.getUniformLocation(
            this.renderProgram, 'u_mvpMatrix'));
    }

    setUniformValues() {
        //console.log(this.functions);
        const gl = this.gl;
        let i = 0;
        gl.uniformMatrix4fv(this.uniLocations[i++],
                            false, this.mvpM.m.elem);
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
        return new Vec2((mx - rect.left) * this.pixelRatio,
                        (my - rect.top) * this.pixelRatio);
    }

    mouseWheelListener(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.camera.cameraDistance /= this.cameraDistScale;
        } else {
            this.camera.cameraDistance *= this.cameraDistScale;
        }
        this.camera.update();
        this.render();
    }

    mouseDownListener(event) {
        event.preventDefault();
        this.canvas.focus();
        this.mouseState.isPressing = true;
        const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
        this.mouseState.prevPosition = mouse;
        this.mouseState.button = event.button;
        if (event.button === Canvas.MOUSE_BUTTON_LEFT) {
            this.camera.prevThetaPhi = new Vec2(this.camera.theta, this.camera.phi);
        } else if (event.button === Canvas.MOUSE_BUTTON_RIGHT) {
            this.camera.prevTarget = this.camera.target;
        }
    }

    mouseDblClickListener(event) {
    }

    mouseUpListener(event) {
        this.mouseState.isPressing = false;
    }

    mouseMoveListener(event) {
        event.preventDefault();
        if (!this.mouseState.isPressing) return;
        const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
        if (this.mouseState.button === Canvas.MOUSE_BUTTON_LEFT) {
            const prevThetaPhi = this.camera.prevThetaPhi;
            this.camera.theta = prevThetaPhi.x + (this.mouseState.prevPosition.x - mouse.x) * 0.01;
            this.camera.phi = prevThetaPhi.y - (this.mouseState.prevPosition.y - mouse.y) * 0.01;
            this.camera.update();
            this.render();
        } else if (this.mouseState.button === Canvas.MOUSE_BUTTON_RIGHT) {
            const d = mouse.sub(this.mouseState.prevPosition);
            const [xVec, yVec] = this.camera.getFocalXYVector(this.canvas.width,
                                                              this.canvas.height);
            this.camera.target = this.camera.prevTarget.add(xVec.scale(-d.x).add(yVec.scale(-d.y)));
            this.camera.update();
            this.render();
        }
    }

    calcLimitSet() {
        const recipe1 = new SakugawaRecipe(new Quaternion(this.z0, 0, 0, 0), this.thetaA, this.thetaB);
        this.dfs = new DFSOperator(recipe1.a, recipe1.b, this.maxLevel, this.threshold);
        console.log('search');
        this.dfs.search();
        console.log('Done');

        this.pointsVbo = CreateStaticVbo(this.gl, this.dfs.points);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVbo);
    }

    keydownListener(event) {
        if (event.key === 'ArrowRight') {
        } else if (event.key === 'ArrowLeft') {
        } else if (event.key === 'ArrowUp') {
        } else if (event.key === 'ArrowDown') {
        } else if (event.key === 'w') {
        } else if (event.key === 's') {
        }
    }
    
    render() {
        const gl = this.gl;
        const width = this.canvas.width;
        const height = this.canvas.height;

        gl.viewport(0, 0, width, height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVbo);
        const attStride = 3;
        gl.vertexAttribPointer(this.vPositionAttrib, attStride, this.gl.FLOAT, false, 0, 0);

        const viewM = Transform.lookAt(new Point3(this.camera.pos.x, this.camera.pos.y, this.camera.pos.z),
                                       new Point3(this.camera.target.x, this.camera.target.y, this.camera.target.z),
                                       this.camera.up);
        const projectM = Transform.perspective(90, 0.001, 1000);
        const mvpM = projectM.mult(viewM);

        const mvpLocation = gl.getUniformLocation(this.renderProgram, 'u_mvpMatrix');
        gl.uniformMatrix4fv(mvpLocation, false, mvpM.m.elem);

        gl.drawArrays(gl.LINES, 0, this.dfs.points.length/3);
        gl.flush();
    }
}
