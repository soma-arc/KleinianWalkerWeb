import Mat4 from './mat4.js';
import Vec3 from './vector3.js';
import Point3 from './point3.js';
import Ray from './ray.js';
import { Radians } from './radians.js';

export default class Transform {
    /**
     *
     * @param {Mat4} m
     * @param {Mat4} mInv
     */
    constructor(m, mInv) {
        this.m = m;
        this.mInv = mInv;
    }

    /**
     * swap role of mInv and m
     * @return {Transform}
     */
    inverse() {
        return new Transform(this.mInv, this.m);
    }

    /**
     *
     * @returns {Transform}
     */
    transpose() {
        return new Transform(this.m.transpose(),
                             this.mInv.transpose());
    }

    /**
     *
     * @param {Transform} t
     * @returns {Transform}
     */
    mult(t) {
        return new Transform(Mat4.prod(this.m, t.m),
                             Mat4.prod(t.mInv, this.mInv));
    }

    /**
     *
     * @param {Transform} t1
     * @param {Transform} t2
     * @returns {Transform}
     */
    static prod(t1, t2) {
        return new Transform(Mat4.prod(t1.m, t2.m),
                             Mat4.prod(t2.mInv, t1.mInv));
    }

    /**
     *
     * @param {Point3} p
     * @returns {Point3}
     */
    applyToPoint(p) {
        const e = this.m.elem;
        const xp = e[0] * p.x + e[4] * p.y + e[8] * p.z + e[12];
        const yp = e[1] * p.x + e[5] * p.y + e[9] * p.z + e[13];
        const zp = e[2] * p.x + e[6] * p.y + e[10] * p.z + e[14];
        const wp = e[3] * p.x + e[7] * p.y + e[11] * p.z + e[15];
        if (wp === 1) return new Point3(xp, yp, zp);
        else return new Point3(xp, yp, zp).scale(1 / wp);
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Vec3}
     */
    applyToVec(v) {
        const e = this.m.elem;
        return new Vec3(e[0] * v.x + e[4] * v.y + e[8] * v.z,
                        e[1] * v.x + e[5] * v.y + e[9] * v.z,
                        e[2] * v.x + e[6] * v.y + e[10] * v.z);
    }

