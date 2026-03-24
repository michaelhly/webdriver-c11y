import {
	type BidiDriver,
	type BidiDriverComponents,
	createBidiDriver,
} from "./bidi-driver.js";
import {
	type ClassicDriver,
	type ClassicDriverComponents,
	createClassicDriver,
} from "./classic-driver.js";

// ---------------------------------------------------------------------------
// Protocol identifier — distinguishes the underlying implementation.
// ---------------------------------------------------------------------------

export type Protocol = "webdriver" | "cdp";

// ---------------------------------------------------------------------------
// Driver — combined Classic + BiDi interface.
// ---------------------------------------------------------------------------

export type Driver = ClassicDriver & BidiDriver;

export interface DriverComponents {
	protocol: Protocol;
	classic: Omit<ClassicDriverComponents, "protocol">;
	bidi: Omit<BidiDriverComponents, "protocol">;
}

export function createDriver(components: DriverComponents): Driver {
	const { protocol, classic, bidi } = components;
	return {
		...createClassicDriver({ protocol, ...classic }),
		...createBidiDriver({ protocol, ...bidi }),
	};
}
