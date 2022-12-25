import { useMemo, useRef, useState } from "react";

export interface ProgressTracker {
	start(total: number): void;
	increment(n?: number): void;
}

export function useProgressBar(threshold: number): [number, ProgressTracker] {
	const [progress, setProgress] = useState(0);

	let total = useRef(1);
	let count = useRef(0);

	const tracker = useMemo(
		() => ({
			start(tot: number) {
				total.current = tot;
				count.current = 0;
        setProgress(0);
			},
			increment(n?: number) {
				const step = threshold * total.current;
				n = n ?? 1;
				const next = count.current + n;

				if (next > total.current) {
					throw new Error(
						`Progress bar count (${count}) higher than ${total.current}`
					);
				}

				const nextTick = Math.ceil(count.current / step);
				count.current += next;
				if (next > nextTick * step) {
					setProgress(nextTick);
				}
			},
		}),
		[threshold]
	);

	return [progress, tracker];
}
