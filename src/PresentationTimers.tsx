import {
  Box,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useNotifications } from "./hooks/useNotifications";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

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
  const [slides, setSlides] = useState<SlideTimings[]>([]);
  const [totalSlides, setTotalSlides] = useState(10);
  const [slideTime, setSlideTime] = useState(60); // seconds
  const [presentationStarted, setPresentationStarted] = useState(false);
  const {
    isOpen: isCustomOpen,
    onOpen: onCustomOpen,
    onClose: onCustomClose,
  } = useDisclosure();
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [presentationStartTime, setPresentationStartTime] =
    useState<Date | null>(null);

  const presentationPresets: PresentationPreset[] = [
    {
      name: "Lightning Talk",
      totalTime: 5,
      slideCount: 5,
      timePerSlide: 60,
      icon: "⚡",
      description: "Quick 5-minute presentation",
      color: "yellow",
    },
    {
      name: "Short Presentation",
      totalTime: 10,
      slideCount: 10,
      timePerSlide: 60,
      icon: "📊",
      description: "Standard 10-minute talk",
      color: "blue",
    },
    {
      name: "Conference Talk",
      totalTime: 20,
      slideCount: 20,
      timePerSlide: 60,
      icon: "🎙️",
      description: "Professional conference presentation",
      color: "purple",
    },
    {
      name: "Academic Presentation",
      totalTime: 30,
      slideCount: 25,
      timePerSlide: 72,
      icon: "🎓",
      description: "Detailed academic presentation",
      color: "green",
    },
    {
      name: "Pitch Deck",
      totalTime: 15,
      slideCount: 12,
      timePerSlide: 75,
      icon: "💼",
      description: "Business pitch presentation",
      color: "orange",
    },
    {
      name: "Keynote",
      totalTime: 45,
      slideCount: 40,
      timePerSlide: 67.5,
      icon: "🌟",
      description: "Major keynote address",
      color: "red",
    },
  ];

  const getCurrentSlideTime = () => {
    if (slides.length > 0 && currentSlide <= slides.length) {
      return slides[currentSlide - 1].duration * 1000;
    }
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

        setTimeout(() => {
          handleNextSlide();
          stopAlarm();
        }, 1000);
      }
    },
  });

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await localforage.getItem("presentationTimerState");
        if (saved && typeof saved === "object") {
          const state = saved as {
            selectedPreset?: PresentationPreset;
            slides?: SlideTimings[];
            currentSlide?: number;
            totalSlides?: number;
            slideTime?: number;
          };
          if (state.selectedPreset) {
            setSelectedPreset(state.selectedPreset);
          }
          if (state.slides) {
            setSlides(state.slides);
          }
          if (typeof state.currentSlide === "number") {
            setCurrentSlide(state.currentSlide);
          }
          if (typeof state.totalSlides === "number") {
            setTotalSlides(state.totalSlides);
          }
          if (typeof state.slideTime === "number") {
            setSlideTime(state.slideTime);
          }
        }
      } catch (error) {
        console.error("Failed to load presentation timer state:", error);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (selectedPreset && !presentationStarted) {
      updateValue(getCurrentSlideTime());
    }
  }, [currentSlide, selectedPreset, slides, presentationStarted, updateValue]);

  // Save state when presentation settings change
  useEffect(() => {
    const saveState = async () => {
      try {
        await localforage.setItem("presentationTimerState", {
          selectedPreset,
          slides,
          currentSlide,
          totalSlides,
          slideTime,
        });
      } catch (error) {
        console.error("Failed to save presentation timer state:", error);
      }
    };
    if (selectedPreset) {
      saveState();
    }
  }, [selectedPreset, slides, currentSlide, totalSlides, slideTime]);

  const handlePresetSelect = (preset: PresentationPreset) => {
    if (!isRunning) {
      setSelectedPreset(preset);
      setCurrentSlide(1);
      setPresentationStarted(false);
      setPresentationStartTime(null);

      // Create default slides
      const defaultSlides = Array.from(
        { length: preset.slideCount },
        (_, i) => ({
          id: `slide-${i + 1}`,
          title: `Slide ${i + 1}`,
          duration: preset.timePerSlide,
        })
      );
      setSlides(defaultSlides);
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
      if (!presentationStartTime) {
        setPresentationStartTime(new Date());
        setPresentationStarted(true);
      }
      start();
    }
  };

  const handleReset = () => {
    stop();
    setCurrentSlide(1);
    setPresentationStarted(false);
    setPresentationStartTime(null);
    updateValue(getCurrentSlideTime());
    stopAlarm();
  };

  const handleNextSlide = () => {
    if (!selectedPreset) return;

    if (currentSlide < (slides.length || selectedPreset.slideCount)) {
      setCurrentSlide(currentSlide + 1);
      if (isRunning) {
        stop();
        // Small delay to allow state update
        setTimeout(() => {
          updateValue(getCurrentSlideTime());
          start();
        }, 100);
      }
    } else {
      // Presentation complete
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
      if (isRunning) {
        stop();
        setTimeout(() => {
          updateValue(getCurrentSlideTime());
          start();
        }, 100);
      }
    }
  };

  const createCustomPresentation = () => {
    if (totalSlides === 0) return;

    const customSlides = Array.from({ length: totalSlides }, (_, i) => ({
      id: `slide-${i + 1}`,
      title: `Slide ${i + 1}`,
      duration: slideTime,
    }));

    const customPreset: PresentationPreset = {
      name: "Custom Presentation",
      totalTime: Math.round((totalSlides * slideTime) / 60),
      slideCount: totalSlides,
      timePerSlide: slideTime,
      icon: "⚡",
      description: "Custom presentation timing",
      color: "pink",
    };

    setSelectedPreset(customPreset);
    setSlides(customSlides);
    setCurrentSlide(1);
    onCustomClose();
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
    const totalSlides = slides.length || selectedPreset.slideCount;
    return ((currentSlide - 1) / totalSlides) * 100;
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
            📊 {t("Presentation Timers")}
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
              variant="outline"
              bg={
                selectedPreset?.name === preset.name
                  ? `${preset.color}.500`
                  : "rgba(255, 255, 255, 0.02)"
              }
              borderColor={
                selectedPreset?.name === preset.name
                  ? `${preset.color}.400`
                  : "rgba(255, 255, 255, 0.15)"
              }
              color="white"
              h="100px"
              p={3}
              borderRadius="12px"
              transition="all 0.2s"
              _hover={{
                bg:
                  selectedPreset?.name === preset.name
                    ? `${preset.color}.600`
                    : "rgba(255, 255, 255, 0.05)",
                borderColor: `${preset.color}.400`,
                transform: "translateY(-2px)",
              }}
            >
              <VStack spacing={1}>
                <Text fontSize="24px">{preset.icon}</Text>
                <Text fontSize="xs" fontWeight="600" lineHeight="1.1">
                  {preset.name}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {preset.totalTime}min • {preset.slideCount} slides
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {Math.round(preset.timePerSlide)}s/slide
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>

        {/* Custom Presentation Button */}
        <Button
          onClick={onCustomOpen}
          isDisabled={isRunning}
          variant="ghost"
          color="white"
          border="1px dashed"
          borderColor="rgba(255, 255, 255, 0.3)"
          h="60px"
          w="220px"
          borderRadius="12px"
          _hover={{
            borderColor: "rgba(255, 255, 255, 0.5)",
            bg: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <VStack spacing={1}>
            <Text fontSize="18px">⚡</Text>
            <Text fontSize="sm">{t("Custom Presentation")}</Text>
          </VStack>
        </Button>

        {/* Presentation Display */}
        {selectedPreset && (
          <VStack spacing={6} w="100%">
            {/* Presentation Info */}
            <VStack spacing={3}>
              <HStack spacing={3}>
                <Text fontSize="2xl">{selectedPreset.icon}</Text>
                <Badge
                  colorScheme={selectedPreset.color}
                  fontSize="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  {selectedPreset.name}
                </Badge>
              </HStack>

              {presentationStartTime && (
                <Text color="#9ca3af" fontSize="sm">
                  {t("Started at")} {format(presentationStartTime, "HH:mm")}
                </Text>
              )}
            </VStack>

            {/* Overall Progress */}
            <Box w="100%" maxW="600px">
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.400">
                  {t("Overall Progress")}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {currentSlide} / {slides.length || selectedPreset.slideCount}
                </Text>
              </HStack>
              <Progress
                value={getTotalProgress()}
                colorScheme={selectedPreset.color}
                size="sm"
                borderRadius="full"
                bg="whiteAlpha.100"
              />
            </Box>

            {/* Current Slide Timer */}
            <VStack spacing={4}>
              <HStack spacing={3}>
                <Badge
                  colorScheme={getTimeColor()}
                  fontSize="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  {t("Slide")} {currentSlide}
                </Badge>
                {slides.length > 0 && slides[currentSlide - 1] && (
                  <Text color="gray.400" fontSize="sm">
                    {slides[currentSlide - 1].title}
                  </Text>
                )}
              </HStack>

              {/* Slide Timer */}
              <Box position="relative" w="280px" h="280px">
                <Progress
                  value={getProgressPercent()}
                  colorScheme={getTimeColor()}
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
                </Box>
              </Box>
            </VStack>

            {/* Navigation Controls */}
            <HStack spacing={4}>
              <IconButton
                onClick={handlePrevSlide}
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                isDisabled={currentSlide === 1}
                aria-label="Previous slide"
                icon={<Text fontSize="lg">←</Text>}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              />

              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {t("Reset")}
              </Button>

              <Button
                onClick={handleStartStop}
                size="lg"
                colorScheme={isRunning ? "red" : getTimeColor()}
                minW="120px"
              >
                {isRunning ? t("Pause") : t("Start")}
              </Button>

              <IconButton
                onClick={handleNextSlide}
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                isDisabled={
                  currentSlide >= (slides.length || selectedPreset.slideCount)
                }
                aria-label="Next slide"
                icon={<Text fontSize="lg">→</Text>}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              />
            </HStack>

            {/* Instructions */}
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("Space: Start/Pause")} • {t("R: Reset")} •{" "}
              {t("← →: Navigate slides")}
            </Text>
          </VStack>
        )}

        {!selectedPreset && (
          <VStack spacing={4}>
            <Text color="#9ca3af" fontSize="lg">
              {t("Choose a presentation format to begin")}
            </Text>
            <Text color="#6b7280" fontSize="sm" textAlign="center" maxW="500px">
              {t(
                "Select from common presentation formats or create a custom presentation with your own timing"
              )}
            </Text>
          </VStack>
        )}
      </VStack>

      {/* Custom Presentation Modal */}
      <Modal isOpen={isCustomOpen} onClose={onCustomClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent
          bg="gray.900"
          color="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <ModalHeader fontSize="lg" fontWeight="600">
            ⚡ {t("Create Custom Presentation")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              <Alert status="info" bg="blue.900" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  {t(
                    "Set up your presentation with custom slide count and timing."
                  )}
                </Text>
              </Alert>

              <Box w="100%">
                <Text fontSize="sm" color="gray.400" mb={3}>
                  {t("Number of Slides")}
                </Text>
                <NumberInput
                  value={totalSlides}
                  onChange={(_, value) => setTotalSlides(value || 1)}
                  min={1}
                  max={100}
                  bg="whiteAlpha.50"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>

              <Box w="100%">
                <Text fontSize="sm" color="gray.400" mb={3}>
                  {t("Time per Slide")}: {slideTime} {t("seconds")}
                </Text>
                <Slider
                  value={slideTime}
                  onChange={(value) => setSlideTime(value)}
                  min={15}
                  max={300}
                  step={5}
                >
                  <SliderTrack bg="whiteAlpha.200">
                    <SliderFilledTrack bg="blue.400" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="xs" color="gray.500">
                    15s
                  </Text>
                  <Text fontSize="xs" color="gray.300">
                    {t("Total")}: {Math.round((totalSlides * slideTime) / 60)}{" "}
                    {t("minutes")}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    5min
                  </Text>
                </HStack>
              </Box>

              <HStack spacing={3} w="100%">
                <Button onClick={onCustomClose} variant="ghost" flex={1}>
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={createCustomPresentation}
                  colorScheme="blue"
                  flex={1}
                  isDisabled={totalSlides === 0}
                >
                  {t("Create Presentation")}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PresentationTimers;
