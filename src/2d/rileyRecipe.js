import Complex from './complex.js';
import SL2C from './sl2c.js';

export default class RileyRecipe {
    constructor(c) {
        const gens = new Array(4);
        gens[0] = new SL2C(Complex.ONE, Complex.ZERO,
                           c, Complex.ONE);
        gens[1] = new SL2C(Complex.ONE, new Complex(2, 0),
                           Complex.ZERO, Complex.ONE);
        gens[2] = gens[0].inverse();
        gens[3] = gens[1].inverse();

        this.gens = gens;
    }
}
