import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

function RandomNumberGenerators() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNumbers = () => {
    if (min >= max) return;

    setIsGenerating(true);

    setTimeout(() => {
      const numbers: number[] = [];
      const used = new Set<number>();

      for (let i = 0; i < count; i++) {
        let num: number;
        let attempts = 0;
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
          attempts++;
        } while (used.has(num) && attempts < 1000);

        numbers.push(num);
        used.add(num);
      }

      setGeneratedNumbers(numbers);
      setHistory((prev) => [numbers, ...prev.slice(0, 9)]); // Keep last 10
      setIsGenerating(false);
    }, 500);
  };

  const quickGenerate = (range: string) => {
    switch (range) {
      case "dice":
        setMin(1);
        setMax(6);
        setCount(1);
        break;
      case "coin":
        setMin(1);
        setMax(2);
        setCount(1);
        break;
      case "lotto":
        setMin(1);
        setMax(49);
        setCount(6);
        break;
      case "percent":
        setMin(0);
        setMax(100);
        setCount(1);
        break;
    }
    setTimeout(() => generateNumbers(), 100);
  };

  const clearHistory = () => {
    setHistory([]);
    setGeneratedNumbers([]);
  };

  return (
    <VStack spacing={8} align="center" maxW="1000px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          🎲 Random Number Generators
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          Generate random numbers for games, decisions, and more
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} w="100%">
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="600" color="white">
              Number Range
            </Text>

            <HStack spacing={4}>
              <VStack spacing={2} align="stretch" flex={1}>
                <Text fontSize="sm" color="#9ca3af">
                  Minimum
                </Text>
                <NumberInput
                  value={min}
                  onChange={(_, value) => setMin(value)}
                  min={-1000000}
                  max={max - 1}
                >
                  <NumberInputField
                    bg="rgba(255, 255, 255, 0.02)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>

              <VStack spacing={2} align="stretch" flex={1}>
                <Text fontSize="sm" color="#9ca3af">
                  Maximum
                </Text>
                <NumberInput
                  value={max}
                  onChange={(_, value) => setMax(value)}
                  min={min + 1}
                  max={1000000}
                >
                  <NumberInputField
                    bg="rgba(255, 255, 255, 0.02)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
            </HStack>

            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" color="#9ca3af">
                Number of Results
              </Text>
              <NumberInput
                value={count}
                onChange={(_, value) =>
                  setCount(Math.max(1, Math.min(100, value)))
                }
                min={1}
                max={100}
              >
                <NumberInputField
                  bg="rgba(255, 255, 255, 0.02)"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </VStack>

            <VStack spacing={3}>
              <Button
                onClick={generateNumbers}
                disabled={min >= max || isGenerating}
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                Generate Numbers
              </Button>

              <Text fontSize="sm" color="#6b7280" textAlign="center">
                Quick Generate:
              </Text>
              <HStack spacing={2} wrap="wrap" justify="center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickGenerate("dice")}
                >
                  🎲 Dice (1-6)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickGenerate("coin")}
                >
                  Coin (1-2)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickGenerate("lotto")}
                >
                  Lotto (1-49)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => quickGenerate("percent")}
                >
                  Percent (0-100)
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="600" color="white">
                Results
              </Text>
              {history.length > 0 && (
                <Button size="sm" variant="ghost" onClick={clearHistory}>
                  Clear History
                </Button>
              )}
            </HStack>

            {generatedNumbers.length > 0 && (
              <Box
                p={6}
                bg="rgba(0, 122, 255, 0.1)"
                border="2px solid"
                borderColor="rgba(0, 122, 255, 0.3)"
                borderRadius="16px"
                textAlign="center"
              >
                <Text fontSize="sm" color="#9ca3af" mb={4}>
                  Generated Numbers
                </Text>
                <HStack spacing={4} justify="center" wrap="wrap">
                  {generatedNumbers.map((num, index) => (
                    <Badge
                      key={index}
                      colorScheme="blue"
                      fontSize="2xl"
                      p={3}
                      borderRadius="12px"
                    >
                      {num}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            {history.length > 0 && (
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" color="#9ca3af">
                  Recent Generations
                </Text>
                {history.slice(0, 5).map((numbers, index) => (
                  <HStack
                    key={index}
                    justify="space-between"
                    p={3}
                    bg="rgba(255, 255, 255, 0.02)"
                    borderRadius="8px"
                  >
                    <HStack spacing={2}>
                      {numbers.map((num, numIndex) => (
                        <Badge
                          key={numIndex}
                          variant="subtle"
                          colorScheme="blue"
                          fontSize="sm"
                        >
                          {num}
                        </Badge>
                      ))}
                    </HStack>
                    <Text fontSize="xs" color="#6b7280">
                      #{history.length - index}
                    </Text>
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

export default RandomNumberGenerators;
