import Vec3 from './vector3.js';

export default class Point3 {
    /**
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     *
     * @param {Point3} p
     * @returns {Point3}
     */
    add(p) {
        return new Point3(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Point3}
     */
    addVec(v) {
        return new Point3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     *
     * @param {Point3} p
     * @returns {Vec3}
     */
    sub(p) {
        return new Vec3(this.x - p.x, this.y - p.y, this.z - p.z);
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Point3}
     */
    subVec(v) {
        return new Point3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     *
     * @param {Point3} p
     * @returns {Point3}
     */
    prod(p) {
        return new Point3(this.x * p.x, this.y * p.y, this.z * p.z);
    }

    /**
     *
     * @param {Point3} p
     * @returns {Point3}
     */
    div(p) {
        return new Point3(this.x / p.x, this.y / p.y, this.z / p.z);
    }

    /**
     *
     * @param {number} k
     * @returns {Point3}
     */
    scale(k) {
        return new Point3(this.x * k, this.y * k, this.z * k);
    }

    /**
     *
     * @returns {Boolean}
     */
    hasNans() {
        return Number.isNaN(this.x) || Number.isNaN(this.y) || Number.isNaN(this.z);
    }

    /**
     *
     * @returns {Point3}
     */
    abs() {
        return new Point3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    /**
     *
     * @param {Point3} p
     * @returns {Number}
     */
    static minComponent(p) {
        return Math.min(p.x, Math.min(p.y, p.z));
    }

    /**
     *
     * @param {Point3} p
     * @returns {Number}
     */
    static maxComponent(p) {
        return Math.max(p.x, Math.max(p.y, p.z));
    }

    /**
     *
     * @param {Point3} p1
     * @param {Point3} p2
     * @returns {number}
     */
    static distance(p1, p2) {
        const l = p1.sub(p2);
        return Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z);
    }

    /**
     *
     * @param {Point3} p1
     * @param {Point3} p2
     * @returns {number}
     */
    static distanceSq(p1, p2) {
        const l = p1.sub(p2);
        return (l.x * l.x + l.y * l.y + l.z * l.z);
    }
}
