import type { LocatorStrategy } from "@michaelhly.webdriver-c11y/schemas";
import {
  DriverError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClientOptions } from "@onkernel/sdk";
import Kernel from "@onkernel/sdk";
import type {
  BrowserCreateParams,
  BrowserCreateResponse,
  BrowserListResponse,
} from "@onkernel/sdk/resources/browsers/browsers.js";

// ---------------------------------------------------------------------------
// KernelContext — shared state for all handlers.
// ---------------------------------------------------------------------------

/** SDK client wiring for {@link createContext}. */
export interface KernelSdkOptions {
  clientOpts?: ClientOptions;
  /** Shared client; default is `new Kernel()`. */
  kernel?: Kernel;
}

/** No browser yet; first `newSession` calls `browsers.create`. */
export type KernelContextNewSessionOptions = KernelSdkOptions & {
  mode: "new";
  /** Passed to `browsers.create` when `newSession` runs. */
  browserOpts?: BrowserCreateParams;
};

/** Browser already known; same as {@link KernelContext.setBrowser} before `newSession`. */
export type KernelContextExistingSessionOptions = KernelSdkOptions & {
  mode: "existing";
  existingBrowser: BrowserListResponse;
};

export type KernelContextOptions =
  | KernelContextNewSessionOptions
  | KernelContextExistingSessionOptions;

export interface KernelContext {
  getClient(): Kernel;
  getSessionId(): string;
  getBrowser(): BrowserCreateResponse;
  setBrowser(browser: BrowserCreateResponse): void;
  clearSession(): void;
  nextElementId(): string;
  nextShadowRootId(): string;
  getBrowserOpts(): BrowserCreateParams;
}

export function createContext(
  options: KernelContextOptions = { mode: "new" },
): KernelContext {
  const client = options.kernel ?? new Kernel();
  const co = options.clientOpts;

  const browserOpts = options.mode === "new" ? (options.browserOpts ?? {}) : {};
  const existingBrowser =
    options.mode === "existing" ? options.existingBrowser : undefined;

  let browser: BrowserCreateResponse | null = existingBrowser ?? null;
  let elementCounter = 0;
  let shadowRootCounter = 0;

  return {
    getClient: () => (co ? client.withOptions(co) : client),
    getSessionId: () => {
      if (!browser) throw new DriverError("No active session");
      return browser.session_id;
    },
    getBrowser: () => {
      if (!browser) throw new DriverError("No active session");
      return browser;
    },
    setBrowser: (b) => {
      browser = b;
    },
    clearSession: () => {
      browser = null;
      elementCounter = 0;
      shadowRootCounter = 0;
    },
    nextElementId: () => `el-${++elementCounter}`,
    nextShadowRootId: () => `sr-${++shadowRootCounter}`,
    getBrowserOpts: () => browserOpts,
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
