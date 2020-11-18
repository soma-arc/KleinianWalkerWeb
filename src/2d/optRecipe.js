import ComplexProbability from './complexProbability.js';

export default class OPTRecipe{
    /**
     *
     * @param {Complex} a1
     * @param {Complex} a2
     * @param {Complex} origin
     */
    constructor(a1, a2, origin) {
		const cp = new ComplexProbability(a1, a2, origin);
        this.gens = cp.getGens();
    }
}
