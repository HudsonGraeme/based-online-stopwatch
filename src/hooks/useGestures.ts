import { useSwipeable } from "react-swipeable";
import type { SwipeableHandlers } from "react-swipeable";

interface GestureConfig {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  delta?: number;
  preventScrollOnSwipe?: boolean;
  trackTouch?: boolean;
  trackMouse?: boolean;
}

export const useGestures = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  delta = 50,
  preventScrollOnSwipe = false,
  trackTouch = true,
  trackMouse = false,
}: GestureConfig): SwipeableHandlers => {
  return useSwipeable({
    onSwipedUp: disabled ? undefined : onSwipeUp,
    onSwipedDown: disabled ? undefined : onSwipeDown,
    onSwipedLeft: disabled ? undefined : onSwipeLeft,
    onSwipedRight: disabled ? undefined : onSwipeRight,
    delta,
    preventScrollOnSwipe,
    trackTouch,
    trackMouse,
  });
};

interface TimerGestureConfig {
  onStartStop?: () => void;
  onReset?: () => void;
  onSecondaryAction?: () => void;
  disabled?: boolean;
}

export const useTimerGestures = ({
  onStartStop,
  onReset,
  onSecondaryAction,
  disabled = false,
}: TimerGestureConfig) => {
  return useGestures({
    onSwipeUp: onStartStop,
    onSwipeDown: onReset,
    onSwipeLeft: onSecondaryAction,
    disabled,
    delta: 75,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });
};

interface NavigationGestureConfig {
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
  disabled?: boolean;
}

export const useNavigationGestures = ({
  onNavigateNext,
  onNavigatePrevious,
  disabled = false,
}: NavigationGestureConfig) => {
  return useGestures({
    onSwipeLeft: onNavigateNext,
    onSwipeRight: onNavigatePrevious,
    disabled,
    delta: 100,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: true,
  });
};

interface TimeAdjustmentGestureConfig {
  onIncrease?: (delta: number) => void;
  onDecrease?: (delta: number) => void;
  disabled?: boolean;
  sensitivity?: number;
}

export const useTimeAdjustmentGestures = ({
  onIncrease,
  onDecrease,
  disabled = false,
  sensitivity = 1,
}: TimeAdjustmentGestureConfig) => {
  return useSwipeable({
    onSwiping: disabled
      ? undefined
      : (eventData) => {
          const { deltaY, first } = eventData;
          if (first) return;

          const delta = Math.abs(deltaY);
          if (delta > 20) {
            const adjustment = Math.floor(delta / 20) * sensitivity * 1000;
            if (deltaY < 0 && onIncrease) {
              onIncrease(adjustment);
            } else if (deltaY > 0 && onDecrease) {
              onDecrease(adjustment);
            }
          }
        },
    delta: 10,
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
  });
};
