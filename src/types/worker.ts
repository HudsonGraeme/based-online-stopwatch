export type TimerType = "stopwatch" | "countdown" | "pomodoro";
export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export interface TimerConfig {
  initialValue?: number;
  phase?: PomodoroPhase;
  cycleCount?: number;
}

export interface TimerUpdate {
  currentValue?: number;
  config?: Partial<TimerConfig>;
}

export type WorkerMessageType =
  | "START_TIMER"
  | "STOP_TIMER"
  | "UPDATE_TIMER"
  | "RESET_TIMER"
  | "PING";

export type WorkerResponseType =
  | "TIMER_TICK"
  | "TIMER_COMPLETE"
  | "TIMER_STARTED"
  | "TIMER_STOPPED"
  | "TIMER_RESET"
  | "TIMER_UPDATED"
  | "PONG";

export interface BaseWorkerMessage {
  type: WorkerMessageType;
  id: string;
}

export interface StartTimerMessage extends BaseWorkerMessage {
  type: "START_TIMER";
  timerType: TimerType;
  config?: TimerConfig;
}

export interface StopTimerMessage extends BaseWorkerMessage {
  type: "STOP_TIMER";
}

export interface UpdateTimerMessage extends BaseWorkerMessage {
  type: "UPDATE_TIMER";
  updates: TimerUpdate;
}

export interface ResetTimerMessage extends BaseWorkerMessage {
  type: "RESET_TIMER";
}

export interface PingMessage {
  type: "PING";
}

export type WorkerMessage =
  | StartTimerMessage
  | StopTimerMessage
  | UpdateTimerMessage
  | ResetTimerMessage
  | PingMessage;

export interface BaseWorkerResponse {
  type: WorkerResponseType;
  id: string;
}

export interface TimerTickResponse extends BaseWorkerResponse {
  type: "TIMER_TICK";
  value: number;
  timerType: TimerType;
  phase?: PomodoroPhase;
  cycleCount?: number;
}

export interface TimerCompleteResponse extends BaseWorkerResponse {
  type: "TIMER_COMPLETE";
  timerType: TimerType;
  phase?: PomodoroPhase;
  cycleCount?: number;
}

export interface TimerStartedResponse extends BaseWorkerResponse {
  type: "TIMER_STARTED";
  timerType: TimerType;
}

export interface TimerStoppedResponse extends BaseWorkerResponse {
  type: "TIMER_STOPPED";
}

export interface TimerResetResponse extends BaseWorkerResponse {
  type: "TIMER_RESET";
  value: number;
}

export interface TimerUpdatedResponse extends BaseWorkerResponse {
  type: "TIMER_UPDATED";
  value: number;
  config: TimerConfig;
}

export interface PongResponse {
  type: "PONG";
}

export type WorkerResponse =
  | TimerTickResponse
  | TimerCompleteResponse
  | TimerStartedResponse
  | TimerStoppedResponse
  | TimerResetResponse
  | TimerUpdatedResponse
  | PongResponse;

export interface TimerState {
  id: string;
  type: TimerType;
  config: TimerConfig;
  startTime: number;
  lastTick: number;
  intervalId: number | null;
  currentValue: number;
  isRunning: boolean;
}
