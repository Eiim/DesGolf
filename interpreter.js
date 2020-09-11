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
		document.getElementById("output").value = out;
	});
});

function parseCode(code) {
	var parseTree = [];
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
			parseTree.push(new Decimal(c));
		}
	}
	return parseTree;
}

function parseTree(tree) {
	var out = "";
	tree.forEach(d => {
		console.log(d.toFixed());
		out += d.toFixed();
	});
	return out;
}