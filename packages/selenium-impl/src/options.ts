/** W3C vendor capability keys understood by selenium-webdriver `Builder`. */
export const BROWSER_OPTION_KEYS = {
	chrome: "goog:chromeOptions",
	firefox: "moz:firefoxOptions",
	edge: "ms:edgeOptions",
} as const;

// Convenience aliases for selenium-webdriver `Options` (same classes, stable names for consumers).
export { Options as ChromeOptions } from "selenium-webdriver/chrome.js";
export { Options as EdgeOptions } from "selenium-webdriver/edge.js";
export { Options as FirefoxOptions } from "selenium-webdriver/firefox.js";

