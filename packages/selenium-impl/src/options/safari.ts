import { Options } from "selenium-webdriver/safari.js";

export class SafariOptionsBuilder {
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
