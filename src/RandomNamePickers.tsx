import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

function RandomNamePickers() {
  const [names, setNames] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const pickRandomName = () => {
    const nameList = names
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (nameList.length === 0) return;

    setIsSpinning(true);

    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * nameList.length);
      const pickedName = nameList[randomIndex];
      setSelectedName(pickedName);
      setHistory((prev) => [pickedName, ...prev.slice(0, 9)]); // Keep last 10
      setIsSpinning(false);
    }, 2000);
  };

  const clearAll = () => {
    setNames("");
    setSelectedName("");
    setHistory([]);
  };

  const nameList = names
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  return (
    <VStack spacing={8} align="center" maxW="1000px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          🎯 Random Name Pickers
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          Fair random selection from your list
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} w="100%">
        <GridItem>
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="600" color="white">
              Enter Names (one per line)
            </Text>
            <Textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Enter names here, one per line..."
              minH="200px"
              bg="rgba(255, 255, 255, 0.02)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              color="white"
              _focus={{
                borderColor: "rgba(0, 122, 255, 0.5)",
                bg: "rgba(255, 255, 255, 0.05)",
              }}
            />
            <HStack spacing={4}>
              <Button
                onClick={pickRandomName}
                disabled={nameList.length === 0 || isSpinning}
                colorScheme="blue"
                size="lg"
                flex={1}
                isLoading={isSpinning}
                loadingText="Picking..."
              >
                Pick Random Name
              </Button>
              <Button onClick={clearAll} variant="outline" size="lg">
                Clear All
              </Button>
            </HStack>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="600" color="white">
              Results
            </Text>

            {selectedName && (
              <Box
                p={6}
                bg="rgba(0, 122, 255, 0.1)"
                border="2px solid"
                borderColor="rgba(0, 122, 255, 0.3)"
                borderRadius="16px"
                textAlign="center"
              >
                <Text fontSize="sm" color="#9ca3af" mb={2}>
                  Selected Name
                </Text>
                <Text fontSize="3xl" fontWeight="700" color="#ffffff">
                  {selectedName}
                </Text>
              </Box>
            )}

            <Box>
              <Text fontSize="sm" color="#9ca3af" mb={2}>
                Total Names: {nameList.length}
              </Text>
            </Box>

            {history.length > 0 && (
              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" color="#9ca3af">
                  Recent Picks
                </Text>
                {history.slice(0, 5).map((name, index) => (
                  <HStack key={index} justify="space-between">
                    <Text color="white" fontSize="sm">
                      {name}
                    </Text>
                    <Badge colorScheme="blue" fontSize="xs">
                      #{history.length - index}
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            )}
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
}

export default RandomNamePickers;
