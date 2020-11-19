import Complex from './complex.js';
import Circle from './circle.js';
import SL2C from './sl2c.js';

export default class ComplexProbability {
    /**
     *
     * @param {Complex} a1
     * @param {Complex} a2
     * @param {Complex} origin
     */
    constructor(a1, a2, origin){
        this.a1 = a1;
        this.a2 = a2;
        this.origin = origin;
        this.a0 = Complex.ONE.sub(a1).sub(a2);
		this.setData();
    }
    
    /**
     *
     * @param {Complex} Q
     */
    setQ(Q){
		this.a1 = Q.sub(origin);
		this.a2 = this.r0.sub(Q);
		this.a0 = Complex.ONE.sub(this.a1).sub(this.a2);
		this.setData();
	}

    /**
     *
     * @param {Complex} step
     */    
	moveQ(step){
		const Q = this.q0.add(step);
		this.a1 = Q.sub(this.origin);
		this.a2 = this.r0.sub(Q);
		this.a0 = Complex.ONE.sub(this.a1).sub(this.a2);
		this.setData();
	}

    /**
     *
     * @param {Complex} R
     */
	setR(R){
		this.a2 = R.sub(this.origin).sub(this.a1);
		this.a0 = Complex.ONE.sub(this.a1).sub(this.a2);
		this.setData();
	}

	/**
     *
     * @param {Complex} step
     */
	moveR(step){
		const R = this.r0.add(step);
		this.a2 = R.sub(origin).sub(this.a1);
		this.a0 = Complex.ONE.sub(this.a1).sub(this.a2);
		this.setData();
	}

    setData(){
		this.x = Complex.sqrt(Complex.ONE.div(this.a0.mult(this.a1)));
		this.y = Complex.sqrt(Complex.ONE.div(this.a1.mult(this.a2)));
		this.z = Complex.sqrt(Complex.ONE.div(this.a2.mult(this.a0)));
		
		this.mirrorVecX = Complex.I.div(this.x);
		this.mirrorVecY = Complex.I.div(this.y);
		this.mirrorVecZ = Complex.I.div(this.z);
		
		this.p0 = this.origin;
		this.q0 = this.p0.add(this.a1);
		this.r0 = this.q0.add(this.a2);

		this.cP0 = new Circle(this.p0, this.mirrorVecX.abs());
		this.cQ0 = new Circle(this.q0, this.mirrorVecY.abs());
		this.cR0 = new Circle(this.r0, this.mirrorVecZ.abs());
		this.cP1 = new Circle(this.p0.add(Complex.ONE), this.cP0.r);

		const intersectP0Q0 = Circle.getIntersections(this.cP0,
                                                      this.cQ0);
		const intersectQ0R0 = Circle.getIntersections(this.cQ0,
                                                      this.cR0);
		const intersectR0P1 = Circle.getIntersections(this.cR0,
                                                      this.cP1);
		if(intersectP0Q0[0].im > intersectP0Q0[1].im){
			this.aboveIntersectP0Q0 = intersectP0Q0[0];
			this.bottomIntersectP0Q0 = intersectP0Q0[1];
		}else{
			this.aboveIntersectP0Q0 = intersectP0Q0[1];
			this.bottomIntersectP0Q0 = intersectP0Q0[0];
		}
		if(intersectQ0R0[0].im > intersectQ0R0[1].im){
			this.aboveIntersectQ0R0 = intersectQ0R0[0];
			this.bottomIntersectQ0R0 = intersectQ0R0[1];
		}else{
			this.aboveIntersectQ0R0 = intersectQ0R0[1];
			this.bottomIntersectQ0R0 = intersectQ0R0[0];
		}
		if(intersectR0P1[0].im > intersectR0P1[1].im) {
			this.aboveIntersectR0P1 = intersectR0P1[0];
			this.bottomIntersectR0P1 = intersectR0P1[1];
		}else{
			this.aboveIntersectR0P1 = intersectR0P1[1];
			this.bottomIntersectR0P1 = intersectR0P1[0];
		}

		this.aboveIntersectR_1P0 = this.aboveIntersectR0P1.sub(Complex.ONE);
		this.bottomIntersectR_1P0 = this.bottomIntersectR0P1.sub(Complex.ONE);
	}

