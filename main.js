document.addEventListener("DOMContentLoaded", function() {
	// Add special character button functionality
	document.getElementById("special-chars").childNodes.forEach(e => {
		e.addEventListener("click", function(){
			var c = document.getElementById("code");
			insert(c, e.textContent);
		});
	});
	// Add run button functionality
	document.getElementById("run").addEventListener("click", function() {
		// Get input
		var input = [];
		for(inp of document.getElementsByClassName("inputTD")) {
			input.push(inp.children[0].value);
		}
		// Get code
		var code = document.getElementById("code").value;
		// Turn raw text into an array-based data structure
		var tree = parseCode(code, input);
		// Parse data structure
		var out = parseTree(tree);
		// Should normally just be one DGNum object, but run simplifyTree just in case.
		document.getElementById("output").value = simplifyTree(out);
	});
	// More inputs functionality
	document.getElementById("inPlus").addEventListener("click", function() {
		var t = document.getElementById("inputTab").children[0];
		if(t.childElementCount < 26) {
			var n = t.childElementCount+1;
			var r = t.insertRow(-1);
			
			ld = r.insertCell(0);
			l = document.createElement("label");
			l.setAttribute("for","input"+n);
			l.textContent = n;
			ld.appendChild(l);
			
			id = r.insertCell(1);
			id.setAttribute("class","inputTD");
			i = document.createElement("input");
			i.setAttribute("type","text");
			i.setAttribute("id","input"+n);
			id.appendChild(i);
		}
	});
	// Less inputs functionality
	document.getElementById("inMinus").addEventListener("click", function() {
		var t = document.getElementById("inputTab").children[0];
		if(t.childElementCount > 1) {
			t.deleteRow(-1);
		}
	});
});

// Below functions adapted from https://github.com/fregante/text-field-edit/blob/master/index.ts, also under MIT license
// Inserts `text` at the cursor’s position, replacing any selection, with **undo** support and by firing the `input` event.
function insert(field, text) {
	const document = field.ownerDocument;
	const initialFocus = document.activeElement;
	if (initialFocus !== field) {
		field.focus();
	}

	if (!document.execCommand('insertText', false, text)) {
		insertTextFirefox(field, text);
	}

	if (initialFocus === document.body) {
		field.blur();
	} else if (initialFocus instanceof HTMLElement && initialFocus !== field) {
		initialFocus.focus();
	}
}
// Fix for Firefox issue
function insertTextFirefox(field, text) {
	field.setRangeText(
		text,
		field.selectionStart || 0,
		field.selectionEnd || 0,
		'end' // Without this, the cursor is either at the beginning or `text` remains selected
	);

	field.dispatchEvent(new InputEvent('input', {
		data: text,
		inputType: 'insertText',
		isComposing: false
	}));
}


