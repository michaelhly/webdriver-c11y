import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schemas";
import { createContext } from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import {
	applyBrowserOptions,
	buildClassicComponents,
	type SeleniumDriverOptions,
} from "./classic.js";

export { createSeleniumBidiDriver } from "./bidi.js";
export type { SeleniumDriverOptions } from "./classic.js";
export { createSeleniumClassicDriver } from "./classic.js";

/** WebDriver classic + BiDi driver; forwards `SeleniumDriverOptions` to the Selenium `Builder`. */
export function createSeleniumDriver(options?: SeleniumDriverOptions): Driver {
	const ctx = createContext();
	if (options) applyBrowserOptions(ctx, options);
	return createDriver({
		protocol: "webdriver",
		classic: buildClassicComponents(ctx),
		bidi: buildBidiComponents(ctx),
	});
}
