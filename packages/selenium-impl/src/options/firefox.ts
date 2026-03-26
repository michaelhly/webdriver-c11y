import { Browser } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox.js";
import type { OptionsBuilder } from "./builder.js";

export interface FirefoxCapabilities {
	binary?: string;
	args?: string[];
	profile?: string;
	prefs?: Record<string, string | number | boolean>;
}

export class FirefoxOptionsBuilder implements OptionsBuilder<Options> {
	static readonly vendor = Browser.FIREFOX;
	readonly vendor = FirefoxOptionsBuilder.vendor;

	private readonly args: string[] = [];
	private readonly prefs = new Map<string, string | number | boolean>();
	private readonly extensionPaths: string[] = [];
	private binaryPath: string | null = null;
	private profilePath: string | null = null;

	static fromCapabilities(caps: FirefoxCapabilities): FirefoxOptionsBuilder {
		const builder = new FirefoxOptionsBuilder();
		if (caps.binary) builder.setBinary(caps.binary);
		if (caps.args) builder.addArguments(...caps.args);
		if (caps.profile) builder.setProfile(caps.profile);
		if (caps.prefs) {
			for (const [key, value] of Object.entries(caps.prefs)) {
				builder.setPreference(key, value);
			}
		}
		return builder;
	}

	addArguments(...args: string[]): this {
		this.args.push(...args);
		return this;
	}

	setPreference(key: string, value: string | number | boolean): this {
		this.prefs.set(key, value);
		return this;
	}

	addExtensions(...paths: string[]): this {
		this.extensionPaths.push(...paths);
		return this;
	}

	setBinary(path: string): this {
		this.binaryPath = path;
		return this;
	}

	setProfile(path: string): this {
		this.profilePath = path;
		return this;
	}

	build(): Options {
		const options = new Options();
		if (this.args.length > 0) {
			options.addArguments(...this.args);
		}
		for (const [key, value] of this.prefs) {
			options.setPreference(key, value);
		}
		if (this.extensionPaths.length > 0) {
			options.addExtensions(...this.extensionPaths);
		}
		if (this.binaryPath) {
			options.setBinary(this.binaryPath);
		}
		if (this.profilePath) {
			options.setProfile(this.profilePath);
		}
		return options;
	}
}
