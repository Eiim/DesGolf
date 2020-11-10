class DGNum {
	// Constructor from an an array or single of Decimals or numbers
	constructor(baseNum, direct=false) {
		if(direct) {
			this.value = baseNum;
		}
		if(typeof baseNum == "number" || typeof baseNum == "string") {
			this.value = [new Decimal(baseNum)];
		} else if(baseNum instanceof Array) {
			this.value = [];
			for(var i of baseNum) {
				if(typeof i == "number") {
					this.value.push(new Decimal(i));
				} else if(i instanceof Decimal) {
					this.value.push(i);
				}
			}
		} else if (baseNum instanceof Decimal) {
			this.value = [baseNum];
		} else {
			this.value = [new Decimal(0)];
		}
	}
	
	// Creates human-readable version
	valueOf() {
		if(this.value.length==1 && this.value[0] instanceof Decimal) {
			return this.value[0].valueOf();
		}
		return this.value.map(x => x.valueOf());
	}
	
	// Artithmetic functions
	plus(n) {
		if(n.value.length>this.value.length) {
			return new DGNum(n.value.map((x,i)=>x.plus(i<this.value.length?this.value[i]:0)), true);
		} else {
			return new DGNum(this.value.map((x,i)=>x.plus(i<n.value.length?n.value[i]:0)), true);
		}
	}
	minus(n) {
		if(n.value.length>this.value.length) {
			return new DGNum(n.value.map((x,i)=>x.minus(i<this.value.length?this.value[i]:0)), true);
		} else {
			return new DGNum(this.value.map((x,i)=>x.minus(i<n.value.length?n.value[i]:0)), true);
		}
	}
	times(n) {
		if(n.value.length>this.value.length) {
			return new DGNum(n.value.map((x,i)=>x.times(i<this.value.length?this.value[i]:0)), true);
		} else {
			return new DGNum(this.value.map((x,i)=>x.times(i<n.value.length?n.value[i]:0)), true);
		}
	}
	div(n) {
		if(n.value.length>this.value.length) {
			return new DGNum(n.value.map((x,i)=>x.div(i<this.value.length?this.value[i]:0)), true);
		} else {
			return new DGNum(this.value.map((x,i)=>x.div(i<n.value.length?n.value[i]:0)), true);
		}
	}
	pow(n) {
		if(n.value.length>this.value.length) {
			return new DGNum(n.value.map((x,i)=>x.pow(i<this.value.length?this.value[i]:0)), true);
		} else {
			return new DGNum(this.value.map((x,i)=>x.pow(i<n.value.length?n.value[i]:0)), true);
		}
	}
	sqrt() {
		return new DGNum(this.value.map(x=>x.sqrt()), true);
	}
	log10() {
		return new DGNum(this.value.map(x=>{
			if(x instanceof DGNum) return x.log10();
			else return Decimal.log10(x);
		}), true);
	}
	ln() {
		return new DGNum(this.value.map(x=>x.ln()), true);
	}
	powGam() {
		return new DGNum(this.value.map(x=>{
			if(x instanceof Decimal) {
				if(x.isInt()) {
					var n = 1;
					for(var i = 2; i <= x.toNumber(); ++i) {
						n*=i;
					}
					return n;
				} else {
					return gamDec(x)
				}
			} else if(x instanceof DGNum) {
				return x.powGam();
			}
		}));
	}
	toBool() {
		return new DGNum(this.value.map(x=>{
			if(x instanceof Decimal) {
				return x.gt(0) ? 1 : 0;
			} else if(x instanceof DGNum) {
				return x.toBool();
			}
		}));
	}
	sign() {
		return new DGNum(this.value.map(x=>{
			if(x instanceof Decimal) {
				return Decimal.sign(x);
			} else if(x instanceof DGNum) {
				return x.sign();
			}
		}));
	}
	isPrime() {
		return new DGNum(this.value.map(x=>{
			if(x instanceof Decimal) {
				if(x.isInt()) {
					if(x.lt(2)) return 0;
					if(x.eq(2) || x.eq(3)) return 1;
					if(x.mod(2).eq(0) || x.mod(3).eq(0)) return 0;
					for(var i = 5; x.sqrt().gte(i); i += 6) {
						if(x.mod(i).eq(0) || x.mod(i+2).eq(0)) return 0;
					}
					return 1;
				} else {
					return 0;
				}
			} else if(x instanceof DGNum) {
				return x.isPrime();
			}
		}));
	}
	
	// Trig functions
	sin() {
		return new DGNum(this.value.map(x=>x.sin()), true);
	}
	cos() {
		return new DGNum(this.value.map(x=>x.cos()), true);
	}
	tan() {
		return new DGNum(this.value.map(x=>x.tan()), true);
	}
}

// Helper function for powGam, only valid for d>0
// Adapted from https://github.com/substack/gamma.js, also licensed under the MIT license.
gamDec = function(d){
	var z = d.toNumber()+1;
	var g = 7;
	var p = [
		0.99999999999980993,
		676.5203681218851,
		-1259.1392167224028,
		771.32342877765313,
		-176.61502916214059,
		12.507343278686905,
		-0.13857109526572012,
		9.9843695780195716e-6,
		1.5056327351493116e-7
	];
	var g_ln = 607/128;
	var p_ln = [
		0.99999999999999709182,
		57.156235665862923517,
		-59.597960355475491248,
		14.136097974741747174,
		-0.49191381609762019978,
		0.33994649984811888699e-4,
		0.46523628927048575665e-4,
		-0.98374475304879564677e-4,
		0.15808870322491248884e-3,
		-0.21026444172410488319e-3,
		0.21743961811521264320e-3,
		-0.16431810653676389022e-3,
		0.84418223983852743293e-4,
		-0.26190838401581408670e-4,
		0.36899182659531622704e-5
	];

	if (z < 0.5) {
		return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
	}
	else if(z > 100) {
		// Spouge approximation (suitable for large arguments)
		var x = p_ln[0];
		for(var i = p_ln.length - 1; i > 0; --i) x += p_ln[i] / (z + i);
		var t = z + g_ln + 0.5;
		return Math.exp(.5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)-Math.log(z));
	}
	else {
		// Lanczos approximation
		z -= 1;
		var x = p[0];
		for (var i = 1; i < g + 2; i++) {
			x += p[i] / (z + i);
		}
		var t = z + g + 0.5;
	
		return Math.sqrt(2 * Math.PI)
			* Math.pow(t, z + 0.5)
			* Math.exp(-t)
			* x
		;
	}
}