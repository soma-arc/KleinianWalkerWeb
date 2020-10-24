import Complex from './complex.js';

export default class SL2C {
    /**
     *
     * @param {Complex} a
     * @param {Complex} b
     * @param {Complex} c
     * @param {Complex} d
     */
    constructor (a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    /**
     *
     * @param {SL2C} m
     * @returns {SL2C}
     */
    mult (m) {
        return new SL2C(this.a.mult(m.a).add(this.b.mult(m.c)),
                        this.a.mult(m.b).add(this.b.mult(m.d)),
                        this.c.mult(m.a).add(this.d.mult(m.c)),
                        this.c.mult(m.b).add(this.d.mult(m.d)));
    }

    /**
     *
     * @param {SL2C} m1
     * @param {SL2C} m2
     * @returns {SL2C}
     */
    static prod (m1, m2) {
        return m1.mult(m2);
    }

    /**
     *
     * @param {SL2C} m
     * @returns {SL2C}
     */
    conjugate (m) {
        // m^-1 this m
        return SL2C.prod(SL2C.prod(m.inverse(), this), m);
    }

    /**
     *
     * @param {Complex} c
     * @returns {SL2C}
     */
    apply (c) {
        if (c.isInfinity()) {
            if (!this.c.isZero()) {
                return this.a.div(this.c);
            } else {
                return Complex.INFINITY;
            }
        }

        const nume = this.a.mult(c).add(this.b);
        const denom = this.c.mult(c).add(this.d);
        if (denom.isZero()) {
            return Complex.INFINITY;
        } else {
            return nume.div(denom);
        }
    }

    /**
     *
     * @returns {SL2C}
     */
    computeFixedPointPlus() {
        const four = new Complex(4, 0);
        const tr = this.trace();
        const num = this.a.sub(this.d).add(tr.mult(tr).sub(four).sqrt());
        return num.div(this.c.scale(2));
    }

    /**
     *
     * @returns {SL2C}
     */
    computeFixedPointMinus() {
        const four = new Complex(4, 0);
        const tr = this.trace();
        const num = this.a.sub(this.d).sub(tr.mult(tr).sub(four).sqrt());
        return num.div(this.c.scale(2));
    }

    /**
     *
     * @returns {SL2C}
     */
    determinant () {
        return this.a.mult(this.d).sub(this.b.mult(this.c));
    }

    /**
     *
     * @param {Complex} k
     * @returns {SL2C}
     */
    scale (k) {
        return new SL2C(this.a.mult(k), this.b.mult(k),
                        this.c.mult(k), this.d.mult(k));
    }

    /**
     *
     * @returns {SL2C}
     */
    inverse () {
        return new SL2C(this.d, this.b.mult(Complex.MINUS_ONE),
                        this.c.mult(Complex.MINUS_ONE), this.a).scale(Complex.ONE.div(this.determinant()));
    }

    /**
     *
     * @returns {Complex}
     */
    trace () {
        return this.a.add(this.d);
    }

    /**
     *
     * @returns {boolean}
     */
    hasNaN () {
        return this.a.hasNaN() || this.b.hasNaN() || this.c.hasNaN() || this.d.hasNaN();
    }

    /**
     *
     * @returns {number[]}
     */
    get linearArray () {
        return this.a.linearArray.concat(this.b.linearArray,
                                         this.c.linearArray,
                                         this.d.linearArray);
    }

    /**
     *
     * @returns {SL2C}
     */
    static get UNIT () {
        return new SL2C(Complex.ONE, Complex.ZERO,
                        Complex.ZERO, Complex.ONE);
    }
}
