function parseFunc(tree, op, i) {
	if(tree[i+1] instanceof DGNum) {
		switch(op) {
			case "q":
				tree.splice(i, 2, tree[i+1].sqrt());
				return tree;
			case "s":
				tree.splice(i, 2, tree[i+1].sin());
				return tree;
			case "c":
				tree.splice(i, 2, tree[i+1].cos());
				return tree;
			case "t":
				tree.splice(i, 2, tree[i+1].tan());
				return tree;
			case "à":
				tree.splice(i, 2, new DGNum(1).div(tree[i+1].sin()));
				return tree;
			case "á":
				tree.splice(i, 2, new DGNum(1).div(tree[i+1].cos()));
				return tree;
			case "â":
				tree.splice(i, 2, new DGNum(1).div(tree[i+1].tan()));
				return tree;
			case "!":
				tree.splice(i, 2, tree[i+1].powGam());
				return tree;
			case "h":
				tree.splice(i, 2, tree[i+1].ln());
				return tree;
			case "m":
				tree.splice(i, 2, tree[i+1].log10());
				return tree;
			case "p":
				tree.splice(i, 2, tree[i+1].isPrime());
				return tree;
			case "?":
				tree.splice(i, 2, tree[i+1].sign());
				return tree;
			case "±":
				tree.splice(i, 2, tree[i+1].toBool());
				return tree;
		}
	}
	return tree;
}