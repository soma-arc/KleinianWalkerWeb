import Complex from './complex.js';

export default class Circle {
    /*
     * @param {Complex} center
     * @param {number} r
     */
    constructor(center, r){
		this.center = center;
		this.r = r;
        this.CENTER_POINT_R = 5;
	}
	
	// draw(Graphics2D g2, double magnification){
	// 	g2.drawOval((int) ((center.re() - r) * magnification), (int) ((center.im() - r) * magnification), 
	// 			   (int) (2*r * magnification), (int) (2*r * magnification));
	// 	drawCenter(g2, magnification);
	// }
	
	// drawCenter(Graphics g, double magnification){
	// 	g.fillOval((int)(center.re() * magnification - CENTER_POINT_R),
	// 			   (int)(center.im() * magnification - CENTER_POINT_R), 
	// 			   2 * CENTER_POINT_R, 2 * CENTER_POINT_R);
	// }
	
	toString(){
		return `{ (${this.center.r}, ${this.center.im}), ${this.r} }`;
	}

    /*
     * @param {Circle} c1
     * @param {Circle} c2
     */
	static getIntersections(c1, c2){
		const intersections = new Array(2);
		const x1 = c2.center.re - c1.center.re;
		const y1 = c2.center.im - c1.center.im;
		const r1 = c1.r;
		const r2 = c2.r;
		const a = (x1 * x1 + y1 * y1 + r1 * r1 - r2 * r2) / 2;
		
		const denom = x1 * x1 + y1 * y1;
		const sqrtElem = Math.sqrt(denom * r1 * r1 - a * a);
		
		const re1 = (a * x1 + y1 * sqrtElem) / denom;
		const im1 = (a * y1 - x1 * sqrtElem) / denom;
		intersections[0] = new Complex(re1 + c1.center.re,
                                       im1 + c1.center.im);
		
		const re2 = (a * x1 - y1 * sqrtElem) / denom;
		const im2 = (a * y1 + x1 * sqrtElem) / denom;
		intersections[1] = new Complex(re2 + c1.center.re,
                                       im2 + c1.center.im);
		
		return intersections;
	}
}