    getGens(){
		const gens = new Array(3);
		gens[0] = this.calcGen(this.p0, this.x);
		gens[1] = this.calcGen(this.q0, this.y);
		gens[2] = this.calcGen(this.r0, this.z);
		return gens;
	}

    /**
     *
     * @param {Complex} p
     * @param {Complex} x
     */
    calcGen(p, x){
		return new SL2C(x.mult(p),
                        x.mult(p.mult(p)).scale(-1).sub(Complex.ONE.div(x)),
                        x,
                        x.mult(p).scale(-1));
	}

    // public void draw(Graphics2D g2, double magnification, int width, int height){
	// 	drawCircles(g2, magnification, width, height);
	// 	drawPath(g2, magnification, width, height);
	// 	drawVectors(g2, magnification, width, height);
	// }
	
	// public void drawTriangles(Graphics2D g2, double magnification, int width, int height){
	// 	AffineTransform af = AffineTransform.getTranslateInstance(width/2 , height/2);
	// 	g2.setTransform(af);
	// 	g2.setColor(Color.white);
	// 	drawTriangle(g2, magnification, p0, aboveIntersectP0Q0, q0);
	// 	drawTriangle(g2, magnification, p0, bottomIntersectP0Q0, q0);

	// 	drawTriangle(g2, magnification, q0, aboveIntersectQ0R0, r0);
	// 	drawTriangle(g2, magnification, q0, bottomIntersectQ0R0, r0);

	// 	drawTriangle(g2, magnification, r0, aboveIntersectR0P1, p0.add(Complex.ONE));
	// 	drawTriangle(g2, magnification, r0, bottomIntersectR0P1, p0.add(Complex.ONE));

	// 	drawTriangle(g2, magnification, r0.sub(Complex.ONE), aboveIntersectR_1P0, p0);
	// 	drawTriangle(g2, magnification, r0.sub(Complex.ONE), bottomIntersectR_1P0, p0);
		
	// 	g2.setTransform(new AffineTransform());
	// }

    replaceAbove(){
		const aboveR_1P0Q0 = this.isIntersectAboveTriangle(this.aboveIntersectR_1P0,
                                                           this.p0,
                                                           this.aboveIntersectP0Q0);
		const aboveP0Q0R0 = this.isIntersectAboveTriangle(this.aboveIntersectP0Q0,
                                                          this.q0,
                                                          this.aboveIntersectQ0R0);
		const aboveQ0R0P1 = this.isIntersectAboveTriangle(this.aboveIntersectQ0R0,
                                                          this.r0,
                                                          this.aboveIntersectR0P1);
		
		if(aboveR_1P0Q0 && aboveP0Q0R0){
			const tLeft = this.segmentSection(this.aboveIntersectP0Q0,
                                              this.bottomIntersectP0Q0,
                                              this.aboveIntersectR_1P0,
                                              this.bottomIntersectR_1P0);
			const tRight = this.segmentSection(this.aboveIntersectP0Q0,
                                               this.bottomIntersectP0Q0,
                                               this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0);
			if(tLeft > tRight){
				return this.replace(0); 
			}else{
				return this.replace(1); 
			}
		}else if(aboveP0Q0R0 && aboveQ0R0P1){
			const tLeft = this.segmentSection(this.aboveIntersectQ0R0,
                                              this.bottomIntersectQ0R0,
                                              this.aboveIntersectP0Q0,
                                              this.bottomIntersectP0Q0);
			const tRight = this.segmentSection(this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0,
                                               this.aboveIntersectR0P1,
                                               this.bottomIntersectR0P1);
			if(tLeft > tRight){
				return this.replace(1); 
			}else{
				return this.replace(2); 
			}
		}else if(aboveR_1P0Q0 && aboveQ0R0P1){
			const tLeft = this.segmentSection(this.aboveIntersectP0Q0,
                                              this.bottomIntersectP0Q0,
                                              this.aboveIntersectR_1P0,
                                              this.bottomIntersectR_1P0);
			const tRight = this.segmentSection(this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0,
                                               this.aboveIntersectR0P1,
                                               this.bottomIntersectR0P1);
			if(tLeft > tRight){
				return this.replace(0); 
			}else{
				return this.replace(2); 
			}
		}else{
			if(aboveR_1P0Q0){
				return this.replace(0);
			}else if(aboveP0Q0R0){
				return this.replace(1);
			}else if(aboveQ0R0P1){
				return this.replace(2);
			}
		}
		
		return null;
	}
	
