import Complex from '../src/complex';

const assert = require('power-assert');

describe('Complex', () => {
    describe('add', () => {
        it('Complex test', () => {
            const a = new Complex(1, 0);
            const b = new Complex(0, 1);
            assert.equal(a.re, b.re);
        });
    });
});
