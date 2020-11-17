import Complex from './complex.js';
import SL2C from './sl2c.js';

export default class JorgensenRecipe {
    constructor(t_a, t_b, isT_abPlus) {
        let t_ab;
        if(isT_abPlus){
            t_ab = (t_a.mult(t_b).add(
                Complex.sqrt(t_a.mult(t_a).mult(t_b).mult(t_b).sub(
                    (t_a.mult(t_a).add(t_b.mult(t_b))).scale(4))))).scale(0.5);
        } else {
            t_ab = (t_a.mult(t_b).sub(
                Complex.sqrt(t_a.mult(t_a).mult(t_b).mult(t_b).sub(
                    (t_a.mult(t_a).add(t_b.mult(t_b))).scale(4))))).scale(0.5);
        }
        console.log(t_ab);
        const gens = new Array(4);
        gens[0] = new SL2C(t_a.sub(t_b.div(t_ab)),
                           t_a.div(t_ab.mult(t_ab)),
                           t_a,
                           t_b.div(t_ab));
        gens[1] = new SL2C(t_b.sub(t_a.div(t_ab)),
                           t_b.scale(-1).div(t_ab.mult(t_ab)),
                           t_b.scale(-1),
                           t_a.div(t_ab));
        console.log(gens[0]);
        console.log(gens[1]);
        gens[2] = gens[0].inverse();
        gens[3] = gens[1].inverse();

        this.gens = gens;
    }
}
