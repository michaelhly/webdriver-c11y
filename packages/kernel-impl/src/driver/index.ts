import type { ClassicDriver } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContextOptions } from "../context.js";
import { createKernelDriver } from "./classic.js";

export { createKernelBidiDriver } from "./bidi.js";
export {
  createKernelClassicDriverFromContext,
  createKernelDriver,
} from "./classic.js";

/** Classic WebDriver backed by Kernel; same as {@link createKernelDriver}. */
export function createKernelClassicDriver(
  options?: KernelContextOptions,
): ClassicDriver {
  return createKernelDriver(options);
}
