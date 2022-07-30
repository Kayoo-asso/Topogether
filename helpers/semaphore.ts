export class Semaphore {
	private counter: number = 0;
	private max: number;
	private waiting: (() => void)[] = [];
	released: number = 0;

	constructor(max: number) {
		this.max = max;
	}

	async acquire(): Promise<void> {
		if (this.counter < this.max) {
			this.counter += 1;
			return Promise.resolve();
		} else {
			return new Promise<void>((resolve) => {
				this.waiting.push(resolve);
			});
		}
	}

	release() {
		this.counter -= 1;
		this.released += 1;
		const next = this.waiting.shift();
		if (next) next();
	}

	clear() {
		// TODO: trigger errors in waiting promises
		this.released = 0;
	}
}