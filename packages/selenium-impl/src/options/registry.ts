import type { Builder } from "selenium-webdriver";
import type { Options as ChromeOpts } from "selenium-webdriver/chrome.js";
import type { Options as EdgeOpts } from "selenium-webdriver/edge.js";
import type { Options as FirefoxOpts } from "selenium-webdriver/firefox.js";
import { optionsBuilderFromVendorCaps } from "./builder.js";
import { ChromeOptions } from "./chrome.js";
import { EdgeOptions } from "./edge.js";
import { FirefoxOptions } from "./firefox.js";

export const BROWSER_OPTION_KEYS = {
	chrome: "goog:chromeOptions",
	firefox: "moz:firefoxOptions",
	edge: "ms:edgeOptions",
} as const;

export const CAPABILITY_BUILDERS = [
	{
		vendor: BROWSER_OPTION_KEYS.chrome,
		fromCaps: (caps: Record<string, unknown>) =>
			optionsBuilderFromVendorCaps(ChromeOptions, caps),
	},
	{
		vendor: BROWSER_OPTION_KEYS.firefox,
		fromCaps: (caps: Record<string, unknown>) =>
			optionsBuilderFromVendorCaps(FirefoxOptions, caps),
	},
	{
		vendor: BROWSER_OPTION_KEYS.edge,
		fromCaps: (caps: Record<string, unknown>) =>
			optionsBuilderFromVendorCaps(EdgeOptions, caps),
	},
] as const;

export const OPTION_SETTERS: Record<
	string,
	(builder: Builder, opts: unknown) => void
> = {
	[BROWSER_OPTION_KEYS.chrome]: (b, o) =>
		b.setChromeOptions(o as ChromeOpts),
	[BROWSER_OPTION_KEYS.firefox]: (b, o) =>
		b.setFirefoxOptions(o as FirefoxOpts),
	[BROWSER_OPTION_KEYS.edge]: (b, o) => b.setEdgeOptions(o as EdgeOpts),
};
