import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "./test/test-utils";
import userEvent from "@testing-library/user-event";
import Stopwatch from "./Stopwatch";

vi.mock("./hooks/useGestures", () => ({
  useTimerGestures: () => ({}),
}));

vi.mock("./hooks/useWebWorkerTimer", () => ({
  useWebWorkerTimer: vi.fn(() => ({
    isRunning: false,
    value: 0,
    start: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn(),
    updateValue: vi.fn(),
    updateConfig: vi.fn(),
  })),
}));

const mockUseWebWorkerTimer = vi.mocked(
  await import("./hooks/useWebWorkerTimer").then((m) => m.useWebWorkerTimer)
);

describe("Stopwatch Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUseWebWorkerTimer.mockReturnValue({
      isRunning: false,
      value: 0,
      start: vi.fn(),
      stop: vi.fn(),
      reset: vi.fn(),
      updateValue: vi.fn(),
      updateConfig: vi.fn(),
    });
  });

  describe("Initial State", () => {
    it("renders with initial time display", () => {
      render(<Stopwatch />);

      expect(screen.getByText("00:00.00")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /start/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /reset/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /lap/i })).toBeInTheDocument();
    });

    it("has reset and lap buttons disabled initially", () => {
      render(<Stopwatch />);

      expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /lap/i })).toBeDisabled();
    });

    it("shows empty lap times message", () => {
      render(<Stopwatch />);

      expect(
        screen.getByText("Lap times will appear here")
      ).toBeInTheDocument();
    });
  });

  describe("Running State", () => {
    it("shows stop button when running", () => {
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: true,
        value: 1000,
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /start/i })
      ).not.toBeInTheDocument();
    });

    it("enables lap button when running", () => {
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: true,
        value: 1000,
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      expect(screen.getByRole("button", { name: /lap/i })).not.toBeDisabled();
    });
  });

  describe("Timer with Value", () => {
    it("enables reset button when timer has value and not running", () => {
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 5000,
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      expect(screen.getByRole("button", { name: /reset/i })).not.toBeDisabled();
    });

    it("displays formatted time correctly", () => {
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 61230, // 1:01.23
        start: vi.fn(),
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      expect(screen.getByText("01:01.23")).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("calls start function when start button clicked", async () => {
      const mockStart = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 0,
        start: mockStart,
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      const startButton = screen.getByRole("button", { name: /start/i });
      await user.click(startButton);

      expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it("calls stop function when stop button clicked", async () => {
      const mockStop = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: true,
        value: 1000,
        start: vi.fn(),
        stop: mockStop,
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      const stopButton = screen.getByRole("button", { name: /stop/i });
      await user.click(stopButton);

      expect(mockStop).toHaveBeenCalledTimes(1);
    });

    it("calls reset function when reset button clicked", async () => {
      const mockReset = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 5000,
        start: vi.fn(),
        stop: vi.fn(),
        reset: mockReset,
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      const resetButton = screen.getByRole("button", { name: /reset/i });
      await user.click(resetButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("triggers start when spacebar pressed", () => {
      const mockStart = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 0,
        start: mockStart,
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      fireEvent.keyDown(document, { code: "Space" });

      expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it("triggers stop when spacebar pressed while running", () => {
      const mockStop = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: true,
        value: 1000,
        start: vi.fn(),
        stop: mockStop,
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(<Stopwatch />);

      fireEvent.keyDown(document, { code: "Space" });

      expect(mockStop).toHaveBeenCalledTimes(1);
    });

    it("ignores shortcuts when typing in inputs", () => {
      const mockStart = vi.fn();
      mockUseWebWorkerTimer.mockReturnValue({
        isRunning: false,
        value: 0,
        start: mockStart,
        stop: vi.fn(),
        reset: vi.fn(),
        updateValue: vi.fn(),
        updateConfig: vi.fn(),
      });

      render(
        <div>
          <input data-testid="test-input" />
          <Stopwatch />
        </div>
      );

      const input = screen.getByTestId("test-input");
      input.focus();

      fireEvent.keyDown(input, { code: "Space" });

      expect(mockStart).not.toHaveBeenCalled();
    });
  });

  describe("UI Elements", () => {
    it("shows keyboard shortcuts help text", () => {
      render(<Stopwatch />);

      expect(screen.getByText("Space")).toBeInTheDocument();
    });

    it("displays time in monospace font", () => {
      render(<Stopwatch />);

      const timeDisplay = screen.getByText("00:00.00");
      expect(timeDisplay).toHaveStyle({ fontFamily: "monospace" });
    });

    it("has proper accessibility attributes", () => {
      render(<Stopwatch />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("type", "button");
      });
    });
  });

  describe("Internationalization", () => {
    it("displays translated button labels", () => {
      render(<Stopwatch />);

      expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Lap" })).toBeInTheDocument();
    });
  });
});
