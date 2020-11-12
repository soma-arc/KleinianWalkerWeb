import SPK1_1 from './spk1_1.js';
import { ComputeMatrix, ComputeFixedPoint,
         MobiusOnPoint, DistQuaternion3D } from './util.js';
import { Hsv2rgb } from '../util.js';

export default class DFSOperator {
    constructor(a, b, maxLevel, epsilon) {
        this.a = a;
        this.b = b;
        this.maxLevel = maxLevel;

        this.tags = new Array(1000);
        this.word = new Array(1000);
        
        this.gens = new Array(4 + 1);
        this.level = 1;
        this.fixedPoint = [new Array(5), new Array(5),
                           new Array(5), new Array(5),
                           new Array(5)];

        this.epsilon = Math.abs(epsilon);

        this.setGens(this.a, this.b);
		this.setFixedPoints();
        this.init();

        this.points = [];
        this.colorList = [];
        this.firstTags = [];
    }

    init(){
        this.word[0] = SPK1_1.UNIT;
        this.level = 1;
        this.tags[1] = 1;
        this.word[1] = this.gens[1];
    }

     /**
     *
     * @param {SPK1_1} a
     * @param {SPK1_1} b
     */
    setGens(a, b) {
        this.gens[1] = a;
		this.gens[2] = b;
		this.gens[3] = a.inverse();
		this.gens[4] = b.inverse();
    }

    setFixedPoints() {
        const repet = [new Array(5), new Array(5),
                       new Array(5), new Array(5),
                       new Array(5)];
        repet[1][1] = ComputeMatrix(this.gens[2], this.gens[3], this.gens[4], this.gens[1]);
        repet[1][2] = this.gens[1];
        repet[1][3] = this.gens[2].mult(this.gens[1]);
        repet[1][4] = ComputeMatrix(this.gens[4], this.gens[3], this.gens[2], this.gens[1]);

        repet[2][1] = ComputeMatrix(this.gens[3], this.gens[4], this.gens[1], this.gens[2]);
        repet[2][2] = this.gens[2];
        repet[2][3] = this.gens[1].mult(this.gens[2]);
        repet[2][4] = ComputeMatrix(this.gens[1], this.gens[4], this.gens[3], this.gens[2]);

        repet[3][1] = ComputeMatrix(this.gens[4], this.gens[1], this.gens[2], this.gens[3]);
        repet[3][2] = this.gens[3];
        repet[3][3] = this.gens[4].mult(this.gens[3]);
        repet[3][4] = ComputeMatrix(this.gens[2], this.gens[1], this.gens[4], this.gens[3]);

        repet[4][1] = ComputeMatrix(this.gens[1], this.gens[2], this.gens[3], this.gens[4]);
        repet[4][2] = this.gens[4];
        repet[4][3] = this.gens[3].mult(this.gens[4]);
        repet[4][4] = ComputeMatrix(this.gens[3], this.gens[2], this.gens[1], this.gens[4]);

        console.log('---Compute Fixed Points---');
        for(let i = 1; i <= 4; i ++){
			for(let j = 1; j <= 4; j++){
                console.log(`(${i}, ${j})`);
				this.fixedPoint[i][j] = ComputeFixedPoint(repet[i][j]);
	            console.log(this.fixedPoint[i][j].toString());
			}
		}
        console.log('---done---');
    }

    search() {
        do {
            while (this.branchTermination() === false) {
                this.goForward();
            }

            do {
                this.goBackward();
            } while ((this.level !== 0) && !this.isAvailableTurn());

            this.turnAndGoForward();
        } while (this.level !== 1 || this.tags[1] !== 1);
    }

    goForward(){
		this.level++;
		this.tags[this.level] = Math.abs((this.tags[this.level - 1] + 1)%4);
		if(this.tags[this.level] === 0)
			this.tags[this.level] = 4;
		//dumpWord();
		//console.log("go forward current level "+ this.level +" tag["+ this.level +"]"+ this.tags[this.level]);
		this.word[this.level] = this.word[this.level -1].mult(this.gens[this.tags[this.level]]);
	}

	goBackward(){
		this.level--;
		//console.log("go backward current level"+ this.level);
	}

	isAvailableTurn(){
        //console.log('isAvailableTurn');
		let t = Math.abs((this.tags[this.level] + 2)%4);
		if(t === 0)
			t = 4;
		let t2 = this.tags[this.level + 1] -1;
		if(t2 === 0)
			t2 = 4;
		if(t2 === t)
			return false;
		else
			return true;
	}

	turnAndGoForward(){
        //console.log('turnAndGoForward');
		this.tags[this.level + 1] = Math.abs((this.tags[this.level + 1]) - 1 % 4);
		if(this.tags[this.level +1] === 0)
			this.tags[this.level + 1] = 4;
		//dumpWord();
		if(this.level === 0)
			this.word[1] = this.gens[this.tags[1]];
		else
			this.word[this.level + 1] = this.word[this.level].mult(this.gens[this.tags[this.level + 1]]);
		this.level++;
		//console.log("turn and go forward current level"+ this.level);
	}
	
	//Indra's pearls p207 “ÁŽêŒêƒAƒ‹ƒSƒŠƒYƒ€
	branchTermination(){
        //console.log('branchTermination');
		const z = new Array(4 + 1);
		for(let j = 1; j <= 4; j++){
			z[j] = MobiusOnPoint(this.word[this.level], this.fixedPoint[this.tags[this.level]][j]);
		}
		
		
		if(this.level === this.maxLevel ||
           (DistQuaternion3D(z[1], z[2]) <= this.epsilon &&
            DistQuaternion3D(z[2], z[3]) <= this.epsilon &&
            DistQuaternion3D(z[3], z[4]) <= this.epsilon)){
			//if(level == maxLevel) System.out.println("max level!");
			// double delta = Util.calcDelta(word[level]);
			// //System.out.println("delta "+ delta);
			// //System.out.println("trace "+ Math.abs(word[level].trace().re()));
			// if(GLInterface.ellipticCheck.isSelected()){
			// 	if(delta < -0.0000001 || 
			// 			(Math.abs(delta) < 0.00001 && 
			// 					Math.abs(word[level].b.k()) < 0.00001 && 
			// 					Math.abs(word[level].c.k()) < 0.00001 && 
			// 					Math.abs(word[level].trace().re()) < 2.0 - 0.000001 )){
			// 		System.out.println("elliptic");
			// 		System.out.println("delta "+ delta);
			// 		System.out.println("trace "+ Math.abs(word[level].trace().re()));
			// 	}
			// }
			const t = new Array(this.maxLevel + 1);
			for(let i = 1; i <= this.level; i++){
				//System.out.print(tags[i]);
				t[i] = this.tags[i];
			}
			//console.log('push');
            //this.points.push(z[1], z[2], z[3], z[4]);
            this.points.push(z[1].re, z[1].i, z[1].j,
                             z[2].re, z[2].i, z[2].j,
                             z[3].re, z[3].i, z[3].j,
                             z[4].re, z[4].i, z[4].j);
            const rgb = Hsv2rgb(this.points.length * 0.00001,1.0, 1.0);
            this.colorList.push(rgb.x, rgb.y, rgb.z);
            this.colorList.push(rgb.x, rgb.y, rgb.z);
            this.colorList.push(rgb.x, rgb.y, rgb.z);
            this.colorList.push(rgb.x, rgb.y, rgb.z);
            this.firstTags.push(this.tags[1]-1, this.tags[1]-1,
                                this.tags[1]-1, this.tags[1]-1);
			return true;
		}else{
			return false;
		}
	}
}
