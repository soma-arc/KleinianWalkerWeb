import GrandmaRecipe from './grandmaRecipe.js';
import JorgensenRecipe from './jorgensenRecipe.js';
import RileyRecipe from './rileyRecipe.js';
import DFSOperator from './dfsOperator.js';

export default class Scene2d {
    constructor() {
    }

    computeGrandmaLimitSet(t_a, t_b, isT_abPlus, maxLevel, threshold) {
        const grandmaRecipe = new GrandmaRecipe(t_a, t_b, isT_abPlus);
        const dfs = new DFSOperator(grandmaRecipe.gens);
        dfs.search(maxLevel, threshold);
        return [dfs.pointList, dfs.colorList, dfs.firstTags];
    }
    
    computeJorgensenLimitSet(t_a, t_b, isT_abPlus, maxLevel, threshold) {
        const jorgensenRecipe = new JorgensenRecipe(t_a, t_b, isT_abPlus);
        const dfs = new DFSOperator(jorgensenRecipe.gens);
        dfs.search(maxLevel, threshold);
        return [dfs.pointList, dfs.colorList, dfs.firstTags];
    }

    computeRileyLimitSet(c, maxLevel, threshold) {
        const rileyRecipe = new RileyRecipe(c);
        const dfs = new DFSOperator(rileyRecipe.gens);
        dfs.search(maxLevel, threshold);
        return [dfs.pointList, dfs.colorList, dfs.firstTags];
    }
}
