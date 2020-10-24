import Complex from './complex.js';
import SL2C from './sl2c.js';

export default class GrandmaRecipe {
    /**
     *
     * @param {Complex} t_a
     * @param {Complex} t_b
     * @param {Boolean} isT_abPlus
     */
    constructor(t_a, t_b, isT_abPlus) {
        let t_ab;
        if (isT_abPlus) {
            t_ab = t_a.mult(t_b).add(Complex.sqrt(t_a.mult(t_a).mult(t_b.mult(t_b)).sub(t_a.mult(t_a).add(t_b.mult(t_b)).mult(new Complex(4, 0))))).mult(new Complex(0.5, 0));
        } else {
            t_ab = t_a.mult(t_b).sub(Complex.sqrt(t_a.mult(t_a).mult(t_b.mult(t_b)).sub(t_a.mult(t_a).add(t_b.mult(t_b)).mult(new Complex(4, 0))))).mult(new Complex(0.5, 0));
        }
        const z0 = t_ab.sub(new Complex(2, 0)).mult(t_b).div(t_b.mult(t_ab).sub(t_a.mult(new Complex(2, 0))).add(t_ab.mult(new Complex(0, 2.0))));
        console.log(t_ab);
        console.log(z0);
        const gens = new Array(4);
        gens[0] = new SL2C(t_a.mult(new Complex(0.5, 0)),
                           t_a.mult(t_ab).sub(t_b.mult(new Complex(2, 0))).add(new Complex(0, 4.0)).div(z0.mult(t_ab.mult(new Complex(2, 0)).add(new Complex(4, 0)))),
                           z0.mult(t_a.mult(t_ab).sub(t_b.mult(new Complex(2, 0))).sub(new Complex(0, 4.0)).div(t_ab.mult(new Complex(2, 0)).sub(new Complex(4, 0)))),
                           t_a.mult(new Complex(0.5, 0)));
        gens[1] = new SL2C(t_b.sub(new Complex(0, 2.0)).mult(new Complex(0.5, 0)),
                           t_b.mult(new Complex(0.5, 0)),
                           t_b.mult(new Complex(0.5, 0)),
                           t_b.add(new Complex(0, 2.0)).mult(new Complex(0.5, 0)));
        gens[2] = gens[0].inverse();
        gens[3] = gens[1].inverse();

        this.gens = gens;
    }
}
