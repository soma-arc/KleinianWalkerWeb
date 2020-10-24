export default class Vec2 {
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    mult(v) {
        return new Vec2(this.x * v.x, this.y * v.y);
    }

    /**
     * @param {Vec2} v
     * @returns {Vec2}
     */
    div(v) {
        return new Vec2(this.x / v.x, this.y / v.y);
    }

    /**
     * @param {Number} k
     * @returns {Vec2}
     */
    scale(k) {
        return new Vec2(this.x * k, this.y * k);
    }

    /**
     *
     * @returns {Number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     *
     * @returns {Number}
     */
    lengthSq() {
        return (this.x * this.x + this.y * this.y);
    }

    /**
     *
     * @returns {Vec2}
     */
    normalize() {
        return this.scale(1.0 / this.length());
    }

    /**
     *
     * @param {Vec2} v
     * @returns {Boolean}
     */
    eq(v) {
        return Math.abs(this.x - v.x) <= Vec2.THRESHOLD &&
            Math.abs(this.y - v.y <= Vec2.THRESHOLD);
    }

    /**
     *
     * @param {Vec2} v1
     * @param {Vec2} v2
     * @returns {Boolean}
     */
    static eq(v1, v2) {
        return Math.abs(v1.x - v2.x) <= Vec2.THRESHOLD &&
            Math.abs(v1.y - v2.y <= Vec2.THRESHOLD);
    }

    /**
     *
     * @returns {Vec2}
     */
    abs() {
        return new Vec2(Math.abs(this.x), Math.abs(this.y));
    }

    /**
     *
     * @returns {Vec2}
     */
    opposite() {
        return new Vec2(-this.x, -this.y)
    }

    cloneDeeply() {
        return new Vec2(this.x, this.y);
    }

    /**
     *
     * @returns {Boolean}
     */
    hasNans() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }

    /**
     *
     * @param {Vec2} v
     * @returns {Vec2}
     */
    static normalize(v) {
        return v.normalize();
    }

    /**
     *
     * @param {Vec2} v1
     * @param {Vec2} v2
     * @returns {Number}
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    /**
     *
     * @param {Vec2} v
     * @returns {Number}
     */
    static minComponent(v) {
        return Math.min(v.x, v.y);
    }

    /**
     *
     * @param {Vec2} v
     * @returns {Number}
     */
    static maxComponent(v) {
        return Math.max(v.x, v.y);
    }

    static get THRESHOLD() {
        return 0.0000001;
    }
}
