import type { WorkerMessage, WorkerResponse } from "../types/worker";

class TimerWorkerManager {
  private static instance: TimerWorkerManager;
  private worker: Worker | null = null;
  private listeners = new Map<
    string,
    (event: MessageEvent<WorkerResponse>) => void
  >();
  private componentRefs = new Set<string>();

  private constructor() {
    this.initWorker();
  }

  static getInstance(): TimerWorkerManager {
    if (!TimerWorkerManager.instance) {
      TimerWorkerManager.instance = new TimerWorkerManager();
    }
    return TimerWorkerManager.instance;
  }

  private initWorker() {
    if (this.worker) return;

    this.worker = new Worker("/timer-worker.js");
    this.worker.addEventListener(
      "message",
      (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;
        if (
          "id" in response &&
          response.id &&
          this.listeners.has(response.id)
        ) {
          this.listeners.get(response.id)!(event);
        }
      }
    );

    this.worker.addEventListener("error", (error) => {
      console.error("TimerWorkerManager - Worker error:", error);
    });
  }

  registerComponent(componentId: string) {
    this.componentRefs.add(componentId);
  }

  unregisterComponent(componentId: string) {
    this.componentRefs.delete(componentId);
    if (this.componentRefs.size === 0) {
      this.cleanup();
    }
  }

  addTimer(
    timerId: string,
    listener: (event: MessageEvent<WorkerResponse>) => void
  ) {
    this.listeners.set(timerId, listener);
  }

  removeTimer(timerId: string) {
    this.listeners.delete(timerId);
    this.postMessage({ type: "STOP_TIMER" as const, id: timerId });
  }

  postMessage(message: WorkerMessage) {
    if (this.worker) {
      this.worker.postMessage(message);
    } else {
      console.error("TimerWorkerManager - No worker available to send message");
    }
  }

  private cleanup() {
    this.destroy();
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.listeners.clear();
    this.componentRefs.clear();
  }
}

export const timerWorkerManager = TimerWorkerManager.getInstance();
