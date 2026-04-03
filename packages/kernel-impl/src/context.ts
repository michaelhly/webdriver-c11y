import type {
  LocatorStrategy,
  ScriptExpression,
} from "@michaelhly.webdriver-c11y/schemas";
import {
  DriverError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClientOptions } from "@onkernel/sdk";
import Kernel from "@onkernel/sdk";
import type {
  BrowserCreateParams,
  BrowserCreateResponse,
} from "@onkernel/sdk/resources/browsers/browsers.js";

// ---------------------------------------------------------------------------
// KernelContext — shared state for all handlers.
// ---------------------------------------------------------------------------

export interface KernelContext {
  getClient(): Kernel;
  getSessionId(): string;
  getBrowser(): BrowserCreateResponse;
  setBrowser(browser: BrowserCreateResponse): void;
  clearSession(): void;
  getCdpWsUrl(): string;
  getLiveViewUrl(): string;
  nextElementId(): string;
  nextShadowRootId(): string;
  getCreateParams(): BrowserCreateParams;
}

export function createContext(
  browserOpts: BrowserCreateParams = {},
  clientOpts?: ClientOptions,
): KernelContext {
  const client = new Kernel();
  let browser: BrowserCreateResponse | null = null;
  let elementCounter = 0;
  let shadowRootCounter = 0;

  return {
    getClient: () => (clientOpts ? client.withOptions(clientOpts) : client),
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
    getCdpWsUrl: () => {
      if (!browser) throw new DriverError("No CDP WebSocket URL available");
      return browser.cdp_ws_url;
    },
    getLiveViewUrl: () => {
      if (!browser?.browser_live_view_url)
        throw new DriverError("No live view URL available");
      return browser.browser_live_view_url;
    },
    nextElementId: () => `el-${++elementCounter}`,
    nextShadowRootId: () => `sr-${++shadowRootCounter}`,
    getCreateParams: () => browserOpts,
  };
}

// ---------------------------------------------------------------------------
// Playwright code execution helper — used only for DOM queries and operations
// that the computer API cannot perform.
// ---------------------------------------------------------------------------

function normalizeCode(code: ScriptExpression): string {
  if (typeof code === "string") return code;
  return `return (${code.toString()})();`;
}

export async function exec<T>(
  ctx: KernelContext,
  code: ScriptExpression,
): Promise<T> {
  const response = await ctx
    .getClient()
    .browsers.playwright.execute(ctx.getSessionId(), {
      code: normalizeCode(code),
    });
  if (!response.success) {
    throw new DriverError(response.error ?? "Playwright execution failed");
  }
  return response.result as T;
}

/** data attribute used to tag DOM elements with stable IDs across calls. */
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

// ---------------------------------------------------------------------------
// JSON-safe string escaping for injecting into Playwright code templates.
// ---------------------------------------------------------------------------

export function esc(value: string): string {
  return JSON.stringify(value);
}
