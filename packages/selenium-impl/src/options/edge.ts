import { Options } from "selenium-webdriver/edge.js";
import {
	ChromiumOptionsBuilder,
	type ChromiumCapabilities,
} from "./chromium.js";

export class EdgeOptionsBuilder extends ChromiumOptionsBuilder<Options> {
	static readonly vendor = "ms:edgeOptions";
	readonly vendor = EdgeOptionsBuilder.vendor;

	static fromCapabilities(caps: ChromiumCapabilities): EdgeOptionsBuilder {
		const builder = new EdgeOptionsBuilder();
		builder.applyCapabilities(caps);
		return builder;
	}

	build(): Options {
		const options = new Options();
		this.applyTo(options);
		return options;
	}
}
