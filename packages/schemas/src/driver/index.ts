import {
  type BidiDriver,
  type BidiDriverComponents,
  createBidiDriver,
} from "./bidi.js";
import {
  type ClassicDriver,
  type ClassicDriverComponents,
  createClassicDriver,
} from "./classic.js";

// ---------------------------------------------------------------------------
// Protocol identifier — distinguishes the underlying implementation.
// ---------------------------------------------------------------------------

export type Protocol = "webdriver" | "cdp";

// ---------------------------------------------------------------------------
// Driver — combined Classic + BiDi interface.
// ---------------------------------------------------------------------------

export type Driver = ClassicDriver & BidiDriver;

export interface DriverComponents {
  protocol: Protocol;
  classic: Omit<ClassicDriverComponents, "protocol">;
  bidi: Omit<BidiDriverComponents, "protocol">;
}

export function createDriver(components: DriverComponents): Driver {
  const { protocol, classic, bidi } = components;
  return {
    ...createClassicDriver({ protocol, ...classic }),
    ...createBidiDriver({ protocol, ...bidi }),
  };
}

export {
  type BidiBrowserHandlers,
  type BidiBrowsingContextHandlers,
  type BidiDriver,
  type BidiDriverComponents,
  type BidiInputHandlers,
  type BidiLogHandlers,
  type BidiNetworkHandlers,
  type BidiResponse,
  type BidiScriptHandlers,
  type BidiStorageHandlers,
  createBidiDriver,
} from "./bidi.js";
// Re-export everything from classic and bidi
export {
  type ActionHandlers,
  type AlertHandlers,
  type ClassicDriver,
  type ClassicDriverComponents,
  type ContextHandlers,
  type CookieHandlers,
  createClassicDriver,
  type ElementHandlers,
  type NavigationHandlers,
  type PrintHandlers,
  type ScreenshotHandlers,
  type ScriptHandlers,
  type SessionHandlers,
  type WindowHandlers,
} from "./classic.js";
