const sqrt2 = Math.sqrt(2);

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
        return new Complex((this.re * c.re) - (this.i * c.im),
                           (this.re * c.im) + (this.im * c.re));
    }

    div(c) {
        const denom = (c.re * c.re) + (c.im * c.im);
        if (denom === 0) {
            return new Complex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        }

        return new Complex((this.re * c.re + this.i * c.im) / denom,
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

    static distance(c1, c2) {
        return c1.sub(c2).length();
    }

    static sqrt(c) {
        if (c.im > 0) {
            return new Complex(Math.sqrt(c.re + Math.sqrt(c.re * c.re +
                                                          c.im * c.im)) / sqrt2,
                               Math.sqrt(-c.re + Math.sqrt(c.re * c.re +
                                                           c.im * c.im)) / sqrt2);
        } else if (c.i < 0) {
            return new Complex(Math.sqrt(c.re + Math.sqrt(c.re * c.re + c.im * c.im)) / sqrt2,
                               -Math.sqrt(-c.re + Math.sqrt(c.re * c.re + c.im * c.im)) / sqrt2);
        }

        if (c.re < 0) {
            return new Complex(0, Math.sqrt(Math.abs(c.re)));
        }

        return new Complex(Math.sqrt(c.re), 0);
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
}
