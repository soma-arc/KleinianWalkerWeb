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
import { CameraOnSphere } from './3d/camera.js';
import PointSeries from './pointSeries.js';

const RENDER_FRAG = require('./shaders/render.frag');
const RENDER_VERT = require('./shaders/render.vert');
//const ORBIT_SEED = require('./momizi.csv');
//const ORBIT_SEED = require('./sakura.csv');
//const ORBIT_SEED = require('./snowFlake.csv');
const ORBIT_SEED = require('./butterfly.csv');

export default class Canvas2D extends Canvas {
    constructor(canvasId, scene2d) {
        super(canvasId);
        this.scene2d = scene2d;
        this.scale = 300;
        this.distScale = 1.25;
        this.translate = new Vec2(0, 0);

        this.camera = new CameraOnSphere(new Vec3(0, 0, 0), Math.PI / 3,
                                         2, new Vec3(0, 1, 0));
        this.cameraDistScale = 1.25;
        this.mouseCameraState = {
            isPressing: false,
            prevPosition: new Vec2(0, 0),
            button: -1
        };

        this.mouseState = {
            isPressing: false,
            prevPosition: new Vec2(0, 0),
            button: -1
        };
        this.scene3d = new Scene3d();

        // GrandmaRecipe
        this.t_a = new Complex(1.91, 0.05);
        this.t_b = new Complex(1.91, 0.05);
        this.isT_abPlus = true;
        // jorgensenRecipe
        this.jt_a = new Complex(1.87, 0.1);
        this.jt_b = new Complex(1.87, -0.1);
        this.jisT_abPlus = false;
        
        // sakugawaRecipe
        this.z0 = new Quaternion(-1, 0, 0, 0);
        this.thetaA = 0;
        this.thetaB = Math.PI * 0.5;

        // Riley Recipe
        this.c = new Complex(1.13, -0.43);

        // OPT Recipe
        this.origin = Complex.ZERO;
        this.a1 = new Complex(0.49, 0.15);
        this.a2 = new Complex(0.25, 0.41);
        this.showControlPoints = true;

        // GrandmaSpecialtiesRecipe
        this.specialties_a = new Complex(0, 0);
        this.specialties_b = new Complex(0, 0);
        this.specialties_ab = new Complex(0, 0);
        this.specialties_R_plus = true;
        
        this.maxLevel = 30;
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

        this.orbitTranslation = new Vec2(0.5, 0);
        //this.orbitTranslation = new Vec2(0.0, 0);
        this.showOrbit = false;
        this.orbitMouseDiff = new Vec2(0, 0);
        this.draggingOrbitSeed = false;
        this.pointSeriesMaxLevel = 5;
        this.showFrame = false;
        this.orbitColor = {
            rgba: { r:255, g: 161, b: 3, a: 1 }
        };
    }

    init() {
        this.canvas = document.getElementById(this.canvasId);
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;
        this.gl = GetWebGL2Context(this.canvas);
        this.addEventListeners();

        this.compileRenderShader();

        this.preparePoints(this.t_a, this.t_b, this.isT_abPlus, this.maxLevel, this.threshold);

        // Render control points for Once Punctured Torus Group
        const r = 0.05;
        const numSplit = 64;
        this.circlePoints = [];
        this.circleColors = [];
        const step = 2 * Math.PI / numSplit;
        let rad = 0;
        for(let i = 0; i < numSplit; i++) {
            this.circlePoints.push(r * Math.cos(rad), 0, r * Math.sin(rad));
            this.circleColors.push(0, 1, 0);
            rad += step;
        }
        this.circleVbo = CreateStaticVbo(this.gl, this.circlePoints);
        this.circleColorsVbo = CreateStaticVbo(this.gl, this.circleColors);

        if(this.showOrbit) this.computeOrbits();
        this.render();
    }

