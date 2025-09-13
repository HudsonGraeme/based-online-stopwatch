class TimerWorkerManager {
  private static instance: TimerWorkerManager;
  private worker: Worker | null = null;
  private listeners = new Map<string, (event: MessageEvent) => void>();

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
    this.worker.addEventListener("message", (event) => {
      const { id } = event.data;
      if (id && this.listeners.has(id)) {
        this.listeners.get(id)!(event);
      } else {
      }
    });

    this.worker.addEventListener("error", (error) => {
      console.error("TimerWorkerManager - Worker error:", error);
    });
  }

  addTimer(timerId: string, listener: (event: MessageEvent) => void) {
    this.listeners.set(timerId, listener);
  }

  removeTimer(timerId: string) {
    this.listeners.delete(timerId);
    this.postMessage({ type: "STOP_TIMER", id: timerId });
  }

  postMessage(message: Record<string, unknown>) {
    if (this.worker) {
      this.worker.postMessage(message);
    } else {
      console.error("TimerWorkerManager - No worker available to send message");
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.listeners.clear();
  }
}

export const timerWorkerManager = TimerWorkerManager.getInstance();
