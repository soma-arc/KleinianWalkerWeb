import Complex from './complex.js';
import SL2C from './sl2c.js';
import { Hsv2rgb } from '../util.js';

export default class DFSOperator {
    /**
     * @param {[SL2C]} gens
     */
    constructor(gens) {
        this.gens = gens;
        this.computeCircularWords(gens);
    }

    /**
     * @param {Number} maxLevel
     * @param {Number} threshold
     */
    initialize(maxLevel, threshold) {
        this.maxLevel = maxLevel;
        this.threshold = threshold;
        this.level = 1;
        this.tags = new Array(100);
        this.tags[1] = 0;
        this.word = new Array(100);
        this.word[0] = SL2C.UNIT;
        this.word[1] = this.gens[0];
        this.pointList = [];
        this.colorList = [];
        this.firstTags = [];
    }

    /**
     * @param {[SL2C]} gens
     */
    computeCircularWords(gens) {
        this.is_aaBParabolic = false;
        const trace_aaB = gens[0].mult(gens[0]).mult(gens[3]).trace().abs();
        if(1.9 < trace_aaB && trace_aaB < 2.1) {
            console.log('aaB is parabolic');
            this.numFixedPoint = [4, 3, 4, 3];
            this.is_aaBParabolic = true;

            this.circularWords = new Array(4);
            this.circularWords[0] = new Array(4);
            this.circularWords[0][0] = gens[1].mult(gens[2]).mult(gens[3]).mult(gens[0]);
            this.circularWords[0][1] = gens[0].mult(gens[3]).mult(gens[0]);
            this.circularWords[0][2] = gens[3].mult(gens[0]).mult(gens[0]);
            this.circularWords[0][3] = gens[3].mult(gens[2]).mult(gens[1]).mult(gens[0]);

            this.circularWords[1] = new Array(3);
            this.circularWords[1][0] = gens[2].mult(gens[3]).mult(gens[0]).mult(gens[1]);
            this.circularWords[1][1] = gens[2].mult(gens[2]).mult(gens[1]);
            this.circularWords[1][2] = gens[0].mult(gens[3]).mult(gens[2]).mult(gens[1]);

            this.circularWords[2] = new Array(4);
            this.circularWords[2][0] = gens[3].mult(gens[0]).mult(gens[1]).mult(gens[2]);
            this.circularWords[2][1] = gens[2].mult(gens[1]).mult(gens[2]);
            this.circularWords[2][2] = gens[1].mult(gens[3]).mult(gens[3]);
            this.circularWords[2][3] = gens[1].mult(gens[0]).mult(gens[3]).mult(gens[2]);

            this.circularWords[3] = new Array(3);
            this.circularWords[3][0] = gens[0].mult(gens[1]).mult(gens[2]).mult(gens[3]);
            this.circularWords[3][1] = gens[0].mult(gens[0]).mult(gens[2]);
            this.circularWords[3][2] = gens[2].mult(gens[1]).mult(gens[0]).mult(gens[3]);
        } else {        
            this.circularWords = new Array(4);
            this.circularWords[0] = new Array(3);
            this.circularWords[0][0] = gens[1].mult(gens[2]).mult(gens[3]).mult(gens[0]);
            this.circularWords[0][1] = gens[0];
            this.circularWords[0][2] = gens[3].mult(gens[2]).mult(gens[1]).mult(gens[0]);

            this.circularWords[1] = new Array(3);
            this.circularWords[1][0] = gens[2].mult(gens[3]).mult(gens[0]).mult(gens[1]);
            this.circularWords[1][1] = gens[1];
            this.circularWords[1][2] = gens[0].mult(gens[3]).mult(gens[2]).mult(gens[1]);

            this.circularWords[2] = new Array(3);
            this.circularWords[2][0] = gens[3].mult(gens[0]).mult(gens[1]).mult(gens[2]);
            this.circularWords[2][1] = gens[2];
            this.circularWords[2][2] = gens[1].mult(gens[0]).mult(gens[3]).mult(gens[2]);

            this.circularWords[3] = new Array(3);
            this.circularWords[3][0] = gens[0].mult(gens[1]).mult(gens[2]).mult(gens[3]);
            this.circularWords[3][1] = gens[3];
            this.circularWords[3][2] = gens[2].mult(gens[1]).mult(gens[0]).mult(gens[3]);
        }

        this.fixedPoints = [];
        for (const l of this.circularWords) {
            const pList = [];
            for (const w of l) {
                pList.push(w.computeFixedPointPlus());
            }
            this.fixedPoints.push(pList);
        }
        //console.log(this.gens);
        //console.log(this.fixedPoints);
    }

