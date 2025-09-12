import { useEffect, useRef, useState, useCallback } from "react";

interface TimerConfig {
  initialValue?: number;
  phase?: string;
  cycleCount?: number;
}

interface UseWebWorkerTimerProps {
  type: "stopwatch" | "countdown" | "pomodoro";
  timerId: string;
  onTick?: (value: number) => void;
  onComplete?: () => void;
  config?: TimerConfig;
}

export const useWebWorkerTimer = ({
  type,
  timerId,
  onTick,
  onComplete,
  config = {},
}: UseWebWorkerTimerProps) => {
  const workerRef = useRef<Worker | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [value, setValue] = useState(config.initialValue || 0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!workerRef.current && !isInitialized.current) {
      isInitialized.current = true;
      workerRef.current = new Worker("/timer-worker.js");

      workerRef.current.addEventListener("message", (event) => {
        const { type: messageType, id, value: messageValue } = event.data;

        if (id !== timerId) return;

        switch (messageType) {
          case "TIMER_TICK":
            setValue(messageValue);
            onTick?.(messageValue);
            break;
          case "TIMER_COMPLETE":
            setIsRunning(false);
            onComplete?.();
            break;
          case "TIMER_STARTED":
            setIsRunning(true);
            break;
          case "TIMER_STOPPED":
            setIsRunning(false);
            break;
          case "TIMER_RESET":
            setValue(messageValue);
            break;
        }
      });

      workerRef.current.postMessage({ type: "PING" });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: "STOP_TIMER",
          id: timerId,
        });
        workerRef.current.terminate();
        workerRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  const start = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "START_TIMER",
        id: timerId,
        timerType: type,
        config: { ...config, initialValue: value },
      });
    }
  }, [timerId, type, config, value]);

  const stop = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "STOP_TIMER",
        id: timerId,
      });
    }
  }, [timerId]);

  const reset = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "RESET_TIMER",
        id: timerId,
      });
    }
  }, [timerId]);

  const updateValue = useCallback(
    (newValue: number) => {
      setValue(newValue);
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: "UPDATE_TIMER",
          id: timerId,
          updates: { currentValue: newValue },
        });
      }
    },
    [timerId]
  );

  const updateConfig = useCallback(
    (newConfig: TimerConfig) => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          type: "UPDATE_TIMER",
          id: timerId,
          updates: { config: newConfig },
        });
      }
    },
    [timerId]
  );

  return {
    isRunning,
    value,
    start,
    stop,
    reset,
    updateValue,
    updateConfig,
  };
};