    computeOrbits() {
        //this.orbitScale = 0.009;
        this.orbitScale = 0.007;
        const points = [];
        for(const p of ORBIT_SEED) {
            const x = p[0] * this.orbitScale + this.orbitTranslation.x;
            const y = p[1] * this.orbitScale + this.orbitTranslation.y;
            points.push(new Complex(x, y));
        }
        this.pointSeries = new PointSeries(points, this.orbitScale, this.orbitGens, this.threshold);
        this.transformedFigures = PointSeries.RunBFS(this.pointSeriesMaxLevel,
                                                     this.pointSeries);
    }

    load(json) {
        console.log(json);
        this.recipeName = json.recipeName;
        this.maxLevel = json.maxLevel;
        this.threshold = json.threshold;
        this.t_a.re = json.t_a[0];
        this.t_a.im = json.t_a[1];
        this.t_b.re = json.t_b[0];
        this.t_b.im = json.t_b[1];
        this.isT_abPlus = json.isT_abPlus;
        this.jt_a.re = json.jt_a[0];
        this.jt_a.im = json.jt_a[1];
        this.jisT_abPlus = json.jisT_abPlus;
        this.z0.re = json.z0[0];
        this.z0.i = json.z0[1];
        this.z0.j = json.z0[2];
        this.z0.k = json.z0[3];
        this.thetaA = json.thetaA;
        this.thetaB = json.thetaB;
        this.c.re = json.c[0];
        this.c.im = json.c[1];
        this.origin.re = json.origin[0];
        this.origin.im = json.origin[1];
        this.a1.re = json.a1[0];
        this.a1.im = json.a1[1];
        this.a2.re = json.a2[0];
        this.a2.im = json.a2[1];
        this.showControlPoints = json.showControlPoints;
        this.backgroundColor = json.backgroundColor;
        this.limitSetColor = json.limitSetColor;
        this.coloringMode = json.coloringMode;
        this.initialHue = json.initialHue;
        this.hueStep = json.hueStep;
        this.generatorColors = json.generatorColors;
        this.rotation = json.rotation;
        this.orbitColor = json.orbitColor;
        this.showOrbit = json.showOrbit;
        this.showFrame = json.showFrame;
        this.orbitTranslation.x = json.orbitTranslation[0];
        this.orbitTranslation.y = json.orbitTranslation[1];
        this.pointSeriesMaxLevel = json.pointSeriesMaxLevel;

        this.changeLimitSetColor();
        this.preparePoints();
        this.computeOrbits();
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

    preparePoints() {
        if(this.recipeName === 'GrandmaRecipe') {
            [this.points, this.colors, this.firstTags, this.orbitGens] =
                this.scene2d.computeGrandmaLimitSet(this.t_a, this.t_b, this.isT_abPlus,
                                                    this.maxLevel, this.threshold);
        } else if (this.recipeName === 'JorgensenRecipe'){
            [this.points, this.colors, this.firstTags, this.orbitGens] =
                this.scene2d.computeJorgensenLimitSet(this.jt_a, this.jt_b, this.jisT_abPlus,
                                                    this.maxLevel, this.threshold);
        } else if (this.recipeName === 'SakugawaRecipe') {
            [this.points, this.colors, this.firstTags] =
                this.scene3d.computeSakugawaLimitSet(this.z0, this.thetaA, this.thetaB,
                                                     this.maxLevel, this.threshold);
        } else if (this.recipeName === 'RileyRecipe') {
            [this.points, this.colors, this.firstTags, this.orbitGens] =
                this.scene2d.computeRileyLimitSet(this.c,
                                                  this.maxLevel,
                                                  this.threshold);
        } else if (this.recipeName === 'OncePuncturedTorus'){
            [this.points, this.colors, this.firstTags, this.orbitGens] =
                this.scene2d.computeOPTLimitSet(this.a1,
                                                this.a2,
                                                this.origin,
                                                this.maxLevel,
                                                this.threshold);
        } else if (this.recipeName === 'GrandmaSpecialtiesRecipe') {
            [this.points, this.colors, this.firstTags, this.orbitGens] =
                this.scene2d.computeGrandmaSpecialtiesLimitSet(this.specialties_a,
                                                               this.specialties_b,
                                                               this.specialties_ab,
                                                               this.specialties_R_plus,
                                                               this.maxLevel,
                                                               this.threshold);
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

        let modelM = Transform.rotate(this.rotation, new Vec3(0, 1, 0));

        let viewM;
        let projectM;
        if(this.recipeName === 'SakugawaRecipe') {
            viewM = Transform.lookAt(new Point3(this.camera.pos.x,
                                                this.camera.pos.y,
                                                this.camera.pos.z),
                                     new Point3(this.camera.target.x,
                                                this.camera.target.y,
                                                this.camera.target.z),
                                     this.camera.up);
            projectM = Transform.perspective(60, 0.001, 1000);
        } else {
            viewM = Transform.lookAt(new Point3(this.translate.x,
                                                1, this.translate.y),
                                     new Point3(this.translate.x,
                                                0, this.translate.y),
                                     new Vec3(0, 0, 1));
            projectM = Transform.ortho2d(-width / this.scale,
                                         width / this.scale,
                                         height / this.scale,
                                         -height / this.scale,
                                         -1, 1);
        }
        
        this.mvpM = projectM.mult(viewM).mult(modelM);
        this.setUniformValues();
        const tmpOrbitM = modelM;
        if(this.recipeName === 'OncePuncturedTorus') {
            gl.drawArrays(gl.LINE_STRIP, 0, this.points.length/3);
            gl.flush();

            let tmpM = modelM;
            for(let i = -8; i < 8; i++) {
                if(i === 0) continue;
                modelM = tmpM.mult(Transform.translate(i, 0, 0));
                this.mvpM = projectM.mult(viewM).mult(modelM);
                this.setUniformValues();
                gl.drawArrays(gl.LINE_STRIP, 0, this.points.length/3);
            }
            gl.flush();
            if(this.showControlPoints) {
                modelM = Transform.translate(this.a1.re, 0, this.a1.im);
                this.mvpM = projectM.mult(viewM).mult(modelM);
                this.setUniformValues();
                gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleVbo);
                gl.vertexAttribPointer(this.vPositionAttrib, attStride, this.gl.FLOAT, false, 0, 0);
                gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleColorsVbo);
                gl.vertexAttribPointer(this.vColorAttrib, attStride, this.gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.LINE_LOOP, 0, this.circlePoints.length/3);

                modelM = Transform.translate(this.a2.re, 0, this.a2.im);
                this.mvpM = projectM.mult(viewM).mult(modelM);
                this.setUniformValues();
                gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleVbo);
                gl.vertexAttribPointer(this.vPositionAttrib, attStride, this.gl.FLOAT, false, 0, 0);
                gl.bindBuffer(this.gl.ARRAY_BUFFER, this.circleColorsVbo);
                gl.vertexAttribPointer(this.vColorAttrib, attStride, this.gl.FLOAT, false, 0, 0);
                gl.drawArrays(gl.LINE_LOOP, 0, this.circlePoints.length/3);
            }
        } else {
            gl.drawArrays(gl.LINES, 0, this.points.length/3);
        }
        gl.flush();

