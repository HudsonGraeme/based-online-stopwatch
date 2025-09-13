import {
  CircularProgress,
  GlowingCircular,
  MinimalLinear,
  PulsingCircular,
  SegmentedCircular,
  StyledLinear,
} from "./ProgressIndicators";
import { useProgressIndicator } from "../hooks/useProgressIndicator";

type ProgressIndicatorType =
  | "circular"
  | "glowing"
  | "linear"
  | "pulsing"
  | "segmented"
  | "styled";

interface UniversalProgressIndicatorProps {
  progress: number;
  size?: number;
  color?: string;
  children?: React.ReactNode;
}

const getProgressComponent = (type: ProgressIndicatorType) => {
  switch (type) {
    case "circular":
      return CircularProgress;
    case "glowing":
      return GlowingCircular;
    case "linear":
      return MinimalLinear;
    case "pulsing":
      return PulsingCircular;
    case "segmented":
      return SegmentedCircular;
    case "styled":
      return StyledLinear;
    default:
      return CircularProgress;
  }
};

export function UniversalProgressIndicator({
  progress,
  size = 250,
  color = "blue.500",
  children,
}: UniversalProgressIndicatorProps) {
  const { progressIndicatorType, isLoaded } = useProgressIndicator();

  if (!isLoaded) {
    // Show default while loading
    return (
      <CircularProgress progress={progress} size={size} color={color}>
        {children}
      </CircularProgress>
    );
  }

  const ProgressComponent = getProgressComponent(progressIndicatorType);

  return (
    <ProgressComponent progress={progress} size={size} color={color}>
      {children}
    </ProgressComponent>
  );
}
