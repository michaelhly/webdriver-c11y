import { type IPerfLoggingPrefs, Options } from "selenium-webdriver/chrome.js";
import {
	type ChromiumCapabilities,
	ChromiumOptionsBuilder,
} from "./chromium.js";

type ChromeCapabilities = ChromiumCapabilities & {
	perfLoggingPrefs?: IPerfLoggingPrefs;
};

export class ChromeOptionsBuilder extends ChromiumOptionsBuilder<Options> {
	static readonly vendor = "goog:chromeOptions";
	readonly vendor = ChromeOptionsBuilder.vendor;

	private _perfLoggingPrefs: IPerfLoggingPrefs = {};

	static fromCapabilities(caps: ChromeCapabilities): ChromeOptionsBuilder {
		const builder = new ChromeOptionsBuilder();
		builder.applyCapabilities(caps);
		if (caps.perfLoggingPrefs)
			builder.setPerfLoggingPrefs(caps.perfLoggingPrefs);
		return builder;
	}

	setPerfLoggingPrefs(prefs: IPerfLoggingPrefs): this {
		Object.assign(this._perfLoggingPrefs, prefs);
		return this;
	}

	build(): Options {
		const options = new Options();
		this.applyTo(options);
		if (Object.keys(this._perfLoggingPrefs).length > 0) {
			options.setPerfLoggingPrefs({
				enableNetwork: this._perfLoggingPrefs.enableNetwork ?? false,
				enablePage: this._perfLoggingPrefs.enablePage ?? false,
				enableTimeline: this._perfLoggingPrefs.enableTimeline ?? false,
				traceCategories: this._perfLoggingPrefs.traceCategories ?? "browser",
				bufferUsageReportingInterval:
					this._perfLoggingPrefs.bufferUsageReportingInterval ?? 0,
			});
		}
		return options;
	}
}