        // Render otbit
        if(this.showOrbit === false ||
           this.recipeName === 'SakugawaRecipe') return;
        this.orbitSeedColors = [];
        for(const p of ORBIT_SEED) {
            this.orbitSeedColors.push(this.orbitColor.rgba.r/255,
                                      this.orbitColor.rgba.g/255,
                                      this.orbitColor.rgba.b/255);
        }
        //console.log(this.orbitColor);
        this.orbitColorVbo = CreateStaticVbo(this.gl, this.orbitSeedColors);
        for(const figure of this.transformedFigures) {
            const orbitPoints = [];
            for(const p of figure.points) {
                orbitPoints.push(p.re, 0, p.im);
            }
            const orbitVbo = CreateStaticVbo(gl, orbitPoints);
            
            const tmpM = tmpOrbitM;
            modelM = tmpM;
            this.mvpM = projectM.mult(viewM).mult(modelM);
            this.setUniformValues();
            gl.bindBuffer(this.gl.ARRAY_BUFFER, orbitVbo);
            gl.vertexAttribPointer(this.vPositionAttrib, attStride,
                                   this.gl.FLOAT, false, 0, 0);
            gl.bindBuffer(this.gl.ARRAY_BUFFER, this.orbitColorVbo);
            gl.vertexAttribPointer(this.vColorAttrib, attStride,
                                   this.gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, orbitPoints.length/3);
        }

