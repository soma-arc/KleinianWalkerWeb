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
        return new Complex((this.re * c.re + this.i * c.im) / denom,
                           (this.im * c.re - this.re * c.im) / denom);
    }

    static get ONE() {
        return new Complex(1, 0);
    }

    static get I() {
        return new Complex(0, 1);
    }
}
