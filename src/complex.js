const SQRT2 = Math.sqrt(2);
const EPSILON = 0.000001;

export default class Complex {

    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    add(c) {
        return new Complex(this.re + c.re,
                           this.im + c.im);
    }

    sub(c) {
        return new Complex(this.re - c.re,
                           this.im - c.im);
    }

    mult(c) {
        return new Complex((this.re * c.re) - (this.im * c.im),
                           (this.re * c.im) + (this.im * c.re));
    }

    div(c) {
        const denom = (c.re * c.re) + (c.im * c.im);
        if (denom === 0) {
            return new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        }

        return new Complex((this.re * c.re + this.im * c.im) / denom,
                           (this.im * c.re - this.re * c.im) / denom);
    }

    conjugate() {
        return new Complex(this.re, -this.im);
    }

    isInfinity() {
        return (this.re === Number.POSITIVE_INFINITY || this.im === Number.POSITIVE_INFINITY);
    }

    isZero() {
        return (this.re === 0 && this.im === 0);
    }

    length() {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    eq(c) {
        const re = this.re - c.re;
        const im = this.im - c.im;
        return (re * re + im * im) < EPSILON;
    }

    static distance(c1, c2) {
        return c1.sub(c2).length();
    }

    static sqrt(c) {
        if (c.im > 0) {
            return new Complex(Math.sqrt(c.re + Math.sqrt(c.re * c.re +
                                                          c.im * c.im)) / SQRT2,
                               Math.sqrt(-c.re + Math.sqrt(c.re * c.re +
                                                           c.im * c.im)) / SQRT2);
        } else if (c.i < 0) {
            return new Complex(Math.sqrt(c.re + Math.sqrt(c.re * c.re + c.im * c.im)) / SQRT2,
                               -Math.sqrt(-c.re + Math.sqrt(c.re * c.re + c.im * c.im)) / SQRT2);
        }

        if (c.re < 0) {
            return new Complex(0, Math.sqrt(Math.abs(c.re)));
        }

        return new Complex(Math.sqrt(c.re), 0);
    }

    static eq(c1, c2) {
        const re = c1.re - c2.re;
        const im = c1.im - c2.im;
        return (re * re + im * im) < EPSILON;
    }

    static get ZERO() {
        return new Complex(0, 0);
    }

    static get ONE() {
        return new Complex(1, 0);
    }

    static get I() {
        return new Complex(0, 1);
    }

    static get MINUS_ONE() {
        return new Complex(0, -1);
    }

    static get INFINITY() {
        return new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
}
