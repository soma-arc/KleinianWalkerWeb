import SakugawaRecipe from './sakugawaRecipe.js';
import DFSOperator from './dfsOperator.js';

export default class Scene2d {
    constructor() {
    }

    computeSakugawaLimitSet(z0, thetaA, thetaB, maxLevel, threshold) {
        const sakugawaRecipe = new SakugawaRecipe(z0, thetaA, thetaB);
        const dfs = new DFSOperator(sakugawaRecipe.a, sakugawaRecipe.b,
                                    maxLevel, threshold);
        dfs.search(maxLevel, threshold);
        return [dfs.points, dfs.colorList, dfs.firstTags];
    }
}
