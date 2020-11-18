import SL2C from './sl2c.js';
import Complex from './complex.js';
import { Hsv2rgb } from '../util.js';

export default class OPTDFSOperator {
	constructor (gens){
		this.gens = new Array(gens.length);
		this.fixPoints = new Array(gens.length);
		for(let i = 0; i < gens.length; i++){
			this.gens[i] = gens[i];
			this.fixPoints[i] = gens[i].apply(Complex.INFINITY);
		}
	}

	initialize(maxLevel, threshold){
        this.maxLevel = maxLevel;
        this.threshold = threshold;
		this.tags = new Array(maxLevel + 1);
		this.words = new Array(maxLevel + 1);
		this.words[0] = SL2C.UNIT;
		this.tags[0] = -1;
		this.level = 0;
        this.pointList = [];
        this.colorList = [];
        this.firstTags = [];

		this.words[1] = this.gens[1];
		this.tags[1] = 1;
		this.level++;
	}
	
	search(maxLevel, threshold){
		this.initialize(maxLevel, threshold);
        this.pointList.push(0, 0, 0);
        let rgb = Hsv2rgb(0, 1.0, 1.0);
        this.colorList.push(rgb.x, rgb.y, rgb.z);
        this.firstTags.push(this.tags[1]);

		do{
			while(this.branchTermination(maxLevel, threshold) == false){
				this.goForward();
			}
			do{
				this.goBackward();
			}while(this.level != 0 && this.isAvailableTurn() == false);
			this.turnAndGoForward();
		}while(this.level != 1 || this.tags[1] != 0);

        this.pointList.push(1, 0, 0);
        rgb = Hsv2rgb(this.pointList.length * 0.00001 , 1.0, 1.0);
        this.colorList.push(rgb.x, rgb.y, rgb.z);
        this.firstTags.push(this.tags[1]);
		return this.pointList;
	}
	
	goForward(){
		this.level++;
		this.tags[this.level] = (this.tags[this.level-1] + 1) % 3; 

		this.words[this.level] = this.words[this.level -1].mult(this.gens[this.tags[this.level]]);
	}

	isAvailableTurn(){
		if((this.tags[this.level] + 2) % 3 != (this.tags[this.level + 1] + 1) % 3 ||
           (this.level == 2 && this.tags[1] == 2 &&
            this.tags[2] == 1 && this.tags[3] == 2)){
			return false;
		}
		return true;
	}
	
	goBackward(){
		this.level--;
	}
	
	turnAndGoForward(){
		this.tags[this.level + 1] = (this.tags[this.level + 1] + 1)%3;

		this.words[this.level + 1] = this.words[this.level].mult(
            this.gens[this.tags[this.level + 1]]);
		this.level++;
	}

	branchTermination(maxLevel, threshold){
		const z = [this.words[this.level].apply(this.fixPoints[(this.tags[this.level] + 1) % 3]),
                   this.words[this.level].apply(this.fixPoints[(this.tags[this.level] + 2) % 3])];
		
		if(Complex.distance(z[0], z[1]) < threshold || this.level == this.maxLevel){
			this.pointList.push(z[0].re, 0, z[0].im,
                                z[1].re, 0, z[1].im);

            const rgb = Hsv2rgb(this.pointList.length * 0.00001,1.0, 1.0);
            this.colorList.push(rgb.x, rgb.y, rgb.z);
            this.colorList.push(rgb.x, rgb.y, rgb.z);

            this.firstTags.push(this.tags[1], this.tags[1]);
			return true;
		}
		
		return false;
	}
}
