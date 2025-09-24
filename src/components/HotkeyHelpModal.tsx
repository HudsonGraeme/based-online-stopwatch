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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const hotkeys: HotkeyItem[] = [
    // Navigation
    {
      key: "H",
      description: t("hotkey.navigation.home"),
      category: t("hotkey.category.navigation"),
    },
    {
      key: "T",
      description: t("hotkey.navigation.timer"),
      category: t("hotkey.category.navigation"),
    },
    {
      key: "P",
      description: t("hotkey.navigation.pomodoro"),
      category: t("hotkey.category.navigation"),
    },
    {
      key: "C",
      description: t("hotkey.navigation.clocks"),
      category: t("hotkey.category.navigation"),
    },

    // Timer Controls
    {
      key: "Space",
      description: t("hotkey.timer_controls.start_stop_pause"),
      category: t("hotkey.category.timer_controls"),
    },
    {
      key: "R",
      description: t("hotkey.timer_controls.reset"),
      category: t("hotkey.category.timer_controls"),
    },
    {
      key: "L",
      description: t("hotkey.timer_controls.lap"),
      category: t("hotkey.category.timer_controls"),
    },
    {
      key: "Enter",
      description: t("hotkey.timer_controls.skip_phase"),
      category: t("hotkey.category.timer_controls"),
    },

    // Editing
    {
      key: "0-9",
      description: t("hotkey.editing.edit_digits"),
      category: t("hotkey.category.editing"),
    },
    {
      key: "Tab",
      description: t("hotkey.editing.navigate_digits"),
      category: t("hotkey.category.editing"),
    },
    {
      key: "← →",
      description: t("hotkey.editing.move_digits"),
      category: t("hotkey.category.editing"),
    },
    {
      key: "Esc",
      description: t("hotkey.editing.deselect_close"),
      category: t("hotkey.category.editing"),
    },

    // View
    {
      key: "F11",
      description: t("hotkey.view.fullscreen"),
      category: t("hotkey.category.view"),
    },
    {
      key: "?",
      description: t("hotkey.view.show_shortcuts"),
      category: t("hotkey.category.view"),
    },
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
          {t("Keyboard Shortcuts")}
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
