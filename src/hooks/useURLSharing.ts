import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

interface TimerConfig {
  initialTime?: number;
  pomodoroPhase?: "work" | "shortBreak" | "longBreak";
  pomodoroCount?: number;
  name?: string;
  message?: string;
}

export const useURLSharing = (_timerType: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [config, setConfig] = useState<TimerConfig>({});
  const [hasLoadedFromURL, setHasLoadedFromURL] = useState(false);

  // Load config from URL on mount
  useEffect(() => {
    const urlConfig: TimerConfig = {};

    if (searchParams.has("time")) {
      const timeParam = searchParams.get("time");
      if (timeParam) {
        // Support formats like: 5m, 300s, 300000ms, or raw milliseconds
        const timeMs = parseTimeString(timeParam);
        if (timeMs > 0) {
          urlConfig.initialTime = timeMs;
        }
      }
    }

    if (searchParams.has("name")) {
      urlConfig.name = searchParams.get("name") || "";
    }

    if (searchParams.has("message")) {
      urlConfig.message = searchParams.get("message") || "";
    }

    if (searchParams.has("phase")) {
      const phase = searchParams.get("phase");
      if (phase === "work" || phase === "shortBreak" || phase === "longBreak") {
        urlConfig.pomodoroPhase = phase;
      }
    }

    if (searchParams.has("count")) {
      const count = parseInt(searchParams.get("count") || "0");
      if (!isNaN(count) && count >= 0) {
        urlConfig.pomodoroCount = count;
      }
    }

    setConfig(urlConfig);
    setHasLoadedFromURL(true);
  }, [searchParams]);

  const shareTimer = (config: TimerConfig) => {
    const params = new URLSearchParams();

    if (config.initialTime) {
      // Share as minutes for readability (e.g., 5m instead of 300000)
      const minutes = config.initialTime / 60000;
      if (minutes === Math.floor(minutes)) {
        params.set("time", `${minutes}m`);
      } else {
        params.set("time", `${config.initialTime / 1000}s`);
      }
    }

    if (config.name) {
      params.set("name", config.name);
    }

    if (config.message) {
      params.set("message", config.message);
    }

    if (config.pomodoroPhase) {
      params.set("phase", config.pomodoroPhase);
    }

    if (config.pomodoroCount !== undefined) {
      params.set("count", config.pomodoroCount.toString());
    }

    // Update URL without triggering navigation
    setSearchParams(params, { replace: true });

    // Generate shareable URL
    const url = new URL(window.location.href);
    url.search = params.toString();

    return url.toString();
  };

  const copyToClipboard = async (config: TimerConfig) => {
    const url = shareTimer(config);

    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch {
        document.body.removeChild(textArea);
        return false;
      }
    }
  };

  const clearURL = () => {
    setSearchParams({}, { replace: true });
  };

  return {
    config,
    hasLoadedFromURL,
    shareTimer,
    copyToClipboard,
    clearURL,
  };
};

// Helper function to parse time strings like "5m", "300s", "300000ms"
const parseTimeString = (timeStr: string): number => {
  const num = parseFloat(timeStr);

  if (timeStr.endsWith("ms")) {
    return num;
  } else if (timeStr.endsWith("s")) {
    return num * 1000;
  } else if (timeStr.endsWith("m")) {
    return num * 60 * 1000;
  } else if (timeStr.endsWith("h")) {
    return num * 60 * 60 * 1000;
  } else {
    // Assume raw milliseconds
    return num;
  }
};
