import Point3 from './point3.js';
import Vec3 from './vector3.js';

export default class Ray {
    /**
     *
     * @param {Point3} o
     * @param {Vec3} d
     * @param {Number} tmax
     * @param {Number} time
     */
    constructor(o, d, tmax, time) {
        this.o = o;
        this.d = d;
        this.tmax = tmax;
        this.time = time;
    }

    /**
     *
     * @param {Number} t
     * @returns {Point3}
     */
    point(t) {
        return this.o.addVec(this.d.scale(t));
    }
}
