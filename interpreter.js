document.addEventListener("DOMContentLoaded", function() {
	// Add special character button functionality
	document.getElementById("special-chars").childNodes.forEach(e => {
		e.addEventListener("click", function(){
			var c = document.getElementById("code");
			c.value = c.value+e.textContent;
		});
	});
	// Add run button functionality
	document.getElementById("run").addEventListener("click", function() {
		// Get input
		var input = [];
		input.push(document.getElementById("input").value);
		// Get code
		var code = document.getElementById("code").value;
		// Turn raw text into an array-based data structure
		var tree = parseCode(code, input);
		// Parse data structure
		var out = parseTree(tree);
		// Should normally just be one Decimal object, but run simplifyTree just in case.
		document.getElementById("output").value = simplifyTree(out);
	});
});

function parseCode(code, input) {
	var tree = [];
	// Interate over each character in code
	for (var charPos = 0, c=''; c = code.charAt(charPos); charPos++) { // Numeric Literals
		if(c == "(") {
			// Parse over code until we find the close for this paren
			var depth = 1;
			for(var cp2 = charPos+1, c2 = ''; c2=code.charAt(cp2); cp2++) {
				if(c2 == "(") {
					++depth;
				} else if(c2 == ")") {
					--depth;
					if(depth == 0) {
						// Once we've found the matching close paren, parse the inner region and push it
						tree.push(parseCode(code.substring(charPos+1, cp2)));
						// Skip to end of block
						charPos = cp2;
						// Mark our depth as -1 to make sure we can see if we got here later
						--depth;
						break;
					}
				}
			}
			if(depth > -1) {
				// If we didn't find a close paren, close at the end anyways
				tree.push(parseCode(code.substring(charPos+1)));
				charPos = code.length;
			}
		} else if(c.charCodeAt(0)>=65 && c.charCodeAt(0)<=90) { // Input
			tree.push(new Decimal(input[c.charCodeAt(0)-65]));
		} else if(c=='þ') {tree.push(Decimal.acos(-1)) //pi
		} else if(c=='e') {tree.push(Decimal.exp(1)) //e
		} else if(c=='Þ') {tree.push(Decimal.acos(-1).times(2)) //tau
		} else if(['1','2','3','4','5','6','7','8','9','0','.'].includes(c)) {
			// Note we can only encounter one decimal point
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
			// c ends up holding our whole number
			tree.push(new Decimal(c));
		// Only push recognized functions
		} else if(['q'].includes(c)) {
			tree.push(c);
		} else if([')'].includes(c)) { // Explicit function closing
			for(var i = tree.length-2; i >=0; --i) {
				if(!(['+','-','*','/','^'].includes(tree[i]) || tree[i] instanceof Decimal)) { // Filter out function characters
					console.log(tree);
					console.log(tree[i]);
					tree.push(tree.splice(i+1, tree.length-i+1));
					break;
				}
			}
		} else if(['+','-','*','/',"^"].includes(c)) { // Basic Operations, variables
			tree.push(c);
		}
	}
	return tree;
}

function parseTree(tree) {
	// Order of operations: parenthesis and function arguments (sub-arrays) are evaluated first
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(op instanceof Array) {
			tree[i] = parseTree(op)[0];
		}
	}
	// Functions will be checked here
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(typeof(op) == "string" && op == "q") {
			if(i+1<tree.length && tree[i+1] instanceof Decimal) {
				tree.splice(i, 2, tree[i+1].sqrt());
			}
		}
	}
	// Exponent checker
	for(var i = 0; i < tree.length; ++i) {
		var op = tree[i];
		if(typeof(op) == "string" && op == "^") {
			if(i>0 && i+1<tree.length && tree[i-1] instanceof Decimal && tree[i+1] instanceof Decimal) {
				tree.splice(i-1, 3, tree[i-1].pow(tree[i+1]));
				--i;
			}
		}
	}
	// Preform multiplication/division
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
	// Finally, addition/subtraction
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

// Ctrl+Enter runs code, like TIO
document.onkeydown = function(e) {
	if(e.key == "Enter" && e.ctrlKey) {
		document.getElementById("run").click();
	}
}

function simplifyTree(tree) {
	var treen = tree.slice();
	for(var i = 0; i < treen.length; i++) {
		if(treen[i] instanceof Array) {
			// Recursively simplify sub-arrays
			treen[i] = simplifyTree(treen[i]);
		} else if(treen[i] instanceof Decimal) {
			// Convert decimals to strings
			treen[i] = treen[i].toFixed();
		}
	}
	return treen;
}