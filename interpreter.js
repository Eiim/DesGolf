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
		if(['1','2','3','4','5','6','7','8','9','0','.'].includes(c)) {
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
		} else if(['+','-','*','/'].includes(c)) {
			tree.push(c);
		}
	}
	return tree;
}

function parseTree(tree) {
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i]
		if(typeof(op) == "string" && ['+','-','*','/'].includes(op)) {
			if(i>0 && i+1<tree.length && tree[i-1] instanceof Decimal && tree[i+1] instanceof Decimal) {
				switch(op) {
					case '+':
						tree.splice(i-1, 3, tree[i-1].add(tree[i+1]));break;
					case '-':
						tree.splice(i-1, 3, tree[i-1].minus(tree[i+1]));break;
					case '*':
						tree.splice(i-1, 3, tree[i-1].times(tree[i+1]));break;
					case '/':
						tree.splice(i-1, 3, tree[i-1].div(tree[i+1]));break;
				}
				--i;
			}
		} else if(op instanceof Array) {
			parseTree(op);
		}
	}
	return tree;
}

document.onkeydown = function(e) {
	if(e.key == "Enter" && e.ctrlKey) {
		document.getElementById("run").click();
	}
}