	replaceBottom(){
		const bottomR_1P0Q0 = this.isIntersectBottomTriangle(this.bottomIntersectR_1P0,
                                                             this.p0,
                                                             this.bottomIntersectP0Q0);
		const bottomP0Q0R0 = this.isIntersectBottomTriangle(this.bottomIntersectP0Q0,
                                                            this.q0,
                                                            this.bottomIntersectQ0R0);
		const bottomQ0R0P1 = this.isIntersectBottomTriangle(this.bottomIntersectQ0R0,
                                                            this.r0,
                                                            this.bottomIntersectR0P1);
		
		if(bottomR_1P0Q0 && bottomP0Q0R0){
			const tLeft = this.segmentSection(this.aboveIntersectP0Q0,
                                              this.bottomIntersectP0Q0,
                                              this.aboveIntersectR_1P0,
                                              this.bottomIntersectR_1P0);
			const tRight = this.segmentSection(this.aboveIntersectP0Q0,
                                               this.bottomIntersectP0Q0,
                                               this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0);
			if(tLeft < tRight){
				return this.replace(0); 
			}else{
				return this.replace(1); 
			}
		}else if(bottomP0Q0R0 && bottomQ0R0P1){
			const tLeft = this.segmentSection(this.aboveIntersectQ0R0,
                                              this.bottomIntersectQ0R0,
                                              this.aboveIntersectQ0R0,
                                              this.bottomIntersectQ0R0);
			const tRight = this.segmentSection(this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0,
                                               this.aboveIntersectR_1P0,
                                               this.bottomIntersectR_1P0);
			if(tLeft < tRight){
				return this.replace(1); 
			}else{
				return this.replace(2); 
			}
		}else if(bottomR_1P0Q0 && bottomQ0R0P1){
			const tLeft = this.segmentSection(this.aboveIntersectQ0R0,
                                              this.bottomIntersectQ0R0,
                                              this.aboveIntersectP0Q0,
                                              this.bottomIntersectP0Q0);
			const tRight = this.segmentSection(this.aboveIntersectQ0R0,
                                               this.bottomIntersectQ0R0,
                                               this.aboveIntersectR0P1,
                                               this.bottomIntersectR0P1);
			if(tLeft < tRight){
				return this.replace(0); 
			}else{
				return this.replace(2); 
			}
		}else{
			if(bottomR_1P0Q0){
				return this.replace(0);
			}else if(bottomP0Q0R0){
				return this.replace(1);
			}else if(bottomQ0R0P1){
				return this.replace(2);
			}
		}
		return null;
	}

    /**
     *
     * @param {Complex} a
     * @param {Complex} b
     * @param {Complex} c
     * @param {Complex} d
     */
	segmentSection(a, b, c, d){
		const a11 = b.re - a.re;
		const a12 = c.re - d.re;
		const b1 = c.re - a.re;
		const a21 = b.im - a.im;
		const a22 = c.im - d.im;
		const b2 = c.im - a.im;
		return (b1*a22-b2*a12)/(a11*a22-a21*a12);
	}

	// public void drawTriangle(Graphics2D g2, double magnification, Complex p1, Complex p2, Complex p3){
	// 	g2.drawLine((int)(p1.re() * magnification), (int)(p1.im() * magnification),
	// 				(int)(p2.re() * magnification), (int) (p2.im() * magnification));
	// 	g2.drawLine((int)(p2.re() * magnification), (int)(p2.im() * magnification),
	// 				(int)(p3.re() * magnification), (int) (p3.im() * magnification));
	// }

	// public void drawControlPoints(Graphics2D g2, double magnification, int width, int height){
	// 	AffineTransform af = AffineTransform.getTranslateInstance(width/2 , height/2);
	// 	g2.setTransform(af);
	// 	g2.setColor(Color.ORANGE);
	// 	cQ0.drawCenter(g2, magnification);
	// 	cR0.drawCenter(g2, magnification);
	// 	g2.setTransform(new AffineTransform());
	// }

