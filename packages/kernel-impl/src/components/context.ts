import Kernel from "@onkernel/sdk";
import type {
  LocatorStrategy,
  Rect,
  ScriptExpression,
} from "@michaelhly.webdriver-c11y/schemas";
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
  setSession(sessionId: string, bidiWsUrl: string): void;
  clearSession(): void;
  getBidiWsUrl(): string;
  nextElementId(): string;
  nextShadowRootId(): string;
  getOptions(): KernelDriverOptions;
}

export function createContext(
  options: KernelDriverOptions = {},
): KernelContext {
  const client = new Kernel({ apiKey: options.apiKey });
  let sessionId: string | null = null;
  let bidiWsUrl: string | null = null;
  let elementCounter = 0;
  let shadowRootCounter = 0;

  return {
    getClient: () => client,
    getSessionId: () => {
      if (!sessionId) throw new DriverError("No active session");
      return sessionId;
    },
    setSession: (id, wsUrl) => {
      sessionId = id;
      bidiWsUrl = wsUrl;
    },
    clearSession: () => {
      sessionId = null;
      bidiWsUrl = null;
      elementCounter = 0;
      shadowRootCounter = 0;
    },
    getBidiWsUrl: () => {
      if (!bidiWsUrl) throw new DriverError("No BiDi WebSocket URL available");
      return bidiWsUrl;
    },
    nextElementId: () => `el-${++elementCounter}`,
    nextShadowRootId: () => `sr-${++shadowRootCounter}`,
    getOptions: () => options,
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

// ---------------------------------------------------------------------------
// Element bounding-box helper — resolves element position for computer API.
// ---------------------------------------------------------------------------

export async function getElementRect(
  ctx: KernelContext,
  elementId: string,
): Promise<Rect> {
  return await exec<Rect>(
    ctx,
    `
    const box = await page.locator('[${EID_ATTR}=${JSON.stringify(elementId)}]').boundingBox();
    return box ? { x: box.x, y: box.y, width: box.width, height: box.height }
               : { x: 0, y: 0, width: 0, height: 0 };
  `,
  );
}

export function elementCenter(rect: Rect): { x: number; y: number } {
  return {
    x: Math.round(rect.x + rect.width / 2),
    y: Math.round(rect.y + rect.height / 2),
  };
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
