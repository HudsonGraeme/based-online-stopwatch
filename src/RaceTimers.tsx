import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { GlassButton } from "./components/ui/GlassButton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";

interface Lane {
  id: number;
  name: string;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
  finishPosition?: number;
}

interface RaceResult {
  id: string;
  timestamp: Date;
  lanes: Array<{
    name: string;
    time: number;
    position: number;
  }>;
}

function RaceTimers() {
  const { t } = useTranslation();
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [nextLaneId, setNextLaneId] = useState(1);
  const [finishCounter, setFinishCounter] = useState(0);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);

  // Load data from localforage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedLanes = await localforage.getItem<Lane[]>("race-lanes");
        const savedResults =
          await localforage.getItem<RaceResult[]>("race-results");
        const savedNextId = await localforage.getItem<number>("race-next-id");

        // Load lanes and determine next ID
        let loadedLanes = savedLanes;
        if (!loadedLanes) {
          // Default lanes if none saved
          loadedLanes = [
            {
              id: 1,
              name: "Lane 1",
              time: 0,
              isRunning: false,
              isFinished: false,
            },
            {
              id: 2,
              name: "Lane 2",
              time: 0,
              isRunning: false,
              isFinished: false,
            },
          ];
          await localforage.setItem("race-lanes", loadedLanes);
        }

        setLanes(loadedLanes);

        // Always calculate next ID from existing lanes
        const maxId = Math.max(...loadedLanes.map((lane) => lane.id), 0);
        const calculatedNextId = maxId + 1;

        // Use saved next ID only if it's higher than calculated
        const finalNextId =
          savedNextId && savedNextId > calculatedNextId
            ? savedNextId
            : calculatedNextId;
        setNextLaneId(finalNextId);

        if (savedResults) {
          setRaceResults(savedResults);
        }
      } catch (error) {
        console.error("Failed to load race data:", error);
      }
    };

    loadData();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (raceStarted) {
      interval = window.setInterval(() => {
        setLanes((prevLanes) =>
          prevLanes.map((lane) =>
            lane.isRunning && !lane.isFinished
              ? { ...lane, time: lane.time + 10 }
              : lane
          )
        );
      }, 10);
    }
    return () => clearInterval(interval);
  }, [raceStarted]);

  // Save lanes to localforage when they change
  useEffect(() => {
    if (lanes.length > 0) {
      localforage.setItem("race-lanes", lanes);
    }
  }, [lanes]);

  // Save results to localforage when they change (but not on initial empty load)
  useEffect(() => {
    if (raceResults.length > 0) {
      localforage.setItem("race-results", raceResults);
    }
  }, [raceResults]);

  // Save next ID to localforage when it changes
  useEffect(() => {
    localforage.setItem("race-next-id", nextLaneId);
  }, [nextLaneId]);

  // Auto-save race results when all lanes are finished
  useEffect(() => {
    if (
      raceStarted &&
      lanes.length > 0 &&
      lanes.every((lane) => lane.isFinished) &&
      !hasAutoSaved
    ) {
      saveRaceResult();
      setHasAutoSaved(true);
    }
  }, [lanes, raceStarted, hasAutoSaved]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const startRace = () => {
    setRaceStarted(true);
    setHasAutoSaved(false);
    setLanes((prevLanes) =>
      prevLanes.map((lane) => ({ ...lane, isRunning: true }))
    );
  };

  const stopLane = (laneId: number) => {
    setLanes((prevLanes) =>
      prevLanes.map((lane) =>
        lane.id === laneId
          ? {
              ...lane,
              isRunning: false,
              isFinished: true,
              finishPosition: finishCounter + 1,
            }
          : lane
      )
    );
    setFinishCounter((prev) => prev + 1);
  };

  const addLane = () => {
    const newLane: Lane = {
      id: nextLaneId,
      name: `${t("Lane")} ${nextLaneId}`,
      time: 0,
      isRunning: false,
      isFinished: false,
    };
    setLanes((prev) => [...prev, newLane]);
    setNextLaneId((prev) => prev + 1);
  };

  const removeLane = (id: number) => {
    if (!raceStarted) {
      setLanes((prev) => prev.filter((lane) => lane.id !== id));
    }
  };

  const updateLaneName = (id: number, name: string) => {
    setLanes((prev) =>
      prev.map((lane) => (lane.id === id ? { ...lane, name } : lane))
    );
  };

  const saveRaceResult = () => {
    const finishedLanes = lanes.filter((lane) => lane.isFinished);
    if (finishedLanes.length === 0) return;

    const raceResult: RaceResult = {
      id: `race-${Date.now()}`,
      timestamp: new Date(),
      lanes: finishedLanes
        .sort((a, b) => (a.finishPosition || 0) - (b.finishPosition || 0))
        .map((lane, index) => ({
          name: lane.name,
          time: lane.time,
          position: index + 1,
        })),
    };

    setRaceResults((prev) => [raceResult, ...prev]);
  };

  const resetRace = () => {
    // Always save results if there are finished lanes (and not already auto-saved)
    const finishedLanes = lanes.filter((lane) => lane.isFinished);
    if (finishedLanes.length > 0 && !hasAutoSaved) {
      saveRaceResult();
    }

    setRaceStarted(false);
    setFinishCounter(0);
    setHasAutoSaved(false);
    setLanes((prevLanes) =>
      prevLanes.map((lane) => ({
        ...lane,
        time: 0,
        isRunning: false,
        isFinished: false,
        finishPosition: undefined,
      }))
    );
  };

  const clearHistory = async () => {
    setRaceResults([]);
    await localforage.removeItem("race-results");
  };

  return (
    <VStack spacing={8} align="center" maxW="1200px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          {t("Race Timers")}
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          {t("Multi-lane timing for races and competitions")}
        </Text>
      </VStack>

      {/* Lane Management */}
      {!raceStarted && (
        <HStack spacing={4} flexWrap="wrap">
          <GlassButton
            onClick={addLane}
            variant="success"
            glassLevel="subtle"
            size="sm"
            leftIcon={<Text fontSize="12px">+</Text>}
          >
            {t("Add Lane")}
          </GlassButton>
          <Text color="gray.400" fontSize="sm">
            {t("{{count}} lane configured", "{{count}} lanes configured", {
              count: lanes.length,
            })}
          </Text>
        </HStack>
      )}

      {/* Race Controls */}
      <HStack spacing={4}>
        <GlassButton
          onClick={startRace}
          disabled={raceStarted || lanes.length === 0}
          variant="success"
          glassLevel="medium"
          size="lg"
          px={8}
        >
          {t("Start Race")}
        </GlassButton>
        <GlassButton
          onClick={resetRace}
          variant="secondary"
          glassLevel="subtle"
          size="lg"
          px={8}
        >
          {t("Reset")}
        </GlassButton>
      </HStack>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
        w="100%"
      >
        {lanes.map((lane) => (
          <GridItem key={lane.id}>
            <Box
              p={6}
              bg="rgba(255, 255, 255, 0.02)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              borderRadius="16px"
              textAlign="center"
            >
              <VStack spacing={4}>
                <HStack justify="space-between" w="100%">
                  <Input
                    value={lane.name}
                    onChange={(e) => updateLaneName(lane.id, e.target.value)}
                    textAlign="center"
                    fontSize="lg"
                    fontWeight="600"
                    color="white"
                    bg="transparent"
                    border="none"
                    _focus={{ bg: "rgba(255, 255, 255, 0.05)" }}
                    disabled={raceStarted}
                    flex={1}
                  />
                  {!raceStarted && (
                    <GlassButton
                      onClick={() => removeLane(lane.id)}
                      variant="danger"
                      glassLevel="subtle"
                      size="sm"
                      minW="auto"
                      px={2}
                    >
                      <Text fontSize="12px">×</Text>
                    </GlassButton>
                  )}
                </HStack>

                <Text
                  fontSize="3xl"
                  fontWeight="700"
                  color={
                    lane.isFinished
                      ? "#10b981"
                      : lane.isRunning
                        ? "#3b82f6"
                        : "#6b7280"
                  }
                  fontFamily="monospace"
                >
                  {formatTime(lane.time)}
                </Text>

                {lane.isFinished && (
                  <Badge colorScheme="green" fontSize="sm">
                    {lane.finishPosition
                      ? `#${lane.finishPosition} ${t("Finished")}`
                      : t("Finished")}
                  </Badge>
                )}

                <GlassButton
                  onClick={() => stopLane(lane.id)}
                  disabled={!lane.isRunning || lane.isFinished}
                  variant="danger"
                  glassLevel="medium"
                  size="sm"
                >
                  {t("Stop")}
                </GlassButton>
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Race Results History */}
      {raceResults.length > 0 && (
        <VStack spacing={4} w="100%" maxW="800px">
          <HStack justify="space-between" w="100%">
            <Text fontSize="2xl" fontWeight="600" color="white">
              {t("Race Results History")}
            </Text>
            <GlassButton
              onClick={clearHistory}
              variant="danger"
              glassLevel="subtle"
              size="sm"
            >
              {t("Clear History")}
            </GlassButton>
          </HStack>

          <Box
            w="100%"
            bg="rgba(255, 255, 255, 0.02)"
            border="1px solid rgba(255, 255, 255, 0.08)"
            borderRadius="12px"
            overflow="hidden"
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="rgba(255, 255, 255, 0.05)">
                  <Th color="gray.300" border="none">
                    {t("Date")}
                  </Th>
                  <Th color="gray.300" border="none">
                    {t("Winner")}
                  </Th>
                  <Th color="gray.300" border="none">
                    {t("Time")}
                  </Th>
                  <Th color="gray.300" border="none">
                    {t("Participants")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {raceResults.map((result) => (
                  <Tr
                    key={result.id}
                    _hover={{ bg: "rgba(255, 255, 255, 0.02)" }}
                  >
                    <Td color="gray.400" border="none">
                      {new Date(result.timestamp).toLocaleDateString()}{" "}
                      {new Date(result.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Td>
                    <Td color="white" border="none" fontWeight="600">
                      {result.lanes[0]?.name || t("Unknown")}
                    </Td>
                    <Td color="green.400" border="none" fontFamily="monospace">
                      {formatTime(result.lanes[0]?.time || 0)}
                    </Td>
                    <Td color="gray.400" border="none" fontSize="sm">
                      {t("{{count}} racer", "{{count}} racers", {
                        count: result.lanes.length,
                      })}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      )}
    </VStack>
  );
}

export default RaceTimers;
