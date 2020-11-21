import Complex from './complex.js';
import SL2C from './sl2c.js';

export default class GrandmaSpecialtiesRecipe {
    /**
     *
     * @param {Complex} t_a
     * @param {Complex} t_b
     * @param {Complex} t_ab
     * @param {Boolean} R_plus
     */
    constructor(t_a, t_b, t_ab, R_plus) {
        // Indra's Pearls p246 Box 23
        this.t_a = t_a;
        this.t_b = t_b;
        this.t_ab = t_ab;
        this.R_plus = R_plus;
        const i = Complex.I;
        const two = new Complex(2, 0);
        const four = new Complex(4, 0);
        const t_C = t_a.mult(t_a).add(t_b.mult(t_b)).add(t_ab.mult(t_ab)).sub(t_a.mult(t_b).mult(t_ab)).sub(two);

        const Q = two.sub(t_C).sqrt();
        const comp_plus = t_C.add(i.mult(Q).mult(t_C.add(two).sqrt())).abs();
        let R;
        let plus = false;
        let minus = false;
        if(comp_plus >= 2){
            R = t_C.add(two).sqrt();
            plus = true;
        }
        const comp_minus = t_C.sub(i.mult(Q).mult(t_C.add(two).sqrt())).abs();
        if(comp_minus >= 2){
            R = t_C.add(two).sqrt().scale(-1.0);
            minus = true;
        }
        if(plus && minus) {
            if(R_plus) {
                R = t_C.add(two).sqrt();
            } else {
                R = t_C.add(two).sqrt().scale(-1.0);
            }
        }

        const gens = new Array(4);
        const z0 = t_ab.sub(two).mult(t_b.add(R)).div(t_b.mult(t_ab).sub(t_a.scale(2.0)).add(i.mult(Q).mult(t_ab)));
        gens[0] = new SL2C(t_a.scale(0.5),
                           t_a.mult(t_ab).sub(t_b.scale(2.0)).add(i.mult(Q).mult(two)).div(z0.mult(t_ab.scale(2.0).add(four))),
                           z0.mult(t_a.mult(t_ab).sub(t_b.scale(2.0)).sub(Q.mult(i).mult(2.0))).div(t_ab.scale(2.0).sub(four)),
                           t_a.scale(0.5));
        gens[1] = new SL2C(t_b.sub(i.mult(Q)).div(two),
                           t_b.mult(t_ab).sub(t_a.scale(2.0)).sub(i.mult(Q).mult(t_ab)).div(z0.mult(t_ab.scale(2.0).add(four))),
                           z0.mult(t_b.mult(t_ab).sub(t_a.scale(2.0)).add(i.mult(Q).mult(t_ab))).div(t_ab.scale(2.0).sub(four)),
                           t_b.add(i.mult(Q)).div(two));

        gens[2] = gens[0].inverse();
        gens[3] = gens[1].inverse();
        console.log(gens);
        this.gens = gens;
    }
}
