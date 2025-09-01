import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "./hooks/useNotifications";
import { useTimerEffects } from "./hooks/useTimerEffects";

const Countdown = () => {
  const { t } = useTranslation();
  const [initialTime, setInitialTime] = useState(300000); // 5 minutes
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const timerRef = useRef<number | null>(null);
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [hasTriggeredAlarm, setHasTriggeredAlarm] = useState(false);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1000);
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      if (time <= 0 && !hasTriggeredAlarm) {
        setIsRunning(false);
        setHasTriggeredAlarm(true);
        console.log('Timer completed - triggering alarm');
        startAlarm();
        showNotification('Timer Complete!', {
          body: 'Your countdown timer has finished.',
          tag: 'timer-complete',
        });
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time, startAlarm, showNotification]);

  useEffect(() => {
    if (isRunning) {
      setSelectedPosition(-1);
    }
  }, [isRunning]);

  const handleStartStop = async () => {
    if (!isRunning && time <= 0) {
      return; // Don't start timer if time is 00:00
    }
    
    if (!hasRequestedPermission) {
      await requestPermission();
      setHasRequestedPermission(true);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    console.log('Reset button clicked');
    setIsRunning(false);
    setTime(initialTime);
    setSelectedPosition(-1);
    setHasTriggeredAlarm(false); // Reset alarm trigger flag
    stopAlarm(); // Always stop alarm on reset
    console.log('Reset completed');
  };

  const handleCharacterClick = (position: number) => {
    if (!isRunning && position !== 2) { // Don't allow clicking on colon
      setSelectedPosition(position);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isRunning || selectedPosition === -1) return;
    
    const key = e.key;
    if (key >= '0' && key <= '9') {
      const digit = parseInt(key);
      const timeString = formatTime(time);
      const chars = timeString.split('');
      
      // Validate the digit based on position
      if (selectedPosition === 0 && digit > 5) return; // First minute digit max 5 (59 minutes max)
      if (selectedPosition === 3 && digit > 5) return; // First second digit max 5 (59 seconds max)
      
      chars[selectedPosition] = key;
      const newTimeString = chars.join('');
      
      try {
        const [minutes, seconds] = newTimeString.split(':').map(Number);
        if (minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
          const newTime = (minutes * 60 + seconds) * 1000;
          setInitialTime(newTime);
          setTime(newTime);
          
          // Move to next editable position
          let nextPosition = selectedPosition + 1;
          if (nextPosition === 2) nextPosition = 3; // Skip colon
          if (nextPosition > 4) nextPosition = 0; // Wrap around
          setSelectedPosition(nextPosition);
        }
      } catch (error) {
        // Invalid time, ignore
      }
    }
    
    if (key === 'ArrowLeft') {
      let newPosition = selectedPosition - 1;
      if (newPosition === 2) newPosition = 1; // Skip colon
      if (newPosition < 0) newPosition = 4; // Wrap around
      setSelectedPosition(newPosition);
    }
    
    if (key === 'ArrowRight') {
      let newPosition = selectedPosition + 1;
      if (newPosition === 2) newPosition = 3; // Skip colon
      if (newPosition > 4) newPosition = 0; // Wrap around
      setSelectedPosition(newPosition);
    }
    
    if (key === 'Escape') {
      setSelectedPosition(-1);
    }
    
    if (key === 'Tab') {
      e.preventDefault();
      if (selectedPosition === -1) {
        setSelectedPosition(0); // Select first digit
      } else {
        let nextPosition = selectedPosition + 1;
        if (nextPosition === 2) nextPosition = 3; // Skip colon
        if (nextPosition > 4) nextPosition = 0; // Wrap around
        setSelectedPosition(nextPosition);
      }
    }
  };

  const formatTime = (time: number) => {
    try {
      if (time < 0 || !isFinite(time)) return "00:00";
      return format(new Date(time), "mm:ss");
    } catch (error) {
      return "00:00";
    }
  };

  const renderEditableTime = (timeValue: number) => {
    const timeString = formatTime(timeValue);
    const chars = timeString.split('');
    
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        outline="none"
        _focus={{ boxShadow: 'none' }}
      >
        {chars.map((char, index) => (
          <Text
            key={index}
            fontSize={{ base: "6xl", sm: "8xl", md: "9xl" }}
            fontFamily="monospace"
            fontWeight="bold"
            display="inline-block"
            cursor={isRunning || index === 2 ? 'default' : 'pointer'}
            color={selectedPosition === index ? 'blue.500' : 'inherit'}
            bg={selectedPosition === index ? 'gray.700' : 'transparent'}
            borderRadius={selectedPosition === index ? 'md' : 'none'}
            px={selectedPosition === index ? 2 : 0}
            onClick={() => handleCharacterClick(index)}
            _hover={{
              bg: !isRunning && index !== 2 ? 'gray.600' : 'transparent'
            }}
            transition="all 0.2s"
          >
            {char}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Box 
      textAlign="center" 
      px={{ base: 4, md: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isFlashing ? 'red.500' : 'transparent',
        transition: 'background-color 0.1s',
        zIndex: isFlashing ? 9999 : 'auto',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box mb={{ base: 6, md: 4 }}>
        {renderEditableTime(time)}
        {!isRunning && (
          <Text 
            fontSize={{ base: "sm", md: "md" }}
            color="gray.500"
            mt={2}
          >
            Click digits to edit • Use arrow keys • Press Esc to deselect
          </Text>
        )}
      </Box>
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
