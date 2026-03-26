import { describe, expect, it } from "vitest";
import { Options as SeleniumEdgeOptions } from "selenium-webdriver/edge.js";
import { EdgeOptionsBuilder } from "../edge.js";

function getEdgeOptions(opts: SeleniumEdgeOptions): Record<string, unknown> {
	return opts.get("ms:edgeOptions") as Record<string, unknown>;
}

describe("EdgeOptionsBuilder compat", () => {
	describe("fromCapabilities", () => {
		it("args match selenium Options.addArguments", () => {
			const caps: Record<string, unknown> = {
				args: ["--headless", "--disable-gpu", "--start-maximized"],
			};

			const selenium = new SeleniumEdgeOptions();
			selenium.addArguments(...(caps.args as string[]));

			const built = EdgeOptionsBuilder.fromCapabilities(caps).build();
			expect(getEdgeOptions(built)).toEqual(getEdgeOptions(selenium));
		});

		it("excludeSwitches match selenium Options.excludeSwitches", () => {
			const caps: Record<string, unknown> = {
				excludeSwitches: ["enable-automation"],
			};

			const selenium = new SeleniumEdgeOptions();
			selenium.excludeSwitches(...(caps.excludeSwitches as string[]));

			const built = EdgeOptionsBuilder.fromCapabilities(caps).build();
			expect(getEdgeOptions(built)).toEqual(getEdgeOptions(selenium));
		});

		it("prefs match selenium Options.setUserPreferences", () => {
			const caps: Record<string, unknown> = {
				prefs: {
					"download.prompt_for_download": false,
					"safebrowsing.enabled": true,
				},
			};

			const selenium = new SeleniumEdgeOptions();
			selenium.setUserPreferences(caps.prefs as Record<string, unknown>);

			const built = EdgeOptionsBuilder.fromCapabilities(caps).build();
			expect(getEdgeOptions(built)).toEqual(getEdgeOptions(selenium));
		});

		it("binary matches selenium Options.setEdgeChromiumBinaryPath", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/microsoft-edge",
			};

			const selenium = new SeleniumEdgeOptions();
			selenium.setEdgeChromiumBinaryPath(caps.binary as string);

			const built = EdgeOptionsBuilder.fromCapabilities(caps).build();
			expect(getEdgeOptions(built)).toEqual(getEdgeOptions(selenium));
		});

		it("full capabilities match selenium Options", () => {
			const caps: Record<string, unknown> = {
				binary: "/usr/bin/microsoft-edge",
				args: ["--start-maximized", "--kiosk-printing"],
				excludeSwitches: ["enable-automation"],
				prefs: {
					"download.prompt_for_download": false,
					"profile.default_content_setting_values.notifications": 2,
				},
			};

			const selenium = new SeleniumEdgeOptions();
			selenium.setEdgeChromiumBinaryPath(caps.binary as string);
			selenium.addArguments(...(caps.args as string[]));
			selenium.excludeSwitches(...(caps.excludeSwitches as string[]));
			selenium.setUserPreferences(caps.prefs as Record<string, unknown>);

			const built = EdgeOptionsBuilder.fromCapabilities(caps).build();
			expect(getEdgeOptions(built)).toEqual(getEdgeOptions(selenium));
		});

		it("empty capabilities produce clean options", () => {
			const built = EdgeOptionsBuilder.fromCapabilities({}).build();
			const opts = getEdgeOptions(built);
			expect(opts.args).toBeUndefined();
			expect(opts.excludeSwitches).toBeUndefined();
			expect(opts.prefs).toBeUndefined();
			expect(opts.binary).toBeUndefined();
		});
	});

	describe("vendor", () => {
		it("is ms:edgeOptions", () => {
			expect(EdgeOptionsBuilder.vendor).toBe("ms:edgeOptions");
			expect(new EdgeOptionsBuilder().vendor).toBe("ms:edgeOptions");
		});
	});
});
