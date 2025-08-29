import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Stopwatch = () => {
  const { t } = useTranslation();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (time: number) => {
    return format(new Date(time), "mm:ss.SS");
  };

  return (
    <Box textAlign="center">
      <Text fontSize="9xl" fontFamily="monospace" fontWeight="bold">
        {formatTime(time)}
      </Text>
      <Flex justifyContent="center" gap="4">
        <Button
          onClick={handleReset}
          size="lg"
          disabled={time === 0 && !isRunning}
        >
          {t("Reset")}
        </Button>
        <Button
          onClick={handleStartStop}
          size="lg"
          colorScheme={isRunning ? "red" : "green"}
        >
          {isRunning ? t("Stop") : t("Start")}
        </Button>
        <Button onClick={handleLap} size="lg" disabled={!isRunning}>
          {t("Lap")}
        </Button>
      </Flex>
      <Box mt="8" maxHeight="200px" overflowY="auto">
        {laps.map((lap, index) => (
          <Flex
            key={index}
            justifyContent="space-between"
            p="2"
            borderBottom="1px solid #4a5568"
          >
            <Text>{t("Lap")} {index + 1}</Text>
            <Text fontFamily="monospace">{formatTime(lap)}</Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default Stopwatch;
