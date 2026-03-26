import { Options } from "selenium-webdriver/firefox.js";
import type { OptionsBuilder } from "./builder.js";

export interface FirefoxCapabilities {
	binary?: string;
	args?: string[];
	profile?: string;
	prefs?: Record<string, string | number | boolean>;
}

export class FirefoxOptionsBuilder implements OptionsBuilder<Options> {
	static readonly vendor = "moz:firefoxOptions";
	readonly vendor = FirefoxOptionsBuilder.vendor;

	private readonly _args: string[] = [];
	private readonly _prefs = new Map<string, string | number | boolean>();
	private readonly _extensions: string[] = [];
	private _binary: string | null = null;
	private _profile: string | null = null;

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
		this._args.push(...args);
		return this;
	}

	setPreference(key: string, value: string | number | boolean): this {
		this._prefs.set(key, value);
		return this;
	}

	addExtensions(...paths: string[]): this {
		this._extensions.push(...paths);
		return this;
	}

	setBinary(path: string): this {
		this._binary = path;
		return this;
	}

	setProfile(path: string): this {
		this._profile = path;
		return this;
	}

	build(): Options {
		const options = new Options();
		if (this._args.length > 0) {
			options.addArguments(...this._args);
		}
		for (const [key, value] of this._prefs) {
			options.setPreference(key, value);
		}
		if (this._extensions.length > 0) {
			options.addExtensions(...this._extensions);
		}
		if (this._binary) {
			options.setBinary(this._binary);
		}
		if (this._profile) {
			options.setProfile(this._profile);
		}
		return options;
	}
}
