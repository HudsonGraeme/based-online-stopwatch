import {
  Box,
  Button,
  Flex,
  Text,
  Progress,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "./hooks/useNotifications";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

type PomodoroPhase = "work" | "shortBreak" | "longBreak";

interface PomodoroSession {
  phase: PomodoroPhase;
  timeRemaining: number;
  cycleCount: number;
  totalCycles: number;
  isRunning: boolean;
}

const POMODORO_TIMES = {
  work: 25 * 60 * 1000, // 25 minutes
  shortBreak: 5 * 60 * 1000, // 5 minutes
  longBreak: 15 * 60 * 1000, // 15 minutes
};

const PomodoroTimer = () => {
  const { t } = useTranslation();
  const [session, setSession] = useState<PomodoroSession>({
    phase: "work",
    timeRemaining: POMODORO_TIMES.work,
    cycleCount: 0,
    totalCycles: 4, // 4 work sessions before long break
    isRunning: false,
  });

  const timerRef = useRef<number | null>(null);
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  useEffect(() => {
    if (session.isRunning && session.timeRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSession((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1000,
        }));
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);

      if (session.timeRemaining <= 0 && session.isRunning) {
        handlePhaseComplete();
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [session.isRunning, session.timeRemaining]);

  const handlePhaseComplete = () => {
    // Start alarm to signal phase completion (will flash green for break, red for work)
    startAlarm();

    setSession((prev) => {
      let nextPhase: PomodoroPhase;
      let nextCycleCount = prev.cycleCount;

      if (prev.phase === "work") {
        nextCycleCount += 1;
        // After 4 work sessions, take a long break
        nextPhase =
          nextCycleCount % prev.totalCycles === 0 ? "longBreak" : "shortBreak";
      } else {
        // After any break, go back to work
        nextPhase = "work";
      }

      const nextTimeRemaining = POMODORO_TIMES[nextPhase];

      // Show notification
      const phaseMessages = {
        work:
          nextPhase === "longBreak"
            ? t("Great job! Time for a long break!")
            : t("Work session complete! Time for a short break!"),
        shortBreak: t("Break over! Ready for another work session?"),
        longBreak: t("Long break over! Ready to start fresh?"),
      };

      showNotification(t("Pomodoro Phase Complete!"), {
        body: phaseMessages[prev.phase],
        tag: "pomodoro-complete",
      });

      return {
        ...prev,
        phase: nextPhase,
        timeRemaining: nextTimeRemaining,
        cycleCount: nextCycleCount,
        isRunning: false, // Pause between phases
      };
    });
  };

  const handleStartStop = async () => {
    if (!session.isRunning && !hasRequestedPermission) {
      await requestPermission();
      setHasRequestedPermission(true);
    }

    // Stop alarm when starting after a phase complete
    if (!session.isRunning) {
      stopAlarm();

      // Flash red when starting work phase
      if (
        session.phase === "work" &&
        session.timeRemaining === POMODORO_TIMES.work
      ) {
        startAlarm();
        setTimeout(() => stopAlarm(), 500); // Brief flash and beep
      }
    }

    if (session.timeRemaining <= 0) {
      return;
    }

    setSession((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleReset = () => {
    stopAlarm();
    setSession({
      phase: "work",
      timeRemaining: POMODORO_TIMES.work,
      cycleCount: 0,
      totalCycles: 4,
      isRunning: false,
    });
  };

  const handleSkipPhase = () => {
    setSession((prev) => ({ ...prev, timeRemaining: 0 }));
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onStartStop: handleStartStop,
    onReset: handleReset,
    onSkip: handleSkipPhase,
  });

  const formatTime = (time: number) => {
    try {
      if (time < 0 || !isFinite(time)) return "00:00";
      return format(new Date(time), "mm:ss");
    } catch (error) {
      return "00:00";
    }
  };

  const getPhaseColor = (phase: PomodoroPhase) => {
    switch (phase) {
      case "work":
        return "red.500";
      case "shortBreak":
        return "green.500";
      case "longBreak":
        return "blue.500";
    }
  };

  const getPhaseLabel = (phase: PomodoroPhase) => {
    switch (phase) {
      case "work":
        return t("Focus Time");
      case "shortBreak":
        return t("Short Break");
      case "longBreak":
        return t("Long Break");
    }
  };

  const progressPercent =
    ((POMODORO_TIMES[session.phase] - session.timeRemaining) /
      POMODORO_TIMES[session.phase]) *
    100;
  const completedWorkSessions =
    session.phase === "work" ? session.cycleCount : session.cycleCount;

  return (
    <Box
      textAlign="center"
      px={{ base: 4, md: 0 }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isFlashing
          ? getPhaseColor(session.phase)
          : "transparent",
        transition: "background-color 0.1s",
        zIndex: isFlashing ? 9999 : "auto",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <VStack spacing={6} maxW="500px" w="100%">
        {/* Phase Header */}
        <VStack spacing={2}>
          <Text fontSize="2xl" fontWeight="700" color="white">
            {t("Pomodoro Timer")}
          </Text>
          <Badge
            colorScheme={
              session.phase === "work"
                ? "red"
                : session.phase === "shortBreak"
                  ? "green"
                  : "blue"
            }
            fontSize="lg"
            px={4}
            py={1}
            borderRadius="full"
          >
            {getPhaseLabel(session.phase)}
          </Badge>
        </VStack>

        {/* Progress Ring */}
        <Box position="relative" w="250px" h="250px">
          <Progress
            value={progressPercent}
            colorScheme={
              session.phase === "work"
                ? "red"
                : session.phase === "shortBreak"
                  ? "green"
                  : "blue"
            }
            size="lg"
            borderRadius="full"
            w="100%"
            h="100%"
            sx={{
              "& > div": {
                borderRadius: "full",
              },
            }}
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            textAlign="center"
          >
            <Text
              fontSize={{ base: "4xl", md: "5xl" }}
              fontFamily="monospace"
              fontWeight="bold"
              color="white"
            >
              {formatTime(session.timeRemaining)}
            </Text>
          </Box>
        </Box>

        {/* Stats */}
        <VStack spacing={2}>
          <HStack spacing={6}>
            <VStack spacing={1}>
              <Text
                fontSize="2xl"
                fontWeight="700"
                color={getPhaseColor(session.phase)}
              >
                {completedWorkSessions}
              </Text>
              <Text fontSize="sm" color="#9ca3af">
                {t("Completed Sessions")}
              </Text>
            </VStack>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="700" color="white">
                {session.totalCycles -
                  (completedWorkSessions % session.totalCycles)}
              </Text>
              <Text fontSize="sm" color="#9ca3af">
                {t("Until Long Break")}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        {/* Controls */}
        <Flex justifyContent="center" gap={{ base: 3, md: 4 }} flexWrap="wrap">
          <Button
            onClick={handleReset}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            disabled={
              session.timeRemaining === POMODORO_TIMES[session.phase] &&
              !session.isRunning
            }
          >
            {t("Reset")}
          </Button>
          <Button
            onClick={handleStartStop}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "100px", md: "auto" }}
            colorScheme={session.isRunning ? "red" : "green"}
          >
            {session.isRunning
              ? t("Pause")
              : session.timeRemaining <= 0
                ? t("Continue")
                : t("Start")}
          </Button>
          <Button
            onClick={handleSkipPhase}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            variant="outline"
            disabled={
              !session.isRunning &&
              session.timeRemaining === POMODORO_TIMES[session.phase]
            }
          >
            {t("Skip")}
          </Button>
        </Flex>

        {/* Instructions */}
        <VStack spacing={2}>
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.500"
            textAlign="center"
            px={4}
          >
            {t(
              "Work for 25 minutes, then take a 5-minute break. After 4 work sessions, enjoy a 15-minute long break!"
            )}
          </Text>
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            color="gray.500"
            textAlign="center"
          >
            {t("Space: Start/Pause")} • {t("R: Reset")} • {t("S: Skip Phase")}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default PomodoroTimer;
