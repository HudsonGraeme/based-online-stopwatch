import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  HStack,
  Text,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FloatingParticles } from "./FloatingParticles";

interface HotkeyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HotkeyItem {
  key: string;
  description: string;
  category: string;
}

const HotkeyHelpModal = ({ isOpen, onClose }: HotkeyHelpModalProps) => {
  const hotkeys: HotkeyItem[] = [
    // Navigation
    { key: "H", description: "Home (Stopwatch)", category: "Navigation" },
    { key: "T", description: "Timer (Countdown)", category: "Navigation" },
    { key: "P", description: "Pomodoro", category: "Navigation" },
    { key: "C", description: "Clocks", category: "Navigation" },

    // Timer Controls
    {
      key: "Space",
      description: "Start/Stop/Pause",
      category: "Timer Controls",
    },
    { key: "R", description: "Reset", category: "Timer Controls" },
    { key: "L", description: "Lap (Stopwatch)", category: "Timer Controls" },
    {
      key: "Enter",
      description: "Skip Phase (Pomodoro)",
      category: "Timer Controls",
    },

    // Editing
    { key: "0-9", description: "Edit time digits", category: "Editing" },
    { key: "Tab", description: "Navigate digits", category: "Editing" },
    { key: "← →", description: "Move between digits", category: "Editing" },
    { key: "Esc", description: "Deselect/Close", category: "Editing" },

    // View
    { key: "F11", description: "Toggle Fullscreen", category: "View" },
    { key: "?", description: "Show keyboard shortcuts", category: "View" },
  ];

  const categories = [...new Set(hotkeys.map((h) => h.category))];

  // Handle escape key
  useEffect(() => {
    const handleEscape = () => {
      if (isOpen) {
        onClose();
      }
    };

    document.addEventListener("escape-pressed", handleEscape as EventListener);
    return () =>
      document.removeEventListener(
        "escape-pressed",
        handleEscape as EventListener
      );
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
      motionPreset="none"
    >
      <ModalOverlay
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(8px) saturate(1.2) brightness(1.3)"
      >
        <FloatingParticles />
      </ModalOverlay>
      <ModalContent
        bg="rgba(0, 0, 0, 0.7)"
        border="none"
        backdropFilter="blur(40px)"
        borderRadius="xl"
        _focus={{ boxShadow: "none", outline: "none" }}
        _focusVisible={{ boxShadow: "none", outline: "none" }}
      >
        <ModalHeader
          fontSize="lg"
          fontWeight="600"
          textAlign="center"
          pb={2}
          color="white"
        >
          Keyboard Shortcuts
        </ModalHeader>

        <ModalBody py={4}>
          <VStack spacing={4} align="stretch">
            {categories.map((category) => (
              <Box key={category}>
                <Text
                  fontSize="xs"
                  fontWeight="500"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  mb={2}
                  textAlign="left"
                >
                  {category}
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {hotkeys
                    .filter((h) => h.category === category)
                    .map((hotkey, idx) => (
                      <HStack key={idx} spacing={2} align="center">
                        <Text
                          as="kbd"
                          fontSize="xs"
                          bg="rgba(255, 255, 255, 0.1)"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontFamily="monospace"
                          color="white"
                          minW="fit-content"
                          textAlign="center"
                        >
                          {hotkey.key}
                        </Text>
                        <Text fontSize="xs" color="gray.300" flex={1}>
                          {hotkey.description}
                        </Text>
                      </HStack>
                    ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HotkeyHelpModal;
