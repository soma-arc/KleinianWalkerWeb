import GrandmaRecipe from './grandmaRecipe.js';
import JorgensenRecipe from './jorgensenRecipe.js';
import RileyRecipe from './rileyRecipe.js';
import DFSOperator from './dfsOperator.js';
import OPTDFSOperator from './OPTDFSOperator.js';
import OPTRecipe from './optRecipe.js';
import GrandmaSpecialtiesRecipe from './grandmaSpecialtiesRecipe.js';

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

    computeOPTLimitSet(a1, a2, origin, maxLevel, threshold) {
        const recipe = new OPTRecipe(a1, a2, origin);
        const dfs = new OPTDFSOperator(recipe.gens);
        dfs.search(maxLevel, threshold);
        return [dfs.pointList, dfs.colorList, dfs.firstTags];
    }

    computeGrandmaSpecialtiesLimitSet(t_a, t_b, t_ab, isR_plus, maxLevel, threshold) {
        const recipe = new GrandmaSpecialtiesRecipe(t_a, t_b, t_ab, isR_plus);
        const dfs = new DFSOperator(recipe.gens);
        dfs.search(maxLevel, threshold);
        return [dfs.pointList, dfs.colorList, dfs.firstTags];
    }
}
