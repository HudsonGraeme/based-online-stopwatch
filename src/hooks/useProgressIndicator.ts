import { useState, useEffect, useMemo } from "react";
import { getProgressIndicatorSetting } from "../components/SettingsModal";

type ProgressIndicatorType =
  | "circular"
  | "glowing"
  | "linear"
  | "pulsing"
  | "segmented"
  | "styled";

// Global event emitter for progress indicator changes
const progressIndicatorEventTarget = new EventTarget();

export function triggerProgressIndicatorRefresh() {
  progressIndicatorEventTarget.dispatchEvent(
    new CustomEvent("progressIndicatorChanged")
  );
}

export function useProgressIndicator() {
  const [progressIndicatorType, setProgressIndicatorType] =
    useState<ProgressIndicatorType>("circular");
  const [isLoaded, setIsLoaded] = useState(false);

  const loadProgressIndicator = async () => {
    const type = await getProgressIndicatorSetting();
    setProgressIndicatorType(type);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadProgressIndicator();

    // Listen for progress indicator changes
    const handleProgressIndicatorChange = () => {
      loadProgressIndicator();
    };

    progressIndicatorEventTarget.addEventListener(
      "progressIndicatorChanged",
      handleProgressIndicatorChange
    );

    return () => {
      progressIndicatorEventTarget.removeEventListener(
        "progressIndicatorChanged",
        handleProgressIndicatorChange
      );
    };
  }, []);

  return useMemo(
    () => ({ progressIndicatorType, isLoaded }),
    [progressIndicatorType, isLoaded]
  );
}
