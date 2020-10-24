import Complex from '../src/complex';
import SL2C from '../src/sl2c';

const assert = require('power-assert');

describe('SL2C', () => {
    describe('trace', () => {
        it('SL2C trace', () => {
            const a = new SL2C(new Complex(2, 3), new Complex(3, 4),
                               new Complex(5, 6), new Complex(5, 6));
            const tr = a.trace();
            assert.equal(tr.re, 7);
            assert.equal(tr.im, 9);
        });
    });
});
