import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { usePersisted } from "./hooks/usePersisted";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";

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

  const formatTime = (time: number) => {
    return format(new Date(time), "mm:ss.SS");
  };

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
        <Flex justifyContent="center" gap={{ base: 3, md: 4 }} flexWrap="wrap">
          <Button
            onClick={handleReset}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            disabled={time === 0 && !isRunning}
          >
            {t("Reset")}
          </Button>
          <Button
            onClick={handleStartStop}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            colorScheme={isRunning ? "red" : "green"}
          >
            {isRunning ? t("Stop") : t("Start")}
          </Button>
          <Button
            onClick={handleLap}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            disabled={!isRunning}
          >
            {t("Lap")}
          </Button>
        </Flex>
        <Box
          mt={{ base: 6, md: 8 }}
          maxHeight="200px"
          overflowY="auto"
          px={{ base: 2, md: 0 }}
        >
          {laps.map((lap, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              p={{ base: 3, md: 2 }}
              borderBottom="1px solid #4a5568"
            >
              <Text fontSize={{ base: "sm", md: "md" }}>
                {t("Lap")} {index + 1}
              </Text>
              <Text fontFamily="monospace" fontSize={{ base: "sm", md: "md" }}>
                {formatTime(lap)}
              </Text>
            </Flex>
          ))}
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
