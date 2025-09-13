import { Box, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
`;

interface ProgressIndicatorProps {
  progress: number; // 0-100
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

export const CircularProgress = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            color:
              color === "blue.500"
                ? "#3b82f6"
                : color === "red.500"
                  ? "#ef4444"
                  : color === "green.500"
                    ? "#10b981"
                    : color === "purple.500"
                      ? "#8b5cf6"
                      : color === "orange.500"
                        ? "#f59e0b"
                        : "#3b82f6",
          }}
        />
      </svg>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
};

export const GlowingCircular = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            color:
              color === "blue.500"
                ? "#3b82f6"
                : color === "red.500"
                  ? "#ef4444"
                  : color === "green.500"
                    ? "#10b981"
                    : color === "purple.500"
                      ? "#8b5cf6"
                      : color === "orange.500"
                        ? "#f59e0b"
                        : "#3b82f6",
            animation: `${glowAnimation} 2s ease-in-out infinite`,
          }}
        />
      </svg>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
};

export const MinimalLinear = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  return (
    <Box w={`${size}px`} textAlign="center">
      <Box mb={4}>{children}</Box>
      <Box
        w="100%"
        h="6px"
        bg="rgba(255, 255, 255, 0.1)"
        borderRadius="3px"
        overflow="hidden"
      >
        <Box
          h="100%"
          w={`${progress}%`}
          bg="currentColor"
          borderRadius="3px"
          style={{
            transition: "width 0.3s ease",
            color:
              color === "blue.500"
                ? "#3b82f6"
                : color === "red.500"
                  ? "#ef4444"
                  : color === "green.500"
                    ? "#10b981"
                    : color === "purple.500"
                      ? "#8b5cf6"
                      : color === "orange.500"
                        ? "#f59e0b"
                        : "#3b82f6",
          }}
        />
      </Box>
      <Text fontSize="sm" color="gray.400" mt={2}>
        {Math.round(progress)}% complete
      </Text>
    </Box>
  );
};

export const PulsingCircular = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box
      position="relative"
      w={`${size}px`}
      h={`${size}px`}
      animation={`${pulseAnimation} 3s ease-in-out infinite`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            color:
              color === "blue.500"
                ? "#3b82f6"
                : color === "red.500"
                  ? "#ef4444"
                  : color === "green.500"
                    ? "#10b981"
                    : color === "purple.500"
                      ? "#8b5cf6"
                      : color === "orange.500"
                        ? "#f59e0b"
                        : "#3b82f6",
          }}
        />
      </svg>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
};

export const SegmentedCircular = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  const segments = 12;
  const radius = (size - 20) / 2;
  const segmentAngle = 360 / segments;
  const completedSegments = Math.floor((progress / 100) * segments);

  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {Array.from({ length: segments }, (_, i) => {
          const angle = i * segmentAngle;
          const isCompleted = i < completedSegments;
          const isPartial =
            i === completedSegments && progress % (100 / segments) > 0;

          return (
            <circle
              key={i}
              cx={size / 2 + Math.cos((angle * Math.PI) / 180) * radius}
              cy={size / 2 + Math.sin((angle * Math.PI) / 180) * radius}
              r="8"
              fill={
                isCompleted || isPartial
                  ? "currentColor"
                  : "rgba(255, 255, 255, 0.1)"
              }
              style={{
                color:
                  color === "blue.500"
                    ? "#3b82f6"
                    : color === "red.500"
                      ? "#ef4444"
                      : color === "green.500"
                        ? "#10b981"
                        : color === "purple.500"
                          ? "#8b5cf6"
                          : color === "orange.500"
                            ? "#f59e0b"
                            : "#3b82f6",
                opacity: isPartial ? 0.6 : 1,
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </svg>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        {children}
      </Box>
    </Box>
  );
};

export const StyledLinear = ({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: ProgressIndicatorProps) => {
  return (
    <Box w={`${size}px`} textAlign="center">
      <Box mb={6}>{children}</Box>
      <Box position="relative">
        <Box
          w="100%"
          h="12px"
          bg="rgba(255, 255, 255, 0.05)"
          borderRadius="6px"
          border="1px solid rgba(255, 255, 255, 0.1)"
          overflow="hidden"
        >
          <Box
            h="100%"
            w={`${progress}%`}
            bg="currentColor"
            borderRadius="6px"
            position="relative"
            style={{
              transition: "width 0.3s ease",
              color:
                color === "blue.500"
                  ? "#3b82f6"
                  : color === "red.500"
                    ? "#ef4444"
                    : color === "green.500"
                      ? "#10b981"
                      : color === "purple.500"
                        ? "#8b5cf6"
                        : color === "orange.500"
                          ? "#f59e0b"
                          : "#3b82f6",
            }}
          >
            {progress > 10 && (
              <Box
                position="absolute"
                right="2px"
                top="50%"
                transform="translateY(-50%)"
                w="8px"
                h="8px"
                bg="white"
                borderRadius="50%"
                opacity={0.9}
              />
            )}
          </Box>
        </Box>
        <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
          {Math.round(progress)}% • {children ? "Time remaining" : "Progress"}
        </Text>
      </Box>
    </Box>
  );
};
