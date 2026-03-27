import { Options } from "selenium-webdriver/firefox.js";
import type { SeleniumBrowserOptions } from "./interface.js";
import type { Capabilities } from "@michaelhly.webdriver-c11y/schemas";

export class FirefoxOptions extends Options implements SeleniumBrowserOptions<Options> {
	readonly capKey = "moz:firefoxOptions";

    fromCapabilities(caps: Capabilities): Options {
		const browserOpts = caps[this.capKey];
		if (!browserOpts) {
			throw new Error(`Browser options not found for key: ${this.capKey}`);
		}

		return new Options(browserOpts);
    }
}