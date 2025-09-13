import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface GlassButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  glassLevel?: "subtle" | "medium" | "strong";
}

const glassVariants = {
  primary: {
    subtle: {
      bg: "rgba(255, 255, 255, 0.03)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      color: "#f9fafb",
      _hover: {
        bg: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-1px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.12)",
        transform: "translateY(0)",
      },
    },
    medium: {
      bg: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      color: "#ffffff",
      _hover: {
        bg: "rgba(255, 255, 255, 0.12)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        transform: "translateY(-1px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.16)",
        transform: "translateY(0)",
      },
    },
    strong: {
      bg: "rgba(255, 255, 255, 0.12)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      color: "#ffffff",
      _hover: {
        bg: "rgba(255, 255, 255, 0.16)",
        borderColor: "rgba(255, 255, 255, 0.4)",
        transform: "translateY(-1px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(0)",
      },
    },
  },
  secondary: {
    subtle: {
      bg: "rgba(255, 255, 255, 0.02)",
      borderColor: "rgba(255, 255, 255, 0.15)",
      color: "white",
      _hover: {
        bg: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        transform: "translateY(-2px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.12)",
        transform: "translateY(0)",
      },
    },
    medium: {
      bg: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      _hover: {
        bg: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.3)",
        transform: "translateY(-1px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.15)",
        transform: "translateY(0)",
      },
    },
    strong: {
      bg: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.25)",
      color: "white",
      _hover: {
        bg: "rgba(255, 255, 255, 0.12)",
        borderColor: "rgba(255, 255, 255, 0.35)",
        transform: "translateY(-1px)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.16)",
        transform: "translateY(0)",
      },
    },
  },
  ghost: {
    subtle: {
      bg: "transparent",
      borderColor: "transparent",
      color: "rgba(255, 255, 255, 0.8)",
      _hover: {
        bg: "rgba(255, 255, 255, 0.05)",
        color: "#ffffff",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.1)",
      },
    },
    medium: {
      bg: "transparent",
      borderColor: "transparent",
      color: "rgba(255, 255, 255, 0.9)",
      _hover: {
        bg: "rgba(255, 255, 255, 0.1)",
        color: "#ffffff",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.15)",
      },
    },
    strong: {
      bg: "transparent",
      borderColor: "transparent",
      color: "#ffffff",
      _hover: {
        bg: "rgba(255, 255, 255, 0.15)",
      },
      _active: {
        bg: "rgba(255, 255, 255, 0.2)",
      },
    },
  },
  danger: {
    subtle: {
      bg: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)",
      color: "#fca5a5",
      _hover: {
        bg: "rgba(239, 68, 68, 0.2)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        color: "#ffffff",
      },
      _active: {
        bg: "rgba(239, 68, 68, 0.3)",
      },
    },
    medium: {
      bg: "rgba(239, 68, 68, 0.2)",
      borderColor: "rgba(239, 68, 68, 0.4)",
      color: "#ffffff",
      _hover: {
        bg: "rgba(239, 68, 68, 0.3)",
        borderColor: "rgba(239, 68, 68, 0.5)",
      },
      _active: {
        bg: "rgba(239, 68, 68, 0.4)",
      },
    },
    strong: {
      bg: "red.500",
      borderColor: "red.600",
      color: "#ffffff",
      _hover: {
        bg: "red.600",
        borderColor: "red.700",
      },
      _active: {
        bg: "red.700",
      },
    },
  },
  success: {
    subtle: {
      bg: "rgba(34, 197, 94, 0.1)",
      borderColor: "rgba(34, 197, 94, 0.3)",
      color: "#86efac",
      _hover: {
        bg: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 0.4)",
        color: "#ffffff",
      },
      _active: {
        bg: "rgba(34, 197, 94, 0.3)",
      },
    },
    medium: {
      bg: "rgba(34, 197, 94, 0.2)",
      borderColor: "rgba(34, 197, 94, 0.4)",
      color: "#ffffff",
      _hover: {
        bg: "rgba(34, 197, 94, 0.3)",
        borderColor: "rgba(34, 197, 94, 0.5)",
      },
      _active: {
        bg: "rgba(34, 197, 94, 0.4)",
      },
    },
    strong: {
      bg: "green.500",
      borderColor: "green.600",
      color: "#ffffff",
      _hover: {
        bg: "green.600",
        borderColor: "green.700",
      },
      _active: {
        bg: "green.700",
      },
    },
  },
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ variant = "primary", glassLevel = "subtle", children, ...props }, ref) => {
    const styles = glassVariants[variant][glassLevel];

    return (
      <Button
        ref={ref}
        border="1px solid"
        borderRadius="8px"
        fontWeight="500"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        {...styles}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GlassButton.displayName = "GlassButton";
