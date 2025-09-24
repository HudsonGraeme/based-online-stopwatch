class TimerWorker {
  constructor() {
    this.timers = new Map();
    this.nextId = 1;

    this.messageHandlers = {
      START_TIMER: this.startTimer.bind(this),
      STOP_TIMER: this.stopTimer.bind(this),
      UPDATE_TIMER: this.updateTimer.bind(this),
      RESET_TIMER: this.resetTimer.bind(this),
      PING: this.ping.bind(this),
    };

    self.addEventListener("message", this.handleMessage.bind(this));
  }

  handleMessage(event) {
    const { type, ...data } = event.data;
    const handler = this.messageHandlers[type];

    if (handler) {
      handler(data);
    } else {
      console.warn(`Unknown message type: ${type}`);
    }
  }

  startTimer({ id, timerType, config = {} }) {
    if (this.timers.has(id)) {
      this.stopTimer({ id });
    }

    const timer = {
      id,
      type: timerType,
      config,
      startTime: Date.now(),
      lastTick: Date.now(),
      intervalId: null,
      currentValue: config.initialValue || 0,
      isRunning: true,
    };

    switch (timerType) {
      case "stopwatch":
        timer.intervalId = setInterval(() => this.tickStopwatch(id), 10);
        break;
      case "countdown":
        timer.intervalId = setInterval(() => this.tickCountdown(id), 1000);
        break;
      case "pomodoro":
        timer.intervalId = setInterval(() => this.tickPomodoro(id), 1000);
        break;
      default:
        console.warn(`Unknown timer type: ${timerType}`);
        return;
    }

    this.timers.set(id, timer);
    this.postMessage({ type: "TIMER_STARTED", id, timerType: timerType });
  }

  stopTimer({ id }) {
    const timer = this.timers.get(id);
    if (timer && timer.intervalId) {
      clearInterval(timer.intervalId);
      timer.intervalId = null;
      timer.isRunning = false;
      this.postMessage({ type: "TIMER_STOPPED", id });
    }
  }

  updateTimer({ id, updates }) {
    const timer = this.timers.get(id);
    if (timer) {
      Object.assign(timer, updates);
      if ("currentValue" in updates) {
        this.postMessage({
          type: "TIMER_UPDATED",
          id,
          value: timer.currentValue,
          config: timer.config,
        });
      }
    }
  }

  resetTimer({ id }) {
    const timer = this.timers.get(id);
    if (timer) {
      this.stopTimer({ id });
      timer.currentValue = 0;
      timer.startTime = Date.now();
      timer.lastTick = Date.now();
      this.postMessage({
        type: "TIMER_RESET",
        id,
        value: timer.currentValue,
      });
    }
  }

  tickStopwatch(id) {
    const timer = this.timers.get(id);
    if (!timer || !timer.isRunning) return;

    const now = Date.now();
    timer.currentValue += now - timer.lastTick;
    timer.lastTick = now;

    this.postMessage({
      type: "TIMER_TICK",
      id,
      value: timer.currentValue,
      timerType: "stopwatch",
    });
  }

  tickCountdown(id) {
    const timer = this.timers.get(id);
    if (!timer || !timer.isRunning) return;

    timer.currentValue = Math.max(0, timer.currentValue - 1000);

    this.postMessage({
      type: "TIMER_TICK",
      id,
      value: timer.currentValue,
      timerType: "countdown",
    });

    if (timer.currentValue <= 0) {
      this.postMessage({
        type: "TIMER_COMPLETE",
        id,
        timerType: "countdown",
      });
      this.stopTimer({ id });
    }
  }

  tickPomodoro(id) {
    const timer = this.timers.get(id);
    if (!timer) {
      return;
    }
    if (!timer.isRunning) {
      return;
    }

    timer.currentValue = Math.max(0, timer.currentValue - 1000);

    this.postMessage({
      type: "TIMER_TICK",
      id,
      value: timer.currentValue,
      timerType: "pomodoro",
      phase: timer.config.phase,
      cycleCount: timer.config.cycleCount,
    });

    if (timer.currentValue <= 0) {
      this.postMessage({
        type: "TIMER_COMPLETE",
        id,
        timerType: "pomodoro",
        phase: timer.config.phase,
        cycleCount: timer.config.cycleCount,
      });
      this.stopTimer({ id });
    }
  }

  ping() {
    this.postMessage({ type: "PONG" });
  }

  postMessage(data) {
    self.postMessage(data);
  }
}

const timerWorker = new TimerWorker();
