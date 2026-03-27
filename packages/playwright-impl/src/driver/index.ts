import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schemas";
import { createContext } from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import {
  buildClassicComponents,
  type PlaywrightDriverOptions,
} from "./classic.js";

export { createPlaywrightBidiDriver } from "./bidi.js";
export type { PlaywrightDriverOptions } from "./classic.js";
export { createPlaywrightClassicDriver } from "./classic.js";

export function createPlaywrightDriver(
  _options?: PlaywrightDriverOptions,
): Driver {
  const ctx = createContext();
  return createDriver({
    protocol: "cdp",
    classic: buildClassicComponents(ctx),
    bidi: buildBidiComponents(ctx),
  });
}
