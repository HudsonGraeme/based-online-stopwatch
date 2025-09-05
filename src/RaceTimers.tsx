import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Lane {
  id: number;
  name: string;
  time: number;
  isRunning: boolean;
  isFinished: boolean;
}

function RaceTimers() {
  const [lanes, setLanes] = useState<Lane[]>([
    { id: 1, name: "Lane 1", time: 0, isRunning: false, isFinished: false },
    { id: 2, name: "Lane 2", time: 0, isRunning: false, isFinished: false },
    { id: 3, name: "Lane 3", time: 0, isRunning: false, isFinished: false },
    { id: 4, name: "Lane 4", time: 0, isRunning: false, isFinished: false },
  ]);
  const [raceStarted, setRaceStarted] = useState(false);

  useEffect(() => {
    let interval: number;
    if (raceStarted) {
      interval = setInterval(() => {
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
    setLanes((prevLanes) =>
      prevLanes.map((lane) => ({ ...lane, isRunning: true }))
    );
  };

  const stopLane = (laneId: number) => {
    setLanes((prevLanes) =>
      prevLanes.map((lane) =>
        lane.id === laneId
          ? { ...lane, isRunning: false, isFinished: true }
          : lane
      )
    );
  };

  const resetRace = () => {
    setRaceStarted(false);
    setLanes((prevLanes) =>
      prevLanes.map((lane) => ({
        ...lane,
        time: 0,
        isRunning: false,
        isFinished: false,
      }))
    );
  };

  const updateLaneName = (laneId: number, name: string) => {
    setLanes((prevLanes) =>
      prevLanes.map((lane) => (lane.id === laneId ? { ...lane, name } : lane))
    );
  };

  return (
    <VStack spacing={8} align="center" maxW="1200px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          🏁 Race Timers
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          Multi-lane timing for races and competitions
        </Text>
      </VStack>

      <HStack spacing={4}>
        <Button
          onClick={startRace}
          disabled={raceStarted}
          colorScheme="blue"
          size="lg"
          px={8}
        >
          Start Race
        </Button>
        <Button onClick={resetRace} variant="outline" size="lg" px={8}>
          Reset
        </Button>
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
                />

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
                    Finished
                  </Badge>
                )}

                <Button
                  onClick={() => stopLane(lane.id)}
                  disabled={!lane.isRunning || lane.isFinished}
                  colorScheme="red"
                  size="sm"
                >
                  Stop
                </Button>
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
}

export default RaceTimers;
