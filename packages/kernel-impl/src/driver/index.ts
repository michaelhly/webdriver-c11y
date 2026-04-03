import {
  type ClassicDriver,
  createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClientOptions } from "@onkernel/sdk";
import type { BrowserCreateParams } from "@onkernel/sdk/resources/browsers/browsers.js";
import { createContext } from "../context.js";
import { buildClassicComponents } from "./classic.js";

export { createKernelBidiDriver } from "./bidi.js";
export { createKernelClassicDriver } from "./classic.js";

/** Creates a Kernel-backed Classic WebDriver. */
export function createKernelDriver(
  browserOpts?: BrowserCreateParams,
  clientOpts?: ClientOptions,
): ClassicDriver {
  const ctx = createContext(browserOpts, clientOpts);
  return createClassicDriver({
    protocol: "playwright",
    ...buildClassicComponents(ctx),
  });
}
