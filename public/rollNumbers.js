// Utility functions returning promises
let deathcount = 0;
let deathcountgame = 0;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

const animate = (elem, prop, value, duration) => {
	return nextFrame().then(() => new Promise(resolve => {
		elem.style.transition = `${prop} ${duration}ms`;
		elem.style[prop] = `${value}px`;
		const done = () => {
			elem.removeEventListener("transitionend", done);
			elem.style.transition = `${prop} 0ms`;
			resolve();
		};
		elem.addEventListener("transitionend", done);
	})).then(nextFrame);
};

/*
async function sleep(s) {
	for (let i=1;i<s;i++) {
			if (deathcount !== count) {
				deathcount = count;
				await timecounter.restart();
				//timecounter.value = 0;
				await new Promise(resolve => setTimeout(resolve, s * 1000));
				break;
			};
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}
*/

/*
function update_count() {
  $.get(window.location.href + "current", function(data) {
    // If the current step is changed, update list.
    if (data !== deathcount) {
		let direction = data > deathcount ? 1 : 0;
		gamecounter.roll(1,500);
		deathcount = data;
	}
  });
}
*/

// DOM element wrapper for the counter functionality
class Counter {
	constructor(element, length = 4, upwards = true) {
		this.element = element;
		this._value = 0;
		this.upwards = !!upwards;
		this.digits = Array.from({ length }, () => element.appendChild(document.createElement("li")));	
	}
	get value() {
		return this._value;
	}
	set value(value) {
		this._value = value;
		const numStr = value.toString().padStart(5, "0").slice(-this.digits.length);
		// Display the current number in the counter element (no animation)
		this.digits.forEach((digit, i) => {
			// Put three lines, each having a digit, where the middle one is the current one:
			digit.innerHTML = `${(+numStr[i] + (this.upwards ? 9 : 1)) % 10}<br>${numStr[i]}<br>${(+numStr[i] + (this.upwards ? 1 : 9)) % 10}`;
			digit.style.top = `${-this.element.clientHeight}px`; // scroll the middle digit into view
			digit.style.marginTop = `0px`;
		});
	}
	
