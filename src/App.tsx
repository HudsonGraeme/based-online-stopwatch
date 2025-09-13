import {
  Box,
  ChakraProvider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { GlassButton } from "./components/ui/GlassButton";
import { useNavigationGestures } from "./hooks/useGestures";
import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useFullscreen } from "react-use";
import { changeLanguage, supportedLanguages } from "./i18n";
import { theme } from "./theme";
import { routes } from "./config/routes";
import ErrorPage from "./ErrorPage";
import NotFound from "./NotFound";
import SEOHead from "./components/SEOHead";
import StructuredData from "./components/StructuredData";
import {
  SettingsModal,
  initializeBackground,
} from "./components/SettingsModal";
import { useGlobalKeyboardShortcuts } from "./hooks/useGlobalKeyboardShortcuts";
import HotkeyHelpModal from "./components/HotkeyHelpModal";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currentItem =
    routes.find((item) => item.path === location.pathname) || routes[0];

  const navigateToNext = () => {
    const currentIndex = routes.findIndex(
      (route) => route.path === location.pathname
    );
    const nextIndex = (currentIndex + 1) % routes.length;
    navigate(routes[nextIndex].path);
  };

  const navigateToPrevious = () => {
    const currentIndex = routes.findIndex(
      (route) => route.path === location.pathname
    );
    const prevIndex = currentIndex === 0 ? routes.length - 1 : currentIndex - 1;
    navigate(routes[prevIndex].path);
  };

  const navigationGestures = useNavigationGestures({
    onNavigateNext: navigateToNext,
    onNavigatePrevious: navigateToPrevious,
  });

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      bg="rgba(10, 10, 10, 0.95)"
      backdropFilter="blur(20px)"
      borderBottom="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      px={6}
      py={4}
      justifyContent="space-between"
      alignItems="center"
      {...navigationGestures}
    >
      <Popover
        placement="bottom-start"
        isOpen={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
      >
        <PopoverTrigger>
          <GlassButton
            variant="primary"
            glassLevel="medium"
            borderRadius="12px"
            px={4}
            py={2}
            fontWeight="600"
            fontSize="14px"
            letterSpacing="0.25px"
            leftIcon={<Text fontSize="16px">{currentItem.icon}</Text>}
            rightIcon={<Text fontSize="12px">▼</Text>}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {t(currentItem.name)}
          </GlassButton>
        </PopoverTrigger>
        <PopoverContent
          bg="rgba(10, 10, 10, 0.95)"
          borderColor="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          maxW={{ base: "320px", sm: "400px", md: "600px" }}
          w={{ base: "320px", sm: "400px", md: "600px" }}
        >
          <PopoverBody p={{ base: 3, md: 4 }}>
            <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3}>
              {routes.map((item) => (
                <GlassButton
                  key={item.path}
                  variant={
                    location.pathname === item.path ? "primary" : "ghost"
                  }
                  glassLevel={
                    location.pathname === item.path ? "medium" : "subtle"
                  }
                  color={
                    location.pathname === item.path ? "#ffffff" : "#9ca3af"
                  }
                  borderRadius="8px"
                  p={{ base: 4, md: 3 }}
                  h="auto"
                  minH={{ base: "60px", md: "auto" }}
                  fontWeight="600"
                  fontSize={{ base: "11px", md: "12px" }}
                  letterSpacing="0.25px"
                  onClick={() => {
                    navigate(item.path);
                    setIsPopoverOpen(false);
                  }}
                >
                  <VStack spacing={1}>
                    <Text fontSize={{ base: "20px", md: "18px" }}>
                      {item.icon}
                    </Text>
                    <Text
                      fontSize={{ base: "10px", md: "11px" }}
                      textAlign="center"
                      lineHeight="1.2"
                      noOfLines={2}
                    >
                      {t(item.name)}
                    </Text>
                  </VStack>
                </GlassButton>
              ))}
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Text
        fontSize={{ base: "xs", md: "sm" }}
        color="#6b7280"
        fontFamily="system-ui, -apple-system, sans-serif"
        opacity={0.7}
        display={{ base: "none", sm: "block" }}
      >
        {t("Based Online Stopwatch")}
      </Text>
    </Flex>
  );
}

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreenEnabled, setIsFullscreenEnabled] = useState(false);
  const { t, i18n } = useTranslation();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isHotkeyHelpOpen,
    onOpen: onHotkeyHelpOpen,
    onClose: onHotkeyHelpClose,
  } = useDisclosure();

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts({
    onShowHelp: onHotkeyHelpOpen,
    onHideHelp: onHotkeyHelpClose,
  });

  // Detect if running as installed app
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://");

  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === i18n.language) ||
    supportedLanguages[0];

  useEffect(() => {
    initializeBackground();
  }, []);

  const isFullscreen = useFullscreen(
    ref as React.RefObject<Element>,
    isFullscreenEnabled
  );

  return (
    <ChakraProvider theme={theme}>
      <SEOHead />
      <StructuredData />
      <Box
        ref={ref}
        minHeight="100vh"
        width="100vw"
        bg="#0a0a0a"
        pt="80px"
        position="relative"
        display="flex"
        flexDirection="column"
        data-theme="app-container"
      >
        <Navigation />

        <Box p={{ base: 4, md: 8 }} pb={{ base: 20, md: 8 }} flex="1">
          <Suspense
            fallback={
              <Box textAlign="center" py={20}>
                <Text color="white">Loading...</Text>
              </Box>
            }
          >
            <Routes>
              {routes.map((route) => {
                const Component = route.component;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Component />}
                    errorElement={<ErrorPage />}
                  />
                );
              })}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Box>

        {/* Footer */}
        <Box
          as="footer"
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          py={{ base: 2, md: 4 }}
          px={{ base: 4, md: 8 }}
          bg="rgba(10, 10, 10, 0.95)"
          backdropFilter="blur(20px)"
          borderTop="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          zIndex={1000}
        >
          <Flex
            alignItems="center"
            w="full"
            maxW={{ base: "full", md: "none" }}
            mx={{ base: "auto", md: 0 }}
          >
            {/* Left side - Coffee emoji and FAQ/Open Source */}
            <HStack spacing={8} flex="1">
              <Text color="rgba(255, 255, 255, 0.6)" fontSize="lg">
                ●
              </Text>

              {/* FAQ and Open Source (hidden on mobile) */}
              <HStack spacing={4} display={{ base: "none", md: "flex" }}>
                <a
                  href="/faq.html"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration =
                      "underline")
                  }
                  onMouseOut={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration =
                      "none")
                  }
                >
                  {t("FAQ")}
                </a>
                <Text color="rgba(255, 255, 255, 0.6)" fontSize="sm">
                  •
                </Text>
                <a
                  href="https://github.com/yourusername/basedonlinestopwatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                  onMouseOver={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration =
                      "underline")
                  }
                  onMouseOut={(e) =>
                    ((e.target as HTMLAnchorElement).style.textDecoration =
                      "none")
                  }
                >
                  {t("Open Source")}
                </a>
              </HStack>
            </HStack>

            {/* Right side - Settings, Language and Fullscreen controls */}
            <HStack spacing={2}>
              <GlassButton
                aria-label="Settings"
                variant="primary"
                glassLevel="subtle"
                size="sm"
                borderRadius="6px"
                px={2}
                py={2}
                minW="auto"
                fontWeight="500"
                onClick={onSettingsOpen}
                _hover={{
                  transform: "rotate(90deg)",
                }}
              >
                <Text fontSize="16px">⚙</Text>
              </GlassButton>

              <Menu>
                <MenuButton
                  as={GlassButton}
                  variant="primary"
                  glassLevel="subtle"
                  size="sm"
                  borderRadius="6px"
                  px={{ base: 2, md: 3 }}
                  py={2}
                  minW="auto"
                  fontWeight="500"
                  fontSize="13px"
                >
                  <Box display={{ base: "block", md: "none" }}>🌐</Box>
                  <Box
                    display={{ base: "none", md: "flex" }}
                    alignItems="center"
                    gap={1}
                  >
                    {currentLanguage.flag} {t("Language")}
                  </Box>
                </MenuButton>
                <MenuList
                  bg="rgba(10, 10, 10, 0.95)"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(20px)"
                >
                  {supportedLanguages.map((lang) => (
                    <MenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      bg="transparent"
                      color="#f9fafb"
                      fontSize="sm"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {lang.flag} {lang.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              {!isStandalone && (
                <GlassButton
                  variant="primary"
                  glassLevel="subtle"
                  size="sm"
                  borderRadius="6px"
                  px={{ base: 2, md: 3 }}
                  py={2}
                  minW="auto"
                  fontWeight="500"
                  fontSize="13px"
                  onClick={() => setIsFullscreenEnabled(!isFullscreenEnabled)}
                >
                  <Box display={{ base: "block", md: "none" }}>
                    {isFullscreen ? "🗙" : "⛶"}
                  </Box>
                  <Box display={{ base: "none", md: "block" }}>
                    {t(isFullscreen ? "Exit Fullscreen" : "Go Fullscreen")}
                  </Box>
                </GlassButton>
              )}
            </HStack>
          </Flex>
        </Box>

        <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
        <HotkeyHelpModal
          isOpen={isHotkeyHelpOpen}
          onClose={onHotkeyHelpClose}
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;
