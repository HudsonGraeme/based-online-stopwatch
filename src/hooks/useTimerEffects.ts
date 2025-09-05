import { useState, useRef } from "react";

export const useTimerEffects = () => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const alarmIntervalRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const flashOnce = () => {
    // Clear any existing flash timeout
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
    }

    setIsFlashing(true);
    flashTimeoutRef.current = window.setTimeout(() => {
      setIsFlashing(false);
      flashTimeoutRef.current = null;
    }, 300);
  };

  const stopFlashing = () => {
    console.log("Stopping flash");
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
      console.log("Flash timeout cleared");
    }
    setIsFlashing(false);
  };

  const playSound = () => {
    try {
      const audio = getAudioContext();
      if (audio.state === "suspended") {
        audio.resume();
      }

      const oscillator = audio.createOscillator();
      const gainNode = audio.createGain();

      // Track active oscillators
      activeOscillatorsRef.current.push(oscillator);

      oscillator.connect(gainNode);
      gainNode.connect(audio.destination);

      // Simple clean beep
      oscillator.frequency.setValueAtTime(880, audio.currentTime); // A5 note
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, audio.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audio.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audio.currentTime + 0.3);

      oscillator.start(audio.currentTime);
      oscillator.stop(audio.currentTime + 0.3);

      // Clean up after sound finishes
      oscillator.onended = () => {
        const index = activeOscillatorsRef.current.indexOf(oscillator);
        if (index > -1) {
          activeOscillatorsRef.current.splice(index, 1);
        }
      };
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const playAlarmCycle = () => {
    // Always play when this function is called (interval controls when to stop)
    playSound();
    flashOnce();
  };

  const startAlarmCycle = () => {
    // Play first cycle immediately
    playAlarmCycle();

    // Set up repeating cycle
    const interval = window.setInterval(() => {
      playAlarmCycle();
    }, 1000);

    alarmIntervalRef.current = interval;
  };

  const stopAlarmCycle = () => {
    console.log("Stopping alarm cycle, interval:", alarmIntervalRef.current);
    if (alarmIntervalRef.current) {
      window.clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
      console.log("Alarm interval cleared");
    }
  };

  const startAlarm = () => {
    console.log("Starting alarm, current alarming state:", isAlarming);

    // Prevent multiple alarms from starting
    if (isAlarming || alarmIntervalRef.current) {
      console.log("Alarm already active, ignoring start request");
      return;
    }

    // Stop any active sounds
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    activeOscillatorsRef.current = [];

    // Clear any flash timeout
    if (flashTimeoutRef.current) {
      window.clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = null;
    }

    setIsAlarming(true);
    setIsFlashing(false);

    // Start immediately
    startAlarmCycle();
  };

  const stopAlarm = () => {
    console.log("Stopping alarm");
    setIsAlarming(false);

    stopAlarmCycle();
    stopFlashing();

    // Stop all currently playing sounds immediately
    activeOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    activeOscillatorsRef.current = [];

    console.log("All sounds stopped");
  };

  return {
    isFlashing,
    isAlarming,
    startAlarm,
    stopAlarm,
  };
};
