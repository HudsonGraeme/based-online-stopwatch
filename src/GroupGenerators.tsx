import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const GroupGenerators = () => {
  const { t } = useTranslation();
  const [participants, setParticipants] = useState("");
  const [groupSize, setGroupSize] = useState(4);
  const [generatedGroups, setGeneratedGroups] = useState<string[][]>([]);

  const parseParticipants = (): string[] => {
    return participants
      .split(/[\n,]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  };

  const generateRandomGroups = (names: string[], size: number): string[][] => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const groups: string[][] = [];

    for (let i = 0; i < shuffled.length; i += size) {
      groups.push(shuffled.slice(i, i + size));
    }

    return groups;
  };

  const handleGenerateGroups = () => {
    const names = parseParticipants();
    if (names.length === 0) return;

    const groups = generateRandomGroups(names, groupSize);
    setGeneratedGroups(groups);
  };

  const handleReset = () => {
    setGeneratedGroups([]);
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
        justifyContent: "center",
        alignItems: "center",
        pt: "80px",
        pb: "120px",
      }}
    >
      <VStack spacing={8} maxW="900px" w="100%" px={4}>
        {/* Header */}
        <VStack spacing={2}>
          <Text fontSize="3xl" fontWeight="700" color="white">
            {t("Group Generators")}
          </Text>
          <Text color="#9ca3af" fontSize="lg">
            {t("Create random teams and groups automatically")}
          </Text>
        </VStack>

        {/* Input Section */}
        <VStack spacing={4} w="100%" maxW="600px">
          <Box w="100%">
            <Text fontSize="sm" color="gray.400" mb={2} textAlign="left">
              {t("Participants (one per line or comma-separated)")}
            </Text>
            <Textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana"
              rows={6}
              bg="rgba(255, 255, 255, 0.05)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.15)"
              color="white"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                bg: "rgba(255, 255, 255, 0.08)",
              }}
            />
          </Box>

          <Box w="100%">
            <Text fontSize="sm" color="gray.400" mb={2} textAlign="left">
              {t("Group Size")}
            </Text>
            <NumberInput
              value={groupSize}
              onChange={(_, value) => setGroupSize(value || 1)}
              min={2}
              max={20}
              bg="rgba(255, 255, 255, 0.05)"
            >
              <NumberInputField
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.15)"
                color="white"
                _focus={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  bg: "rgba(255, 255, 255, 0.08)",
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper color="white" />
                <NumberDecrementStepper color="white" />
              </NumberInputStepper>
            </NumberInput>
          </Box>
        </VStack>

        {/* Generate Button */}
        <HStack spacing={4}>
          {generatedGroups.length > 0 && (
            <Button onClick={handleReset} size="lg">
              {t("Reset")}
            </Button>
          )}

          <Button
            onClick={handleGenerateGroups}
            size="lg"
            isDisabled={parseParticipants().length < 2}
          >
            {t("Generate Groups")}
          </Button>
        </HStack>

        {/* Generated Groups Display */}
        {generatedGroups.length > 0 && (
          <VStack spacing={4} w="100%">
            <Text fontSize="xl" fontWeight="600" color="white">
              {t("Generated Groups")} ({generatedGroups.length} {t("groups")})
            </Text>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={4}
              w="100%"
            >
              {generatedGroups.map((group, index) => (
                <Box
                  key={index}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.15)"
                  p={4}
                  borderRadius="8px"
                  color="white"
                >
                  <Text fontSize="md" fontWeight="600" mb={2}>
                    {t("Group")} {index + 1}
                  </Text>
                  <VStack spacing={1} align="start">
                    {group.map((member, memberIndex) => (
                      <Text key={memberIndex} fontSize="sm" color="gray.300">
                        • {member}
                      </Text>
                    ))}
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        )}

        {generatedGroups.length === 0 && (
          <Text color="#9ca3af" fontSize="md">
            {t(
              "Enter participant names and click Generate Groups to create teams"
            )}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default GroupGenerators;
