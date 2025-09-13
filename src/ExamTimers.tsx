import {
  Box,
  Button,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useNotifications } from "./hooks/useNotifications";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { UniversalProgressIndicator } from "./components/UniversalProgressIndicator";

interface ExamPreset {
  name: string;
  totalTime: number;
  sections: { name: string; time: number; color: string }[];
}

const ExamTimers = () => {
  const { t } = useTranslation();
  const [selectedExam, setSelectedExam] = useState<ExamPreset | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  const examPresets: ExamPreset[] = [
    {
      name: "SAT",
      totalTime: 134,
      sections: [
        { name: "Reading & Writing", time: 64, color: "blue" },
        { name: "Break", time: 10, color: "orange" },
        { name: "Math", time: 70, color: "green" },
      ],
    },
    {
      name: "AP",
      totalTime: 180,
      sections: [
        { name: "Multiple Choice", time: 90, color: "blue" },
        { name: "Break", time: 15, color: "orange" },
        { name: "Free Response", time: 75, color: "green" },
      ],
    },
    {
      name: "Final",
      totalTime: 120,
      sections: [
        { name: "Review", time: 10, color: "gray" },
        { name: "Exam", time: 100, color: "red" },
        { name: "Final Review", time: 10, color: "blue" },
      ],
    },
    {
      name: "Midterm",
      totalTime: 75,
      sections: [
        { name: "Instructions", time: 5, color: "gray" },
        { name: "Exam", time: 70, color: "red" },
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
      initialValue: (getCurrentSection()?.time || 0) * 60 * 1000,
    },
    onComplete: () => {
      const currentSection = getCurrentSection();
      if (currentSection) {
        startAlarm();
        showNotification(`${currentSection.name} Complete!`, {
          body: `Time to move to the next section`,
          tag: "exam-section-complete",
        });

        setTimeout(() => {
          handleNextSection();
        }, 2000);
      }
    },
  });

  useEffect(() => {
    const currentSection = getCurrentSection();
    if (currentSection && !isRunning) {
      updateValue(currentSection.time * 60 * 1000);
    }
  }, [currentSectionIndex, selectedExam, updateValue, isRunning]);

  const handleExamSelect = (exam: ExamPreset) => {
    if (!isRunning) {
      setSelectedExam(exam);
      setCurrentSectionIndex(0);
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
      start();
    }
  };

  const handleReset = () => {
    stop();
    setCurrentSectionIndex(0);
    const firstSection = selectedExam?.sections[0];
    if (firstSection) {
      updateValue(firstSection.time * 60 * 1000);
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
    const sectionTotalTime = currentSection.time * 60 * 1000;
    return ((sectionTotalTime - timeRemaining) / sectionTotalTime) * 100;
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
            {t("Exam Timers")}
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
              variant={selectedExam?.name === exam.name ? "solid" : "outline"}
              colorScheme={selectedExam?.name === exam.name ? "white" : "gray"}
              bg={
                selectedExam?.name === exam.name
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
                  {exam.name}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {exam.totalTime}min
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>

        {/* Exam Display */}
        {selectedExam && currentSection && (
          <VStack spacing={6} w="100%">
            {/* Exam Info */}
            <Text fontSize="2xl" fontWeight="700" color="white">
              {selectedExam.name} Exam
            </Text>

            {/* Current Section */}
            <VStack spacing={4}>
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="600" color="white">
                  {currentSection.name}
                </Text>
                <Text color="gray.400" fontSize="sm">
                  Section {currentSectionIndex + 1} of{" "}
                  {selectedExam.sections.length}
                </Text>
              </VStack>

              <UniversalProgressIndicator
                progress={getProgressPercent()}
                size={250}
                color={`${currentSection.color}.500`}
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
              </UniversalProgressIndicator>
            </VStack>

            {/* Controls */}
            <HStack spacing={4}>
              <Button
                onClick={handlePrevSection}
                size="lg"
                variant="outline"
                isDisabled={currentSectionIndex === 0 || isRunning}
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
                onClick={handleNextSection}
                size="lg"
                variant="outline"
                isDisabled={
                  currentSectionIndex === selectedExam.sections.length - 1
                }
              >
                {t("Next")} →
              </Button>
            </HStack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("Space: Start/Pause")} • {t("R: Reset")}
            </Text>
          </VStack>
        )}

        {!selectedExam && (
          <Text color="#9ca3af" fontSize="lg">
            {t("Choose an exam format to begin")}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default ExamTimers;
