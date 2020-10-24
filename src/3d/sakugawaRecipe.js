import Quaternion from './quaternion.js';
import SPK1_1 from './spk1_1.js';

/**
 *
 * @param {Quaternion} z0
 * @param {Number} thetaA
 * @param {Number} thetaB
 */
export default class SakugawaRecipe {
    constructor(z0, thetaA, thetaB) {
        this.z0 = z0;
        const z0Re = z0.re;
        this.thetaA = thetaA;
        this.thetaB = thetaB;

        const R = Math.sqrt( -z0Re * (z0Re + 4.0) * ( Math.sin(thetaA + thetaB) * Math.sin(thetaA + thetaB) ) );
		let z;
		if(Math.sin(thetaA + thetaB) == 0){
			z = new Quaternion(-4, 0, 0, 0);
		}else{
			const phi = Math.PI/2;//ƒÓ
			z = new Quaternion(z0Re, R * Math.cos(phi), R * Math.sin(phi), 0);
		}

		const qa = new Quaternion(Math.cos(thetaA), 0, 0, Math.sin(thetaA));
		this.a = new SPK1_1(qa, Quaternion.ZERO, z.mult(qa), qa);

		const qb = new Quaternion(Math.cos(thetaB), 0, 0, Math.sin(thetaB));

		this.b = new SPK1_1(qb, qb, Quaternion.ZERO, qb);
    }
}
