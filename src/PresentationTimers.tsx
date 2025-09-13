import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useNotifications } from "./hooks/useNotifications";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { UniversalProgressIndicator } from "./components/UniversalProgressIndicator";

interface SlideTimings {
  id: string;
  title: string;
  duration: number; // in seconds
}

interface PresentationPreset {
  name: string;
  totalTime: number; // in minutes
  slideCount: number;
  timePerSlide: number; // in seconds
  icon: string;
  description: string;
  color: string;
}

const PresentationTimers = () => {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] =
    useState<PresentationPreset | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  const presentationPresets: PresentationPreset[] = [
    {
      name: "Lightning Talk",
      totalTime: 5,
      slideCount: 5,
      timePerSlide: 60,
      icon: "LT",
      description: "Quick 5-minute presentation",
      color: "yellow",
    },
    {
      name: "Short Presentation",
      totalTime: 10,
      slideCount: 10,
      timePerSlide: 60,
      icon: "SP",
      description: "Standard 10-minute talk",
      color: "blue",
    },
    {
      name: "Conference Talk",
      totalTime: 20,
      slideCount: 20,
      timePerSlide: 60,
      icon: "CT",
      description: "Professional conference presentation",
      color: "purple",
    },
    {
      name: "Academic Presentation",
      totalTime: 30,
      slideCount: 25,
      timePerSlide: 72,
      icon: "AP",
      description: "Detailed academic presentation",
      color: "green",
    },
    {
      name: "Pitch Deck",
      totalTime: 15,
      slideCount: 12,
      timePerSlide: 75,
      icon: "PD",
      description: "Business pitch presentation",
      color: "orange",
    },
    {
      name: "Keynote",
      totalTime: 45,
      slideCount: 40,
      timePerSlide: 67.5,
      icon: "KN",
      description: "Major keynote address",
      color: "red",
    },
  ];

  const getCurrentSlideTime = () => {
    return selectedPreset ? selectedPreset.timePerSlide * 1000 : 60000;
  };

  const {
    isRunning,
    value: timeRemaining,
    start,
    stop,
    updateValue,
  } = useWebWorkerTimer({
    type: "countdown",
    timerId: "presentation-timer",
    config: { initialValue: getCurrentSlideTime() },
    onComplete: () => {
      if (selectedPreset) {
        startAlarm();
        showNotification(`Slide ${currentSlide} Time Up!`, {
          body: `Move to slide ${currentSlide + 1}`,
          tag: "slide-complete",
        });
      }
    },
  });

  useEffect(() => {
    if (selectedPreset && !isRunning) {
      updateValue(getCurrentSlideTime());
    }
  }, [currentSlide, selectedPreset, updateValue, isRunning]);

  const handlePresetSelect = (preset: PresentationPreset) => {
    if (!isRunning) {
      setSelectedPreset(preset);
      setCurrentSlide(1);
      stopAlarm();
    }
  };

  const handleStartStop = async () => {
    if (!selectedPreset) return;

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
    setCurrentSlide(1);
    updateValue(getCurrentSlideTime());
    stopAlarm();
  };

  const handleNextSlide = () => {
    if (!selectedPreset) return;

    if (currentSlide < selectedPreset.slideCount) {
      setCurrentSlide(currentSlide + 1);
    } else {
      stop();
      startAlarm();
      showNotification("Presentation Complete!", {
        body: "Great job! Time to wrap up.",
        tag: "presentation-complete",
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onStartStop: handleStartStop,
    onReset: handleReset,
  });

  const formatTime = (time: number) => {
    try {
      if (time < 0 || !isFinite(time)) return "00:00";
      return format(new Date(time), "mm:ss");
    } catch (error) {
      return "00:00";
    }
  };

  const getProgressPercent = () => {
    const slideTime = getCurrentSlideTime();
    return ((slideTime - timeRemaining) / slideTime) * 100;
  };

  const getTotalProgress = () => {
    if (!selectedPreset) return 0;
    return ((currentSlide - 1) / selectedPreset.slideCount) * 100;
  };

  const getTimeColor = () => {
    const percent = getProgressPercent();
    if (percent < 60) return "green";
    if (percent < 85) return "yellow";
    return "red";
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
        backgroundColor: isFlashing ? `${getTimeColor()}.500` : "transparent",
        transition: "background-color 0.1s",
        zIndex: isFlashing ? 9999 : "auto",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pt: "80px",
        pb: "120px",
      }}
    >
      <VStack spacing={8} maxW="900px" w="100%" px={4}>
        {/* Header */}
        <VStack spacing={2}>
          <Text fontSize="3xl" fontWeight="700" color="white">
            {t("Presentation Timers")}
          </Text>
          <Text color="#9ca3af" fontSize="lg">
            {t("Keep your presentations on track with smart slide timing")}
          </Text>
        </VStack>

        {/* Presentation Presets */}
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} w="100%">
          {presentationPresets.map((preset) => (
            <Button
              key={preset.name}
              onClick={() => handlePresetSelect(preset)}
              isDisabled={isRunning}
              variant={
                selectedPreset?.name === preset.name ? "solid" : "outline"
              }
              bg={
                selectedPreset?.name === preset.name
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.02)"
              }
              borderColor="rgba(255, 255, 255, 0.15)"
              color="white"
              h="90px"
              p={3}
              borderRadius="8px"
              transition="all 0.2s"
              _hover={{
                bg: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-1px)",
              }}
            >
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="600">
                  {preset.name}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {preset.totalTime}min • {preset.slideCount} slides
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>

        {/* Presentation Display */}
        {selectedPreset && (
          <VStack spacing={6} w="100%">
            {/* Presentation Info */}
            <Text fontSize="2xl" fontWeight="700" color="white">
              {selectedPreset.name}
            </Text>

            {/* Current Slide Timer */}
            <VStack spacing={4}>
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="600" color="white">
                  Slide {currentSlide} of {selectedPreset.slideCount}
                </Text>
              </VStack>

              {/* Slide Timer */}
              <UniversalProgressIndicator
                progress={getProgressPercent()}
                size={280}
                color={`${getTimeColor()}.500`}
              >
                <Text
                  fontSize="5xl"
                  fontFamily="monospace"
                  fontWeight="bold"
                  color="white"
                >
                  {formatTime(timeRemaining)}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {Math.round(timeRemaining / 1000)}s remaining
                </Text>
              </UniversalProgressIndicator>
            </VStack>

            {/* Controls */}
            <HStack spacing={4}>
              <Button
                onClick={handlePrevSlide}
                size="lg"
                variant="outline"
                isDisabled={currentSlide === 1}
              >
                ← {t("Previous")}
              </Button>

              <Button onClick={handleReset} size="lg" variant="outline">
                {t("Reset")}
              </Button>

              <Button
                onClick={handleStartStop}
                size="lg"
                colorScheme={isRunning ? "red" : "green"}
              >
                {isRunning ? t("Pause") : t("Start")}
              </Button>

              <Button
                onClick={handleNextSlide}
                size="lg"
                variant="outline"
                isDisabled={currentSlide >= selectedPreset.slideCount}
              >
                {t("Next")} →
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("Space: Start/Pause")} • {t("R: Reset")}
            </Text>
          </VStack>
        )}

        {!selectedPreset && (
          <Text color="#9ca3af" fontSize="lg">
            {t("Choose a presentation format to begin")}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default PresentationTimers;
