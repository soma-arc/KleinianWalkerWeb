const EPSILON = 0.0000000001;

export default class Quaternion {
    /**
     *
     * @param {number} re
     * @param {number} i
     * @param {number} j
     * @param {number} k
     */
    constructor(re, i, j, k) {
        this.re = re;
        this.i = i;
        this.j = j;
        this.k = k;
    }

    /**
     *
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    add(q) {
        return new Quaternion(this.re + q.re,
                              this.i + q.i,
                              this.j + q.j,
                              this.k + q.k);
    }

    /**
     *
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    sub(q) {
        return new Quaternion(this.re - q.re,
                              this.i - q.i,
                              this.j - q.j,
                              this.k - q.k);
    }

    /**
     *
     * @param {Quaternion} q
     * @returns {Quaternion}
     */
    mult(q) {
        if (this.isZero() || q.isZero()) return Quaternion.ZERO;
        if(this.isInfinity() || q.isInfinity()) return Quaternion.INFINITY;

        return new Quaternion(this.re * q.re - this.i * q.i  - this.j * q.j  - this.k * q.k, 
                              this.re * q.i  + this.i * q.re + this.j * q.k  - this.k * q.j, 
                              this.re * q.j  - this.i * q.k  + this.j * q.re + this.k * q.i, 
                              this.re * q.k  + this.i * q.j  - this.j * q.i  + this.k * q.re);
    }

    scale(k) {
        if(this.isInfinity() || k === Number.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY;
		return new Quaternion(this.re * k, this.i * k, this.j * k, this.k * k);
    }

    static log(q) {
        const logRe = Math.log(q.norm());
        const logImag = q.imag().scale(1.0 / q.imag().norm()).scale(Math.atan(q.imag().norm() / q.re));
        return new Quaternion(logRe, logImag.i, logImag.j, logImag.k);
    }

    static exp(q) {
        const realValue = Math.exp(q.re) * Math.cos(q.imag().norm());
        const im = q.imag().scale(1.0 / q.imag().norm()).scale(Math.sin(q.imag().norm())).scale(Math.exp(q.re));
        return new Quaternion(realValue, im.i, im.j, im.k);
    }

    static pow(q, exponent) {
        return Quaternion.exp(Quaternion.log(q).scale(exponent));
    }
    
    sqrt() {
        if(this.isComplex()) {
            return this.complexSqrt();
        }
        return Quaternion.pow(this, 0.5);
    }

    complexSqrt() {
        if (this.i > 0) {
            const n = Math.sqrt(this.re * this.re + this.i * this.i);
            return new Quaternion(Math.sqrt(this.re + n) / Math.sqrt(2),
                                  Math.sqrt(-this.re + n) / Math.sqrt(2),
                                  0,0);
        } else if (this.i < 0) {
            const n = Math.sqrt(this.re * this.re + this.i * this.i);
            return new Quaternion(Math.sqrt(this.re + n) / Math.sqrt(2),
                                  -Math.sqrt(-this.re + n) / Math.sqrt(2),
                                  0,0);
        }

        if(this.re < 0) {
            return new Quaternion(0, Math.sqrt(Math.abs(this.re)), 0, 0);
        }
        return new Quaternion(Math.sqrt(this.re), 0, 0, 0);
    }

    div(k) {
        if (k === Number.POSITIVE_INFINITY || (k === 0 && this.isZero())) return Quaternion.ZERO;
        else if (k === 0) return Quaternion.INFINITY;
        return new Quaternion(this.re / k, this.i / k, this.j / k, this.k / k);
    }

    imag() {
        return new Quaternion(0, this.i, this.j, this.k);
    }

    isZero() {
        // return (this.re) === 0 &&
        //     (this.i) === 0 &&
        //     (this.j) === 0 &&
        //     (this.k) === 0;
        return Math.abs(this.re) < EPSILON &&
            Math.abs(this.i) < EPSILON &&
            Math.abs(this.j) < EPSILON &&
            Math.abs(this.k) < EPSILON;
    }

    isInfinity() {
        return this.re === Number.POSITIVE_INFINITY ||
            this.i === Number.POSITIVE_INFINITY ||
            this.j === Number.POSITIVE_INFINITY ||
            this.k === Number.POSITIVE_INFINITY;
    }

    isReal() {
        return (Math.abs(this.i) < EPSILON &&
                Math.abs(this.j) < EPSILON &&
                Math.abs(this.k) < EPSILON);
    }

    isComplex() {
        return (this.j === 0 && this.k === 0);
    }

    cliffordTransposition() {
        return new Quaternion(this.re, this.i, this.j, -this.k);        
    }

    conjugation() {
        return new Quaternion(this.re, -this.i, -this.j, -this.k);
    }

    abs() {
        return this.re * this.re + this.i * this.i + this.j * this.j + this.k * this.k;
    }

    norm() {
        if(this.isInfinity()) return Number.POSITIVE_INFINITY;
        return Math.sqrt(this.re * this.re + this.i * this.i + this.j * this.j + this.k * this.k);
    }

    sqNorm() {
        if(this.isInfinity()) return Number.POSITIVE_INFINITY;
        return this.re * this.re + this.i * this.i + this.j * this.j + this.k * this.k;
    }

    inverse() {
        const v = Math.pow(this.norm(), 2);
        if(v === Number.POSITIVE_INFINITY) return Quaternion.ZERO;
        else if (v < EPSILON) return Quaternion.INFINITY;
        return this.conjugation().div(v);
    }

    //純虚四元数p = b1i + c1j + d1k と q = b2i + c2j + d2kに対して
	//p.q = b1b2 + c1c2 + d1d2
	//pxq = (c1d2 - d1c2)i + (d1b2 - b1d2)j + (b1c2 - c1b2)k
    vectorDot(q) {
        return this.i * q.i + this.j * q.j + this.k * q.k;
    }

    vectorCross(q) {
        return new Quaternion(0,
                              this.j*q.k - this.k*q.j,
                              this.k*q.i - this.i*q.k,
                              this.i*q.j - this.j*q.i);
    }

    equals(q) {
        return Math.abs(this.re - q.re) < EPSILON &&
            Math.abs(this.i - q.i) < EPSILON &&
            Math.abs(this.j - q.j) < EPSILON &&
            Math.abs(this.k - q.k) < EPSILON;
    }

    static get ZERO() {
        return new Quaternion(0, 0, 0, 0);
    }

    static get ONE() {
        return new Quaternion(1, 0, 0, 0);
    }

    static get I () {
        return new Quaternion(0, 1, 0, 0);
    }

    static get INFINITY() {
        return new Quaternion(Number.POSITIVE_INFINITY,
                              Number.POSITIVE_INFINITY,
                              Number.POSITIVE_INFINITY,
                              Number.POSITIVE_INFINITY);
    }

    toString(){
		let iSign = " + ";
		let jSign = " + ";
		let kSign = " + ";
		if(this.i < 0) iSign = " - ";
		if(this.j < 0) jSign = " - ";
		if(this.k < 0) kSign = " - ";
		return this.re + iSign + Math.abs(this.i) +"i" + jSign + Math.abs(this.j) + "j"+ kSign + Math.abs(this.k) +"k";
	}
}
