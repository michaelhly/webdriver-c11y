import type { IOptionsValues } from "selenium-webdriver/chrome.js";
import type { Options as ChromiumOptions } from "selenium-webdriver/chromium.js";
import type { OptionsBuilder } from "./builder.js";

export type ChromiumCapabilities = Partial<IOptionsValues> & {
	excludeSwitches?: string[];
};

export abstract class ChromiumOptionsBuilder<TOptions extends ChromiumOptions>
	implements OptionsBuilder<TOptions>
{
	abstract readonly vendor: string;

	private readonly _args: string[] = [];
	private readonly _excluded: string[] = [];
	private readonly _extensions: (string | Buffer)[] = [];
	private _prefs: Record<string, unknown> = {};
	private _binary: string | null = null;
	private _detach = false;
	private _localState: Record<string, unknown> = {};
	private _logFile: string | null = null;

	protected applyCapabilities(caps: ChromiumCapabilities): void {
		if (caps.args) this.addArguments(...caps.args);
		if (caps.extensions) this.addExtensions(...caps.extensions);
		if (caps.prefs)
			this.setUserPreferences(caps.prefs as Record<string, unknown>);
		if (caps.excludeSwitches) this.excludeSwitches(...caps.excludeSwitches);
		if (caps.binary) this.setBinaryPath(caps.binary);
		if (caps.detach) this.detachDriver(caps.detach);
		if (caps.localState)
			this.setLocalState(caps.localState as Record<string, unknown>);
		if (caps.logFile) this.setLogFile(caps.logFile);
	}

	addArguments(...args: string[]): this {
		this._args.push(...args);
		return this;
	}

	excludeSwitches(...switches: string[]): this {
		this._excluded.push(...switches);
		return this;
	}

	setUserPreferences(prefs: Record<string, unknown>): this {
		Object.assign(this._prefs, prefs);
		return this;
	}

	addExtensions(...paths: (string | Buffer)[]): this {
		this._extensions.push(...paths);
		return this;
	}

	setBinaryPath(path: string): this {
		this._binary = path;
		return this;
	}

	detachDriver(detach: boolean): this {
		this._detach = detach;
		return this;
	}

	setLocalState(state: Record<string, unknown>): this {
		Object.assign(this._localState, state);
		return this;
	}

	setLogFile(path: string): this {
		this._logFile = path;
		return this;
	}

	protected applyTo(options: ChromiumOptions): void {
		if (this._binary) options.setBinaryPath(this._binary);
		if (this._args.length > 0) options.addArguments(...this._args);
		if (this._excluded.length > 0) options.excludeSwitches(...this._excluded);
		if (Object.keys(this._prefs).length > 0)
			options.setUserPreferences(this._prefs);
		if (this._extensions.length > 0) options.addExtensions(...this._extensions);
		if (this._detach) options.detachDriver(this._detach);
		if (Object.keys(this._localState).length > 0)
			options.setLocalState(this._localState);
		if (this._logFile) options.setBrowserLogFile(this._logFile);
	}

	abstract build(): TOptions;
}
