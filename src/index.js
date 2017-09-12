import Complex from '../lib/GeometryUtils/src/complex.js';
import GrandmaRecipe from './grandmaRecipe.js';
import DfsOperator from './dfsOperator.js';

window.addEventListener('load', function(event) {
    const recipe = new GrandmaRecipe(new Complex(2, 0.5),
                                     new Complex(2, 0.5),
                                     false);
    const dfs = new DfsOperator(recipe.gens);
    dfs.initialize(3, 0.005);
    console.log('init')
    dfs.search();
    console.log(dfs.pointList);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.lineWidth = 0.5;
    ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
    const scale = 100;
    for (const p of dfs.pointList) {
        ctx.beginPath();
        ctx.moveTo(p[0].re * scale, p[0].im * scale);
        ctx.lineTo(p[1].re * scale, p[1].im * scale);
        ctx.lineTo(p[2].re * scale, p[2].im * scale);
        ctx.stroke();
    }
});
