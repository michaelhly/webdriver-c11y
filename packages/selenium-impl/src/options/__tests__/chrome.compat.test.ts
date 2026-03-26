import { describe, expect, it } from "vitest";
import { Options as SeleniumChromeOptions } from "selenium-webdriver/chrome.js";
import { ChromeOptionsBuilder } from "../chrome.js";

function getChromeOptions(
	opts: SeleniumChromeOptions,
): Record<string, unknown> {
	return opts.get("goog:chromeOptions") as Record<string, unknown>;
}

describe("ChromeOptionsBuilder compat", () => {
	describe("fromCapabilities", () => {
		it("args match selenium Options.addArguments", () => {
			const caps: Record<string, unknown> = {
				args: ["--headless", "--disable-gpu", "--start-maximized"],
			};

			const selenium = new SeleniumChromeOptions();
			selenium.addArguments(...(caps.args as string[]));

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			expect(getChromeOptions(built)).toEqual(getChromeOptions(selenium));
		});

		it("excludeSwitches match selenium Options.excludeSwitches", () => {
			const caps: Record<string, unknown> = {
				excludeSwitches: ["enable-automation", "load-extension"],
			};

			const selenium = new SeleniumChromeOptions();
			selenium.excludeSwitches(...(caps.excludeSwitches as string[]));

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			expect(getChromeOptions(built)).toEqual(getChromeOptions(selenium));
		});

		it("prefs match selenium Options.setUserPreferences", () => {
			const caps: Record<string, unknown> = {
				prefs: {
					"download.directory_upgrade": true,
					"download.prompt_for_download": false,
					"plugins.always_open_pdf_externally": true,
					"safebrowsing.enabled": true,
					"profile.default_content_setting_values.notifications": 2,
					"profile.default_content_setting_values.clipboard": 1,
					credentials_enable_service: false,
					"profile.password_manager_enabled": false,
				},
			};

			const selenium = new SeleniumChromeOptions();
			selenium.setUserPreferences(caps.prefs as Record<string, unknown>);

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			expect(getChromeOptions(built)).toEqual(getChromeOptions(selenium));
		});

		it("binary matches selenium Options.setChromeBinaryPath", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/google-chrome",
			};

			const selenium = new SeleniumChromeOptions();
			selenium.setChromeBinaryPath(caps.binary as string);

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			expect(getChromeOptions(built)).toEqual(getChromeOptions(selenium));
		});

		it("extensions match selenium Options.addExtensions", () => {
			const caps: Record<string, unknown> = {
				extensions: ["ext1.crx", "ext2.crx"],
			};

			const selenium = new SeleniumChromeOptions();
			selenium.addExtensions(...(caps.extensions as string[]));

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			const builtExts = getChromeOptions(built).extensions;
			const seleniumExts = getChromeOptions(selenium).extensions;
			expect(typeof builtExts).toBe(typeof seleniumExts);
		});

		it("full capabilities match selenium Options", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/chrome",
				args: [
					"--disable-blink-features",
					"--disable-blink-features=AutomationControlled",
					"--safebrowsing-disable-download-protection",
					"--start-maximized",
					"--kiosk-printing",
					"--silent-debugger-extension-api",
					"--remote-debugging-port=9222",
					"--disable-features=OptimizationHints",
					"--disable-optimization-guide",
				],
				excludeSwitches: ["enable-automation"],
				prefs: {
					"download.directory_upgrade": true,
					"download.prompt_for_download": false,
					"extensions.ui.developer_mode": true,
					"plugins.always_open_pdf_externally": true,
					"safebrowsing.enabled": true,
					"profile.default_content_setting_values.notifications": 2,
					"profile.default_content_setting_values.clipboard": 1,
					"profile.default_content_setting_values.automatic_downloads": 1,
					"optimization_guide.enabled": false,
					credentials_enable_service: false,
					"profile.password_manager_enabled": false,
					"autofill.profile_enabled": false,
					"autofill.credit_card_enabled": false,
				},
			};

			const selenium = new SeleniumChromeOptions();
			selenium.setChromeBinaryPath(caps.binary as string);
			selenium.addArguments(...(caps.args as string[]));
			selenium.excludeSwitches(...(caps.excludeSwitches as string[]));
			selenium.setUserPreferences(caps.prefs as Record<string, unknown>);

			const built = ChromeOptionsBuilder.fromCapabilities(caps).build();
			expect(getChromeOptions(built)).toEqual(getChromeOptions(selenium));
		});

		it("empty capabilities produce clean options", () => {
			const built = ChromeOptionsBuilder.fromCapabilities({}).build();
			const opts = getChromeOptions(built);
			expect(opts.args).toBeUndefined();
			expect(opts.excludeSwitches).toBeUndefined();
			expect(opts.prefs).toBeUndefined();
			expect(opts.binary).toBeUndefined();
		});
	});
});
