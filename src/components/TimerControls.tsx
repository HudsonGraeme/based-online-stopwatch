import { Flex } from "@chakra-ui/react";
import type { FlexProps } from "@chakra-ui/react";
import { GlassButton } from "./ui/GlassButton";

interface TimerAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface PrimaryAction extends TimerAction {
  variant: "success" | "danger";
  glassLevel?: "subtle" | "medium" | "strong";
}

interface SecondaryAction extends TimerAction {
  variant?: "secondary" | "ghost";
  glassLevel?: "subtle" | "medium" | "strong";
}

interface TimerControlsProps extends Omit<FlexProps, "children"> {
  primaryAction: PrimaryAction;
  secondaryActions?: SecondaryAction[];
  size?: "sm" | "md" | "lg";
  spacing?: number;
  orientation?: "horizontal" | "vertical";
}

export const TimerControls = ({
  primaryAction,
  secondaryActions = [],
  size = "md",
  spacing = 4,
  orientation = "horizontal",
  ...flexProps
}: TimerControlsProps) => {
  const isVertical = orientation === "vertical";

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      gap={spacing}
      flexDirection={isVertical ? "column" : "row"}
      flexWrap={isVertical ? "nowrap" : "wrap"}
      {...flexProps}
    >
      {/* Secondary actions before primary (Reset, etc.) */}
      {secondaryActions.map((action, index) => (
        <GlassButton
          key={`secondary-${index}`}
          variant={action.variant || "secondary"}
          glassLevel={action.glassLevel || "subtle"}
          size={{ base: size === "lg" ? "md" : "sm", md: size }}
          minW={{ base: "80px", md: "auto" }}
          onClick={action.onClick}
          isDisabled={action.disabled}
          isLoading={action.loading}
        >
          {action.label}
        </GlassButton>
      ))}

      {/* Primary action (Start/Stop) */}
      <GlassButton
        variant={primaryAction.variant}
        glassLevel={primaryAction.glassLevel || "medium"}
        size={{ base: size === "lg" ? "md" : "sm", md: size }}
        minW={{ base: "100px", md: "auto" }}
        onClick={primaryAction.onClick}
        isDisabled={primaryAction.disabled}
        isLoading={primaryAction.loading}
      >
        {primaryAction.label}
      </GlassButton>
    </Flex>
  );
};
