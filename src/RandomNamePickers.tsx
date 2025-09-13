import {
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import localforage from "localforage";
import { GlassButton } from "./components/ui/GlassButton";

interface PickResult {
  id: string;
  timestamp: Date;
  name: string;
  totalNames: number;
  nameList: string[];
}

function RandomNamePickers() {
  const { t } = useTranslation();
  const [names, setNames] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<PickResult[]>([]);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);
  const [availableNames, setAvailableNames] = useState<string>("");

  const pickRandomName = () => {
    const currentNameList = removeAfterPick
      ? availableNames
          .split("\n")
          .map((name) => name.trim())
          .filter((name) => name.length > 0)
      : names
          .split("\n")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);

    if (currentNameList.length === 0) return;

    setIsSpinning(true);

    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * currentNameList.length);
      const pickedName = currentNameList[randomIndex];

      const result: PickResult = {
        id: `pick-${Date.now()}`,
        timestamp: new Date(),
        name: pickedName,
        totalNames: currentNameList.length,
        nameList: [...currentNameList],
      };

      setSelectedName(pickedName);
      setHistory((prev) => [result, ...prev.slice(0, 19)]); // Keep last 20

      // Remove picked name if option is enabled
      if (removeAfterPick) {
        const updatedNames = currentNameList.filter(
          (_, index) => index !== randomIndex
        );
        setAvailableNames(updatedNames.join("\n"));
      }

      setIsSpinning(false);
    }, 1500);
  };

  const clearAll = () => {
    setNames("");
    setSelectedName("");
    setHistory([]);
    setAvailableNames("");
  };

  const clearHistory = async () => {
    setHistory([]);
    await localforage.removeItem("name-picker-history");
  };

  const resetAvailableNames = () => {
    setAvailableNames(names);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Initialize available names when names change or toggle is enabled
  useEffect(() => {
    if (removeAfterPick && names && !availableNames) {
      setAvailableNames(names);
    }
  }, [names, availableNames, removeAfterPick]);

  // Load and save history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await localforage.getItem<PickResult[]>(
          "name-picker-history"
        );
        if (savedHistory) {
          setHistory(savedHistory);
        }
      } catch (error) {
        console.error("Failed to load name picker history:", error);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localforage.setItem("name-picker-history", history);
    }
  }, [history]);

  const nameList = names
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const currentAvailableList = removeAfterPick
    ? (availableNames || names)
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0)
    : nameList;

  return (
    <VStack spacing={8} align="center" maxW="1000px" mx="auto">
      <VStack spacing={4} textAlign="center">
        <Text fontSize="4xl" fontWeight="700" color="white">
          {t("Random Name Pickers")}
        </Text>
        <Text fontSize="lg" color="#9ca3af">
          {t("Fair random selection from your list")}
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} w="100%">
        <GridItem>
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="600" color="white">
              {t("Enter Names (one per line)")}
            </Text>
            <Textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={t("Enter names here, one per line...")}
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
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel
                htmlFor="remove-after-pick"
                mb="0"
                color="#9ca3af"
                fontSize="sm"
              >
                {t("Remove After Pick")}
              </FormLabel>
              <Switch
                id="remove-after-pick"
                isChecked={removeAfterPick}
                onChange={(e) => setRemoveAfterPick(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>

            <HStack spacing={4}>
              <GlassButton
                onClick={pickRandomName}
                disabled={currentAvailableList.length === 0 || isSpinning}
                variant="primary"
                glassLevel="medium"
                size="lg"
                flex={1}
                isLoading={isSpinning}
                loadingText="Picking..."
              >
                {t("Pick Random Name")}
              </GlassButton>
              <GlassButton
                onClick={clearAll}
                variant="danger"
                glassLevel="subtle"
                size="lg"
              >
                {t("Clear All")}
              </GlassButton>
            </HStack>

            {removeAfterPick &&
              availableNames &&
              currentAvailableList.length < nameList.length && (
                <GlassButton
                  onClick={resetAvailableNames}
                  variant="secondary"
                  glassLevel="subtle"
                  size="sm"
                  w="100%"
                >
                  {t("Reset Available Names ({{count}} removed)", {
                    count: nameList.length - currentAvailableList.length,
                  })}
                </GlassButton>
              )}
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

            {selectedName && (
              <Box
                p={6}
                bg="rgba(0, 122, 255, 0.1)"
                border="2px solid"
                borderColor="rgba(0, 122, 255, 0.3)"
                borderRadius="16px"
                textAlign="center"
                position="relative"
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color="#9ca3af">
                    {t("Selected Name")}
                  </Text>
                  <GlassButton
                    size="xs"
                    variant="ghost"
                    glassLevel="subtle"
                    onClick={() => copyToClipboard(selectedName)}
                    px={2}
                  >
                    {t("Copy")}
                  </GlassButton>
                </HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="700"
                  color="#ffffff"
                  cursor="pointer"
                  onClick={() => copyToClipboard(selectedName)}
                  _hover={{ transform: "scale(1.02)" }}
                  transition="transform 0.1s"
                >
                  {selectedName}
                </Text>
              </Box>
            )}

            <Box
              p={4}
              bg="rgba(255, 255, 255, 0.02)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.08)"
              borderRadius="12px"
            >
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="#9ca3af">
                    {t("Total Names:")}
                  </Text>
                  <Badge colorScheme="blue" fontSize="sm">
                    {nameList.length}
                  </Badge>
                </HStack>
                {removeAfterPick && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="#9ca3af">
                      {t("Available:")}
                    </Text>
                    <Badge
                      colorScheme={
                        currentAvailableList.length > 0 ? "green" : "red"
                      }
                      fontSize="sm"
                    >
                      {currentAvailableList.length}
                    </Badge>
                  </HStack>
                )}
              </VStack>
            </Box>

            {history.length > 0 && (
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" color="#9ca3af">
                  {t("Recent Picks ({{count}})", { count: history.length })}
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
                    onClick={() => copyToClipboard(result.name)}
                  >
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text color="white" fontSize="md" fontWeight="600">
                          {result.name}
                        </Text>
                        <Text fontSize="xs" color="#6b7280">
                          {new Date(result.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color="#9ca3af">
                          {t("From {{count}} name", "From {{count}} names", {
                            count: result.totalNames,
                          })}
                        </Text>
                        <Badge colorScheme="blue" fontSize="xs">
                          {t("Click to copy")}
                        </Badge>
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

export default RandomNamePickers;