        if(this.showFrame === false) return;
        const framePoints = [];
        framePoints.push(this.pointSeries.orbitSeedMin.x, 0,
                         this.pointSeries.orbitSeedMin.y);
        framePoints.push(this.pointSeries.orbitSeedMin.x, 0,
                         this.pointSeries.orbitSeedMax.y);
        framePoints.push(this.pointSeries.orbitSeedMax.x, 0,
                         this.pointSeries.orbitSeedMax.y);
        framePoints.push(this.pointSeries.orbitSeedMax.x, 0,
                         this.pointSeries.orbitSeedMin.y);
        const frameVbo = CreateStaticVbo(gl, framePoints);
        gl.bindBuffer(this.gl.ARRAY_BUFFER, frameVbo);
        gl.vertexAttribPointer(this.vPositionAttrib, attStride,
                               this.gl.FLOAT, false, 0, 0);
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.orbitColorVbo);
        gl.vertexAttribPointer(this.vColorAttrib, attStride,
                               this.gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_LOOP, 0, framePoints.length/3);
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

    /**
     * Calculate screen coordinates from mouse position
     * [0, 0]x[width, height]
     * @param {number} mx
     * @param {number} my
     * @returns {Vec2}
     */
    calcCameraCanvasCoord(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Vec2((mx - rect.left) * this.pixelRatio,
                        (my - rect.top) * this.pixelRatio);
    }

    mouseWheelListener(event) {
        event.preventDefault();
        if (event.deltaY > 0) {
            if(this.recipeName === 'SakugawaRecipe') {
                this.camera.cameraDistance *= this.cameraDistScale;
                this.camera.update();
            } else {
                this.scale /= this.distScale;
            }
        } else {
            if(this.recipeName === 'SakugawaRecipe') {
                this.camera.cameraDistance /= this.cameraDistScale;
                this.camera.update();
            } else {
                this.scale *= this.distScale;
            }
        }
        this.render();
    }

    mouseDownListener(event) {
        event.preventDefault();
        this.canvas.focus();
        if(this.recipeName === 'SakugawaRecipe') {
            this.mouseCameraState.isPressing = true;
            const mouse = this.calcCameraCanvasCoord(event.clientX,
                                                     event.clientY);
            this.mouseCameraState.prevPosition = mouse;
            this.mouseCameraState.button = event.button;
            if (event.button === Canvas.MOUSE_BUTTON_LEFT) {
                this.camera.prevThetaPhi = new Vec2(this.camera.theta,
                                                    this.camera.phi);
            } else if (event.button === Canvas.MOUSE_BUTTON_RIGHT) {
                this.camera.prevTarget = this.camera.target;
            }
        } else if(this.recipeName === 'OncePuncturedTorus' && this.showControlPoints) {
            this.mouseState.isPressing = true;
            const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
            const d1 = Math.sqrt(Math.pow(mouse.x - this.a1.re, 2) +
                                 Math.pow(mouse.y - this.a1.im, 2));
            const d2 = Math.sqrt(Math.pow(mouse.x - this.a2.re, 2) +
                                 Math.pow(mouse.y - this.a2.im, 2));
            //console.log('opt')
            //console.log(d1);
            if(d1 < 0.05) {
                this.selecting = 'a1';
                //console.log('sa1')
            } else if(d2 < 0.05) {
                this.selecting = 'a2';
                //console.log('sa2')
            } else {
                this.selecting = -1;
            }
           
        }
        const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
        this.mouseState.button = event.button;
        this.mouseState.prevPosition = mouse;
        this.mouseState.prevTranslate = this.translate;
        this.mouseState.isPressing = true;
        //console.log(`mouse${mouse.x}, ${mouse.y}`);
        if(this.pointSeries.orbitSeedMin.x < mouse.x &&
           mouse.x <  this.pointSeries.orbitSeedMax.x &&
           this.pointSeries.orbitSeedMin.y < mouse.y &&
           mouse.y <  this.pointSeries.orbitSeedMax.y) {
            //console.log('click');
            this.orbitMouseDiff = new Vec2(mouse.x - this.pointSeries.orbitSeedMin.x - this.orbitTranslation.x,
                                           mouse.y - this.pointSeries.orbitSeedMin.y - this.orbitTranslation.y);
            //console.log(`diff ${this.orbitMouseDiff.x}, ${this.orbitMouseDiff.y}`);
            this.prevOrbitTranslation = this.orbitTranslation;
            this.draggingOrbitSeed = true;
        }
    }

    mouseMoveListener(event) {
        event.preventDefault();
        if(this.recipeName === 'SakugawaRecipe') {
            if (!this.mouseCameraState.isPressing) return;
            const mouse = this.calcCameraCanvasCoord(event.clientX,
                                                     event.clientY);
            if (this.mouseCameraState.button === Canvas.MOUSE_BUTTON_LEFT) {
                const prevThetaPhi = this.camera.prevThetaPhi;
                this.camera.theta = prevThetaPhi.x + (this.mouseCameraState.prevPosition.x - mouse.x) * 0.01;
                this.camera.phi = prevThetaPhi.y - (this.mouseCameraState.prevPosition.y - mouse.y) * 0.01;
                this.camera.update();
                this.render();
            } else if (this.mouseCameraState.button === Canvas.MOUSE_BUTTON_RIGHT) {
                const d = mouse.sub(this.mouseCameraState.prevPosition);
                const [xVec, yVec] = this.camera.getFocalXYVector(this.canvas.width,
                                                                  this.canvas.height);
                this.camera.target = this.camera.prevTarget.add(xVec.scale(-d.x* 0.1).add(yVec.scale(-d.y * 0.1)));
                this.camera.update();
                this.render();
            }
        } else {
            if (!this.mouseState.isPressing) return;
            const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
            if(this.showControlPoints &&
               this.recipeName === 'OncePuncturedTorus' &&
               this.mouseState.button === Canvas.MOUSE_BUTTON_LEFT) {
                if(this.selecting === 'a1') {
                    this.a1.re = mouse.x;
                    this.a1.im = mouse.y;
                } else if (this.selecting === 'a2') {
                    this.a2.re = mouse.x;
                    this.a2.im = mouse.y;
                }
                this.preparePoints();
                this.render();
            }
            if (this.mouseState.button === Canvas.MOUSE_BUTTON_RIGHT) {
                this.translate = new Vec2(this.translate.x - (mouse.x - this.mouseState.prevPosition.x),
                                          this.translate.y + mouse.y - this.mouseState.prevPosition.y);
                this.render();
            }
        }

        if(this.draggingOrbitSeed) {
            const mouse = this.calcCanvasCoord(event.clientX, event.clientY);
            const wh = new Vec2(this.pointSeries.orbitWidth,
                                this.pointSeries.orbitHeight).scale(0.5);
            this.orbitTranslation = mouse.add(wh);
            //console.log(`orb ${this.orbitTranslation.x}, ${this.orbitTranslation.y}`);
            this.computeOrbits();
            this.render();
        }
    }
    
    mouseUpListener(event) {
        this.mouseCameraState.isPressing = false;
        this.mouseState.isPressing = false;
        this.mouseState.button = -1;
        this.draggingOrbitSeed = false;
    }

    save() {
        this.render();
        this.saveImage(this.gl,
                       this.canvas.width,
                       this.canvas.height,
                       'limitset.png');
    }
}
