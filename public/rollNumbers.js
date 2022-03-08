// Utility functions returning promises
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
let deathcount = 0;

// DOM element wrapper for the counter functionality
class Counter {
	constructor(element, length = 4, upwards = true) {
		this.element = element;
		this._value = 0;
		this.upwards = !!upwards;
		this.digits = Array.from({ length }, () => element.appendChild(document.createElement("li")));
		this.button = document.createElement("button");	
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
		});
	}
		async roll(direction = 1, duration = 500) {
			await nextFrame();
			const numChangingDigits = Math.min(this.digits.length,
			this.value.toString().length - this.value.toString().search(direction > 0 ? /9*$/ : /0*$/) + 1);
			const numStr = this.value.toString().padStart(5, "0").slice(-numChangingDigits);
			const promises = this.digits.slice(-numChangingDigits).map((digit, i) =>
			animate(digit, "top", direction > 0 === this.upwards ? -this.element.clientHeight * 2 + 5 : 0, duration));	
			await Promise.all(promises);
			this.value = this.value + direction;
			await nextFrame();
		}
		async rollTo(target, duration = 1000, pause = 1000) {
			const direction = Math.sign(target - this.value);
			while (this.value !== target) {
				for(let i = 1;i<60;i++) {
					await delay(pause);
					if (deathcount !== count) {
						deathcount = count;
						this.value = 999;
						i = 60;
					};
				}
			await this.roll(direction, duration);
		}
	}
}


// Demo:
const counter = new Counter(document.getElementById("order-list"), 3, true);
counter.value = 999;
counter.rollTo(1999);
//counter.roll(1,0);
//counter.button.onclick = function() {counter.roll(1,1000)};
//document.body.appendChild(counter.button);