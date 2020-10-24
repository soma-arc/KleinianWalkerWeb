import GrandmaRecipe from './grandmaRecipe.js';
import DFSOperator from './dfsOperator.js';

export default class Scene2d {
    constructor() {
    }

    computeGrandmaLimitSet(t_a, t_b, isT_abPlus, maxLevel, threshold) {
        const grandmaRecipe = new GrandmaRecipe(t_a, t_b, isT_abPlus);
        const dfs = new DFSOperator(grandmaRecipe.gens);
        dfs.search(maxLevel, threshold);
        return dfs.pointList;
    }
}
