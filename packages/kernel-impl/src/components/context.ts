import Kernel from "@onkernel/sdk";
import type { LocatorStrategy } from "@michaelhly.webdriver-c11y/schemas";
import {
  DriverError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";

// ---------------------------------------------------------------------------
// Options for creating a Kernel-backed browser session.
// ---------------------------------------------------------------------------

export interface KernelDriverOptions {
  apiKey?: string;
  headless?: boolean;
  stealth?: boolean;
  gpu?: boolean;
  viewport?: { width: number; height: number };
  timeoutSeconds?: number;
}

// ---------------------------------------------------------------------------
// KernelContext — shared state for all handlers.
// ---------------------------------------------------------------------------

export interface KernelContext {
  getClient(): Kernel;
  getSessionId(): string;
  setSession(sessionId: string): void;
  clearSession(): void;
  nextElementId(): string;
  nextShadowRootId(): string;
  getOptions(): KernelDriverOptions;
}

export function createContext(
  options: KernelDriverOptions = {},
): KernelContext {
  const client = new Kernel({ apiKey: options.apiKey });
  let sessionId: string | null = null;
  let elementCounter = 0;
  let shadowRootCounter = 0;

  return {
    getClient: () => client,
    getSessionId: () => {
      if (!sessionId) throw new DriverError("No active session");
      return sessionId;
    },
    setSession: (id) => {
      sessionId = id;
    },
    clearSession: () => {
      sessionId = null;
      elementCounter = 0;
      shadowRootCounter = 0;
    },
    nextElementId: () => `el-${++elementCounter}`,
    nextShadowRootId: () => `sr-${++shadowRootCounter}`,
    getOptions: () => options,
  };
}

// ---------------------------------------------------------------------------
// Data attribute used to tag DOM elements with stable IDs across calls.
// ---------------------------------------------------------------------------

export const EID_ATTR = "data-kernel-eid";

// ---------------------------------------------------------------------------
// Locator strategy → Playwright selector conversion.
// ---------------------------------------------------------------------------

export function toPlaywrightSelector(
  using: LocatorStrategy,
  value: string,
): string {
  switch (using) {
    case "css":
      return `css=${value}`;
    case "xpath":
      return `xpath=${value}`;
    case "id":
      return `css=#${CSS.escape(value)}`;
    case "name":
      return `css=[name=${JSON.stringify(value)}]`;
    case "tag-name":
      return `css=${value}`;
    case "class-name":
      return `css=.${CSS.escape(value)}`;
    case "link-text":
      return `css=a >> text=${JSON.stringify(value)}`;
    case "partial-link-text":
      return `css=a >> text=${JSON.stringify(value)}`;
    case "text":
      return `text=${JSON.stringify(value)}`;
    case "placeholder":
      return `css=[placeholder=${JSON.stringify(value)}]`;
    case "role":
      return `role=${value}`;
    case "label":
      return `css=[aria-label=${JSON.stringify(value)}]`;
    default:
      throw new UnsupportedOperationError(
        `Unsupported locator strategy: ${using as string}`,
      );
  }
}
