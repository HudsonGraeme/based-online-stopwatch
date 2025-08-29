import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

interface TallyCounter {
  id: number;
  name: string;
  count: number;
  color: string;
}

function TallyCounters() {
  const [counters, setCounters] = useState<TallyCounter[]>([
    { id: 1, name: "Counter 1", count: 0, color: "blue" },
    { id: 2, name: "Counter 2", count: 0, color: "green" },
    { id: 3, name: "Counter 3", count: 0, color: "purple" },
    { id: 4, name: "Counter 4", count: 0, color: "orange" },
  ]);

  const increment = (id: number) => {
    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === id ? { ...counter, count: counter.count + 1 } : counter
      )
    );
  };

  const decrement = (id: number) => {
    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === id && counter.count > 0
          ? { ...counter, count: counter.count - 1 }
          : counter
      )
    );
  };

  const reset = (id: number) => {
    setCounters((prev) =>
      prev.map((counter) =>
        counter.id === id ? { ...counter, count: 0 } : counter
      )
    );
  };

  const resetAll = () => {
    setCounters((prev) => prev.map((counter) => ({ ...counter, count: 0 })));
  };

  const total = counters.reduce((sum, counter) => sum + counter.count, 0);

  return (
    <VStack spacing={8} align="center" maxW="1000px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          🔢 Tally Counters
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          Keep track of multiple counts simultaneously
        </Text>
      </VStack>

      <Box
        p={6}
        bg="rgba(255, 255, 255, 0.02)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.08)"
        borderRadius="16px"
        textAlign="center"
        w="100%"
      >
        <Text fontSize="sm" color="#9ca3af" mb={2}>
          Total Count
        </Text>
        <Text fontSize="5xl" fontWeight="700" color="white">
          {total}
        </Text>
        <Button onClick={resetAll} variant="outline" size="sm" mt={4}>
          Reset All
        </Button>
      </Box>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={6}
        w="100%"
      >
        {counters.map((counter) => (
          <GridItem key={counter.id}>
            <Box
              p={6}
              bg="rgba(255, 255, 255, 0.02)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              borderRadius="16px"
              textAlign="center"
            >
              <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="600" color="white">
                  {counter.name}
                </Text>

                <Text
                  fontSize="4xl"
                  fontWeight="700"
                  color="white"
                  fontFamily="monospace"
                >
                  {counter.count}
                </Text>

                <HStack spacing={2}>
                  <IconButton
                    aria-label="Decrement"
                    icon={<Text fontSize="xl">-</Text>}
                    onClick={() => decrement(counter.id)}
                    size="sm"
                    variant="outline"
                    isDisabled={counter.count === 0}
                  />
                  <IconButton
                    aria-label="Increment"
                    icon={<Text fontSize="xl">+</Text>}
                    onClick={() => increment(counter.id)}
                    size="sm"
                    colorScheme={counter.color}
                  />
                </HStack>

                <Button
                  onClick={() => reset(counter.id)}
                  size="xs"
                  variant="ghost"
                  color="#9ca3af"
                >
                  Reset
                </Button>
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  );
}

export default TallyCounters;