	async sleep(s) {
		for (let i=1;i<s;i++) {
				if (deathcount !== count) {
					if (deathcount !== 0) await this.resetcount(this.value,0,1,1000);
					deathcount = count;
					//timecounter.value = 0;
					await new Promise(resolve => setTimeout(resolve, s * 1000));
					break;
				};
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}

	async csleep(s) {
		for (let i=1;i<s;i++) {
				if (deathcount !== count) {
					if (deathcount !== 0) await this.resetcount(this.value,0,1,1000);
					deathcount = count;
					//timecounter.value = 0;
					await new Promise(resolve => setTimeout(resolve, s * 1000));
					break;
				};
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	}
	
	async setcount(before, after, direction = 1, duration = 3000) {
		if (Math.abs(before - after) === 1) {
		before = parseInt(before);
		after = parseInt(after);
			//console.log(`before: ${before}`);
			//console.log(`after: ${after}`);
			//console.log(`before < after: ${before < after}`);
			await this.croll(before < after ? 1 : 0,duration);
		} else {
		await nextFrame();
		//const rx = new RegExp(before, 'i');
		//console.log(rx);
		const numChangingDigits = Math.abs(before - after) === 1 ? 1 : Math.max(before.toString().length, after.toString().length);
		console.log(numChangingDigits);
		
		const numStr = this.value.toString().padStart(5, "0").slice(-numChangingDigits);
		console.log(numStr);
		
		const numStrBefore = before.toString().padStart(5, "0").slice(-this.digits.length);
		console.log(numStrBefore);
		
		const numStrAfter = after.toString().padStart(5, "0").slice(-this.digits.length);
		console.log(numStrAfter);
		
		this.digits.forEach((digit, i) => {
			// Put three lines, each having a digit, where the middle one is the current one:
			digit.innerHTML = `0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0`;
			//`${numStrAfter[i]}<br>${numStrBefore[i]}<br>${numStrAfter[i]}`;
			digit.style.top = `${(-this.element.clientHeight + 7)* numStrBefore[i]}px`; // scroll the middle digit into view
			digit.style.marginTop = `-4px`;
		});
		
		if (before.length !== after.length ) {
			if (before.length < after.length) {
				before = before.toString().padStart(after.length, "0");
			} else {
				after = after.toString().padStart(before.length, "0");
			}
		}			
		const promises = this.digits.slice(-numChangingDigits).map
		(
			(digit, i) =>
			animate
			(
				digit,
				"top",
				before[i] <= after[i] ? (-this.element.clientHeight + 5) * after[i] - 1: (-this.element.clientHeight + 5) * (10 - after[i] === 0 ? 10 : after[i]) - 1,
				duration*5
			)
		);
		//animate(digit, "top", before - after < 0 ? -this.element.clientHeight * 2 + 7 : 0, duration));
		await Promise.all(promises);
		await nextFrame();
		}		
		this.value = after;
	}

	async croll(direction = 1, duration = 500) {
		await nextFrame();
		//await this.sleep(3);
		const numChangingDigits = Math.min(this.digits.length,
		this.value.toString().length - this.value.toString().search(direction > 0 ? /9*$/ : /0*$/) + 1);
		console.log(`Changing Digits: ${numChangingDigits}`);
		const numStr = this.value.toString().padStart(5, "0").slice(-numChangingDigits);
		console.log(`numStr: ${numStr}`);
		console.log(`slice: ${this.digits.slice(-numChangingDigits)}`);
		const promises = this.digits.slice(-numChangingDigits).map((digit, i) =>
		animate(digit, "top", direction > 0 === this.upwards ? -this.element.clientHeight * 2 + 7 : -7, duration));
		
		await Promise.all(promises);
		this.value = this.value + direction;
		await nextFrame();
	}

	async countcheck() {
		while (true) {
			//console.log(`count: ${count}`);
			await new Promise(resolve => setTimeout(resolve, 1000));
			if (deathcountgame !== count) {
				await this.setcount(this.value,count,1,1000);
				deathcountgame = count;
				//this.value = deathcountgame;
			}
		}
	}

	
	async roll(direction = 1, duration = 500) {
		await nextFrame();
		await this.sleep(60);
		const numChangingDigits = Math.min(this.digits.length,
		this.value.toString().length - this.value.toString().search(direction > 0 ? /9*$/ : /0*$/) + 1);
		const numStr = this.value.toString().padStart(5, "0").slice(-numChangingDigits);
		const promises = this.digits.slice(-numChangingDigits).map((digit, i) =>
		animate(digit, "top", direction > 0 === this.upwards ? -this.element.clientHeight * 2 + 7 : 0, duration));
		
		await Promise.all(promises);
		this.value = this.value + direction;
		//console.log(`current time value: ${this.value}`);
		await nextFrame();
	}
	
	async rollTo(target, duration = 1000, pause = 1000) {
		const direction = Math.sign(target - this.value);
		while (this.value !== target) {
			await this.roll(direction, duration);
		}
	}

	async resetcount(before, after, direction = 1, duration = 3000) {
		await nextFrame();
		const rx = new RegExp(before, 'i');
		console.log(rx);
		const numChangingDigits = Math.abs(before - after) === 1 ? 1 : Math.max(before.toString().length, after.toString().length);
		console.log(numChangingDigits);
		
		const numStr = this.value.toString().padStart(5, "0").slice(-numChangingDigits);
		console.log(numStr);
		
		const numStrBefore = before.toString().padStart(5, "0").slice(-this.digits.length);
		console.log(numStrBefore);
		
		const numStrAfter = after.toString().padStart(5, "0").slice(-this.digits.length);
		console.log(numStrAfter);
		
		this.digits.forEach((digit, i) => {
			// Put three lines, each having a digit, where the middle one is the current one:
			digit.innerHTML = `${numStrAfter[i]}<br>${numStrBefore[i]}<br>${numStrAfter[i]}`;
			digit.style.top = `${(-this.element.clientHeight)}px`; // scroll the middle digit into view
			//digit.style.marginTop = `-5px`;
		});
		
		const promises = this.digits.slice(-numChangingDigits).map((digit, i) =>
		animate(digit, "top", before - after < 0 ? -this.element.clientHeight * 2 + 7 : 0, duration));
		await Promise.all(promises);
		this.value = after;
		await nextFrame();
		
	}
	
}

// Demo:

const gamecounter = new Counter(document.getElementById("gamecount"), 3, true);
//gamecounter.value = deathcount;
gamecounter.value = 0;
gamecounter.countcheck();
const timecounter = new Counter(document.getElementById("order-list"), 3, true);
timecounter.value = 0;
timecounter.rollTo(999);

//counter.roll(1,0);
//counter.button.onclick = function() {counter.roll(1,1000)};
//document.body.appendChild(counter.button);