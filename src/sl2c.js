import Complex from './complex';

export default class SL2C {

    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    prod(m) {
        return new SL2C(this.a.prod(m.a).add(this.b.prod(m.c)),
                        this.a.prod(m.b).add(this.b.prod(m.d)),
                        this.c.prod(m.a).add(this.d.prod(m.c)),
                        this.c.prod(m.b).add(this.d.prod(m.d)));
    }

    determinant() {
        this.a.prod(this.d).sub(this.b.prod(this.c));
    }

    inverse() {
        return new SL2C(this.d, this.b.prod(Complex.MINUS_ONE),
                        this.c.prod(Complex.MINUS_ONE), this.a).prod(this.determinant());
    }

    trace() {
        return this.a.add(this.d);
    }
}
