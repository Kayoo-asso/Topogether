import { useState } from "react";

export interface ProgressTracker {
	start(total: number): void;
	increment(n?: number): void;
}

export function useProgressBar(threshold: number): [number, ProgressTracker] {
	const [progress, setProgress] = useState(0);

	let total = 1;
	let count = 0;

	const start = (tot: number) => {
		total = tot;
		count = 0;
	};

	const increment = (n?: number) => {
		const step = threshold * total;
		n = n ?? 1;
		const next = count + n;

		if (next > total) {
			throw new Error(`Progress bar count (${count}) higher than ${total}`);
		}

		const nextTick = Math.ceil(count / step);
		count += next;
		if (next > nextTick * step) {
			setProgress(nextTick);
		}
	};

	return [progress, { start, increment }];
}
