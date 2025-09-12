import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import localforage from "localforage";
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useNotifications } from "./hooks/useNotifications";
import { useCountdownPersistence } from "./hooks/usePersistence";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useURLSharing } from "./hooks/useURLSharing";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";

const Countdown = () => {
  const { t } = useTranslation();
  const [initialTime, setInitialTime] = useState(300000); // 5 minutes
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tickEachSecond, setTickEachSecond] = useState(false);
  const { loadValue } = useCountdownPersistence(initialTime, 0, false);
  const { config: urlConfig, hasLoadedFromURL } = useURLSharing("countdown");

  const {
    isRunning,
    value: time,
    start,
    stop,
    updateValue,
  } = useWebWorkerTimer({
    type: "countdown",
    timerId: "main-countdown",
    config: { initialValue: initialTime },
    onComplete: () => {
      startAlarm();
      showNotification("Timer Complete!", {
        body: "Your countdown timer has finished.",
        tag: "timer-complete",
      });
    },
    onTick: (value) => {
      if (value > 0 && tickEachSecond) {
        playTickSound();
      }
    },
  });

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      const saved = await loadValue();
      if (saved) {
        setInitialTime(saved.initialTime);
        updateValue(saved.time);
      }
    };
    loadState();
  }, []);

  // Load from URL parameters
  useEffect(() => {
    if (
      hasLoadedFromURL &&
      urlConfig.initialTime &&
      urlConfig.initialTime !== initialTime
    ) {
      setInitialTime(urlConfig.initialTime);
      updateValue(urlConfig.initialTime);
      stopAlarm();
    }
  }, [hasLoadedFromURL, urlConfig.initialTime]);

  useEffect(() => {
    if (isRunning) {
      setSelectedPosition(-1);
    }
  }, [isRunning]);

  // Load settings from localforage
  useEffect(() => {
    const loadSettings = async () => {
      const saved = await localforage.getItem("countdownSettings");
      if (saved && typeof saved === "object" && "tickEachSecond" in saved) {
        setTickEachSecond(
          (saved as { tickEachSecond: boolean }).tickEachSecond
        );
      }
    };
    loadSettings();
  }, []);

  const handleStartStop = async () => {
    if (!isRunning && time <= 0) {
      return; // Don't start timer if time is 00:00
    }

    if (!hasRequestedPermission) {
      await requestPermission();
      setHasRequestedPermission(true);
    }

    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  const handleReset = () => {
    stop();
    updateValue(initialTime);
    setSelectedPosition(-1);
    stopAlarm();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onStartStop: handleStartStop,
    onReset: handleReset,
  });

  const presetTimes = useMemo(
    () => [
      { label: t("countdown.preset.1min"), value: 1 * 60 * 1000 },
      { label: t("countdown.preset.5min"), value: 5 * 60 * 1000 },
      { label: t("countdown.preset.10min"), value: 10 * 60 * 1000 },
      { label: t("countdown.preset.15min"), value: 15 * 60 * 1000 },
      { label: t("countdown.preset.25min"), value: 25 * 60 * 1000 },
      { label: t("countdown.preset.30min"), value: 30 * 60 * 1000 },
    ],
    [t]
  );

  const handlePresetClick = (presetValue: number) => {
    if (!isRunning) {
      setInitialTime(presetValue);
      updateValue(presetValue);
      setSelectedPosition(-1);
      stopAlarm();
    }
  };

  const playTickSound = () => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleCharacterClick = (position: number) => {
    if (!isRunning && position !== 2) {
      // Don't allow clicking on colon
      setSelectedPosition(position);

      // Focus hidden input on mobile to trigger numeric keyboard
      if (
        hiddenInputRef.current &&
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      ) {
        hiddenInputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;

    // Always handle Escape to deselect
    if (key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setSelectedPosition(-1);
      return;
    }

    // Handle Space and R when no digit is selected
    if (selectedPosition === -1) {
      if (key === " ") {
        e.preventDefault();
        e.stopPropagation();
        handleStartStop();
        return;
      }
      if (key.toLowerCase() === "r") {
        e.preventDefault();
        e.stopPropagation();
        handleReset();
        return;
      }
    }

    if (isRunning || selectedPosition === -1) return;

    if (key >= "0" && key <= "9") {
      const digit = parseInt(key);
      const timeString = formatTime(time);
      const chars = timeString.split("");

      // Validate the digit based on position
      if (selectedPosition === 0 && digit > 5) return; // First minute digit max 5 (59 minutes max)
      if (selectedPosition === 3 && digit > 5) return; // First second digit max 5 (59 seconds max)

      chars[selectedPosition] = key;
      const newTimeString = chars.join("");

      try {
        const [minutes, seconds] = newTimeString.split(":").map(Number);
        if (minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59) {
          const newTime = (minutes * 60 + seconds) * 1000;
          setInitialTime(newTime);
          updateValue(newTime);

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

    if (key === "ArrowLeft") {
      let newPosition = selectedPosition - 1;
      if (newPosition === 2) newPosition = 1; // Skip colon
      if (newPosition < 0) newPosition = 4; // Wrap around
      setSelectedPosition(newPosition);
    }

    if (key === "ArrowRight") {
      let newPosition = selectedPosition + 1;
      if (newPosition === 2) newPosition = 3; // Skip colon
      if (newPosition > 4) newPosition = 0; // Wrap around
      setSelectedPosition(newPosition);
    }

    if (key === "Tab") {
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
    const chars = timeString.split("");

    return (
      <Box
        className="time-display"
        display="flex"
        justifyContent="center"
        alignItems="center"
        onKeyDown={handleKeyDown}
        onBlur={() => setSelectedPosition(-1)}
        tabIndex={0}
        outline="none"
        _focus={{ boxShadow: "none" }}
      >
        {chars.map((char, index) => (
          <Text
            key={index}
            fontSize={{ base: "6xl", sm: "8xl", md: "9xl" }}
            fontFamily="monospace"
            fontWeight="bold"
            display="inline-block"
            cursor={isRunning || index === 2 ? "default" : "pointer"}
            color={selectedPosition === index ? "blue.500" : "inherit"}
            bg={selectedPosition === index ? "gray.700" : "transparent"}
            borderRadius={selectedPosition === index ? "md" : "none"}
            px={selectedPosition === index ? 2 : 0}
            onClick={() => handleCharacterClick(index)}
            _hover={{
              bg: !isRunning && index !== 2 ? "gray.600" : "transparent",
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
      onClick={(e) => {
        // Deselect digit if clicking outside the time display
        if ((e.target as HTMLElement).closest(".time-display") === null) {
          setSelectedPosition(-1);
        }
      }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: isFlashing ? "red.500" : "transparent",
        transition: "background-color 0.1s",
        zIndex: isFlashing ? 9999 : "auto",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <VStack spacing={6} maxW="600px" w="100%">
        {/* Quick Presets */}
        {!isRunning && (
          <SimpleGrid columns={{ base: 3, md: 6 }} spacing={2} w="100%">
            {presetTimes.map((preset) => (
              <Button
                key={preset.value}
                h={{ base: "48px", md: "52px" }}
                variant="outline"
                bg="rgba(255, 255, 255, 0.02)"
                borderColor="rgba(255, 255, 255, 0.15)"
                color="white"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                }}
                _active={{
                  bg: "rgba(255, 255, 255, 0.12)",
                  transform: "translateY(0)",
                }}
                onClick={() => handlePresetClick(preset.value)}
                isDisabled={isRunning}
                transition="all 0.2s"
                borderRadius="lg"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
              >
                {preset.label}
              </Button>
            ))}
          </SimpleGrid>
        )}

        <Box mb={{ base: 6, md: 4 }}>
          {/* Hidden input for mobile numeric keyboard */}
          <Input
            ref={hiddenInputRef}
            position="absolute"
            left="-9999px"
            opacity={0}
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={handleKeyDown}
            onBlur={() => setSelectedPosition(-1)}
          />
          {renderEditableTime(time)}
          {!isRunning && (
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.500" mt={2}>
              {t("Click digits to edit")} • <kbd>Space</kbd> Start/Stop •{" "}
              <kbd>R</kbd> Reset • <kbd>Esc</kbd> Deselect • <kbd>?</kbd> for
              help
            </Text>
          )}
        </Box>
        <Flex justifyContent="center" gap={{ base: 3, md: 4 }} flexWrap="wrap">
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

          <Button
            onClick={() => setIsSettingsOpen(true)}
            size={{ base: "md", md: "lg" }}
            minW={{ base: "80px", md: "auto" }}
            variant="ghost"
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
            }}
          >
            {t("Settings")}
          </Button>
        </Flex>

        {/* Settings Modal */}
        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isCentered
          motionPreset="slideInBottom"
          size={{ base: "full", sm: "md" }}
        >
          <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
          <ModalContent
            bg="gray.900"
            color="white"
            mx={{ base: 0, sm: 4 }}
            my={{ base: 0, sm: 4 }}
            maxH={{ base: "100vh", sm: "auto" }}
            borderRadius={{ base: 0, sm: "xl" }}
            borderTop={{ base: "1px solid", sm: "none" }}
            borderColor="whiteAlpha.200"
          >
            <ModalHeader
              fontSize="lg"
              fontWeight="600"
              pb={3}
              borderBottom="1px solid"
              borderColor="whiteAlpha.100"
            >
              {t("Settings")}
            </ModalHeader>
            <ModalCloseButton top={3} right={3} />
            <ModalBody py={5}>
              <VStack align="stretch" spacing={4}>
                <Box
                  p={4}
                  borderRadius="lg"
                  bg="whiteAlpha.50"
                  _hover={{ bg: "whiteAlpha.100" }}
                  transition="background 0.2s"
                  cursor="pointer"
                  onClick={() => {
                    const newValue = !tickEachSecond;
                    setTickEachSecond(newValue);
                    localforage.setItem("countdownSettings", {
                      tickEachSecond: newValue,
                    });
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="md" fontWeight="500" mb={1}>
                        {t("countdown.tickSound")}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {t("countdown.tickSoundDesc")}
                      </Text>
                    </Box>
                    <Checkbox
                      isChecked={tickEachSecond}
                      size="lg"
                      colorScheme="blue"
                      pointerEvents="none"
                    />
                  </Flex>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Countdown;
