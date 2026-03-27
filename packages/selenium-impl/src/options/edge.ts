import { Options } from "selenium-webdriver/edge.js";
import type { SeleniumBrowserOptions } from "./interface.js";
import type { Capabilities } from "@michaelhly.webdriver-c11y/schemas";

export class EdgeOptions extends Options implements SeleniumBrowserOptions<Options> {
	readonly capKey = "ms:edgeOptions";

    fromCapabilities(caps: Capabilities): Options {
		const browserOpts = caps[this.capKey];
		if (!browserOpts) {
			throw new Error(`Browser options not found for key: ${this.capKey}`);
		}

		return new Options(browserOpts);
    }
}