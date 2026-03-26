import { Options } from "selenium-webdriver/chrome.js";

export interface ChromeCapabilities {
	binary?: string;
	args?: string[];
	extensions?: string[];
	prefs?: Record<string, unknown>;
	excludeSwitches?: string[];
}

export class ChromeOptionsBuilder {
	private readonly args: string[] = [];
	private readonly excluded: string[] = [];
	private readonly packedExtensions: (string | Buffer)[] = [];
	private prefs: Record<string, unknown> = {};
	private binaryPath: string | null = null;

	static fromCapabilities(caps: ChromeCapabilities): ChromeOptionsBuilder {
		const builder = new ChromeOptionsBuilder();
		if (caps.binary) builder.setBinaryPath(caps.binary);
		if (caps.args) builder.addArguments(...caps.args);
		if (caps.extensions) builder.addExtensions(...caps.extensions);
		if (caps.prefs) builder.setUserPreferences(caps.prefs);
		if (caps.excludeSwitches) builder.excludeSwitches(...caps.excludeSwitches);
		return builder;
	}

	addArguments(...args: string[]): this {
		this.args.push(...args);
		return this;
	}

	excludeSwitches(...switches: string[]): this {
		this.excluded.push(...switches);
		return this;
	}

	setUserPreferences(prefs: Record<string, unknown>): this {
		Object.assign(this.prefs, prefs);
		return this;
	}

	addExtensions(...paths: (string | Buffer)[]): this {
		this.packedExtensions.push(...paths);
		return this;
	}

	setBinaryPath(path: string): this {
		this.binaryPath = path;
		return this;
	}

	build(): Options {
		const options = new Options();
		if (this.binaryPath) {
			options.setChromeBinaryPath(this.binaryPath);
		}
		if (this.args.length > 0) {
			options.addArguments(...this.args);
		}
		if (this.excluded.length > 0) {
			options.excludeSwitches(...this.excluded);
		}
		if (Object.keys(this.prefs).length > 0) {
			options.setUserPreferences(this.prefs);
		}
		if (this.packedExtensions.length > 0) {
			options.addExtensions(...this.packedExtensions);
		}
		return options;
	}
}
