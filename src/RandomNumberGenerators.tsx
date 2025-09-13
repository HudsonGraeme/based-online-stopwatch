import {
  Badge,
  Box,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlassButton } from "./components/ui/GlassButton";

interface GenerationResult {
  id: string;
  timestamp: Date;
  numbers: number[];
  range: { min: number; max: number };
  type: string;
}

function RandomNumberGenerators() {
  const { t } = useTranslation();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  const generateNumbers = (type: string = "custom") => {
    if (min >= max) return;

    const range = max - min + 1;
    if (!allowDuplicates && count > range) return;

    setIsGenerating(true);

    setTimeout(() => {
      const numbers: number[] = [];
      const used = new Set<number>();

      if (allowDuplicates) {
        for (let i = 0; i < count; i++) {
          const num = Math.floor(Math.random() * range) + min;
          numbers.push(num);
        }
      } else {
        for (let i = 0; i < count; i++) {
          let num: number;
          let attempts = 0;
          do {
            num = Math.floor(Math.random() * range) + min;
            attempts++;
          } while (used.has(num) && attempts < 1000);

          numbers.push(num);
          used.add(num);
        }
      }

      const result: GenerationResult = {
        id: `gen-${Date.now()}`,
        timestamp: new Date(),
        numbers: numbers.sort((a, b) => a - b),
        range: { min, max },
        type,
      };

      setGeneratedNumbers(result.numbers);
      setHistory((prev) => [result, ...prev.slice(0, 19)]); // Keep last 20
      setIsGenerating(false);
    }, 300);
  };

  const quickGenerate = (type: string) => {
    switch (type) {
      case "dice":
        setMin(1);
        setMax(6);
        setCount(1);
        setAllowDuplicates(true);
        break;
      case "coin":
        setMin(1);
        setMax(2);
        setCount(1);
        setAllowDuplicates(true);
        break;
      case "lotto":
        setMin(1);
        setMax(49);
        setCount(6);
        setAllowDuplicates(false);
        break;
      case "percent":
        setMin(0);
        setMax(100);
        setCount(1);
        setAllowDuplicates(true);
        break;
    }
    setTimeout(() => generateNumbers(type), 100);
  };

  const clearHistory = async () => {
    setHistory([]);
    setGeneratedNumbers([]);
    await localforage.removeItem("rng-history");
  };

  const copyToClipboard = (numbers: number[]) => {
    const text = numbers.join(", ");
    navigator.clipboard.writeText(text);
  };

  // Load and save history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory =
          await localforage.getItem<GenerationResult[]>("rng-history");
        if (savedHistory) {
          setHistory(savedHistory);
        }
      } catch (error) {
        console.error("Failed to load RNG history:", error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localforage.setItem("rng-history", history);
    }
  }, [history]);

  return (
    <VStack spacing={8} align="center" maxW="1000px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          {t("Random Number Generator")}
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          {t("Generate random numbers for games, decisions, and more")}
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} w="100%">
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="600" color="white">
              {t("Number Range")}
            </Text>

            <HStack spacing={4}>
              <VStack spacing={2} align="stretch" flex={1}>
                <Text fontSize="sm" color="#9ca3af">
                  {t("Minimum")}
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
                  {t("Maximum")}
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
                {t("Number of Results")}
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

            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel
                htmlFor="allow-duplicates"
                mb="0"
                color="#9ca3af"
                fontSize="sm"
              >
                {t("Allow Duplicates")}
              </FormLabel>
              <Switch
                id="allow-duplicates"
                isChecked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>

            <VStack spacing={3}>
              <GlassButton
                onClick={() => generateNumbers()}
                disabled={min >= max || isGenerating}
                variant="primary"
                glassLevel="medium"
                size="lg"
                w="100%"
                isLoading={isGenerating}
                loadingText="Generating..."
              >
                {t("Generate Numbers")}
              </GlassButton>

              <Text fontSize="sm" color="#6b7280" textAlign="center">
                {t("Quick Generate:")}
              </Text>
              <HStack spacing={2} wrap="wrap" justify="center">
                <GlassButton
                  size="sm"
                  variant="secondary"
                  glassLevel="subtle"
                  onClick={() => quickGenerate("dice")}
                >
                  {t("Dice (1-6)")}
                </GlassButton>
                <GlassButton
                  size="sm"
                  variant="secondary"
                  glassLevel="subtle"
                  onClick={() => quickGenerate("coin")}
                >
                  {t("Coin (1-2)")}
                </GlassButton>
                <GlassButton
                  size="sm"
                  variant="secondary"
                  glassLevel="subtle"
                  onClick={() => quickGenerate("lotto")}
                >
                  {t("Lotto (1-49)")}
                </GlassButton>
                <GlassButton
                  size="sm"
                  variant="secondary"
                  glassLevel="subtle"
                  onClick={() => quickGenerate("percent")}
                >
                  {t("Percent (0-100)")}
                </GlassButton>
              </HStack>
            </VStack>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="600" color="white">
                {t("Results")}
              </Text>
              {history.length > 0 && (
                <GlassButton
                  size="sm"
                  variant="danger"
                  glassLevel="subtle"
                  onClick={clearHistory}
                >
                  {t("Clear History")}
                </GlassButton>
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
                position="relative"
              >
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="sm" color="#9ca3af">
                    {t("Generated Numbers")}
                  </Text>
                  <GlassButton
                    size="xs"
                    variant="ghost"
                    glassLevel="subtle"
                    onClick={() => copyToClipboard(generatedNumbers)}
                    px={2}
                  >
                    {t("Copy")}
                  </GlassButton>
                </HStack>
                <HStack spacing={4} justify="center" wrap="wrap">
                  {generatedNumbers.map((num, index) => (
                    <Badge
                      key={index}
                      colorScheme="blue"
                      fontSize="2xl"
                      p={3}
                      borderRadius="12px"
                      cursor="pointer"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="transform 0.1s"
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
                  {t("Recent Generations ({{count}})", {
                    count: history.length,
                  })}
                </Text>
                {history.slice(0, 5).map((result) => (
                  <Box
                    key={result.id}
                    p={4}
                    bg="rgba(255, 255, 255, 0.02)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.08)"
                    borderRadius="12px"
                    _hover={{ bg: "rgba(255, 255, 255, 0.04)" }}
                    transition="background 0.2s"
                    cursor="pointer"
                    onClick={() => copyToClipboard(result.numbers)}
                  >
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Badge
                            colorScheme={
                              result.type === "dice"
                                ? "orange"
                                : result.type === "coin"
                                  ? "yellow"
                                  : result.type === "lotto"
                                    ? "purple"
                                    : result.type === "percent"
                                      ? "green"
                                      : "blue"
                            }
                            fontSize="xs"
                            px={2}
                            py={1}
                          >
                            {result.type === "custom"
                              ? t("Custom")
                              : t(result.type)}
                          </Badge>
                          <Text fontSize="xs" color="#6b7280">
                            {result.range.min}-{result.range.max}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color="#6b7280">
                          {new Date(result.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </HStack>
                      <HStack spacing={2} wrap="wrap">
                        {result.numbers.map((num, numIndex) => (
                          <Badge
                            key={numIndex}
                            variant="subtle"
                            colorScheme="blue"
                            fontSize="sm"
                            px={2}
                            py={1}
                          >
                            {num}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </Box>
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
