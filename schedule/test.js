function log(text) {
	
	document.getElementById("console-output").value += text + "\n";
	
}

function printClass(classCode) {
	scurl("https://rabi.phys.virginia.edu/mySIS/CS2/sectiontip.php?ClassNumber=" + classCode, text => {
		console.log(text);
		let p = new Parser(text);

		p.deleteUntil('class="InfoClass">');
		p.deleteUntil('class="InfoClass">');
		let title = p.deleteUntil('<br');

		for (let time of getTimes(p)) {
			timeparts = time.split(' ');
			log(timeparts[0]);
			log(`${convert12hr(timeparts[1])}-${convert12hr(timeparts[3])} ${title}\n`);
		}
	});
}

generateSchedule("15450\n11975\n16647\n18452\n19348\n18453\n19350\n16036\n16142")

function generateSchedule(text) {
	for (let classCode of text.split('\n')) {
		printClass(classCode);
	}
}

function getTimes(p, times=[]) { // returns something like ["MoWeFr 9:00AM - 9:50AM", "Th 8:30AM - 9:20AM"]
	if (times.length == 0) p.deleteUntil('class="InfoMeetings"');
	p.deleteUntil('</td><td>');
	times.push(p.deleteUntil("</td><td>"));
	p.continueUntil("</table>")
	if (p.getBuffer().includes('<strong>')) { p.reset(); return getTimes(p, times); }
	return times;
}

function convert12hr(textTime) { // 10:00PM -> 22:00
	let numbers = textTime.match(/\d{1,}/g).map(num => parseInt(num));
	let ampm = textTime.toLowerCase().match(/am|pm/g)[0] === 'pm' ? 12 : 0;
	return `${(numbers[0] % 12 + ampm).toString().padStart(2, "0")}:${numbers[1].toString().padStart(2, "0")}`;
}

function scurl(url, cfunc) {
	return $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', response => cfunc(response.contents));
}

class Parser{
	constructor(text) {
		this.text = text;
		this.bindex = 0;
		this.bsize = 0;
	}
	getBuffer() {
		return this.text.substring(this.bindex, this.bindex + this.bsize);
	}
	getBufferRemoveString(string) {
		return this.text.substring(this.bindex, this.bindex + this.bsize - string.length);
	}
	reset() {
		this.bsize = 0;
	}
	clear(string) {
		let buffer = string? this.getBufferRemoveString(string) : this.getBuffer();
		this.bindex += this.bsize;
		this.reset();
		return buffer;
	}
	continueUntil(string, includeString=false) {
		while(!this.getBuffer().endsWith(string)){
			this.bsize++;
		}
		if (includeString) return this.getBuffer();
		return this.getBufferRemoveString(string);
	}
	deleteUntil(string) {
		this.continueUntil(string);
		return this.clear(string);
	}
}