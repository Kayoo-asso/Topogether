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
			this.listeners.forEach(x => x(undefined));
		} else {
			const nextTick = PROGRESS_TICK * Math.ceil(count / PROGRESS_TICK);
			if(next >= nextTick) {
				this.listeners.forEach(x => x(nextTick))
			}
			this.count = next;
		}
	}

	tick() {
		return this.count ? PROGRESS_TICK * Math.floor(this.count / PROGRESS_TICK) : undefined;
	}
}

const trackers: Map<string, ProgressTracker> = new Map();

export function getProgressTracker(id: string) {
	let existing = trackers.get(id);
	if(!existing) {
		existing = new ProgressTracker();
		trackers.set(id, existing);
	}
	return existing;
}

export function useProgressBar(
	id: string,
): number | undefined {
	const tracker = getProgressTracker(id);
	const [progress, setProgress] = useState<number | undefined>(tracker.tick());

	useEffect(() => {
		const tracker = getProgressTracker(id);
		tracker.listeners.add(setProgress);
		// In case the ID changes
		setProgress(tracker.tick());
	}, [tracker]);

	return progress;
}
