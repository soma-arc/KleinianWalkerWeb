export default class Vec3 {
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
     * @param {Vec3} v
     * @returns {Vec3}
     */
    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Vec3}
     */
    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Vec3}
     */
    mult(v) {
        return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Vec3}
     */
    div(v) {
        return new Vec3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    /**
     *
     * @param {number} k
     * @returns {Vec3}
     */
    scale(k) {
        return new Vec3(this.x * k, this.y * k, this.z * k);
    }

    /**
     *
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     *
     * @returns {number}
     */
    lengthSq() {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
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
     * @returns {Vec3}
     */
    abs() {
        return new Vec3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
    }

    /**
     *
     * @returns {Vec3}
     */
    opposite() {
        return new Vec3(-this.x, -this.y, -this.z)
    }

    /**
     *
     * @returns {Vec3}
     */
    normalize() {
        return this.scale(1.0 / this.length());
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Number}
     */
    static minComponent(v) {
        return Math.min(v.x, Math.min(v.y, v.z));
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Number}
     */
    static maxComponent(v) {
        return Math.max(v.x, Math.max(v.y, v.z));
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Vec3}
     */
    static normalize(v) {
        return v.normalize();
    }

    /**
     *
     * @param {Vec3} v1
     * @param {Vec3} v2
     * @returns {number}
     */
    static dot(v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
    }

    /**
     *
     * @param {Vec3} v1
     * @param {Vec3} v2
     * @returns {Vec3}
     */
    static cross(v1, v2) {
        return new Vec3(v1.y * v2.z - v1.z * v2.y,
                        v1.z * v2.x - v1.x * v2.z,
                        v1.x * v2.y - v1.y * v2.x);
    }

    /**
     *
     * @param {Vec3} v
     * @returns {Boolean}
     */
    eq(v) {
        return Math.abs(this.x - v.x) <= Vec3.THRESHOLD &&
            Math.abs(this.y - v.y <= Vec3.THRESHOLD) &&
            Math.abs(this.z - v.z <= Vec3.THRESHOLD);
    }

    /**
     *
     * @param {Vec2} v1
     * @param {Vec2} v2
     * @returns {Boolean}
     */
    static eq(v1, v2) {
        return Math.abs(v1.x - v2.x) <= Vec3.THRESHOLD &&
            Math.abs(v1.y - v2.y) <= Vec3.THRESHOLD &&
            Math.abs(v1.z - v2.z <= Vec3.THRESHOLD);
    }

    /**
     *
     * @param {Vec3} v1
     * @returns {[Vec3]}
     */
    static coordinateSystem(v1) {
        let v2;
        if (Math.abs(v1.x) > Math.abs(v1.y)) {
            v2 = new Vec3(-v1.z, 0, v1.x).scale(1 / Math.sqrt(v1.x * v1.x + v1.z * v1.z));
        } else {
            v2 = new Vec3(0, v1.z, -v1.y).scale(1 / Math.sqrt(v1.y * v1.y + v1.z * v1.z));
        }
        const v3 = Vec3.cross(v1, v2);
        return [v1, v2, v3];
    }

    static abs(v) {
        return new Vec3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
    }

    static fract(v) {
        return new Vec3(v.x - Math.floor(v.x),
                        v.y - Math.floor(v.y),
                        v.z - Math.floor(v.z));
    }

    static clamp(v, a, b) {
        return new Vec3(Math.min(Math.max(v.x, a), b),
                        Math.min(Math.max(v.y, a), b),
                        Math.min(Math.max(v.z, a), b));
    }

    static mix(x, y, a) {
        return x.scale(1 - a).add(y.scale(a));
    }

    static get THRESHOLD() {
        return 0.0000001;
    }
}
