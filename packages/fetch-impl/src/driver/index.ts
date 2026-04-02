import {
  type ClassicDriver,
  createClassicDriver,
  createDriver,
  type Driver,
} from "@michaelhly.webdriver-c11y/schemas";
import { createContext } from "../context.js";
import { buildBidiComponents } from "./bidi.js";
import { buildClassicComponents } from "./classic.js";

export interface HttpDriverOptions {
  serverUrl: string;
}

/** WebDriver Classic driver backed by HTTP fetch. */
export function createHttpClassicDriver(
  options: HttpDriverOptions,
): ClassicDriver {
  const ctx = createContext(options.serverUrl);
  return createClassicDriver({
    protocol: "webdriver",
    ...buildClassicComponents(ctx),
  });
}

/** Combined Classic + BiDi driver; BiDi methods throw UnsupportedOperationError. */
export function createHttpDriver(options: HttpDriverOptions): Driver {
  const ctx = createContext(options.serverUrl);
  return createDriver({
    protocol: "webdriver",
    classic: buildClassicComponents(ctx),
    bidi: buildBidiComponents(),
  });
}
