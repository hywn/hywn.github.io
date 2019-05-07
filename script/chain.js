function getChain(text){
	
	text = text.toLowerCase().replace(/\s+/g, ' ').replace(/([^a-z0-9 ])/g, ''); // removes all nonalphanumeric characters

	let words = new Array(), // makes empty arrays
	    counters = new Array();
	
	let lastIndex = -1; // index of last word that was processed by loop

	text.split(" ").forEach(word => { // loops through words in text

		let currIndex = words.indexOf(word); // gets index of current word

		if (currIndex == -1) { // if word hasn't been registered

			for (i in counters) // expand all existing nodes by 1
				counters[i].push(0);

			currIndex = words.length; // recognize new entry

			words.push(word); // add word to word list
			
			counters.push(new Array(words.length).fill(0)); // add new node to counters

		}

		if (lastIndex != -1) counters[lastIndex][currIndex] = // updates last word's counter
		                     counters[lastIndex][currIndex] + 1;

		lastIndex = currIndex; // curr word will be previous word for next word

	});
	
	console.log(counters);

	let probabilities = new Array(); // time to calculate probabilities instead of counters

	for (let i in counters) {

		let sum = counters[i].reduce((total, x) => total + x); // sum

		if (sum == 0) probabilities[i] = new Array(counters[i].length).fill(0); // if sum is 0, fill row with 0s to prevent division by 0
		
		else { // else fill row with calculated probabilities
			probabilities[i] = new Array();
			for (let j in counters[i]) probabilities[i][j] = counters[i][j]/sum;
		}
		
	}

	return { // return everything
		words: words,
		probabilities: probabilities
	}

}

function generateText(source, length, firstWord) {
	
	let chain = getChain(source);
	
	let words = chain.words;
	let probabilities = chain.probabilities;
	
	console.log(words);
	
	let text = "";
	
	let currIndex = words.indexOf(firstWord);
	
	for (let i=0; i < length; i++) {
		
		text += words[currIndex];
		text += " ";
		
		currIndex = getWeightedIndex(probabilities[currIndex]);
		
		console.log(i);
		
	}
	
	return text;
	
}

function getWeightedIndex (node) {
	
	let rand = Math.random();
	
	let sum = 0;
	
	for (let i in node) {
		
		sum += node[i];
		if (sum >= rand) return i;
		
	}
	
	return 0;
	
}
