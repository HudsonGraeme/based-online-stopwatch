import {
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import { useFullscreen } from "react-use";
import { changeLanguage, supportedLanguages } from "./i18n";
import { theme } from "./theme";
import Countdown from "./Countdown";
import ErrorPage from "./ErrorPage";
import NotFound from "./NotFound";
import RaceTimers from "./RaceTimers";
import SEOHead from "./components/SEOHead";
import StructuredData from "./components/StructuredData";
import RandomNamePickers from "./RandomNamePickers";
import RandomNumberGenerators from "./RandomNumberGenerators";
import Stopwatch from "./Stopwatch";
import TallyCounters from "./TallyCounters";


function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { name: "Stopwatch", path: "/", icon: "⏱️" },
    { name: "Countdown", path: "/countdown", icon: "⏳" },
    { name: "Race Timers", path: "/race-timers", icon: "🏁" },
    { name: "Classroom Timers", path: "/classroom-timers", icon: "📚" },
    { name: "Holiday Timers", path: "/holiday-timers", icon: "🎄" },
    { name: "Random Name Pickers", path: "/random-name-pickers", icon: "🎯" },
    {
      name: "Random Number Generators",
      path: "/random-number-generators",
      icon: "🎲",
    },
    { name: "Sensory Timers", path: "/sensory-timers", icon: "🌈" },
    { name: "Clocks", path: "/clocks", icon: "🕐" },
    { name: "Exam Timers", path: "/exam-timers", icon: "📝" },
    { name: "Chance Games", path: "/chance-games", icon: "🎮" },
    { name: "Group Generators", path: "/group-generators", icon: "👥" },
    { name: "Presentation Timers", path: "/presentation-timers", icon: "📊" },
    { name: "Tally Counters", path: "/tally-counters", icon: "🔢" },
  ];

  const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

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
    >
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            variant="ghost"
            color="#ffffff"
            bg="rgba(255, 255, 255, 0.08)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.2)"
            borderRadius="12px"
            px={4}
            py={2}
            fontWeight="600"
            fontSize="14px"
            letterSpacing="0.25px"
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: "rgba(255, 255, 255, 0.12)",
              transform: "translateY(-1px)",
            }}
            leftIcon={<Text fontSize="16px">{currentItem.icon}</Text>}
            rightIcon={<Text fontSize="12px">▼</Text>}
          >
            {t(currentItem.name)}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          bg="rgba(10, 10, 10, 0.95)"
          borderColor="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          maxW="600px"
          w="600px"
        >
          <PopoverBody p={4}>
            <SimpleGrid columns={3} spacing={3}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  color={location.pathname === item.path ? "#ffffff" : "#9ca3af"}
                  bg={
                    location.pathname === item.path
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent"
                  }
                  border={location.pathname === item.path ? "1px solid" : "none"}
                  borderColor={
                    location.pathname === item.path
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent"
                  }
                  borderRadius="8px"
                  p={3}
                  h="auto"
                  fontWeight="600"
                  fontSize="12px"
                  letterSpacing="0.25px"
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{
                    color: "#ffffff",
                    bg: "rgba(255, 255, 255, 0.05)",
                    transform: "translateY(-1px)",
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <VStack spacing={1}>
                    <Text fontSize="18px">{item.icon}</Text>
                    <Text fontSize="11px" textAlign="center" lineHeight="1.2">
                      {t(item.name)}
                    </Text>
                  </VStack>
                </Button>
              ))}
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Text
        fontSize="sm"
        color="#6b7280"
        fontFamily="system-ui, -apple-system, sans-serif"
        opacity={0.7}
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
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];

  const isFullscreen = useFullscreen(
    ref as React.RefObject<Element>,
    isFullscreenEnabled
  );

  const toggle = () => {
    setIsFullscreenEnabled(!isFullscreenEnabled);
  };

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
      >
        <Navigation />

        <Box p={8}>
          <Routes>
            <Route
              path="/"
              element={<Stopwatch />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/countdown"
              element={<Countdown />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/race-timers"
              element={<RaceTimers />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/classroom-timers"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    📚 {t("Classroom Timers")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/holiday-timers"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    🎄 {t("Holiday Timers")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/random-name-pickers"
              element={<RandomNamePickers />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/random-number-generators"
              element={<RandomNumberGenerators />}
              errorElement={<ErrorPage />}
            />
            <Route
              path="/sensory-timers"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    🌈 {t("Sensory Timers")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/clocks"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    🕐 {t("Clocks")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/exam-timers"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    📝 {t("Exam Timers")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/chance-games"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    🎮 {t("Chance Games")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/group-generators"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    👥 {t("Group Generators")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/presentation-timers"
              element={
                <VStack spacing={4} align="center" py={20}>
                  <Text fontSize="4xl" color="white">
                    📊 {t("Presentation Timers")}
                  </Text>
                  <Text color="#9ca3af">{t("Coming soon...")}</Text>
                </VStack>
              }
            />
            <Route
              path="/tally-counters"
              element={<TallyCounters />}
              errorElement={<ErrorPage />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>

        <HStack position="fixed" bottom="6" right="6" spacing={2}>
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="ghost"
              color="#6b7280"
              bg="rgba(255, 255, 255, 0.02)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="12px"
              px={4}
              py={2}
              fontWeight="600"
              fontSize="14px"
              letterSpacing="0.25px"
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                color: "#ffffff",
                bg: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
              }}
              _active={{
                bg: "rgba(255, 255, 255, 0.12)",
                transform: "translateY(0)",
                boxShadow: "0 2px 8px rgba(255, 255, 255, 0.2)",
              }}
            >
              {currentLanguage.flag} {t("Language")}
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
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.05)"
                  }}
                >
                  {lang.flag} {lang.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          
          <Button
            onClick={toggle}
            size="sm"
            variant="ghost"
            color="#6b7280"
            bg="rgba(255, 255, 255, 0.02)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            borderRadius="12px"
            px={4}
            py={2}
            fontWeight="600"
            fontSize="14px"
            letterSpacing="0.25px"
            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              color: "#ffffff",
              bg: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(255, 255, 255, 0.3)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
            }}
            _active={{
              bg: "rgba(255, 255, 255, 0.12)",
              transform: "translateY(0)",
              boxShadow: "0 2px 8px rgba(255, 255, 255, 0.2)",
            }}
          >
            {t(isFullscreen ? "Exit Fullscreen" : "Go Fullscreen")}
          </Button>
        </HStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
