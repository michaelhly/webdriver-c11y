import {
  type ClassicDriver,
  createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import { createContext, type KernelDriverOptions } from "../context.js";
import { buildClassicComponents } from "./classic.js";

export type { KernelDriverOptions } from "../context.js";
export { createKernelBidiDriver } from "./bidi.js";
export { createKernelClassicDriver } from "./classic.js";

/** Creates a Kernel-backed Classic WebDriver. */
export function createKernelDriver(
  options?: KernelDriverOptions,
): ClassicDriver {
  const ctx = createContext(options);
  return createClassicDriver({
    protocol: "cdp",
    ...buildClassicComponents(ctx),
  });
}
