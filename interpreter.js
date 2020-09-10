document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("special-chars").childNodes.forEach(e => {
		e.addEventListener("click", function(){
			var c = document.getElementById("code");
			c.value = c.value+e.textContent;
		});
	});
});