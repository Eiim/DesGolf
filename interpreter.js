document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("special-chars").childNodes.forEach(e => {
		e.addEventListener("click", function(){
			var c = document.getElementById("code");
			c.value = c.value+e.textContent;
		});
	});
	document.getElementById("run").addEventListener("click", function() {
		var code = document.getElementById("code").value;
		var tree = parseCode(code);
		console.log(tree);
		var out = parseTree(tree);
		if(out[0] instanceof Decimal) {
			out[0] = out[0].toFixed();
		}
		document.getElementById("output").value = out[0];
	});
});

function parseCode(code) {
	var tree = [];
	for (var charPos = 0, c=''; c = code.charAt(charPos); charPos++) { 
		if(c == "(") {
			var depth = 1;
			for(var cp2 = charPos+1, c2 = ''; c2=code.charAt(cp2); cp2++) {
				if(c2 == "(") {
					++depth;
				} else if(c2 == ")") {
					--depth;
					if(depth == 0) {
						console.log(tree);
						tree.push(parseCode(code.substring(charPos+1, cp2)));
						console.log(parseCode(code.substring(charPos+1, cp2)));
						console.log(tree);
						charPos = cp2;
						--depth;
						break;
					}
				}
			}
			if(depth > -1) {
				tree.push(parseCode(code.substring(charPos+1)));
				charPos = tree.length;
			}
			console.log(charPos);
		} else if(['1','2','3','4','5','6','7','8','9','0','.'].includes(c)) {
			var decimalEncountered = c=='.';
			for(var i = charPos+1, cnew = ''; cnew = code.charAt(i); i++) {
				if(['1','2','3','4','5','6','7','8','9','0'].includes(cnew)) {
					c += cnew;
					++charPos;
				} else if(cnew == '.' && !decimalEncountered) {
					c += cnew;
					++charPos;
					decimalEncountered = true;
				} else {
					break;
				}
			}
			tree.push(new Decimal(c));
		} else if(['+','-','*','/',"^"].includes(c)) {
			tree.push(c);
		}
	}
	return tree;
}

function parseTree(tree) {
	//console.log(simplifyTree(tree));
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(op instanceof Array) {
			tree[i] = parseTree(op);
		}
	}
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(typeof(op) == "string" && op == "^") {
			if(i>0 && i+1<tree.length && tree[i-1] instanceof Decimal && tree[i+1] instanceof Decimal) {
				tree.splice(i-1, 3, tree[i-1].pow(tree[i+1]));
				--i;
			}
		}
	}
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(typeof(op) == "string" && ['*','/'].includes(op)) {
			if(i>0 && i+1<tree.length && tree[i-1] instanceof Decimal && tree[i+1] instanceof Decimal) {
				switch(op) {
					case '*':
						tree.splice(i-1, 3, tree[i-1].times(tree[i+1]));break;
					case '/':
						tree.splice(i-1, 3, tree[i-1].div(tree[i+1]));break;
				}
				--i;
			}
		}
	}
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(typeof(op) == "string" && ['+','-'].includes(op)) {
			if(i>0 && i+1<tree.length && tree[i-1] instanceof Decimal && tree[i+1] instanceof Decimal) {
				switch(op) {
					case '+':
						tree.splice(i-1, 3, tree[i-1].add(tree[i+1]));break;
					case '-':
						tree.splice(i-1, 3, tree[i-1].minus(tree[i+1]));break;
				}
				--i;
			}
		}
	}
	return tree;
}

document.onkeydown = function(e) {
	if(e.key == "Enter" && e.ctrlKey) {
		document.getElementById("run").click();
	}
}

function simplifyTree(tree) {
	treen = tree.slice();
	for(var i = 0; i < treen.length; i++) {
		console.log(i+": "+treen[i]+" / "+treen);
		if(treen[i] instanceof Array) {
			console.log("Recursing");
			//treen[i] = simplifyTree(treen[i]);
			console.log(simplifyTree(treen[i]));
			treen[i] = [1,2];
			console.log(treen[i]+"<-"+treen)
		} else if(treen[i] instanceof Decimal) {
			console.log("Decing");
			treen[i] = treen[i].toFixed();
		} else {
			console.log("Doing nothing");
			treen[i] = treen[i];
		}
	}
	return treen;
}