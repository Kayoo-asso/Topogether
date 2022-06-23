import { useState } from "react";

type ProgressBarOptions = {
  notifyThreshold?: number
}

export class ProgressBar {
  public total: number = 0;
  public step: number;
  private count: number = 0;
  private onNotif: (progress: number) => void;

  constructor(step: number, onNotif: (progress: number) => void) {
    this.step = step;
    this.onNotif = onNotif;
  }

  init(total: number) {
    this.total = total;
    this.count = 0;
  }

  increment() {
    if (this.count >= this.total) {
      throw new Error("Progress bar incremented too many times");
    }

    const prevStep = (this.count / (this.step * this.total)) | 0;
    this.count += 1;
    const newStep = (this.count / (this.step * this.total)) | 0;
    if (newStep > prevStep) {
      this.onNotif(this.count / this.total);
    }
  }

}

export function useProgressBar(options?: ProgressBarOptions): [number, ProgressBar] {
  const [progress, setProgress] = useState(0);
  // Hack taken from React Query, when you need a better useMemo that is only called once
  const [bar] = useState(() => new ProgressBar(
    options?.notifyThreshold || 0.01,
    setProgress
  ));

  return [progress, bar];
}