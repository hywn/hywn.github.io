export function scurl(url, cfunc) {
	return $.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', response => cfunc(response.contents));
}

export function Parser(text){
	this.text = text;
	this.bindex = 0;
	this.bsize = 0;
	this.getBuffer = function() {
		return text.substring(this.bindex, this.bindex + this.bsize);
	}
	this.getBufferRemoveString = function(string) {
		return text.substring(this.bindex, this.bindex + this.bsize - string.length);
	}
	this.clear = function(string) {
		let buffer = string? this.getBufferRemoveString(string) : this.getBuffer();
		this.bindex += this.bsize;
		this.bsize = 0;
		return buffer;
	}
	this.continueUntil = function(string, includeString=false) {
		while(!this.getBuffer().endsWith(string)){
			this.bsize++;
		}
		if (includeString) return this.getBuffer();
		return this.getBufferRemoveString(string);
	}
	this.deleteUntil = function(string) {
		this.continueUntil(string);
		return this.clear(string);
	}
}