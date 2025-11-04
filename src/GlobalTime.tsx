import {
  Box,
  Flex,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Badge,
  Checkbox,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Wrap,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect, useMemo } from "react";
import { format, toZonedTime } from "date-fns-tz";
import { isSameDay } from "date-fns";
import "leaflet/dist/leaflet.css";
import terminator from "@joergdietrich/leaflet.terminator";
import { GlassButton } from "./components/ui/GlassButton";

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface SelectedLocation extends Location {
  currentTime: Date;
}

const MAJOR_CITIES = [
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.006,
    timezone: "America/New_York",
  },
  { name: "London", lat: 51.5074, lng: -0.1278, timezone: "Europe/London" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, timezone: "Asia/Tokyo" },
  {
    name: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    timezone: "Australia/Sydney",
  },
  {
    name: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    timezone: "America/Los_Angeles",
  },
  { name: "Paris", lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, timezone: "Asia/Dubai" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, timezone: "Asia/Singapore" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Toronto", lat: 43.6532, lng: -79.3832, timezone: "America/Toronto" },
  { name: "Berlin", lat: 52.52, lng: 13.405, timezone: "Europe/Berlin" },
  {
    name: "Mexico City",
    lat: 19.4326,
    lng: -99.1332,
    timezone: "America/Mexico_City",
  },
  {
    name: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
    timezone: "America/Sao_Paulo",
  },
  {
    name: "Hong Kong",
    lat: 22.3193,
    lng: 114.1694,
    timezone: "Asia/Hong_Kong",
  },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, timezone: "Asia/Shanghai" },
];

const customMarkerIcon = new Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3Cfilter id='shadow' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceAlpha' stdDeviation='2'/%3E%3CfeOffset dx='0' dy='1' result='offsetblur'/%3E%3CfeFlood flood-color='%23000000' flood-opacity='0.3'/%3E%3CfeComposite in2='offsetblur' operator='in'/%3E%3CfeMerge%3E%3CfeMergeNode/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Ccircle cx='12' cy='12' r='8' fill='%230066FF' filter='url(%23shadow)'/%3E%3Ccircle cx='12' cy='12' r='3' fill='%23ffffff'/%3E%3C/svg%3E",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DayNightTerminator({ currentTime }: { currentTime: Date }) {
  const map = useMap();

  useEffect(() => {
    const terminatorLayer = terminator({
      time: currentTime,
      fillColor: "#000033",
      fillOpacity: 0.5,
      weight: 0,
    });

    terminatorLayer.addTo(map);

    return () => {
      terminatorLayer.remove();
    };
  }, [map, currentTime]);

  return null;
}

function getTimezoneFromCoords(lat: number, lng: number): string {
  const city = MAJOR_CITIES.reduce((closest, city) => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    const closestDistance = Math.sqrt(
      Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2)
    );
    return distance < closestDistance ? city : closest;
  });
  return city.timezone;
}

function getCityNameFromCoords(lat: number, lng: number): string {
  const city = MAJOR_CITIES.reduce((closest, city) => {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
    );
    const closestDistance = Math.sqrt(
      Math.pow(closest.lat - lat, 2) + Math.pow(closest.lng - lng, 2)
    );
    return distance < closestDistance ? city : closest;
  });
  return city.name;
}

function isBusinessHours(
  date: Date,
  startHour: number,
  endHour: number,
  includeSaturday: boolean,
  includeSunday: boolean
): boolean {
  const hour = date.getHours();
  const day = date.getDay();

  const isWeekday = day >= 1 && day <= 5;
  const isSaturday = day === 6;
  const isSunday = day === 0;

  const isValidDay =
    isWeekday || (isSaturday && includeSaturday) || (isSunday && includeSunday);

  return isValidDay && hour >= startHour && hour < endHour;
}

