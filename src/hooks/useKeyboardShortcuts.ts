import { useEffect } from 'react';

interface KeyboardShortcuts {
  onStartStop?: () => void;
  onReset?: () => void;
  onLap?: () => void;
  onSkip?: () => void;
  disabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onStartStop,
  onReset,
  onLap,
  onSkip,
  disabled = false
}: KeyboardShortcuts) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if modifier keys are pressed (allow browser shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onStartStop?.();
          break;
        case 'KeyR':
          e.preventDefault();
          onReset?.();
          break;
        case 'KeyL':
          e.preventDefault();
          onLap?.();
          break;
        case 'KeyS':
          e.preventDefault();
          onSkip?.();
          break;
        case 'Escape':
          // Let individual components handle escape (like countdown digit selection)
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartStop, onReset, onLap, onSkip, disabled]);
};