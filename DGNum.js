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