const GlobalTime = () => {
  const [selectedLocations, setSelectedLocations] = useState<
    SelectedLocation[]
  >([]);
  const [baseTime, setBaseTime] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [businessHoursStart, setBusinessHoursStart] = useState(9);
  const [businessHoursEnd, setBusinessHoursEnd] = useState(17);
  const [includeSaturday, setIncludeSaturday] = useState(false);
  const [includeSunday, setIncludeSunday] = useState(false);
  const [isLiveNow, setIsLiveNow] = useState(true);

  const formattedTimesText = useMemo(() => {
    if (selectedLocations.length === 0) return "";
    return selectedLocations
      .map(
        (loc) =>
          `${loc.name}: ${format(loc.currentTime, "h:mm a, EEEE, MMMM d", { timeZone: loc.timezone })}`
      )
      .join("\n");
  }, [selectedLocations]);

  const { onCopy, hasCopied } = useClipboard(formattedTimesText);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return [];
    return MAJOR_CITIES.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const handleMapClick = (lat: number, lng: number) => {
    const timezone = getTimezoneFromCoords(lat, lng);
    const name = getCityNameFromCoords(lat, lng);
    const id = `${lat}-${lng}-${Date.now()}`;

    const newLocation: SelectedLocation = {
      id,
      name,
      lat,
      lng,
      timezone,
      currentTime: toZonedTime(baseTime, timezone),
    };

    setSelectedLocations((prev) => [...prev, newLocation]);
    setSearchQuery("");
  };

  const handleCitySelect = (city: (typeof MAJOR_CITIES)[0]) => {
    const id = `${city.lat}-${city.lng}-${Date.now()}`;
    const newLocation: SelectedLocation = {
      id,
      name: city.name,
      lat: city.lat,
      lng: city.lng,
      timezone: city.timezone,
      currentTime: toZonedTime(baseTime, city.timezone),
    };

    setSelectedLocations((prev) => [...prev, newLocation]);
    setSearchQuery("");
  };

  const removeLocation = (id: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const updateTimeFromSlider = (hours: number) => {
    const newTime = new Date(baseTime);
    newTime.setHours(hours, 0, 0, 0);
    setBaseTime(newTime);
    setIsLiveNow(false);
  };

  const resetToNow = () => {
    setBaseTime(new Date());
    setIsLiveNow(true);
  };

  const setToTomorrow9AM = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setBaseTime(tomorrow);
    setIsLiveNow(false);
  };

  const setToNextMonday2PM = () => {
    const next = new Date();
    const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(14, 0, 0, 0);
    setBaseTime(next);
    setIsLiveNow(false);
  };

  const currentHour = baseTime.getHours() + baseTime.getMinutes() / 60;

  useEffect(() => {
    setSelectedLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        currentTime: toZonedTime(baseTime, loc.timezone),
      }))
    );
  }, [baseTime]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pt: "80px",
        pb: "40px",
      }}
    >
      <Flex direction={{ base: "column", lg: "row" }} h="100%" gap={0}>
        <Box
          flex={{ base: "none", lg: "3" }}
          h={{ base: "60%", lg: "100%" }}
          position="relative"
        >
          <VStack
            position="absolute"
            top={6}
            left="50%"
            transform="translateX(-50%)"
            zIndex={1000}
            w="90%"
            maxW="560px"
            spacing={2}
          >
            <Input
              placeholder="Search cities worldwide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="rgba(18, 18, 18, 0.92)"
              backdropFilter="blur(20px) saturate(180%)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              borderRadius="12px"
              color="white"
              fontSize="15px"
              h="48px"
              px={5}
              fontWeight="500"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)"
              _placeholder={{ color: "rgba(255, 255, 255, 0.4)" }}
              _focus={{
                outline: "none",
                bg: "rgba(18, 18, 18, 0.95)",
                borderColor: "#0066FF",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(0, 102, 255, 0.2)",
              }}
              transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            />

            {selectedLocations.length > 0 && (
              <VStack
                w="100%"
                spacing={3}
                bg="rgba(18, 18, 18, 0.92)"
                backdropFilter="blur(20px) saturate(180%)"
                borderRadius="12px"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.08)"
                p={4}
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)"
              >
                <HStack w="100%" justify="space-between" align="center">
                  <Text
                    fontSize="12px"
                    color="rgba(255, 255, 255, 0.5)"
                    fontWeight="500"
                    textTransform="uppercase"
                    letterSpacing="0.5px"
                  >
                    Time
                  </Text>
                  <Text fontSize="14px" color="white" fontWeight="600">
                    {format(baseTime, "h:mm a")}
                  </Text>
                </HStack>
                <Slider
                  value={currentHour}
                  min={0}
                  max={24}
                  step={0.25}
                  onChange={updateTimeFromSlider}
                >
                  <SliderTrack
                    bg="rgba(255, 255, 255, 0.1)"
                    h="6px"
                    borderRadius="full"
                  >
                    <SliderFilledTrack bg="#0066FF" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={5}
                    bg="white"
                    border="2px solid"
                    borderColor="#0066FF"
                  />
                </Slider>
                <HStack
                  w="100%"
                  justify="space-between"
                  fontSize="11px"
                  color="rgba(255, 255, 255, 0.4)"
                  fontWeight="500"
                >
                  <Text>12 AM</Text>
                  <Text>6 AM</Text>
                  <Text>12 PM</Text>
                  <Text>6 PM</Text>
                  <Text>12 AM</Text>
                </HStack>
                <Wrap spacing={2} justify="center">
                  <GlassButton
                    onClick={resetToNow}
                    variant={isLiveNow ? "primary" : "secondary"}
                    glassLevel="subtle"
                    size="xs"
                    fontSize="12px"
                    px={3}
                  >
                    {isLiveNow ? "● Live Now" : "Now"}
                  </GlassButton>
                  <GlassButton
                    onClick={setToTomorrow9AM}
                    variant="secondary"
                    glassLevel="subtle"
                    size="xs"
                    fontSize="12px"
                    px={3}
                  >
                    Tomorrow 9 AM
                  </GlassButton>
                  <GlassButton
                    onClick={setToNextMonday2PM}
                    variant="secondary"
                    glassLevel="subtle"
                    size="xs"
                    fontSize="12px"
                    px={3}
                  >
                    Next Mon 2 PM
                  </GlassButton>
                </Wrap>
              </VStack>
            )}

            {filteredCities.length > 0 && (
              <VStack
                w="100%"
                bg="rgba(18, 18, 18, 0.95)"
                backdropFilter="blur(20px) saturate(180%)"
                borderRadius="12px"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.08)"
                spacing={0}
                maxH="240px"
                overflowY="auto"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)"
              >
                {filteredCities.map((city, idx) => (
                  <Box
                    key={city.name}
                    w="100%"
                    px={5}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: "rgba(0, 102, 255, 0.15)" }}
                    onClick={() => handleCitySelect(city)}
                    borderBottom={
                      idx < filteredCities.length - 1 ? "1px solid" : "none"
                    }
                    borderColor="rgba(255, 255, 255, 0.06)"
                    transition="background 0.15s ease"
                  >
                    <Text color="white" fontSize="15px" fontWeight="500">
                      {city.name}
                    </Text>
                    <Text
                      color="rgba(255, 255, 255, 0.5)"
                      fontSize="13px"
                      mt={0.5}
                    >
                      {city.timezone}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>

          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
            zoomControl={false}
            worldCopyJump={false}
            maxBounds={undefined}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              noWrap={false}
            />
            <DayNightTerminator currentTime={baseTime} />
            <MapClickHandler onMapClick={handleMapClick} />
            {selectedLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={customMarkerIcon}
              >
                <Popup>
                  <VStack spacing={1} align="start">
                    <Text fontWeight="bold">{loc.name}</Text>
                    <Text fontSize="sm">
                      {format(loc.currentTime, "HH:mm:ss", {
                        timeZone: loc.timezone,
                      })}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {format(loc.currentTime, "EEE, MMM d", {
                        timeZone: loc.timezone,
                      })}
                    </Text>
                  </VStack>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>

        <Box
          flex={{ base: "none", lg: "1" }}
          h={{ base: "40%", lg: "100%" }}
          bg="linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(12, 12, 12, 0.98) 100%)"
          backdropFilter="blur(40px)"
          overflowY="auto"
          p={6}
        >
          <VStack spacing={6} align="stretch" h="100%">
            <Text
              fontSize="20px"
              fontWeight="600"
              color="white"
              letterSpacing="-0.3px"
            >
              Locations
            </Text>

            <Box
              p={4}
              bg="rgba(255, 255, 255, 0.02)"
              borderRadius="14px"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.06)"
            >
              <Text
                fontSize="13px"
                color="rgba(255, 255, 255, 0.6)"
                mb={3}
                fontWeight="500"
                letterSpacing="0.3px"
                textTransform="uppercase"
              >
                Working Hours
              </Text>
              <HStack spacing={3} mb={3}>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={businessHoursStart}
                  onChange={(e) =>
                    setBusinessHoursStart(Number(e.target.value))
                  }
                  size="sm"
                  w="68px"
                  h="36px"
                  bg="rgba(255, 255, 255, 0.04)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  borderRadius="8px"
                  color="white"
                  fontSize="15px"
                  fontWeight="500"
                  textAlign="center"
                  _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}
                  _focus={{
                    borderColor: "#0066FF",
                    boxShadow: "0 0 0 3px rgba(0, 102, 255, 0.15)",
                    outline: "none",
                  }}
                  transition="all 0.15s ease"
                />
                <Text
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="14px"
                  fontWeight="500"
                >
                  —
                </Text>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={businessHoursEnd}
                  onChange={(e) => setBusinessHoursEnd(Number(e.target.value))}
                  size="sm"
                  w="68px"
                  h="36px"
                  bg="rgba(255, 255, 255, 0.04)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  borderRadius="8px"
                  color="white"
                  fontSize="15px"
                  fontWeight="500"
                  textAlign="center"
                  _hover={{ bg: "rgba(255, 255, 255, 0.06)" }}
                  _focus={{
                    borderColor: "#0066FF",
                    boxShadow: "0 0 0 3px rgba(0, 102, 255, 0.15)",
                    outline: "none",
                  }}
                  transition="all 0.15s ease"
                />
              </HStack>
              <HStack spacing={4}>
                <Checkbox
                  isChecked={includeSaturday}
                  onChange={(e) => setIncludeSaturday(e.target.checked)}
                  size="sm"
                  colorScheme="blue"
                >
                  <Text
                    fontSize="14px"
                    color="rgba(255, 255, 255, 0.7)"
                    fontWeight="500"
                  >
                    Saturday
                  </Text>
                </Checkbox>
                <Checkbox
                  isChecked={includeSunday}
                  onChange={(e) => setIncludeSunday(e.target.checked)}
                  size="sm"
                  colorScheme="blue"
                >
                  <Text
                    fontSize="14px"
                    color="rgba(255, 255, 255, 0.7)"
                    fontWeight="500"
                  >
                    Sunday
                  </Text>
                </Checkbox>
              </HStack>
            </Box>

            {selectedLocations.length === 0 ? (
              <VStack
                spacing={4}
                justify="center"
                flex={1}
                color="rgba(255, 255, 255, 0.3)"
              >
                <Box fontSize="48px" opacity={0.6}>
                  🌍
                </Box>
                <VStack spacing={2}>
                  <Text
                    textAlign="center"
                    fontSize="15px"
                    fontWeight="500"
                    color="rgba(255, 255, 255, 0.6)"
                  >
                    No locations selected
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="13px"
                    color="rgba(255, 255, 255, 0.4)"
                    maxW="240px"
                    lineHeight="1.5"
                  >
                    Click the map or search to add locations and find optimal
                    meeting times
                  </Text>
                </VStack>
              </VStack>
            ) : (
              <VStack spacing={3} align="stretch">
                {selectedLocations.length > 0 && (
                  <HStack justify="flex-end">
                    <Tooltip
                      label={hasCopied ? "Copied!" : "Copy all times"}
                      placement="left"
                    >
                      <GlassButton
                        onClick={onCopy}
                        variant="secondary"
                        glassLevel="subtle"
                        size="xs"
                        fontSize="12px"
                        px={3}
                      >
                        {hasCopied ? "✓ Copied" : "Copy Times"}
                      </GlassButton>
                    </Tooltip>
                  </HStack>
                )}
                {selectedLocations.map((loc, idx) => {
                  const inBusinessHours = isBusinessHours(
                    loc.currentTime,
                    businessHoursStart,
                    businessHoursEnd,
                    includeSaturday,
                    includeSunday
                  );
                  const hour = loc.currentTime.getHours();
                  const isNight = hour < 6 || hour >= 20;
                  const referenceTime = selectedLocations[0].currentTime;
                  const hoursDiff = Math.round(
                    (loc.currentTime.getTime() - referenceTime.getTime()) /
                      (1000 * 60 * 60)
                  );
                  const isDifferentDay = !isSameDay(
                    loc.currentTime,
                    referenceTime
                  );
                  const dayLabel = isDifferentDay
                    ? loc.currentTime > referenceTime
                      ? "Tomorrow"
                      : "Yesterday"
                    : null;

                  return (
                    <Box
                      key={loc.id}
                      p={4}
                      bg={`linear-gradient(135deg, ${isNight ? "rgba(10, 10, 30, 0.6)" : "rgba(20, 35, 50, 0.4)"} 0%, rgba(255, 255, 255, 0.02) 100%)`}
                      borderRadius="14px"
                      border="1px solid"
                      borderColor={
                        inBusinessHours
                          ? "rgba(16, 185, 129, 0.3)"
                          : "rgba(255, 255, 255, 0.08)"
                      }
                      boxShadow={
                        inBusinessHours
                          ? "0 0 20px rgba(16, 185, 129, 0.15)"
                          : "none"
                      }
                      transition="all 0.2s ease"
                      position="relative"
                    >
                      {isLiveNow && (
                        <Box
                          position="absolute"
                          top={2}
                          right={2}
                          w="6px"
                          h="6px"
                          bg="#10B981"
                          borderRadius="full"
                          animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                          boxShadow="0 0 8px rgba(16, 185, 129, 0.6)"
                        />
                      )}

                      <HStack justify="space-between" mb={2}>
                        <VStack align="start" spacing={0} flex={1}>
                          <HStack spacing={2}>
                            <Text
                              color="white"
                              fontWeight="600"
                              fontSize="17px"
                              letterSpacing="-0.2px"
                            >
                              {loc.name}
                            </Text>
                            {idx > 0 && (
                              <Badge
                                fontSize="10px"
                                px={1.5}
                                py={0.5}
                                borderRadius="4px"
                                bg="rgba(255, 255, 255, 0.1)"
                                color="rgba(255, 255, 255, 0.7)"
                                fontWeight="600"
                              >
                                {hoursDiff >= 0
                                  ? `+${hoursDiff}h`
                                  : `${hoursDiff}h`}
                              </Badge>
                            )}
                            {dayLabel && (
                              <Badge
                                fontSize="10px"
                                px={1.5}
                                py={0.5}
                                borderRadius="4px"
                                bg="rgba(251, 146, 60, 0.2)"
                                color="rgba(251, 146, 60, 0.9)"
                                fontWeight="600"
                              >
                                {dayLabel}
                              </Badge>
                            )}
                          </HStack>
                          <Text
                            color="rgba(255, 255, 255, 0.4)"
                            fontSize="11px"
                            fontWeight="500"
                          >
                            {loc.timezone.split("/")[1]?.replace(/_/g, " ")}
                          </Text>
                        </VStack>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          color="rgba(255, 255, 255, 0.3)"
                          aria-label="Remove location"
                          icon={<Text fontSize="20px">×</Text>}
                          onClick={() => removeLocation(loc.id)}
                          borderRadius="8px"
                          _hover={{
                            color: "rgba(239, 68, 68, 0.9)",
                            bg: "rgba(239, 68, 68, 0.15)",
                          }}
                          transition="all 0.15s ease"
                        />
                      </HStack>

                      <Text
                        fontSize="36px"
                        fontWeight="700"
                        color="white"
                        fontFamily="ui-monospace, monospace"
                        letterSpacing="-1px"
                        mb={2}
                      >
                        {format(loc.currentTime, "h:mm a", {
                          timeZone: loc.timezone,
                        })}
                      </Text>

                      <Box mb={3}>
                        <HStack justify="space-between" mb={1}>
                          <Text
                            fontSize="10px"
                            color="rgba(255, 255, 255, 0.4)"
                            fontWeight="500"
                            textTransform="uppercase"
                            letterSpacing="0.5px"
                          >
                            24-Hour View
                          </Text>
                          <Badge
                            colorScheme={inBusinessHours ? "green" : "gray"}
                            fontSize="9px"
                            px={1.5}
                            py={0.5}
                            borderRadius="4px"
                            fontWeight="600"
                            textTransform="uppercase"
                            letterSpacing="0.3px"
                          >
                            {inBusinessHours ? "Work" : "Off"}
                          </Badge>
                        </HStack>
                        <Box
                          position="relative"
                          h="8px"
                          bg="rgba(255, 255, 255, 0.05)"
                          borderRadius="full"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            left={`${(businessHoursStart / 24) * 100}%`}
                            w={`${((businessHoursEnd - businessHoursStart) / 24) * 100}%`}
                            h="100%"
                            bg="rgba(16, 185, 129, 0.3)"
                            borderRadius="full"
                          />
                          <Box
                            position="absolute"
                            left={`${(hour / 24) * 100}%`}
                            w="3px"
                            h="100%"
                            bg="#0066FF"
                            boxShadow="0 0 8px rgba(0, 102, 255, 0.8)"
                          />
                        </Box>
                      </Box>

                      <Text
                        color="rgba(255, 255, 255, 0.35)"
                        fontSize="11px"
                        fontWeight="500"
                      >
                        {format(loc.currentTime, "EEEE, MMMM d, yyyy", {
                          timeZone: loc.timezone,
                        })}
                      </Text>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default GlobalTime;
