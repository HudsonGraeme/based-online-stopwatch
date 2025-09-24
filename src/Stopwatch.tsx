import { Box, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { usePersisted } from "./hooks/usePersisted";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerGestures } from "./hooks/useGestures";
import { TimerControls } from "./components/TimerControls";

const Stopwatch = () => {
  const { t } = useTranslation();
  const [laps, setLaps] = usePersisted<number[]>("stopwatch-laps", []);

  const {
    isRunning,
    value: time,
    start,
    stop,
    reset: resetTimer,
  } = useWebWorkerTimer({
    type: "stopwatch",
    timerId: "main-stopwatch",
    config: { initialValue: 0 },
  });

  const handleStartStop = () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  const handleReset = () => {
    stop();
    resetTimer();
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onStartStop: handleStartStop,
    onReset: handleReset,
    onLap: handleLap,
  });

  // Gesture support
  const gestureHandlers = useTimerGestures({
    onStartStop: handleStartStop,
    onReset: handleReset,
    onSecondaryAction: handleLap,
    disabled: false,
  });

  const formatTime = (time: number) => {
    return format(new Date(time), "mm:ss.SS");
  };

  return (
    <Box
      textAlign="center"
      px={{ base: 4, md: 0 }}
      {...gestureHandlers}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box maxW="600px" w="100%">
        <Text
          fontSize={{ base: "5xl", sm: "7xl", md: "8xl" }}
          fontFamily="monospace"
          fontWeight="bold"
          mb={{ base: 6, md: 4 }}
        >
          {formatTime(time)}
        </Text>
        <TimerControls
          primaryAction={{
            label: isRunning ? t("Stop") : t("Start"),
            onClick: handleStartStop,
            variant: isRunning ? "danger" : "success",
          }}
          secondaryActions={[
            {
              label: t("Reset"),
              onClick: handleReset,
              disabled: time === 0 && !isRunning,
              variant: "secondary",
            },
            {
              label: t("Lap"),
              onClick: handleLap,
              disabled: !isRunning,
              variant: "secondary",
            },
          ]}
          size="lg"
          spacing={4}
        />
        <Box
          mt={{ base: 6, md: 8 }}
          height="200px"
          bg="rgba(255, 255, 255, 0.02)"
          borderRadius="12px"
          border="1px solid rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(20px)"
          overflowY="auto"
          px={{ base: 3, md: 4 }}
          py={3}
        >
          {laps.length === 0 ? (
            <Flex
              height="100%"
              alignItems="center"
              justifyContent="center"
              opacity={0.4}
            >
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.5)">
                {t("Lap times will appear here")}
              </Text>
            </Flex>
          ) : (
            laps.map((lap, index) => (
              <Flex
                key={index}
                justifyContent="space-between"
                alignItems="center"
                py={3}
                px={2}
                borderRadius="8px"
                bg={
                  index % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent"
                }
                _hover={{
                  bg: "rgba(255, 255, 255, 0.05)",
                }}
                transition="background-color 0.2s ease"
              >
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color="rgba(255, 255, 255, 0.8)"
                  fontWeight="500"
                >
                  {t("Lap")} {index + 1}
                </Text>
                <Text
                  fontFamily="monospace"
                  fontSize={{ base: "sm", md: "md" }}
                  color="#ffffff"
                  fontWeight="600"
                >
                  {formatTime(lap)}
                </Text>
              </Flex>
            ))
          )}
        </Box>

        {/* Keyboard shortcuts hint */}
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="gray.500"
          mt={4}
          textAlign="center"
        >
          <kbd>Space</kbd> Start/Stop • <kbd>R</kbd> Reset • <kbd>L</kbd> Lap •{" "}
          <kbd>?</kbd> for help
        </Text>
      </Box>
    </Box>
  );
};

export default Stopwatch;
