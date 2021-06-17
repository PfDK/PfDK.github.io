// parse-ms
// MIT License, copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// Modified by Dobby233Liu in slight cooperation with MIT License
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var convMS = milliseconds => {
	if (typeof milliseconds !== 'number') {
		throw new TypeError('Expected a number');
	}

	const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

	let ret = {
		hours: roundTowardsZero(milliseconds / 3600000),
		minutes: roundTowardsZero(milliseconds / 60000) % 60,
		seconds: roundTowardsZero(milliseconds / 1000) % 60,
		milliseconds: roundTowardsZero(milliseconds) % 1000
	};
	ret = {
		getHours: () => ret.hours,
		getMinutes: () => ret.minutes,
		getSeconds: () => ret.seconds,
		getMilliseconds: () => ret.milliseconds,
		...ret
	};
	
	return ret
};

// youtube timedtext to srt convertor
// Dobby233Liu 2020
// WTFPL
// follows the rules in https://srt-subtitles.com/
var srtTimeFormat = function srtTimeFormat(time = 1000){
	var timestampObject = convMS(time);
	function padLeft(string = "0", lengthRequired = 3, padder = "0"){
		var myString = string;
		while (myString.length < lengthRequired){
			myString = padder + myString;
		}
		return myString;
	}
	hr = timestampObject.getHours();
	hr = padLeft((hr).toString(), 2);
	var mt = timestampObject.getMinutes();
	mt = padLeft((mt).toString(), 2);
	var sc = timestampObject.getSeconds();
	sc = padLeft((sc).toString(), 2);
	var ms = timestampObject.getMilliseconds();
	ms = padLeft((ms).toString());
	return hr + ":" + mt + ":" + sc + "," + ms;
}
var gtimedToSRT = function gtimedToSRT(timedtextObject){
	var finalTxt = "";
	if (timedtextObject.wireMagic != "pb3") console.warn("[gtimedToSRT] this object could be incomp with my function... wireMagic != pb3");
	var anotherI = 0;
	for (i in timedtextObject.events){
		var event_ = timedtextObject.events[i];
		if (event_.segs && event_.segs.length == 1 && ( event_.segs[0].utf8.trim() == "\n" || event_.segs[0].utf8.trim() == "" )) {
			console.warn("[gtimedToSRT] empty segment, skipping");
			continue;
		}
		if (!event_.segs || event_.segs.length < 1) {
			console.warn("[gtimedToSRT] no segments, skipping");
			continue;
		}
		if (isNaN(i)) console.warn("[gtimedToSRT] i is NaN");
		anotherI++;
		var srtPos = anotherI;
		finalTxt += srtPos.toString() + "\n";
		finalTxt += srtTimeFormat(event_.tStartMs) + " --> " + srtTimeFormat(event_.tStartMs + event_.dDurationMs) + "\n";
		for (i2 in event_.segs) {
			finalTxt += event_.segs[i2].utf8; // CHECKLATER: utf8 prop
		}
		finalTxt += "\n\n";
	}
	return finalTxt;
}
try {
	if (module) {
		module.exports = gtimedToSRT;
	}
} catch {}