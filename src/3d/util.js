import SPK1_1 from './spk1_1.js';
import Quaternion from './quaternion.js';

/**
 *
 * @param {SPK1_1} m
 * @param {Quaternion} q
 */
export function MobiusOnPoint(m, q) {
    const a = m.a;
    const b = m.b;
    const c = m.c;
    const d = m.d;

    if(q.isInfinity()) {
        if(c.isZero()) {
            return Quaternion.INFINITY;
        }
        return a.mult(c.inverse());
    }

    const left = a.mult(q).add(b);
    const right = c.mult(q).add(d).inverse();
    return left.mult(right);
}

/**
 *
 * @param {SPK1_1} m
 */
export function ComputeDelta(m) {
    return m.a.add( m.d.cliffordTransposition() ).imag().sqNorm() + 4 * m.b.k * m.c.k;
}

/**
 *
 * @param {SPK1_1} m
 */
export function ComputeFixedPoint(m) {
    const sigma = m.c.mult(m.c.cliffordTransposition().inverse());
    const tau = sigma.mult(m.a.cliffordTransposition()).add(m.d);
    let delta = ComputeDelta(m);
    let t = Quaternion.ONE;
    // console.log('sigma '+ sigma);
	// console.log('tau '+ tau);
	// console.log('delta '+ delta);

    if(sigma.equals(Quaternion.ONE)) {
        if(tau.isReal()) {
            if(Math.abs(m.trace().re) >= 1.9999999999) {
                // console.log('in 1c');
                t = tau.scale(0.5).add( tau.scale(0.5).mult(tau.scale(0.5)).sub(Quaternion.ONE).sqrt() );
            } else {
                // There are infinite number of fixed points
                // console.log('(1) infinity');
            }
        } else {
            // console.log('in 2');
            const TValue = tau.re + Math.sqrt((tau.re * tau.re - delta - 4)/2 + Math.sqrt(Math.pow(delta + 4 - tau.re * tau.re, 2) + 4 * tau.re * tau.re * delta));
            const T = new Quaternion(TValue, 0, 0, 0);
            const NValue = TValue / (TValue - 2 * tau.re);
            const N = new Quaternion(NValue, 0, 0, 0);
            t = (T.sub(tau)).inverse().mult(N.sub(sigma));
        }
    } else {
        if (delta <= 0.0000000001) {
            if(delta > 0) delta = 0;
            // console.log('in 3c');
            const N = Quaternion.ONE;
            const TValue = tau.re - Math.sqrt(-delta);
            const T = new Quaternion(TValue, 0, 0, 0);
            t = T.sub(tau).inverse().mult(N.sub(sigma));
            // console.log('T '+ T.toString());
            // console.log('t '+ t.toString());
        } else {
            // console.log('in 4');
            const TValue = tau.re + Math.sqrt((tau.re * tau.re - delta - 4)/2 + Math.sqrt(Math.pow(delta + 4 - tau.re * tau.re, 2) + 4 * tau.re * tau.re * delta));
            const T = new Quaternion(TValue, 0, 0, 0);
            const NValue = TValue / (TValue - 2 * tau.re);
            const N = new Quaternion(NValue, 0, 0, 0);
            t = (T.sub(tau)).inverse().mult(N.sub(sigma));
        }
    }
    const V = m.c.inverse().mult(t.sub(m.d));
    // console.log('m.c.inverse() '+ m.c.inverse().toString());
    // console.log('t.sub(m.d) '+ t.sub(m.d).toString());
    return V;
}

/**
 *
 * @param {Quaternion} q1
 * @param {Quaternion} q2
 */
export function DistQuaternion3D(q1, q2) {
    const diff = q2.sub(q1);
    const total = diff.re * diff.re + diff.i * diff.i + diff.j * diff.j;
    return Math.sqrt(total);
}

export function ComputeMatrix(m1, m2, m3, m4) {
    const m1m2 = m1.mult(m2);
    const m1m2m3  = m1m2.mult(m3);
    const m1m2m3m4 = m1m2m3.mult(m4);
    return m1m2m3m4;
}
