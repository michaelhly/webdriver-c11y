import {
  type ClassicDriver,
  createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import type { BrowserCreateParams, BrowserCreateResponse } from "@onkernel/sdk/resources/browsers/browsers.js";
import { createContext } from "../context.js";
import { buildClassicComponents } from "./classic.js";

export { createKernelBidiDriver } from "./bidi.js";
export { createKernelClassicDriver } from "./classic.js";

/** Creates a Kernel-backed Classic WebDriver. */
export function createKernelDriver(
  createParams?: BrowserCreateParams,
  browser?: BrowserCreateResponse,
): ClassicDriver {
  const ctx = createContext(createParams, browser);
  return createClassicDriver({
    protocol: "playwright",
    ...buildClassicComponents(ctx),
  });
}
