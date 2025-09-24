import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

(global as any).ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

(global as any).IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

(global as any).Worker = vi.fn().mockImplementation(() => ({
  postMessage: vi.fn(),
  addEventListener: vi.fn(),
  terminate: vi.fn(),
}));

Object.defineProperty(window, "location", {
  writable: true,
  value: {
    href: "http://localhost:3000",
    origin: "http://localhost:3000",
    protocol: "http:",
    host: "localhost:3000",
    pathname: "/",
    search: "",
    hash: "",
  },
});
