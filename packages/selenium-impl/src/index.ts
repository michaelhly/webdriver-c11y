export type { Capabilities as SeleniumCapabilities } from "selenium-webdriver";
export { normalizeSeleniumCapabilities } from "./capabilities.js";
export type { SeleniumDriverOptions } from "./driver/index.js";
export {
  createSeleniumBidiDriver,
  createSeleniumClassicDriver,
  createSeleniumDriver,
} from "./driver/index.js";

export * from "./options.js";
