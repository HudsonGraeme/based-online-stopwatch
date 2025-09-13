import { useEffect, useState, useCallback } from "react";
import { timerWorkerManager } from "../services/TimerWorkerManager";
import type { TimerConfig, TimerType, WorkerResponse } from "../types/worker";

interface UseWebWorkerTimerProps {
  type: TimerType;
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
  const [isRunning, setIsRunning] = useState(false);
  const [value, setValue] = useState(config.initialValue || 0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      const response = event.data;

      switch (response.type) {
        case "TIMER_TICK":
          setValue(response.value);
          onTick?.(response.value);
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
          setValue(response.value);
          break;
        case "TIMER_UPDATED":
          setValue(response.value);
          break;
      }
    };

    timerWorkerManager.addTimer(timerId, handleMessage);

    return () => {
      timerWorkerManager.removeTimer(timerId);
    };
  }, [timerId]); // Removed onTick and onComplete from dependencies

  const start = useCallback(() => {
    const message = {
      type: "START_TIMER" as const,
      id: timerId,
      timerType: type,
      config: { ...config, initialValue: value },
    };
    timerWorkerManager.postMessage(message);
  }, [timerId, type, config, value]);

  const stop = useCallback(() => {
    timerWorkerManager.postMessage({
      type: "STOP_TIMER" as const,
      id: timerId,
    });
  }, [timerId]);

  const reset = useCallback(() => {
    timerWorkerManager.postMessage({
      type: "RESET_TIMER" as const,
      id: timerId,
    });
  }, [timerId]);

  const updateValue = useCallback(
    (newValue: number) => {
      setValue(newValue);
      timerWorkerManager.postMessage({
        type: "UPDATE_TIMER" as const,
        id: timerId,
        updates: { currentValue: newValue },
      });
    },
    [timerId]
  );

  const updateConfig = useCallback(
    (newConfig: TimerConfig) => {
      timerWorkerManager.postMessage({
        type: "UPDATE_TIMER" as const,
        id: timerId,
        updates: { config: newConfig },
      });
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
