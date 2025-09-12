import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";

interface TimeZone {
  id: string;
  name: string;
  timezone: string;
  flag: string;
  utcOffset: string;
}

interface ClockDisplay {
  timezone: TimeZone;
  time: Date;
}

const Clocks = () => {
  const { t, i18n } = useTranslation();
  const [clocks, setClocks] = useState<ClockDisplay[]>([]);
  const [availableTimezones] = useState<TimeZone[]>([
    {
      id: "utc",
      name: "UTC",
      timezone: "UTC",
      flag: "🌍",
      utcOffset: "+00:00",
    },
    {
      id: "ny",
      name: "New York",
      timezone: "America/New_York",
      flag: "🇺🇸",
      utcOffset: "-05:00",
    },
    {
      id: "la",
      name: "Los Angeles",
      timezone: "America/Los_Angeles",
      flag: "🇺🇸",
      utcOffset: "-08:00",
    },
    {
      id: "london",
      name: "London",
      timezone: "Europe/London",
      flag: "🇬🇧",
      utcOffset: "+00:00",
    },
    {
      id: "paris",
      name: "Paris",
      timezone: "Europe/Paris",
      flag: "🇫🇷",
      utcOffset: "+01:00",
    },
    {
      id: "berlin",
      name: "Berlin",
      timezone: "Europe/Berlin",
      flag: "🇩🇪",
      utcOffset: "+01:00",
    },
    {
      id: "moscow",
      name: "Moscow",
      timezone: "Europe/Moscow",
      flag: "🇷🇺",
      utcOffset: "+03:00",
    },
    {
      id: "dubai",
      name: "Dubai",
      timezone: "Asia/Dubai",
      flag: "🇦🇪",
      utcOffset: "+04:00",
    },
    {
      id: "mumbai",
      name: "Mumbai",
      timezone: "Asia/Kolkata",
      flag: "🇮🇳",
      utcOffset: "+05:30",
    },
    {
      id: "singapore",
      name: "Singapore",
      timezone: "Asia/Singapore",
      flag: "🇸🇬",
      utcOffset: "+08:00",
    },
    {
      id: "tokyo",
      name: "Tokyo",
      timezone: "Asia/Tokyo",
      flag: "🇯🇵",
      utcOffset: "+09:00",
    },
    {
      id: "sydney",
      name: "Sydney",
      timezone: "Australia/Sydney",
      flag: "🇦🇺",
      utcOffset: "+11:00",
    },
    {
      id: "auckland",
      name: "Auckland",
      timezone: "Pacific/Auckland",
      flag: "🇳🇿",
      utcOffset: "+13:00",
    },
    {
      id: "toronto",
      name: "Toronto",
      timezone: "America/Toronto",
      flag: "🇨🇦",
      utcOffset: "-05:00",
    },
    {
      id: "vancouver",
      name: "Vancouver",
      timezone: "America/Vancouver",
      flag: "🇨🇦",
      utcOffset: "-08:00",
    },
    {
      id: "mexico",
      name: "Mexico City",
      timezone: "America/Mexico_City",
      flag: "🇲🇽",
      utcOffset: "-06:00",
    },
    {
      id: "sao_paulo",
      name: "São Paulo",
      timezone: "America/Sao_Paulo",
      flag: "🇧🇷",
      utcOffset: "-03:00",
    },
    {
      id: "buenos_aires",
      name: "Buenos Aires",
      timezone: "America/Argentina/Buenos_Aires",
      flag: "🇦🇷",
      utcOffset: "-03:00",
    },
    {
      id: "cairo",
      name: "Cairo",
      timezone: "Africa/Cairo",
      flag: "🇪🇬",
      utcOffset: "+02:00",
    },
    {
      id: "lagos",
      name: "Lagos",
      timezone: "Africa/Lagos",
      flag: "🇳🇬",
      utcOffset: "+01:00",
    },
    {
      id: "cape_town",
      name: "Cape Town",
      timezone: "Africa/Johannesburg",
      flag: "🇿🇦",
      utcOffset: "+02:00",
    },
    {
      id: "bangkok",
      name: "Bangkok",
      timezone: "Asia/Bangkok",
      flag: "🇹🇭",
      utcOffset: "+07:00",
    },
    {
      id: "seoul",
      name: "Seoul",
      timezone: "Asia/Seoul",
      flag: "🇰🇷",
      utcOffset: "+09:00",
    },
    {
      id: "beijing",
      name: "Beijing",
      timezone: "Asia/Shanghai",
      flag: "🇨🇳",
      utcOffset: "+08:00",
    },
  ]);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [is24Hour, setIs24Hour] = useState(true);

  // Load persisted state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const saved = await localforage.getItem("clocksState");
        if (saved && typeof saved === "object") {
          const state = saved as {
            clockTimezones?: string[];
            is24Hour?: boolean;
          };

          // Restore clock preference
          if (typeof state.is24Hour === "boolean") {
            setIs24Hour(state.is24Hour);
          }

          // Restore clocks
          if (state.clockTimezones && Array.isArray(state.clockTimezones)) {
            const restoredClocks = state.clockTimezones
              .map((id) => availableTimezones.find((tz) => tz.id === id))
              .filter(Boolean)
              .map((tz) => ({
                timezone: tz!,
                time: new Date(),
              }));

            if (restoredClocks.length > 0) {
              setClocks(restoredClocks);
              return; // Exit early if we restored clocks
            }
          }
        }
      } catch (error) {
        console.error("Failed to load clocks state:", error);
      }

      // Fallback to default clocks if no saved state
      const defaultTimezones = [
        availableTimezones.find((tz) => tz.id === "utc")!,
        availableTimezones.find((tz) => tz.id === "ny")!,
        availableTimezones.find((tz) => tz.id === "london")!,
        availableTimezones.find((tz) => tz.id === "tokyo")!,
      ];

      setClocks(
        defaultTimezones.map((tz) => ({
          timezone: tz,
          time: new Date(),
        }))
      );
    };

    loadState();
  }, [availableTimezones]);

  // Update all clocks every second
  useEffect(() => {
    const interval = setInterval(() => {
      setClocks((prevClocks) =>
        prevClocks.map((clock) => ({
          ...clock,
          time: new Date(),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save state when clocks or preferences change
  useEffect(() => {
    const saveState = async () => {
      try {
        await localforage.setItem("clocksState", {
          clockTimezones: clocks.map((clock) => clock.timezone.id),
          is24Hour,
        });
      } catch (error) {
        console.error("Failed to save clocks state:", error);
      }
    };

    if (clocks.length > 0) {
      saveState();
    }
  }, [clocks, is24Hour]);

  const addClock = () => {
    const timezone = availableTimezones.find(
      (tz) => tz.id === selectedTimezone
    );
    if (
      timezone &&
      !clocks.find((clock) => clock.timezone.id === timezone.id)
    ) {
      setClocks((prev) => [
        ...prev,
        {
          timezone,
          time: new Date(),
        },
      ]);
      onAddClose();
      setSelectedTimezone("");
    }
  };

  const removeClock = (timezoneId: string) => {
    setClocks((prev) =>
      prev.filter((clock) => clock.timezone.id !== timezoneId)
    );
  };

  const formatTime = (time: Date, timezone: string, is24Hour: boolean) => {
    try {
      const locale = i18n.language || "en-US";
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !is24Hour,
      };
      return time.toLocaleTimeString(locale, options);
    } catch (error) {
      return "00:00:00";
    }
  };

  const formatDate = (time: Date, timezone: string) => {
    try {
      const locale = i18n.language || "en-US";
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return time.toLocaleDateString(locale, options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const periods = useMemo(
    () => ({
      morning: { period: t("morning"), icon: "🌅", color: "orange" as const },
      afternoon: {
        period: t("afternoon"),
        icon: "☀️",
        color: "yellow" as const,
      },
      evening: { period: t("evening"), icon: "🌆", color: "purple" as const },
      night: { period: t("night"), icon: "🌙", color: "blue" as const },
      unknown: { period: t("unknown"), icon: "🕐", color: "gray" as const },
    }),
    [t]
  );

  const getTimeOfDay = (time: Date, timezone: string) => {
    try {
      const locale = i18n.language || "en-US";
      const hour = parseInt(
        time.toLocaleTimeString(locale, {
          timeZone: timezone,
          hour: "2-digit",
          hour12: false,
        })
      );

      if (hour >= 6 && hour < 12) return periods.morning;
      if (hour >= 12 && hour < 17) return periods.afternoon;
      if (hour >= 17 && hour < 20) return periods.evening;
      return periods.night;
    } catch (error) {
      return periods.unknown;
    }
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        pt: "100px",
        pb: "120px",
        overflowY: "auto",
      }}
    >
      <VStack spacing={8} maxW="1200px" w="100%" px={4}>
        {/* Header */}
        <VStack spacing={4}>
          <Text fontSize="3xl" fontWeight="700" color="white">
            🕐 {t("worldClocks")}
          </Text>
          <Text color="#9ca3af" fontSize="lg">
            {t("description")}
          </Text>

          {/* Controls */}
          <HStack spacing={4}>
            <Button
              onClick={onAddOpen}
              colorScheme="blue"
              size="sm"
              leftIcon={<Text>+</Text>}
            >
              {t("addClock")}
            </Button>

            <Button
              onClick={() => setIs24Hour(!is24Hour)}
              variant="outline"
              size="sm"
              color="white"
              borderColor="rgba(255, 255, 255, 0.3)"
              _hover={{
                bg: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {t(is24Hour ? "format12Hour" : "format24Hour")}
            </Button>
          </HStack>
        </VStack>

        {/* Clock Grid */}
        {clocks.length > 0 ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={6}
            w="100%"
            maxW="1000px"
          >
            {clocks.map((clock) => {
              const timeOfDay = getTimeOfDay(
                clock.time,
                clock.timezone.timezone
              );
              return (
                <Box
                  key={clock.timezone.id}
                  bg="rgba(255, 255, 255, 0.02)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="16px"
                  p={6}
                  position="relative"
                  transition="all 0.2s"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.05)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-2px)",
                  }}
                >
                  {/* Remove Button */}
                  {clocks.length > 1 && (
                    <IconButton
                      position="absolute"
                      top={2}
                      right={2}
                      size="xs"
                      variant="ghost"
                      color="gray.400"
                      aria-label={t("removeClock")}
                      icon={<Text fontSize="sm">×</Text>}
                      onClick={() => removeClock(clock.timezone.id)}
                      _hover={{
                        color: "red.400",
                        bg: "rgba(255, 0, 0, 0.1)",
                      }}
                    />
                  )}

                  <VStack spacing={4}>
                    {/* Location Header */}
                    <HStack spacing={3}>
                      <Text fontSize="2xl">{clock.timezone.flag}</Text>
                      <VStack spacing={0}>
                        <Text
                          fontSize="lg"
                          fontWeight="600"
                          color="white"
                          lineHeight="1.2"
                        >
                          {t(`city.${clock.timezone.id}`)}
                        </Text>
                        <Badge
                          colorScheme={timeOfDay.color}
                          size="sm"
                          borderRadius="full"
                        >
                          {timeOfDay.icon} {timeOfDay.period}
                        </Badge>
                      </VStack>
                    </HStack>

                    <Divider borderColor="rgba(255, 255, 255, 0.1)" />

                    {/* Time Display */}
                    <VStack spacing={2}>
                      <Text
                        fontSize={{ base: "3xl", md: "4xl" }}
                        fontFamily="monospace"
                        fontWeight="bold"
                        color="white"
                        letterSpacing="wider"
                      >
                        {formatTime(
                          clock.time,
                          clock.timezone.timezone,
                          is24Hour
                        )}
                      </Text>

                      <Text
                        fontSize="sm"
                        color="gray.400"
                        textAlign="center"
                        lineHeight="1.3"
                      >
                        {formatDate(clock.time, clock.timezone.timezone)}
                      </Text>

                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontFamily="monospace"
                      >
                        {t("utc")}
                        {clock.timezone.utcOffset}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <VStack spacing={4}>
            <Text color="#9ca3af" fontSize="lg">
              {t("noClocksAdded")}
            </Text>
            <Button onClick={onAddOpen} colorScheme="blue">
              {t("addFirstClock")}
            </Button>
          </VStack>
        )}

        {/* Quick Add Popular Cities */}
        {clocks.length > 0 && (
          <VStack spacing={4} w="100%">
            <Text color="gray.400" fontSize="md">
              {t("quickAddPopular")}
            </Text>
            <Flex wrap="wrap" gap={2} justify="center">
              {availableTimezones
                .filter(
                  (tz) => !clocks.find((clock) => clock.timezone.id === tz.id)
                )
                .slice(0, 8)
                .map((timezone) => (
                  <Button
                    key={timezone.id}
                    size="sm"
                    variant="outline"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    }}
                    onClick={() => {
                      setClocks((prev) => [
                        ...prev,
                        {
                          timezone,
                          time: new Date(),
                        },
                      ]);
                    }}
                  >
                    {timezone.flag} {t(`city.${timezone.id}`)}
                  </Button>
                ))}
            </Flex>
          </VStack>
        )}
      </VStack>

      {/* Add Clock Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent
          bg="gray.900"
          color="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <ModalHeader fontSize="lg" fontWeight="600">
            🕐 {t("addNewClock")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text fontSize="sm" color="gray.400">
                {t("chooseTimezone")}
              </Text>

              <Select
                placeholder={t("selectTimezone")}
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _focus={{
                  borderColor: "blue.400",
                  bg: "whiteAlpha.100",
                }}
              >
                {availableTimezones
                  .filter(
                    (tz) => !clocks.find((clock) => clock.timezone.id === tz.id)
                  )
                  .map((timezone) => (
                    <option
                      key={timezone.id}
                      value={timezone.id}
                      style={{ backgroundColor: "#1a202c", color: "white" }}
                    >
                      {timezone.flag} {t(`city.${timezone.id}`)} (UTC
                      {timezone.utcOffset})
                    </option>
                  ))}
              </Select>

              <HStack spacing={3} w="100%">
                <Button onClick={onAddClose} variant="ghost" flex={1}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={addClock}
                  colorScheme="blue"
                  flex={1}
                  isDisabled={
                    !selectedTimezone ||
                    Boolean(
                      clocks.find(
                        (clock) => clock.timezone.id === selectedTimezone
                      )
                    )
                  }
                >
                  {t("addClock")}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Clocks;
