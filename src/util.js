import Vec3 from './geometry/vector3.js';

export function Hsv2rgb(h, s, v) {
    const c = new Vec3(h, s, v);
    const cxxx = new Vec3(h, h, h);
    const K = new Vec3(1.0, 2.0 / 3.0, 1.0 / 3.0);
    const Kxxx = new Vec3(1, 1, 1);
    const Kwww = new Vec3(3, 3, 3);
    const p = Vec3.abs(Vec3.fract(cxxx.add(K)).scale(6.0).sub(Kwww));
    return Vec3.mix(Kxxx, Vec3.clamp(p.sub(Kxxx), 0.0, 1.0), c.y).scale(c.z);
}
