import { Options } from "selenium-webdriver/firefox.js";

export class FirefoxOptionsBuilder {
	private readonly args: string[] = [];
	private readonly prefs = new Map<string, string | number | boolean>();
	private readonly extensionPaths: string[] = [];
	private binaryPath: string | null = null;
	private profilePath: string | null = null;

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
