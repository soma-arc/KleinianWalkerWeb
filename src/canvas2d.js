import Vec3 from './geometry/vector3.js';
import Vec2 from './geometry/vector2.js';
import Point3 from './geometry/point3.js';
import Transform from './geometry/transform.js';

import { GetWebGL2Context, CreateSquareVbo, AttachShader,
         LinkProgram, CreateRGBATextures, CreateStaticVbo } from './glUtils.js';
import Canvas from './canvas.js';

const RENDER_FRAG = require('./shaders/render.frag');
const RENDER_VERT = require('./shaders/render.vert');

export default class Canvas2D extends Canvas {
    constructor(canvasId) {
        super(canvasId);

        this.scale = 300;
        this.distScale = 1.25;
        this.translate = new Vec2(0, 0);
    }

    init() {
        this.canvas = document.getElementById(this.canvasId);
        this.gl = GetWebGL2Context(this.canvas);
        this.addEventListeners();

        this.compileRenderShader();

        this.preparePoints();
        
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
        this.getUniformLocations();
    }

    preparePoints() {
        this.points = [];
        for (let i = 0; i < 1000000; i++) {
            const x = (Math.random() - 0.5) * 2;
            const y = (Math.random() - 0.5) * 2;
            let pos = new Vec2(x, y);
            this.points.push(pos.x, 0, pos.y);
        }
        this.pointsVbo = CreateStaticVbo(this.gl, this.points);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVbo);
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
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.renderProgram);
        gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointsVbo);
        const attStride = 3;
        gl.vertexAttribPointer(this.vPositionAttrib, attStride, this.gl.FLOAT, false, 0, 0);

        const viewM = Transform.lookAt(new Point3(this.translate.x,
                                                  1, this.translate.y),
                                       new Point3(this.translate.x,
                                                  0, this.translate.y),
                                       new Vec3(0, 0, 1));
        const projectM = Transform.ortho2d(-width / this.scale,
                                           width / this.scale,
                                           -height / this.scale,
                                           height / this.scale,
                                           -1, 1);

        this.mvpM = projectM.mult(viewM);
        this.setUniformValues();

        gl.drawArrays(gl.POINTS, 0, this.points.length/3);
        gl.flush();
    }
}
