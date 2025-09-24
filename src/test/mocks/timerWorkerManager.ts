import { vi } from "vitest";
import type { WorkerMessage, WorkerResponse } from "../../types/worker";

interface TimerState {
  id: string;
  isRunning: boolean;
  value: number;
  type: string;
  callbacks: Array<(event: MessageEvent<WorkerResponse>) => void>;
}

class MockTimerWorkerManager {
  private timers = new Map<string, TimerState>();
  private intervals = new Map<string, NodeJS.Timeout>();

  addTimer(
    id: string,
    callback: (event: MessageEvent<WorkerResponse>) => void
  ) {
    const existingTimer = this.timers.get(id);
    if (existingTimer) {
      existingTimer.callbacks.push(callback);
    } else {
      this.timers.set(id, {
        id,
        isRunning: false,
        value: 0,
        type: "stopwatch",
        callbacks: [callback],
      });
    }
  }

  removeTimer(id: string) {
    const timer = this.timers.get(id);
    if (timer) {
      this.stopTimer(id);
      this.timers.delete(id);
    }
  }

  postMessage(message: WorkerMessage) {
    const timer = this.timers.get(message.id);
    if (!timer) return;

    switch (message.type) {
      case "START_TIMER":
        this.startTimer(message.id, message.timerType);
        break;
      case "STOP_TIMER":
        this.stopTimer(message.id);
        break;
      case "RESET_TIMER":
        this.resetTimer(message.id);
        break;
      case "UPDATE_TIMER":
        if (message.updates?.currentValue !== undefined) {
          timer.value = message.updates.currentValue;
          this.notifyCallbacks(message.id, {
            type: "TIMER_UPDATED",
            value: timer.value,
          });
        }
        break;
    }
  }

  private startTimer(id: string, type: string) {
    const timer = this.timers.get(id);
    if (!timer) return;

    timer.isRunning = true;
    timer.type = type;
    this.notifyCallbacks(id, { type: "TIMER_STARTED" });

    if (type === "stopwatch") {
      const interval = setInterval(() => {
        if (timer.isRunning) {
          timer.value += 10;
          this.notifyCallbacks(id, { type: "TIMER_TICK", value: timer.value });
        }
      }, 10);
      this.intervals.set(id, interval);
    }
  }

  private stopTimer(id: string) {
    const timer = this.timers.get(id);
    if (!timer) return;

    timer.isRunning = false;
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
    }
    this.notifyCallbacks(id, { type: "TIMER_STOPPED" });
  }

  private resetTimer(id: string) {
    const timer = this.timers.get(id);
    if (!timer) return;

    this.stopTimer(id);
    timer.value = 0;
    this.notifyCallbacks(id, { type: "TIMER_RESET", value: 0 });
  }

  private notifyCallbacks(id: string, response: WorkerResponse) {
    const timer = this.timers.get(id);
    if (timer) {
      timer.callbacks.forEach((callback) => {
        callback({ data: response } as MessageEvent<WorkerResponse>);
      });
    }
  }

  getAllTimers() {
    return Array.from(this.timers.values());
  }

  getTimer(id: string) {
    return this.timers.get(id);
  }
}

export const mockTimerWorkerManager = new MockTimerWorkerManager();

vi.mock("../../services/TimerWorkerManager", () => ({
  timerWorkerManager: mockTimerWorkerManager,
}));
