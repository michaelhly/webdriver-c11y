import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schemas";
import {
  type KernelDriverOptions,
  createContext,
} from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import { buildClassicComponents } from "./classic.js";

export { createKernelBidiDriver } from "./bidi.js";
export { createKernelClassicDriver } from "./classic.js";
export type { KernelDriverOptions } from "../components/context.js";

/** Creates a Kernel-backed WebDriver with Classic + BiDi (BiDi is stubbed). */
export function createKernelDriver(options?: KernelDriverOptions): Driver {
  const ctx = createContext(options);
  return createDriver({
    protocol: "cdp",
    classic: buildClassicComponents(ctx),
    bidi: buildBidiComponents(),
  });
}
