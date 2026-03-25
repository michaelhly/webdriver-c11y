import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schemas";
import { createContext } from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import { buildClassicComponents } from "./classic.js";

export { createSeleniumBidiDriver } from "./bidi.js";
export { createSeleniumClassicDriver } from "./classic.js";

export function createSeleniumDriver(): Driver {
	const ctx = createContext();
	return createDriver({
		protocol: "webdriver",
		classic: buildClassicComponents(ctx),
		bidi: buildBidiComponents(ctx),
	});
}
