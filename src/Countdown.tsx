import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Countdown = () => {
  const { t } = useTranslation();
  const [initialTime, setInitialTime] = useState(300000); // 5 minutes
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      if (time <= 0) {
        setIsRunning(false);
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [minutes, seconds] = e.target.value.split(":").map(Number);
    const newTime = (minutes * 60 + seconds) * 1000;
    setInitialTime(newTime);
    setTime(newTime);
  };

  const formatTime = (time: number) => {
    return format(new Date(time), "mm:ss");
  };

  return (
    <Box textAlign="center" px={{ base: 4, md: 0 }}>
      <Input
        value={formatTime(initialTime)}
        onChange={handleTimeChange}
        size={{ base: "md", md: "lg" }}
        textAlign="center"
        fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
        fontFamily="monospace"
        fontWeight="bold"
        mb={{ base: 6, md: 4 }}
        isDisabled={isRunning}
      />
      <Text 
        fontSize={{ base: "6xl", sm: "8xl", md: "9xl" }} 
        fontFamily="monospace" 
        fontWeight="bold"
        mb={{ base: 6, md: 4 }}
      >
        {formatTime(time)}
      </Text>
      <Flex 
        justifyContent="center" 
        gap={{ base: 3, md: 4 }}
        flexWrap="wrap"
      >
        <Button 
          onClick={handleReset} 
          size={{ base: "md", md: "lg" }}
          minW={{ base: "80px", md: "auto" }}
          disabled={time === initialTime}
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
      </Flex>
    </Box>
  );
};

export default Countdown;
