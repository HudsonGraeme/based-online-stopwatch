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
import localforage from "localforage";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useState<string[]>([
    location.pathname,
  ]);

  const currentItem =
    routes.find((item) => item.path === location.pathname) || routes[0];

  useEffect(() => {
    localforage.getItem<string[]>("visitedRoutes").then((saved) => {
      if (saved && saved.length > 0) {
        setVisitedRoutes(saved);
      }
    });
  }, []);

  useEffect(() => {
    setVisitedRoutes((prev) => {
      if (prev[prev.length - 1] === location.pathname) return prev;

      const filtered = prev.filter((path) => path !== location.pathname);
      const newVisited = [...filtered, location.pathname];
      return newVisited.slice(-3);
    });
  }, [location.pathname]);

  useEffect(() => {
    localforage.setItem("visitedRoutes", visitedRoutes);
  }, [visitedRoutes]);

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
      pt={4}
      pb={0}
      h="72px"
      justifyContent="space-between"
      alignItems="flex-end"
      {...navigationGestures}
    >
      <Flex gap={4} flex="1" h="full">
        <Flex alignItems="center" h="full">
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
                minW={{ base: "auto", md: "12rem" }}
                fontWeight="600"
                fontSize="14px"
                letterSpacing="-0.01em"
                leftIcon={<currentItem.icon size={16} strokeWidth={2.5} />}
                rightIcon={
                  <Text
                    fontSize="10px"
                    transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    transform={
                      isPopoverOpen ? "rotate(180deg)" : "rotate(0deg)"
                    }
                  >
                    ▼
                  </Text>
                }
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                {t(currentItem.name)}
              </GlassButton>
            </PopoverTrigger>
            <PopoverContent
              bg="rgba(18, 18, 18, 0.92)"
              borderColor="rgba(255, 255, 255, 0.08)"
              backdropFilter="blur(40px) saturate(150%)"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)"
              borderRadius="16px"
              maxW={{ base: "320px", sm: "400px", md: "600px" }}
              w={{ base: "320px", sm: "400px", md: "600px" }}
              overflow="hidden"
            >
              <PopoverBody p={{ base: 4, md: 6 }}>
                <SimpleGrid
                  columns={{ base: 2, sm: 3 }}
                  spacing={{ base: 2, md: 3 }}
                >
                  {routes.map((item, index) => (
                    <GlassButton
                      key={item.path}
                      variant={
                        location.pathname === item.path ? "primary" : "ghost"
                      }
                      glassLevel="subtle"
                      bg={
                        location.pathname === item.path
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(255, 255, 255, 0.02)"
                      }
                      color={
                        location.pathname === item.path
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.7)"
                      }
                      borderRadius="12px"
                      border="1px solid"
                      borderColor={
                        location.pathname === item.path
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(255, 255, 255, 0.06)"
                      }
                      p={{ base: 4, md: 4 }}
                      h="auto"
                      minH={{ base: "80px", md: "90px" }}
                      fontWeight="500"
                      fontSize={{ base: "13px", md: "13px" }}
                      letterSpacing="-0.01em"
                      onClick={() => {
                        navigate(item.path);
                        setIsPopoverOpen(false);
                      }}
                      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      _hover={{
                        bg:
                          location.pathname === item.path
                            ? "rgba(255, 255, 255, 0.15)"
                            : "rgba(255, 255, 255, 0.06)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                      }}
                      _active={{
                        transform: "scale(0.98)",
                      }}
                      opacity={0}
                      animation={
                        isPopoverOpen
                          ? `fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.03}s forwards`
                          : undefined
                      }
                      sx={{
                        "@keyframes fadeInUp": {
                          "0%": {
                            opacity: 0,
                            transform: "translateY(8px)",
                          },
                          "100%": {
                            opacity: 1,
                            transform: "translateY(0)",
                          },
                        },
                      }}
                    >
                      <VStack spacing={3}>
                        <Box
                          color={
                            location.pathname === item.path
                              ? "rgba(255, 255, 255, 0.95)"
                              : "rgba(255, 255, 255, 0.6)"
                          }
                          transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                          <item.icon size={28} strokeWidth={1.5} />
                        </Box>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          textAlign="center"
                          lineHeight="1.3"
                          noOfLines={2}
                          fontWeight={
                            location.pathname === item.path ? "600" : "500"
                          }
                          opacity={location.pathname === item.path ? 1 : 0.85}
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
        </Flex>

        <Flex
          h="full"
          alignItems="flex-end"
          display={{ base: "none", md: "flex" }}
        >
          <HStack spacing={0.5}>
            {visitedRoutes.map((routePath, index) => {
              const routeItem = routes.find((r) => r.path === routePath);
              if (!routeItem) return null;

              const isActive = routePath === location.pathname;

              return (
                <Flex
                  key={`${routePath}-${index}`}
                  bg={
                    isActive
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(255, 255, 255, 0.04)"
                  }
                  borderTop="1px solid"
                  borderLeft="1px solid"
                  borderRight="1px solid"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  px={3}
                  py={2}
                  alignItems="center"
                  gap={2}
                  minW="120px"
                  maxW="160px"
                  position="relative"
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    bg: isActive
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 0.06)",
                  }}
                  _before={{
                    content: '""',
                    position: "absolute",
                    bottom: "-1px",
                    left: 0,
                    right: 0,
                    height: "1px",
                    bg: isActive ? "rgba(10, 10, 10, 0.95)" : "transparent",
                    zIndex: 2,
                  }}
                >
                  <Box
                    color={
                      isActive
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.5)"
                    }
                    transition="color 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    cursor="pointer"
                    onClick={() => navigate(routePath)}
                  >
                    <routeItem.icon size={14} strokeWidth={2} />
                  </Box>
                  <Text
                    fontSize="12px"
                    fontWeight={isActive ? "600" : "500"}
                    color={
                      isActive
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.5)"
                    }
                    letterSpacing="-0.01em"
                    noOfLines={1}
                    flex="1"
                    cursor="pointer"
                    onClick={() => navigate(routePath)}
                  >
                    {t(routeItem.name)}
                  </Text>
                  <Box
                    color="rgba(255, 255, 255, 0.4)"
                    cursor="pointer"
                    transition="color 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisitedRoutes((prev) =>
                        prev.filter((p) => p !== routePath)
                      );
                    }}
                    fontSize="10px"
                    lineHeight="1"
                  >
                    ✕
                  </Box>
                </Flex>
              );
            })}
          </HStack>
        </Flex>
      </Flex>
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
        bg="transparent"
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
