import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";
import { useWebWorkerTimer } from "./hooks/useWebWorkerTimer";
import { useTimerEffects } from "./hooks/useTimerEffects";
import { useNotifications } from "./hooks/useNotifications";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { UniversalProgressIndicator } from "./components/UniversalProgressIndicator";

interface ActivityPreset {
  name: string;
  duration: number; // in milliseconds
  color: string;
  icon: string;
  description: string;
}

const ClassroomTimers = () => {
  const { t } = useTranslation();
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityPreset | null>(null);
  const [customTime, setCustomTime] = useState("");
  const {
    isOpen: isCustomOpen,
    onOpen: onCustomOpen,
    onClose: onCustomClose,
  } = useDisclosure();
  const { showNotification, requestPermission } = useNotifications();
  const { isFlashing, startAlarm, stopAlarm } = useTimerEffects();
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

  const activityPresets: ActivityPreset[] = useMemo(
    () => [
      {
        name: t("Reading Time"),
        duration: 15 * 60 * 1000, // 15 minutes
        color: "blue",
        icon: "RD",
        description: t("Silent reading period"),
      },
      {
        name: t("Group Work"),
        duration: 20 * 60 * 1000, // 20 minutes
        color: "green",
        icon: "GW",
        description: t("Collaborative activity time"),
      },
      {
        name: t("Presentation"),
        duration: 5 * 60 * 1000, // 5 minutes
        color: "purple",
        icon: "PR",
        description: t("Student presentation slot"),
      },
      {
        name: t("Break Time"),
        duration: 10 * 60 * 1000, // 10 minutes
        color: "orange",
        icon: "BR",
        description: t("Rest and recharge"),
      },
      {
        name: t("Quiz Time"),
        duration: 30 * 60 * 1000, // 30 minutes
        color: "red",
        icon: "WR",
        description: t("Assessment period"),
      },
      {
        name: t("Discussion"),
        duration: 15 * 60 * 1000, // 15 minutes
        color: "teal",
        icon: "DI",
        description: t("Class discussion time"),
      },
      {
        name: t("Clean Up"),
        duration: 5 * 60 * 1000, // 5 minutes
        color: "yellow",
        icon: "CL",
        description: t("Tidy up the classroom"),
      },
      {
        name: t("Transition"),
        duration: 3 * 60 * 1000, // 3 minutes
        color: "gray",
        icon: "TR",
        description: t("Move between activities"),
      },
    ],
    [t]
  );

  const {
    isRunning,
    value: timeRemaining,
    start,
    stop,
    updateValue,
  } = useWebWorkerTimer({
    type: "countdown",
    timerId: "classroom-timer",
    config: { initialValue: selectedActivity?.duration || 0 },
    onComplete: () => {
      startAlarm();
      showNotification(`${selectedActivity?.name} Complete!`, {
        body: `${selectedActivity?.description} time is up!`,
        tag: "classroom-timer-complete",
      });
    },
  });

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await localforage.getItem("classroomTimerState");
        if (saved && typeof saved === "object") {
          const state = saved as { selectedActivity?: ActivityPreset };
          if (state.selectedActivity) {
            setSelectedActivity(state.selectedActivity);
          }
        }
      } catch (error) {
        console.error("Failed to load classroom timer state:", error);
      }
    };
    loadState();
  }, []);

  // Update timer when activity changes
  useEffect(() => {
    if (selectedActivity && !isRunning) {
      updateValue(selectedActivity.duration);
    }
  }, [selectedActivity, isRunning, updateValue]);

  // Save state when selectedActivity changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await localforage.setItem("classroomTimerState", {
          selectedActivity,
        });
      } catch (error) {
        console.error("Failed to save classroom timer state:", error);
      }
    };
    if (selectedActivity) {
      saveState();
    }
  }, [selectedActivity]);

  const handleActivitySelect = (activity: ActivityPreset) => {
    if (!isRunning) {
      setSelectedActivity(activity);
      stopAlarm();
    }
  };

  const handleStartStop = async () => {
    if (!selectedActivity) return;

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
    if (selectedActivity) {
      stop();
      updateValue(selectedActivity.duration);
      stopAlarm();
    }
  };

  const handleCustomTimer = () => {
    const minutes = parseInt(customTime);
    if (minutes > 0 && minutes <= 180) {
      // Max 3 hours
      const customActivity: ActivityPreset = {
        name: t("Custom Timer"),
        duration: minutes * 60 * 1000,
        color: "pink",
        icon: "CT",
        description: t("{{minutes}} minute custom activity", { minutes }),
      };
      setSelectedActivity(customActivity);
      onCustomClose();
      setCustomTime("");
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
    } catch {
      return "00:00";
    }
  };

  const getProgressPercent = () => {
    if (!selectedActivity) return 0;
    return (
      ((selectedActivity.duration - timeRemaining) /
        selectedActivity.duration) *
      100
    );
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
        backgroundColor: isFlashing
          ? `${selectedActivity?.color}.500`
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
      <VStack spacing={8} maxW="800px" w="100%" px={4}>
        {/* Header */}
        <VStack spacing={2}>
          <Text fontSize="3xl" fontWeight="700" color="white">
            {t("Classroom Timers")}
          </Text>
          <Text color="#9ca3af" fontSize="lg">
            {t("Perfect timing for every classroom activity")}
          </Text>
        </VStack>

        {/* Activity Selection Grid */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
          {activityPresets.map((activity) => (
            <Button
              key={activity.name}
              onClick={() => handleActivitySelect(activity)}
              isDisabled={isRunning}
              variant="outline"
              bg={
                selectedActivity?.name === activity.name
                  ? `${activity.color}.500`
                  : "rgba(255, 255, 255, 0.02)"
              }
              borderColor={
                selectedActivity?.name === activity.name
                  ? `${activity.color}.400`
                  : "rgba(255, 255, 255, 0.15)"
              }
              color="white"
              h="80px"
              p={3}
              borderRadius="12px"
              transition="all 0.2s"
              _hover={{
                bg:
                  selectedActivity?.name === activity.name
                    ? `${activity.color}.600`
                    : "rgba(255, 255, 255, 0.05)",
                borderColor: `${activity.color}.400`,
                transform: "translateY(-2px)",
              }}
            >
              <VStack spacing={1}>
                <Text fontSize="20px">{activity.icon}</Text>
                <Text fontSize="xs" fontWeight="600" lineHeight="1.1">
                  {activity.name}
                </Text>
                <Text fontSize="xs" color="gray.300">
                  {Math.round(activity.duration / 60000)}m
                </Text>
              </VStack>
            </Button>
          ))}
        </SimpleGrid>

        {/* Custom Timer Button */}
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
            <Text fontSize="18px">+</Text>
            <Text fontSize="sm">{t("Custom Timer")}</Text>
          </VStack>
        </Button>

        {/* Timer Display */}
        {selectedActivity && (
          <VStack spacing={6}>
            <VStack spacing={3}>
              <Text fontSize="2xl" fontWeight="700" color="white">
                {selectedActivity.name}
              </Text>
              <Text color="#9ca3af" fontSize="md">
                {selectedActivity.description}
              </Text>
            </VStack>

            {/* Progress Ring */}
            <UniversalProgressIndicator
              progress={getProgressPercent()}
              size={200}
              color={`${selectedActivity.color}.500`}
            >
              <Text
                fontSize="4xl"
                fontFamily="monospace"
                fontWeight="bold"
                color="white"
              >
                {formatTime(timeRemaining)}
              </Text>
            </UniversalProgressIndicator>

            {/* Controls */}
            <HStack spacing={4}>
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
                colorScheme={isRunning ? "red" : selectedActivity.color}
                minW="120px"
              >
                {isRunning ? t("Pause") : t("Start")}
              </Button>
            </HStack>

            {/* Instructions */}
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("Space: Start/Pause")} • {t("R: Reset")}
            </Text>
          </VStack>
        )}

        {!selectedActivity && (
          <VStack spacing={4}>
            <Text color="#9ca3af" fontSize="lg">
              {t("Choose an activity to start timing")}
            </Text>
            <Text color="#6b7280" fontSize="sm" textAlign="center" maxW="400px">
              {t(
                "Select from common classroom activities or create a custom timer for any duration"
              )}
            </Text>
          </VStack>
        )}
      </VStack>

      {/* Custom Timer Modal */}
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
            {t("Custom Timer")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="100%">
                <Text fontSize="sm" color="gray.400" mb={2}>
                  {t("Duration (minutes)")}
                </Text>
                <Input
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="15"
                  type="number"
                  min="1"
                  max="180"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  _focus={{
                    borderColor: "blue.400",
                    bg: "whiteAlpha.100",
                  }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {t("Enter a duration between 1-180 minutes")}
                </Text>
              </Box>

              <HStack spacing={3} w="100%">
                <Button onClick={onCustomClose} variant="ghost" flex={1}>
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={handleCustomTimer}
                  colorScheme="blue"
                  flex={1}
                  isDisabled={
                    !customTime ||
                    parseInt(customTime) < 1 ||
                    parseInt(customTime) > 180
                  }
                >
                  {t("Start Timer")}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClassroomTimers;
