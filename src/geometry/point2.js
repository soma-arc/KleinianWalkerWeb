const assert = require('power-assert');
import Vec2 from './vector2.js';

export default class Point2 {
/**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        assert.ok(!this.hasNans())
    }

    /**
     * @param {Point2} p
     * @returns {Point2}
     */
    add(p) {
        return new Point2(this.x + p.x, this.y + p.y);
    }

    /**
     * 
     * @param {Vec2} v
     * @returns {Point2}
     */
    addVec(v) {
        return new Point2(this.x + v.x, this.y + v.y)
    }

    /**
     * @param {Point2} p
     * @returns {Vec2}
     */
    sub(p) {
        return new Vec2(this.x - p.x, this.y - p.y);
    }

    /**
     * 
     * @param {Vec2} v
     * @returns {Point2} 
     */
    subVec(v) {
        return new Point2(this.x - v.x, this.y - v.y);
    }

    /**
     * @param {Point2} p
     * @returns {Point2}
     */
    prod(p) {
        return new Point2(this.x * p.x, this.y * p.y);
    }

    /**
     * @param {Point2} p
     * @returns {Point2}
     */
    div(p) {
        return new Point2(this.x / p.x, this.y / p.y);
    }

    /**
     * @param {Number} p
     * @returns {Point2}
     */
    scale(k) {
        return new Point2(this.x * k, this.y * k);
    }

    /**
     *
     * @param {Point2} p
     * @returns {Boolean}
     */
    eq(p) {
        return Math.abs(this.x - p.x) <= Point2.EPSILON &&
            Math.abs(this.y - p.y <= Point2.EPSILON);
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
     * @param {Point2} p1
     * @param {Point2} p2
     * @returns {Number}
     */
    static distance(p1, p2) {
        const l = p1.sub(p2);
        return Math.sqrt(l.x * l.x + l.y * l.y);
    }

    /**
     *
     * @param {Point2} p1
     * @param {Point2} p2
     * @returns {Number}
     */
    static distanceSq(p1, p2) {
        const l = p1.sub(p2);
        return l.x * l.x + l.y * l.y;
    }

    /**
     *
     * @param {Point2} p
     * @returns {Number}
     */
    static minComponent(p) {
        return Math.min(p.x, p.y);
    }

    /**
     *
     * @param {Point2} p
     * @returns {Number}
     */
    static maxComponent(p) {
        return Math.max(p.x, p.y);
    }

    static get EPSILON() {
        return 0.00001;
    }
}
