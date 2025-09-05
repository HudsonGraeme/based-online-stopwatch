import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Button,
  Box,
  SimpleGrid,
  Image,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";
import { FloatingParticles } from "./FloatingParticles";

interface BackgroundImage {
  id: string;
  data: string;
  name?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backgroundStore = localforage.createInstance({
  name: "basedonlinestopwatch",
  storeName: "backgrounds",
});

const settingsStore = localforage.createInstance({
  name: "basedonlinestopwatch",
  storeName: "settings",
});

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBackgrounds();
    loadSelectedBackground();
  }, []);

  const loadBackgrounds = async () => {
    try {
      const keys = await backgroundStore.keys();
      const images: BackgroundImage[] = [];
      for (const key of keys) {
        const data = await backgroundStore.getItem<string>(key);
        if (data) {
          images.push({ id: key, data });
        }
      }
      setBackgrounds(images);
    } catch (error) {
      console.error("Failed to load backgrounds:", error);
    }
  };

  const loadSelectedBackground = async () => {
    try {
      const selected =
        await settingsStore.getItem<string>("selectedBackground");
      setSelectedBackground(selected);
    } catch (error) {
      console.error("Failed to load selected background:", error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const newBackgrounds: BackgroundImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: t("Invalid file type"),
          description: t("Please upload image files only"),
          status: "error",
          duration: 3000,
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t("File too large"),
          description: t("Please upload images smaller than 5MB"),
          status: "warning",
          duration: 3000,
        });
        continue;
      }

      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const id = `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await backgroundStore.setItem(id, base64);
        newBackgrounds.push({ id, data: base64, name: file.name });
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
          title: t("Upload failed"),
          description: t("Failed to upload") + ` ${file.name}`,
          status: "error",
          duration: 3000,
        });
      }
    }

    if (newBackgrounds.length > 0) {
      setBackgrounds([...backgrounds, ...newBackgrounds]);
      toast({
        title: t("Images uploaded"),
        description:
          t("Successfully uploaded") +
          ` ${newBackgrounds.length} ` +
          t("image(s)"),
        status: "success",
        duration: 3000,
      });
    }

    setIsLoading(false);
    event.target.value = "";
  };

  const selectBackground = async (id: string | null) => {
    try {
      await settingsStore.setItem("selectedBackground", id);
      setSelectedBackground(id);

      if (id === null) {
        // Remove custom background styles when "None" is selected
        const existingStyle = document.getElementById(
          "custom-background-style"
        );
        if (existingStyle) {
          existingStyle.remove();
        }
      } else {
        const bgData = backgrounds.find((bg) => bg.id === id)?.data;
        applyBackgroundToPage(bgData);
      }
    } catch (error) {
      console.error("Failed to save background selection:", error);
      toast({
        title: t("Failed to update background"),
        status: "error",
        duration: 3000,
      });
    }
  };

  const deleteBackground = async (id: string) => {
    try {
      await backgroundStore.removeItem(id);
      setBackgrounds(backgrounds.filter((bg) => bg.id !== id));

      if (selectedBackground === id) {
        await selectBackground(null);
      }

      toast({
        title: t("Background deleted"),
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to delete background:", error);
      toast({
        title: t("Failed to delete background"),
        status: "error",
        duration: 3000,
      });
    }
  };

  const applyBackgroundToPage = (bgData: string | null | undefined) => {
    const existingStyle = document.getElementById("custom-background-style");
    if (existingStyle) {
      existingStyle.remove();
    }

    if (bgData) {
      const style = document.createElement("style");
      style.id = "custom-background-style";
      style.textContent = `
        #root {
          background-image: url(${bgData}) !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          background-attachment: fixed !important;
        }
        #root::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          pointer-events: none;
        }
        [data-theme="app-container"] {
          background-color: transparent !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
        borderRadius="12px"
        boxShadow="none"
        mx={4}
      >
        <ModalHeader
          color="white"
          fontSize="2xl"
          fontWeight="500"
          pb={8}
          pt={8}
          textAlign="center"
        >
          {t("Settings")}
        </ModalHeader>
        <ModalCloseButton
          color="rgba(255, 255, 255, 0.5)"
          size="lg"
          top={6}
          right={6}
          _hover={{
            color: "white",
            bg: "rgba(255, 255, 255, 0.1)",
            borderRadius: "full",
          }}
        />
        <ModalBody pb={8} px={8}>
          <VStack spacing={8} align="stretch">
            <Box>
              <Text
                color="rgba(255, 255, 255, 0.7)"
                fontSize="sm"
                fontWeight="400"
                mb={6}
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                {t("Background Image")}
              </Text>

              <VStack spacing={6} align="stretch">
                <Button
                  as="label"
                  htmlFor="background-upload"
                  size="sm"
                  variant="outline"
                  color="rgba(255, 255, 255, 0.7)"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  bg="transparent"
                  borderRadius="8px"
                  fontWeight="400"
                  alignSelf="flex-start"
                  _hover={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    bg: "rgba(255, 255, 255, 0.05)",
                  }}
                  transition="all 0.2s ease"
                  isLoading={isLoading}
                  cursor="pointer"
                  loadingText={t("Uploading...")}
                >
                  + {t("Upload Image")}
                </Button>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />

                <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
                  <Box
                    position="relative"
                    borderRadius="16px"
                    border="2px solid"
                    borderColor={
                      selectedBackground === null
                        ? "#10b981"
                        : "rgba(255, 255, 255, 0.08)"
                    }
                    bg="rgba(255, 255, 255, 0.03)"
                    h="90px"
                    cursor="pointer"
                    onClick={() => selectBackground(null)}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      borderColor:
                        selectedBackground === null
                          ? "#059669"
                          : "rgba(255, 255, 255, 0.15)",
                      bg: "rgba(255, 255, 255, 0.06)",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={
                      selectedBackground === null ? "0 0 0 1px #10b981" : "none"
                    }
                  >
                    <Text
                      color={
                        selectedBackground === null
                          ? "#10b981"
                          : "rgba(255, 255, 255, 0.5)"
                      }
                      fontSize="sm"
                      fontWeight="500"
                    >
                      {t("None")}
                    </Text>
                  </Box>

                  {backgrounds.map((bg) => (
                    <Box
                      key={bg.id}
                      position="relative"
                      borderRadius="16px"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={
                        selectedBackground === bg.id
                          ? "#10b981"
                          : "rgba(255, 255, 255, 0.08)"
                      }
                      cursor="pointer"
                      onClick={() => selectBackground(bg.id)}
                      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      _hover={{
                        borderColor:
                          selectedBackground === bg.id
                            ? "#059669"
                            : "rgba(255, 255, 255, 0.15)",
                      }}
                      h="90px"
                      boxShadow={
                        selectedBackground === bg.id
                          ? "0 0 0 1px #10b981, 0 8px 25px -8px rgba(16, 185, 129, 0.3)"
                          : "none"
                      }
                    >
                      <Image
                        src={bg.data}
                        alt="Background"
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                      <IconButton
                        aria-label="Delete background"
                        icon={<Text fontSize="12px">×</Text>}
                        size="sm"
                        position="absolute"
                        top={2}
                        right={2}
                        bg="rgba(0, 0, 0, 0.8)"
                        color="rgba(255, 255, 255, 0.7)"
                        borderRadius="full"
                        minW="24px"
                        h="24px"
                        _hover={{
                          bg: "rgba(239, 68, 68, 0.9)",
                          color: "white",
                          transform: "scale(1.1)",
                        }}
                        transition="all 0.2s ease"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBackground(bg.id);
                        }}
                      />
                    </Box>
                  ))}
                </SimpleGrid>

                {backgrounds.length === 0 && (
                  <Box
                    textAlign="center"
                    py={8}
                    px={4}
                    borderRadius="16px"
                    bg="rgba(255, 255, 255, 0.02)"
                    border="1px dashed"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Text
                      color="rgba(255, 255, 255, 0.4)"
                      fontSize="sm"
                      fontWeight="400"
                    >
                      {t("No images uploaded yet")}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export async function initializeBackground() {
  try {
    const selected = await settingsStore.getItem<string>("selectedBackground");
    if (selected) {
      const bgData = await backgroundStore.getItem<string>(selected);
      if (bgData) {
        const style = document.createElement("style");
        style.id = "custom-background-style";
        style.textContent = `
          #root {
            background-image: url(${bgData}) !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
          }
          #root::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.75);
            pointer-events: none;
          }
          [data-theme="app-container"] {
            background-color: transparent !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  } catch (error) {
    console.error("Failed to initialize background:", error);
  }
}
