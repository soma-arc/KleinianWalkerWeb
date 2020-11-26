import Vec2 from './geometry/vector2.js';
import SL2C from './2d/sl2c.js';

export default class PointSeries {
    /**
     * @param {[Complex]} points
     */
    constructor(points, orbitScale, gens) {
        this.points = points;
        this.orbitScale = orbitScale;
        this.gens = gens;
        this.calcBounds();
    }

    calcBounds() {
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        this.orbitSeedPoints = [];
        this.orbitSeedColors = [];
        for(const p of this.points) {
            const x = p.re;
            const y = p.im;
            if(x > maxX) maxX = x;
            if(y > maxY) maxY = y;
            if(x < minX) minX = x;
            if(y < minY) minY = y;
            this.orbitSeedPoints.push(x, 0, y);
            this.orbitSeedColors.push(255/255, 161/255, 3/255);

            this.orbitSeedMin = new Vec2(minX, minY);
            this.orbitSeedMax = new Vec2(maxX, maxY);
            this.orbitWidth = maxX - minX;
            this.orbitHeight = maxY - minY;
        }
    }

    /**
     * @param {SL2C} t
     * @returns {PointSeries}
     */
    transform(t) {
        const transformedPoints = [];
        for(const p of this.points) {
            transformedPoints.push(t.apply(p));
        }
        return new PointSeries(transformedPoints, this.orbitScale, this.gens);
    }

    /**
     * @param {int} maxLevel
     * @param {root} rootPointSeries
     */
    static RunBFS(maxLevel, rootPointSeries) {
        const figures = [[]];
        figures[0].push(TaggedPointSeries.MakeTaggedPointSeries(rootPointSeries,
                                                                -1));
        for(let level = 0; level < maxLevel; level++) {
            figures.push([]);
            for(const figure of figures[level]) {
                for(let tag = 0; tag < figure.pointSeries.gens.length; tag++) {
                    if((tag + 2) % 4 == figure.tag) continue;
					const word = figure.word.mult(figure.pointSeries.gens[tag]);
					figures[level + 1].push(
                        new TaggedPointSeries(rootPointSeries.transform(word),
                                              tag, word));
                }
            }
        }

        const transformedFigures = [];
        for(const list of figures){
			for(const l of list){
				transformedFigures.push(l.pointSeries);
			}
		}

        return transformedFigures;
    }
}

class TaggedPointSeries {
    constructor (pointSeries, tag, word) {
        this.pointSeries = pointSeries;
        this.tag = tag;
        this.word = word;        
    }

    static MakeTaggedPointSeries(pointSeries, tag) {
        return new TaggedPointSeries(pointSeries, tag, SL2C.UNIT);
    }
}
