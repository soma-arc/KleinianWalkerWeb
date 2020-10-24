import Complex from '../src/complex';

const assert = require('power-assert');

describe('Complex', () => {
    const a = new Complex(1, 5);
    const b = new Complex(4, 1);
    const c = new Complex(1, 5);
    const zero = Complex.ZERO;

    describe('eq', () => {
        it('should return true when the a is equal to b', () => {
            assert.equal(Complex.eq(a, c), true);
            assert.ok(a.eq(c));
        });
        it('should return false when the a is not equal to b', () => {
            assert.equal(Complex.eq(a, b), false);
            assert.equal(a.eq(b), false);
        });
    });

    describe('add', () => {
        it('Complex addition', () => {
            assert.ok(a.add(b).eq(new Complex(5, 6)));
        });
    });

    describe('sub', () => {
        it('Complex subtraction', () => {
            assert.ok(Complex.eq(a.sub(b), new Complex(-3, 4)));
        });
    });

    describe('mult', () => {
        it('Complex multiplication', () => {
            assert.ok(Complex.eq(a.mult(b), new Complex(-1, 21)));
        });
    });

    describe('div', () => {
        it('Complex division', () => {
            assert.ok(Complex.eq(a.div(b), new Complex(0.5294117, 1.117647)));
        });
        it('Complex division by zero should return infinity', () => {
            assert.ok(a.div(zero).isInfinity());
        });
    });
});
