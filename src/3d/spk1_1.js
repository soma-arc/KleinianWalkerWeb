import Quaternion from './quaternion.js';

export default class SPK1_1 {
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    mult(q){
		return new SPK1_1(this.a.mult(q.a).add(this.b.mult(q.c)),
                          this.a.mult(q.b).add(this.b.mult(q.d)),
                          this.c.mult(q.a).add(this.d.mult(q.c)),
                          this.c.mult(q.b).add(this.d.mult(q.d)));
	}
    
    inverse() {
        return new SPK1_1(this.d.cliffordTransposition(),
                          this.b.cliffordTransposition().scale(-1),
                          this.c.cliffordTransposition().scale(-1),
                          this.a.cliffordTransposition());
    }

    trace() {
        return this.a.add(this.d);
    }

    static get UNIT () {
        return new SPK1_1(Quaternion.ONE, Quaternion.ZERO,
                          Quaternion.ZERO, Quaternion.ONE);
    }

    toString(){
		return '{'+ this.a.toString() +','+ this.b.toString() +'\n'+ this.c.toString() +','+ this.d.toString() +'}';
	}
}
