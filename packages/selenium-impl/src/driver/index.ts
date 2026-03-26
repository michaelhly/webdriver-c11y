import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schemas";
import { createContext } from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import {
	type SeleniumDriverOptions,
	applyBrowserOptions,
	buildClassicComponents,
} from "./classic.js";

export type { SeleniumDriverOptions } from "./classic.js";
export { createSeleniumBidiDriver } from "./bidi.js";
export { createSeleniumClassicDriver } from "./classic.js";

export function createSeleniumDriver(
	options?: SeleniumDriverOptions,
): Driver {
	const ctx = createContext();
	if (options) applyBrowserOptions(ctx, options);
	return createDriver({
		protocol: "webdriver",
		classic: buildClassicComponents(ctx),
		bidi: buildBidiComponents(ctx),
	});
}