    /**
     *
     * @param {Ray} ray
     * @returns {Ray}
     */
    applyToRay(ray) {
        const o = this.applyToPoint(ray.o);
        const d = this.applyToVec(ray.d);
        return new Ray(o, d, ray.tmax, ray.time);
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {Transform}
     */
    static translate(x, y, z) {
        return new Transform(new Mat4(1, 0, 0, 0,
                                      0, 1, 0, 0,
                                      0, 0, 1, 0,
                                      x, y, z, 1),
                             new Mat4(1, 0, 0, 0,
                                      0, 1, 0, 0,
                                      0, 0, 1, 0,
                                      -x, -y, -z, 1));
    }

    /**
     *
     * @param {Number} degrees
     * @returns {Transform}
     */
    static rotateX(degrees) {
        const cosTheta = Math.cos(Radians(degrees));
        const sinTheta = Math.sin(Radians(degrees));
        const m = new Mat4(1, 0, 0, 0,
                           0, cosTheta, sinTheta, 0,
                           0, -sinTheta, cosTheta, 0,
                           0, 0, 0, 1);
        return new Transform(m, m.transpose());
    }

    /**
     *
     * @param {Number} degrees
     * @returns {Transform}
     */
    static rotateY(degrees) {
        const cosTheta = Math.cos(Radians(degrees));
        const sinTheta = Math.sin(Radians(degrees));
        const m = new Mat4(cosTheta, 0, -sinTheta, 0,
                           0, 1, 0, 0,
                           sinTheta, 0, cosTheta, 0,
                           0, 0, 0, 1);
        return new Transform(m, m.transpose());
    }

    /**
     *
     * @param {Number} degrees
     * @returns {Transform}
     */
    static rotateZ(degrees) {
        const cosTheta = Math.cos(Radians(degrees));
        const sinTheta = Math.sin(Radians(degrees));
        const m = new Mat4(cosTheta, sinTheta, 0, 0,
                           -sinTheta, cosTheta, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1);
        return new Transform(m, m.transpose());
    }

    /**
     *
     * @param {Number} degrees
     * @param {Vec3} axis
     */
    static rotate(degrees, axis) {
        const a = axis.normalize();
        const a2 = a.mult(a);
        const axy = a.x * a.y;
        const ayz = a.y * a.z;
        const axz = a.x * a.z;

        const cosTheta = Math.cos(Radians(degrees));
        const sinTheta = Math.sin(Radians(degrees));

        const m = new Mat4(a2.x + (1 - a2.x) * cosTheta,
                           axy * (1 - cosTheta) + a.z * sinTheta,
                           axz * (1 - cosTheta) - a.y * sinTheta,
                           0,

                           axy * (1 - cosTheta) - a.z * sinTheta,
                           a2.y + (1 - a2.y) * cosTheta,
                           ayz * (1 - cosTheta) + a.x * sinTheta,
                           0,

                           axz * (1 - cosTheta) + a.y * sinTheta,
                           ayz * (1 - cosTheta) - a.x * sinTheta,
                           a2.z + (1 - a2.z) * cosTheta,
                           0,

                           0, 0, 0, 1);
        return new Transform(m, m.transpose());
    }

    /**
     *
     * @param {Point3} pos
     * @param {Point3} target
     * @param {Vec3} up
     */
    static lookAt(pos, target, up) {
        const dir = target.sub(pos).normalize();
        const left = Vec3.cross(up.normalize(), dir).normalize();
        const nUp = Vec3.cross(dir, left);
        const cameraToWorld = new Mat4(left.x, left.y, left.z, 0,
                                       nUp.x, nUp.y, nUp.z, 0,
                                       dir.x, dir.y, dir.z, 0,
                                       pos.x, pos.y, pos.z, 1);
        return new Transform(cameraToWorld.inverse(), cameraToWorld);
    }

    /**
     * Camera to Screen
     * @param {Number} fovDegrees
     * @param {Number} near
     * @param {Number} far
     * @returns {Transform}
     */
    static perspective(fovDegrees, near, far) {
        const pers = new Mat4(1, 0, 0, 0,
                              0, 1, 0, 0,
                              0, 0, far / (far - near), 1,
                              0, 0, -far * near / (far - near), 0);
        const invTan = 1 / Math.tan(Radians(fovDegrees) / 2);
        return Transform.scale(invTan, invTan, 1).mult(Transform.fromMat4(pers));
    }

    static ortho(near, far) {
        return Transform.scale(1, 1, 1 / (far - near)).mult(Transform.translate(0, 0, -near));
    }

    static ortho2d(left, right, bottom, top, near, far) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        const m = new Mat4(-2 * lr, 0, 0, 0,
                           0, -2 * bt, 0, 0,
                           0, 0, 2 * nf, 0,
                           (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
        return new Transform(m, m.transpose());
    }

    
    // static ortho2d(left, right, bottom, top, near, far) {
    //     const lr = 1 / (left - right);
    //     const bt = 1 / (bottom - top);
    //     const nf = 1 / (near - far);
    //     const m = new Mat4(-2 * lr, 0, 0, 0,
    //                        0, -2 * bt, 0, 0,
    //                        0, 0, 2 * nf, 0,
    //                        (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1);
    //     return new Transform(m, m.transpose());
    // }

    static rasterToScreen(width, height) {
        const aspect = width / height;
        let screenToRaster;
        if (aspect > 1.0) {
            screenToRaster = Transform.scale(width, height, 1)
                .mult(Transform.scale(1 / (2 * aspect), 1 / 2, 1))
                .mult(Transform.translate(aspect, 1, 0));
        } else {
            screenToRaster = Transform.scale(width, height, 1)
                .mult(Transform.scale(1 / 2, 1 / (2 / aspect), 1))
                .mult(Transform.translate(1, 1 / aspect, 0));
        }
        return screenToRaster.inverse();
    }

    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {Transform}
     */
    static scale(x, y, z) {
        return new Transform(new Mat4(x, 0, 0, 0,
                                      0, y, 0, 0,
                                      0, 0, z, 0,
                                      0, 0, 0, 1),
                             new Mat4(1 / x, 0, 0, 0,
                                      0, 1 / y, 0, 0,
                                      0, 0, 1 / z, 0,
                                      0, 0, 0, 1));
    }

    /**
     *
     * @returns {Boolean}
     */
    swapsHandedness() {
        return (this.m.elem[0] * (this.m.elem[5] * this.m.elem[10] -
                                  this.m.elem[9] * this.m.elem[6]) -
                this.m.elem[4] * (this.m.elem[1] * this.m.elem[10] -
                                  this.m.elem[9] * this.m.elem[2]) +
                this.m.elem[8] * (this.m.elem[1] * this.m.elem[6] -
                                  this.m.elem[5] * this.m.elem[2])) < 0;
    }

    /**
     * @return {Transform}
     */
    static get IDENTITY() {
        return new Transform(Mat4.IDENTITY, Mat4.IDENTITY);
    }

    /**
     * column-major m_column_row
     * | m00 m10 m20 m30 |
     * | m01 m11 m21 m31 |
     * | m02 m12 m22 m32 |
     * | m03 m13 m23 m33 |
     * @param {Number} m00
     * @param {Number} m01
     * @param {Number} m02
     * @param {Number} m03
     * @param {Number} m10
     * @param {Number} m11
     * @param {Number} m12
     * @param {Number} m13
     * @param {Number} m20
     * @param {Number} m21
     * @param {Number} m22
     * @param {Number} m23
     * @param {Number} m30
     * @param {Number} m31
     * @param {Number} m32
     * @param {Number} m33
     * @return {Transform}
     */
    static fromValues(m00, m01, m02, m03,
                      m10, m11, m12, m13,
                      m20, m21, m22, m23,
                      m30, m31, m32, m33) {
        const m = new Mat4(m00, m01, m02, m03,
                           m10, m11, m12, m13,
                           m20, m21, m22, m23,
                           m30, m31, m32, m33);
        const mInv = m.inverse();
        return new Transform(m, mInv);
    }

    static fromMat4(m) {
        return new Transform(m, m.inverse());
    }
}
