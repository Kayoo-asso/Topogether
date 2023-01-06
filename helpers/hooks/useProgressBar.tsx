import { useEffect, useMemo, useRef, useState } from "react";

type SetProgress = (progress: number | undefined) => void;

const PROGRESS_TICK = 0.01;

export class ProgressTracker {
	count: number | undefined;
	total: number = 1;
	listeners: Set<SetProgress> = new Set();

	start(total: number) {
		// TODO: DEBUG, remove later
		if (this.count !== undefined) {
			throw new Error("This should not happen!");
		}
		this.total = total;
		this.count = 0;
	}

	increment(n?: number) {
		n = n ?? 1;
		const count = this.count!;
		if (count + n > this.total) {
			throw new Error(
				`Progress bar count (${count}) higher than ${this.total}`
			);
		}
		let next = count + n;
		if (next === this.total) {
			// Reset count
			this.count = undefined;
			this.listeners.forEach((x) => x(undefined));
		} else {
			const nextTick = this.tick()! + PROGRESS_TICK;
			this.count = next;
			if (next >= nextTick) {
				this.listeners.forEach((x) => x(nextTick));
			}
		}
	}

	tick() {
		if (this.count) {
			const percent = this.count / this.total;
			const nbTicks = Math.floor(percent / PROGRESS_TICK);
			return PROGRESS_TICK * nbTicks;
		} else {
			return undefined;
		}
	}
}

const trackers: Map<string, ProgressTracker> = new Map();

export function getProgressTracker(id: string) {
	let existing = trackers.get(id);
	if (!existing) {
		existing = new ProgressTracker();
		trackers.set(id, existing);
	}
	return existing;
}

export function useProgressBar(id: string): number | undefined {
	const tracker = getProgressTracker(id);
	const [progress, setProgress] = useState<number | undefined>(tracker.tick());

	useEffect(() => {
		const tracker = getProgressTracker(id);
		tracker.listeners.add(setProgress);
		// In case the ID changes
		setProgress(tracker.tick());
		return () => {
			tracker.listeners.delete(setProgress);
		};
	}, [tracker]);

	return progress;
}
