import { Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/safari.js";
import type { OptionsBuilder } from "./builder.js";

export class SafariOptionsBuilder implements OptionsBuilder<Options> {
	static readonly vendor = Browser.SAFARI;
	readonly vendor = SafariOptionsBuilder.vendor;

	private useTechnologyPreview = false;

	setTechnologyPreview(use: boolean): this {
		this.useTechnologyPreview = use;
		return this;
	}

	build(): Options {
		const options = new Options();
		if (this.useTechnologyPreview) {
			options.setTechnologyPreview(true);
		}
		return options;
	}
}