	// public void drawCircles(Graphics2D g2, double magnification, int width, int height){
	// 	g2.setColor(color);
	// 	int n = (int)(width / 2 / (1 * magnification)) + 2; 
	// 	for(int i = -n ; i <= n ; i++){
	// 		AffineTransform af = AffineTransform.getTranslateInstance(width/2 + i * magnification , height/2);
	// 		g2.setTransform(af);
	// 		cP0.draw(g2, magnification);
	// 		cQ0.draw(g2, magnification);
	// 		cR0.draw(g2, magnification);
	// 		g2.setTransform(new AffineTransform());
	// 	}
	// }
	
	// public void drawPath(Graphics2D g2, double magnification, int width, int height){
	// 	g2.setColor(Color.white);

	// 	int n = (int)(width / 2 / (1 * magnification)) + 2; 
	// 	for(int i = -n ; i <= n ; i++){
	// 		AffineTransform af = AffineTransform.getTranslateInstance(width/2 + (i + origin.re()) * magnification , origin.im() * magnification  + height/2);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(a1, g2, magnification);

	// 		af.translate(a1.re() * magnification, a1.im() * magnification);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(a2, g2, magnification);

	// 		af.translate(a2.re() * magnification, a2.im() * magnification);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(a0, g2, magnification);

	// 		g2.setTransform(new AffineTransform());
	// 	}
	// }
	
	// public void drawVectors(Graphics2D g2, double magnification, int width, int height){
	// 	g2.setColor(Color.white);

	// 	int n = (int)(width / 2 / (1 * magnification)) + 2; 
	// 	for(int i = -n ; i <= n ; i++){
	// 		AffineTransform af = AffineTransform.getTranslateInstance(width/2 + (i + origin.re()) * magnification , origin.im() * magnification  + height/2);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(mirrorVecX, g2, magnification);
	// 		drawVectorFromOrigin(mirrorVecX.mult(-1), g2, magnification);

	// 		af.translate(a1.re() * magnification, a1.im() * magnification);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(mirrorVecY, g2, magnification);
	// 		drawVectorFromOrigin(mirrorVecY.mult(-1), g2, magnification);

	// 		af.translate(a2.re() * magnification, a2.im() * magnification);
	// 		g2.setTransform(af);

	// 		drawVectorFromOrigin(mirrorVecZ, g2, magnification);
	// 		drawVectorFromOrigin(mirrorVecZ.mult(-1), g2, magnification);

	// 		g2.setTransform(new AffineTransform());
	// 	}
	// }

	// public void drawVectorFromOrigin(Complex to, Graphics2D g2, double magnification){
	// 	g2.drawLine(0, 0, (int) (to.re() * magnification), (int) (to.im() * magnification));
	// }

    /**
     *
     * @param {Number} index
     */
	replace(index){
		if(index == 1){
			return new ComplexProbability(this.a1.add(this.a2),
                                          this.a2.mult(this.a0).div(this.a1.add(this.a2)),
                                          this.p0);
		}else if(index == 2){
			return new ComplexProbability(this.a2.add(this.a0),
                                          this.a0.mult(this.a1).div(this.a2.add(this.a0)),
                                          this.q0);
		}else{// 0
			return new ComplexProbability(this.a0.add(this.a1),
                                          this.a1.mult(this.a2).div(this.a0.add(this.a1)),
                                          this.r0);
		}
	}

	// public void setColor(Color color){
	// 	this.color = color;
	// }

	// public boolean isClickedQ(double mouseX, double mouseY, double magnification){
	// 	if(q0.mult(magnification).dist(new Complex(mouseX, mouseY)) < Circle.CENTER_POINT_R){
	// 		return true;
	// 	}
	// 	return false;
	// }

	// public boolean isClickedR(double mouseX, double mouseY, double magnification){
	// 	if(r0.mult(magnification).dist(new Complex(mouseX, mouseY)) < Circle.CENTER_POINT_R){
	// 		return true;
	// 	}
	// 	return false;
	// }

    /**
     *
     * @param {Complex} leftIntersect
     * @param {Complex} m
     * @param {Complex} rightIntersect
     */
	isIntersectAboveTriangle(leftIntersect, m, rightIntersect){
		return leftIntersect.sub(m).div(rightIntersect.sub(m)).im < 0;
	}

    /**
     *
     * @param {Complex} leftIntersect
     * @param {Complex} m
     * @param {Complex} rightIntersect
     */
	isIntersectBottomTriangle(leftIntersect, m, rightIntersect){
		return leftIntersect.sub(m).div(rightIntersect.sub(m)).im > 0;
	}
}
