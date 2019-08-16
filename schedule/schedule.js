var shortDays = ["mo", "tu", "we", "th", "fr"];
var longDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

class ScheduleCanvas {
	constructor(canvasID,
		{startHour=8, endHour=18,
		blockWidth=100, blockHeight=60,
		marginX=50, marginY=50,
		background='#fff', foreground='#000',
		guideOpacity=0.2, lineHeight=14, textPadding=5, font='12px Arial'}={}) {
		this.startHour = startHour; this.endHour = endHour; this.blockWidth = blockWidth; this.blockHeight = blockHeight; this.marginX = marginX; this.marginY = marginY; this.background = background; this.foreground = foreground; this.guideOpacity = guideOpacity; this.lineHeight = lineHeight; this.textPadding = textPadding; this.font = font;
		this.canvas = document.getElementById(canvasID);
		this.canvas.width = marginX + longDays.length*blockWidth;
		this.canvas.height = marginY + (endHour - startHour + 1) * blockHeight;
		
		this.c = this.canvas.getContext("2d");
		this.c.globalAlpha = 1;
		this.c.font = font;
		this.c.strokeStyle = foreground;
		this.c.textAlign = "center";
		this.c.textBaseline = "middle";
		
		this.clear();
	}
	clear(){
		/*this.c.fillStyle = this.background;
		this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.c.fillStyle = this.foreground;*/
		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	drawSchedule(text){
		window.requestAnimationFrame(() => this.drawScheduleCallback(text));
	}
	drawScheduleCallback(text) { //text
		this.clear();
		this.drawTimes();
		this.drawDOWLabels();
		for (let chunk of text.split('\n\n')) {
			let lines = chunk.split("\n");
			for (let dow of lines[0].toLowerCase().split(/(?=(?:..)*$)/)) // splits mowefrtu into mo, we, fr, tu
				for (let block of lines.slice(1, lines.length).map(parseBlock)) // takes remaining lines and parses them into blocks
					if (shortDays.indexOf(dow) != -1)
						this.drawTextRect(block[0],
							this.marginX + shortDays.indexOf(dow)*this.blockWidth,
							this.marginY + (block[1] - this.startHour)*this.blockHeight,
							this.blockWidth,
							(block[2] - block[1])*this.blockHeight);
		}
	}
	drawTextRect(text, x, y, width, height) {
		this.c.fillStyle = this.background;
		this.c.fillRect(x, y, width, height);
		this.c.fillStyle = this.foreground;
		
		this.c.strokeRect(x, y, width, height);
		
		var burrito;
		let lines = "";
		while ((burrito = this.getWrap(text, width)).tail.length != 0) {
			lines += burrito.head + "\n";
			text = burrito.tail;
		}
		lines += burrito.head;
		this.drawText(lines, x + width/2, y + height/2);
	}
	drawText(text, centerX, centerY) {
		let lines = text.split("\n");
		centerY -= Math.floor(lines.length/2) * this.lineHeight - (1 - lines.length%2) * this.lineHeight/2;
		centerY -= this.lineHeight;
		for (let line of lines)
			this.c.fillText(line, centerX, centerY += this.lineHeight);
	}
	getWrap(text, width) {
		let words = text.split(" ");
		for (let i=words.length; i>0; i--) {
			let head = words.slice(0, i).join(" ");
			let tail = words.slice(i, words.length).join(" ");
			if (this.c.measureText(head).width + this.textPadding*2 < width)
				return {
					head: head,
					tail: tail
				}
		}
		return {
			head: ".",
			tail: ""
		}
	}
	drawTimes() { // (num, num, num, num, num)
		for (let hour=this.startHour; hour<=this.endHour; hour++)
			this.drawTextRect(hour + "", 0, this.marginY + (hour - this.startHour)*this.blockHeight, this.marginX, this.blockHeight);
	}
	drawDOWLabels() {
		for (let day=0; day<longDays.length; day++) this.drawTextRect(longDays[day], this.marginX + day*this.blockWidth, 0, this.blockWidth, this.marginY );
	}
}

/* parsing */

function parseBlock(string) { // "HH:MM-HH:MM Label"
	return [string.substr(12), parseHours(string, 0, 5), parseHours(string, 6, 5)];
}

function parseHours(string, start, end) {
	parts = string.substr(start, end).split(":");
	return parseInt(parts[0]) + parseInt(parts[1])/60;
}

/* UI graphics */

function drawDOWLabels() { // note: idk how var, let, noname works
	for (day=0; day<longDays.length; day++) drawTextRect(longDays[day], marginX + day*blockWidth, 0, blockWidth, marginY );
}


