import { Browser, Builder } from "selenium-webdriver";
import type { Options as ChromeSeleniumOptions } from "selenium-webdriver/chrome.js";
import type { Options as EdgeSeleniumOptions } from "selenium-webdriver/edge.js";
import type { Options as FirefoxSeleniumOptions } from "selenium-webdriver/firefox.js";
import type { Options as SafariSeleniumOptions } from "selenium-webdriver/safari.js";
import { ChromeOptionsBuilder } from "./chrome.js";
import { EdgeOptionsBuilder } from "./edge.js";
import { FirefoxOptionsBuilder } from "./firefox.js";

export const CAPABILITY_BUILDERS = [
	{ vendor: ChromeOptionsBuilder.vendor, fromCaps: ChromeOptionsBuilder.fromCapabilities },
	{ vendor: FirefoxOptionsBuilder.vendor, fromCaps: FirefoxOptionsBuilder.fromCapabilities },
	{ vendor: EdgeOptionsBuilder.vendor, fromCaps: EdgeOptionsBuilder.fromCapabilities },
] as const;

type SetOptionsMethod = (builder: Builder, opts: unknown) => void;

export const OPTION_SETTERS: Record<string, SetOptionsMethod> = {
	[Browser.CHROME]: (b, o) => b.setChromeOptions(o as ChromeSeleniumOptions),
	[Browser.FIREFOX]: (b, o) => b.setFirefoxOptions(o as FirefoxSeleniumOptions),
	[Browser.EDGE]: (b, o) => b.setEdgeOptions(o as EdgeSeleniumOptions),
	[Browser.SAFARI]: (b, o) => b.setSafariOptions(o as SafariSeleniumOptions),
};
