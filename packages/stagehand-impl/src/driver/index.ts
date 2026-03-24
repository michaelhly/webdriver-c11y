import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schema";
import { createContext } from "../components/context.js";
import { buildBidiComponents } from "./bidi.js";
import { buildClassicComponents } from "./classic.js";

export { createStagehandBidiDriver } from "./bidi.js";
export { createStagehandClassicDriver } from "./classic.js";

export function createStagehandDriver(): Driver {
	const ctx = createContext();
	return createDriver({
		protocol: "cdp",
		classic: buildClassicComponents(ctx),
		bidi: buildBidiComponents(ctx),
	});
}
