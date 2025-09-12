import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

interface KeyboardShortcuts {
  onShowHelp: () => void;
  onHideHelp: () => void;
}

export const useGlobalKeyboardShortcuts = ({
  onShowHelp,
  onHideHelp,
}: KeyboardShortcuts) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  // Removed unused helpKeyTimer
  const [isHelpKeyPressed, setIsHelpKeyPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const target = event.target as HTMLElement;

      // Don't handle shortcuts if user is typing in an input/textarea
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Handle help key (show on press)
      if (key === "?" || key === "/") {
        event.preventDefault();
        if (!isHelpKeyPressed) {
          setIsHelpKeyPressed(true);
          onShowHelp();
        }
        return;
      }

      // Navigation shortcuts
      switch (key) {
        case "h":
          event.preventDefault();
          navigate("/");
          break;
        case "t":
          event.preventDefault();
          navigate("/countdown");
          break;
        case "p":
          event.preventDefault();
          navigate("/pomodoro");
          break;
        case "c":
          event.preventDefault();
          navigate("/clocks");
          break;
        case "escape":
          event.preventDefault();
          // Close any open modals or deselect
          document.dispatchEvent(new CustomEvent("escape-pressed"));
          break;
        case "f11":
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
          break;
      }

      setPressedKeys((prev) => new Set(prev).add(key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // Hide help when ? key is released
      if ((key === "?" || key === "/") && isHelpKeyPressed) {
        setIsHelpKeyPressed(false);
        onHideHelp();
      }

      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [navigate, location, onShowHelp, onHideHelp, isHelpKeyPressed]);

  return { pressedKeys };
};