    search(maxLevel, threshold) {
        this.initialize(maxLevel, threshold);
        do {
            while (this.branchTermination(this.level, this.maxLevel,
                                          this.tags, this.word,
                                          this.fixedPoints, this.threshold,
                                          this.pointList) === false) {
                this.level = this.goForward(this.level, this.tags, this.gens, this.word);
            }

            do {
                this.level = this.goBackward(this.level);
            } while ((this.level !== 0) && !this.availableTurn(this.level, this.tags));

            this.level = this.turnAndGoForward(this.level, this.tags, this.gens, this.word);
        } while (this.level !== 1 || this.tags[1] !== 0);
    }

    goForward(level, tags, gens, word) {
        level++;
        tags[level] = (tags[level - 1] + 1) % 4;
        word[level] = word[level - 1].mult(gens[tags[level]]);
        return level;
    }

    goBackward(level) {
        level--;
        return level;
    }

    availableTurn(level, tags) {
        // -1 % 4 = -1, -2 % 4 = -2
        return ((4 + (tags[level + 1] - 1)) % 4 !== (tags[level] + 2) % 4);
    }

    turnAndGoForward(level, tags, gens, word) {
        tags[level + 1] = (4 + tags[level + 1] - 1) % 4;
        if (level === 0) {
            word[1] = gens[tags[1]];
        } else {
            word[level + 1] = word[level].mult(gens[tags[level + 1]]);
        }
        level++;
        return level;
    }

    branchTermination(level, maxLevel, tags, word, fixedPoints,
                      threshold, pointList) {
        const p = [];
        for (const fixedPoint of fixedPoints[tags[level]]) {
            p.push(word[level].apply(fixedPoint));
        }

        if(this.is_aaBParabolic) {
            if(level === maxLevel &&
               fixedPoints[tags[level]].length === 3 &&
               (Complex.distance(p[2], p[1]) < threshold &&
                Complex.distance(p[1], p[0]) < threshold)){
                pointList.push(p[0].re, 0, p[0].im,
                               p[1].re, 0, p[1].im,
                               p[1].re, 0, p[1].im,
                               p[2].re, 0, p[2].im);
                const rgb = Hsv2rgb(pointList.length * 0.00001,1.0, 1.0);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);

                this.firstTags.push(tags[1], tags[1], tags[1], tags[1]);
                return true;
            } else if (level === maxLevel &&
                       fixedPoints[tags[level]].length === 4 &&
                       (Complex.distance(p[3], p[2]) < threshold &&
                        Complex.distance(p[2], p[1]) < threshold &&
                        Complex.distance(p[1], p[0]) < threshold)) {
                pointList.push(p[0].re, 0, p[0].im,
                               p[1].re, 0, p[1].im,
                               p[1].re, 0, p[1].im,
                               p[2].re, 0, p[2].im,
                               p[2].re, 0, p[2].im,
                               p[3].re, 0, p[3].im);
                const rgb = Hsv2rgb(pointList.length * 0.00001,1.0, 1.0);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);

                this.firstTags.push(tags[1], tags[1],
                                    tags[1], tags[1],
                                    tags[1], tags[1]);
                return true;
            }
        } else {
            if (level === maxLevel ||
                (Complex.distance(p[2], p[1]) < threshold &&
                 Complex.distance(p[1], p[0]) < threshold)) {
                //console.log(maxLevel);
                //            Array.prototype.push.apply(pointList, p);
                pointList.push(p[0].re, 0, p[0].im,
                               p[1].re, 0, p[1].im,
                               p[1].re, 0, p[1].im,
                               p[2].re, 0, p[2].im);
                const rgb = Hsv2rgb(pointList.length * 0.00001,1.0, 1.0);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);
                this.colorList.push(rgb.x, rgb.y, rgb.z);

                this.firstTags.push(tags[1], tags[1], tags[1], tags[1]);
                return true;
            }
        }
        return false;
    }
}
