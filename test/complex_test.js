import Complex from '../src/complex';

const assert = require('power-assert');

describe('Complex', () => {
    describe('add', () => {
        it('Complex test', () => {
            const a = new Complex(1, 0);
            const b = new Complex(0, 1);
            const ab = a.add(b);
            assert.equal(ab.re, 1);
            assert.equal(ab.im, 1);
        });
    });
});
