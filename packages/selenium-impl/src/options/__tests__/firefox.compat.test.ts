import { Options as SeleniumFirefoxOptions } from "selenium-webdriver/firefox.js";
import { describe, expect, it } from "vitest";
import { FirefoxOptionsBuilder } from "../firefox.js";

function getFirefoxOptions(
	opts: SeleniumFirefoxOptions,
): Record<string, unknown> {
	return opts.get("moz:firefoxOptions") as Record<string, unknown>;
}

describe("FirefoxOptionsBuilder compat", () => {
	describe("fromCapabilities", () => {
		it("args match selenium Options.addArguments", () => {
			const caps: Record<string, unknown> = {
				args: ["-headless", "-safe-mode"],
			};

			const selenium = new SeleniumFirefoxOptions();
			selenium.addArguments(...(caps.args as string[]));

			const built = FirefoxOptionsBuilder.fromCapabilities(caps).build();
			expect(getFirefoxOptions(built)).toEqual(getFirefoxOptions(selenium));
		});

		it("prefs match selenium Options.setPreference", () => {
			const caps: Record<string, unknown> = {
				prefs: {
					"dom.webnotifications.enabled": false,
					"network.proxy.type": 1,
					"browser.startup.homepage": "about:blank",
				},
			};

			const selenium = new SeleniumFirefoxOptions();
			for (const [key, value] of Object.entries(
				caps.prefs as Record<string, string | number | boolean>,
			)) {
				selenium.setPreference(key, value);
			}

			const built = FirefoxOptionsBuilder.fromCapabilities(caps).build();
			expect(getFirefoxOptions(built)).toEqual(getFirefoxOptions(selenium));
		});

		it("binary matches selenium Options.setBinary", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/firefox-nightly",
			};

			const selenium = new SeleniumFirefoxOptions();
			selenium.setBinary(caps.binary as string);

			const built = FirefoxOptionsBuilder.fromCapabilities(caps).build();
			expect(getFirefoxOptions(built)).toEqual(getFirefoxOptions(selenium));
		});

		it("profile matches selenium Options.setProfile", () => {
			const caps: Record<string, unknown> = {
				profile: "/tmp/firefox-profile",
			};

			const selenium = new SeleniumFirefoxOptions();
			selenium.setProfile(caps.profile as string);

			const built = FirefoxOptionsBuilder.fromCapabilities(caps).build();
			expect(getFirefoxOptions(built)).toEqual(getFirefoxOptions(selenium));
		});

		it("full capabilities match selenium Options", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/firefox",
				args: ["-headless", "-safe-mode"],
				profile: "/tmp/profile",
				prefs: {
					"dom.webnotifications.enabled": false,
					"network.proxy.type": 1,
					"browser.startup.homepage": "about:blank",
				},
			};

			const selenium = new SeleniumFirefoxOptions();
			selenium.setBinary(caps.binary as string);
			selenium.addArguments(...(caps.args as string[]));
			selenium.setProfile(caps.profile as string);
			for (const [key, value] of Object.entries(
				caps.prefs as Record<string, string | number | boolean>,
			)) {
				selenium.setPreference(key, value);
			}

			const built = FirefoxOptionsBuilder.fromCapabilities(caps).build();
			expect(getFirefoxOptions(built)).toEqual(getFirefoxOptions(selenium));
		});

		it("empty capabilities produce clean options", () => {
			const built = FirefoxOptionsBuilder.fromCapabilities({}).build();
			const opts = getFirefoxOptions(built);
			expect(opts.args).toBeUndefined();
			expect(opts.binary).toBeUndefined();
		});
	});

	describe("vendor", () => {
		it("is moz:firefoxOptions", () => {
			expect(FirefoxOptionsBuilder.vendor).toBe("moz:firefoxOptions");
			expect(new FirefoxOptionsBuilder().vendor).toBe("moz:firefoxOptions");
		});
	});
});
