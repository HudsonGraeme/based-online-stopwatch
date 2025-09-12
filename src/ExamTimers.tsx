import {
  Box,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Input,
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
  Divider,
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

interface ExamSection {
  id: string;
  name: string;
  allocatedTime: number; // in minutes
  color: string;
  icon: string;
}

interface ExamPreset {
  name: string;
  totalTime: number; // in minutes
  sections: ExamSection[];
  icon: string;
  description: string;
}

const ExamTimers = () => {
  const { t } = useTranslation();
  const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [customSections, setCustomSections] = useState<ExamSection[]>([]);
  const {
    isOpen: isCustomOpen,
    onOpen: onCustomOpen,
    onClose: onCustomClose,
  } = useDisclosure();
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);

  const examPresets: ExamPreset[] = [
    {
      name: "SAT Exam",
      totalTime: 180, // 3 hours
      icon: "📊",
      description: "Standardized college entrance exam",
      sections: [
        {
          id: "reading",
          name: "Reading",
          allocatedTime: 65,
          color: "blue",
          icon: "📖",
        },
        {
          id: "writing",
          name: "Writing & Language",
          allocatedTime: 35,
          color: "green",
          icon: "✍️",
        },
        {
          id: "break",
          name: "Break",
          allocatedTime: 10,
          color: "orange",
          icon: "☕",
        },
        {
          id: "math-no-calc",
          name: "Math (No Calculator)",
          allocatedTime: 25,
          color: "purple",
          icon: "🔢",
        },
        {
          id: "math-calc",
          name: "Math (Calculator)",
          allocatedTime: 55,
          color: "red",
          icon: "🧮",
        },
      ],
    },
    {
      name: "AP Exam",
      totalTime: 180,
      icon: "🎓",
      description: "Advanced placement examination",
      sections: [
        {
          id: "mcq",
          name: "Multiple Choice",
          allocatedTime: 90,
          color: "blue",
          icon: "✅",
        },
        {
          id: "break",
          name: "Break",
          allocatedTime: 15,
          color: "orange",
          icon: "☕",
        },
        {
          id: "frq",
          name: "Free Response",
          allocatedTime: 75,
          color: "green",
          icon: "📝",
        },
      ],
    },
    {
      name: "Final Exam",
      totalTime: 120,
      icon: "📋",
      description: "Standard university final exam",
      sections: [
        {
          id: "review",
          name: "Review Time",
          allocatedTime: 10,
          color: "gray",
          icon: "👀",
        },
        {
          id: "exam",
          name: "Exam Time",
          allocatedTime: 100,
          color: "red",
          icon: "📝",
        },
        {
          id: "review-final",
          name: "Final Review",
          allocatedTime: 10,
          color: "blue",
          icon: "🔍",
        },
      ],
    },
    {
      name: "Midterm Exam",
      totalTime: 75,
      icon: "📄",
      description: "Mid-semester examination",
      sections: [
        {
          id: "reading",
          name: "Read Instructions",
          allocatedTime: 5,
          color: "gray",
          icon: "📋",
        },
        {
          id: "exam",
          name: "Exam Time",
          allocatedTime: 70,
          color: "red",
          icon: "✏️",
        },
      ],
    },
  ];

  const getCurrentSection = () => {
    if (!selectedExam || !selectedExam.sections[currentSectionIndex])
      return null;
    return selectedExam.sections[currentSectionIndex];
  };

  const {
    isRunning,
    value: timeRemaining,
    start,
    stop,
    updateValue,
  } = useWebWorkerTimer({
    type: "countdown",
    timerId: "exam-timer",
    config: {
      initialValue: (getCurrentSection()?.allocatedTime || 0) * 60 * 1000,
    },
    onComplete: () => {
      const currentSection = getCurrentSection();
      if (currentSection) {
        startAlarm();
        showNotification(`${currentSection.name} Complete!`, {
          body: `Time to move to the next section`,
          tag: "exam-section-complete",
        });

        // Auto-advance to next section
        setTimeout(() => {
          handleNextSection();
        }, 2000);
      }
    },
  });

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await localforage.getItem("examTimerState");
        if (saved && typeof saved === "object") {
          const state = saved as {
            selectedExam?: ExamPreset;
            currentSectionIndex?: number;
            customSections?: ExamSection[];
          };
          if (state.selectedExam) {
            setSelectedExam(state.selectedExam);
          }
          if (typeof state.currentSectionIndex === "number") {
            setCurrentSectionIndex(state.currentSectionIndex);
          }
          if (state.customSections) {
            setCustomSections(state.customSections);
          }
        }
      } catch (error) {
        console.error("Failed to load exam timer state:", error);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const currentSection = getCurrentSection();
    if (currentSection && !isRunning) {
      updateValue(currentSection.allocatedTime * 60 * 1000);
    }
  }, [currentSectionIndex, selectedExam, updateValue, isRunning]);

  // Save state when exam or section changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await localforage.setItem("examTimerState", {
          selectedExam,
          currentSectionIndex,
          customSections,
        });
      } catch (error) {
        console.error("Failed to save exam timer state:", error);
      }
    };
    if (selectedExam) {
      saveState();
    }
  }, [selectedExam, currentSectionIndex, customSections]);

  const handleExamSelect = (exam: ExamPreset) => {
    if (!isRunning) {
      setSelectedExam(exam);
      setCurrentSectionIndex(0);
      setExamStartTime(null);
      stopAlarm();
    }
  };

  const handleStartStop = async () => {
    if (!selectedExam) return;

    if (!hasRequestedPermission) {
      await requestPermission();
      setHasRequestedPermission(true);
    }

    if (isRunning) {
      stop();
    } else {
      if (!examStartTime) {
        setExamStartTime(new Date());
      }
      start();
    }
  };

  const handleReset = () => {
    stop();
    setCurrentSectionIndex(0);
    setExamStartTime(null);
    const firstSection = selectedExam?.sections[0];
    if (firstSection) {
      updateValue(firstSection.allocatedTime * 60 * 1000);
    }
    stopAlarm();
  };

  const handleNextSection = () => {
    if (!selectedExam) return;

    if (currentSectionIndex < selectedExam.sections.length - 1) {
      stop();
      setCurrentSectionIndex(currentSectionIndex + 1);
      stopAlarm();
    } else {
      // Exam complete
      stop();
      startAlarm();
      showNotification("Exam Complete!", {
        body: "Time's up! Please submit your exam.",
        tag: "exam-complete",
      });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      stop();
      setCurrentSectionIndex(currentSectionIndex - 1);
      stopAlarm();
    }
  };

  const addCustomSection = () => {
    const newSection: ExamSection = {
      id: `section-${customSections.length + 1}`,
      name: `Section ${customSections.length + 1}`,
      allocatedTime: 30,
      color: "blue",
      icon: "📝",
    };
    setCustomSections([...customSections, newSection]);
  };

  const createCustomExam = () => {
    if (customSections.length === 0) return;

    const customExam: ExamPreset = {
      name: "Custom Exam",
      totalTime: customSections.reduce(
        (total, section) => total + section.allocatedTime,
        0
      ),
      icon: "⚡",
      description: "Custom exam configuration",
      sections: customSections,
    };

    setSelectedExam(customExam);
    setCurrentSectionIndex(0);
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
    const currentSection = getCurrentSection();
    if (!currentSection) return 0;
    const sectionTotalTime = currentSection.allocatedTime * 60 * 1000;
    return ((sectionTotalTime - timeRemaining) / sectionTotalTime) * 100;
  };

  const getTotalExamProgress = () => {
    if (!selectedExam) return 0;
    const completedSections = selectedExam.sections.slice(
      0,
      currentSectionIndex
    );
    const completedTime = completedSections.reduce(
      (total, section) => total + section.allocatedTime,
      0
    );
    const currentSectionProgress = getCurrentSection()
      ? (getCurrentSection()!.allocatedTime * 60 * 1000 - timeRemaining) /
        (60 * 1000)
      : 0;

    const totalTime = selectedExam.sections.reduce(
      (total, section) => total + section.allocatedTime,
      0
    );
    return ((completedTime + currentSectionProgress) / totalTime) * 100;
  };

  const currentSection = getCurrentSection();

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
          ? `${currentSection?.color}.500`
          : "transparent",
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
            📝 {t("Exam Timers")}
          </Text>
          <Text color="#9ca3af" fontSize="lg">
            {t("Professional exam timing with section management")}
          </Text>
        </VStack>

        {/* Exam Selection */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
          {examPresets.map((exam) => (
            <Button
              key={exam.name}
              onClick={() => handleExamSelect(exam)}
              isDisabled={isRunning}
              variant="outline"
              bg={
                selectedExam?.name === exam.name
                  ? "blue.500"
                  : "rgba(255, 255, 255, 0.02)"
              }
              borderColor={
                selectedExam?.name === exam.name
                  ? "blue.400"
                  : "rgba(255, 255, 255, 0.15)"
              }
              color="white"
              h="90px"
              p={3}
              borderRadius="12px"
              transition="all 0.2s"
              _hover={{
                bg:
                  selectedExam?.name === exam.name
                    ? "blue.600"
                    : "rgba(255, 255, 255, 0.05)",
                borderColor: "blue.400",
                transform: "translateY(-2px)",
              }}
            >
              <VStack spacing={1}>
                <Text fontSize="24px">{exam.icon}</Text>
                <Text fontSize="xs" fontWeight="600" lineHeight="1.1">
                  {exam.name}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {exam.totalTime}min
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>

        {/* Custom Exam Button */}
        <Button
          onClick={onCustomOpen}
          isDisabled={isRunning}
          variant="ghost"
          color="white"
          border="1px dashed"
          borderColor="rgba(255, 255, 255, 0.3)"
          h="60px"
          w="200px"
          borderRadius="12px"
          _hover={{
            borderColor: "rgba(255, 255, 255, 0.5)",
            bg: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <VStack spacing={1}>
            <Text fontSize="18px">⚡</Text>
            <Text fontSize="sm">{t("Custom Exam")}</Text>
          </VStack>
        </Button>

        {/* Exam Display */}
        {selectedExam && currentSection && (
          <VStack spacing={6} w="100%">
            {/* Exam Info */}
            <VStack spacing={3}>
              <HStack spacing={3}>
                <Text fontSize="2xl">{selectedExam.icon}</Text>
                <Badge
                  colorScheme="blue"
                  fontSize="lg"
                  px={4}
                  py={2}
                  borderRadius="full"
                >
                  {selectedExam.name}
                </Badge>
              </HStack>

              {examStartTime && (
                <Text color="#9ca3af" fontSize="sm">
                  {t("Started at")} {format(examStartTime, "HH:mm")}
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
                  {Math.round(getTotalExamProgress())}%
                </Text>
              </HStack>
              <Progress
                value={getTotalExamProgress()}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
                bg="whiteAlpha.100"
              />
            </Box>

            {/* Current Section */}
            <VStack spacing={4}>
              <HStack spacing={3}>
                <Text fontSize="xl">{currentSection.icon}</Text>
                <Badge
                  colorScheme={currentSection.color}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {currentSection.name}
                </Badge>
                <Text color="gray.400" fontSize="sm">
                  ({currentSectionIndex + 1} of {selectedExam.sections.length})
                </Text>
              </HStack>

              {/* Section Timer */}
              <Box position="relative" w="250px" h="250px">
                <Progress
                  value={getProgressPercent()}
                  colorScheme={currentSection.color}
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
                    fontSize="4xl"
                    fontFamily="monospace"
                    fontWeight="bold"
                    color="white"
                  >
                    {formatTime(timeRemaining)}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {Math.round(timeRemaining / 60000)} min left
                  </Text>
                </Box>
              </Box>
            </VStack>

            {/* Controls */}
            <HStack spacing={4}>
              <Button
                onClick={handlePrevSection}
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                isDisabled={currentSectionIndex === 0 || isRunning}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                ← {t("Previous")}
              </Button>

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
                colorScheme={isRunning ? "red" : currentSection.color}
                minW="120px"
              >
                {isRunning ? t("Pause") : t("Start")}
              </Button>

              <Button
                onClick={handleNextSection}
                size="lg"
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                color="white"
                isDisabled={
                  currentSectionIndex === selectedExam.sections.length - 1
                }
                _hover={{
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {t("Next")} →
              </Button>
            </HStack>

            {/* Instructions */}
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("Space: Start/Pause")} • {t("R: Reset")}
            </Text>
          </VStack>
        )}

        {!selectedExam && (
          <VStack spacing={4}>
            <Text color="#9ca3af" fontSize="lg">
              {t("Choose an exam format to begin")}
            </Text>
            <Text color="#6b7280" fontSize="sm" textAlign="center" maxW="500px">
              {t(
                "Select from standard exam formats or create a custom exam with your own sections and timing"
              )}
            </Text>
          </VStack>
        )}
      </VStack>

      {/* Custom Exam Modal */}
      <Modal isOpen={isCustomOpen} onClose={onCustomClose} isCentered size="xl">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent
          bg="gray.900"
          color="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
          maxH="80vh"
          overflow="hidden"
        >
          <ModalHeader fontSize="lg" fontWeight="600">
            ⚡ {t("Create Custom Exam")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflow="auto">
            <VStack spacing={4}>
              <Alert status="info" bg="blue.900" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  {t(
                    "Add sections for your custom exam. Each section will run consecutively."
                  )}
                </Text>
              </Alert>

              {customSections.map((section, index) => (
                <Box
                  key={section.id}
                  w="100%"
                  p={4}
                  bg="whiteAlpha.50"
                  borderRadius="md"
                >
                  <VStack spacing={3}>
                    <HStack w="100%" justify="space-between">
                      <Input
                        value={section.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const updated = [...customSections];
                          updated[index].name = e.target.value;
                          setCustomSections(updated);
                        }}
                        placeholder="Section name"
                        size="sm"
                        bg="whiteAlpha.100"
                      />
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          const updated = customSections.filter(
                            (_, i) => i !== index
                          );
                          setCustomSections(updated);
                        }}
                      >
                        ×
                      </Button>
                    </HStack>

                    <Box w="100%">
                      <Text fontSize="sm" color="gray.400" mb={2}>
                        {t("Duration")}: {section.allocatedTime} {t("minutes")}
                      </Text>
                      <Slider
                        value={section.allocatedTime}
                        onChange={(value) => {
                          const updated = [...customSections];
                          updated[index].allocatedTime = value;
                          setCustomSections(updated);
                        }}
                        min={5}
                        max={180}
                        step={5}
                      >
                        <SliderTrack bg="whiteAlpha.200">
                          <SliderFilledTrack bg="blue.400" />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>
                  </VStack>
                </Box>
              ))}

              <Button
                onClick={addCustomSection}
                variant="dashed"
                w="100%"
                borderColor="whiteAlpha.300"
                color="gray.300"
                _hover={{
                  borderColor: "whiteAlpha.500",
                  bg: "whiteAlpha.50",
                }}
              >
                + {t("Add Section")}
              </Button>

              <Divider />

              <HStack spacing={3} w="100%">
                <Button onClick={onCustomClose} variant="ghost" flex={1}>
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={createCustomExam}
                  colorScheme="blue"
                  flex={1}
                  isDisabled={customSections.length === 0}
                >
                  {t("Create Exam")}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExamTimers;
