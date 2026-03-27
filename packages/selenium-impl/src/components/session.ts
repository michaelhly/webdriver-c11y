import type {
	Capabilities,
	SessionHandlers,
	Timeouts,
} from "@michaelhly.webdriver-c11y/schemas";
import { SessionNotCreatedError } from "@michaelhly.webdriver-c11y/schemas";
import { Builder } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome.js";
import { Options as EdgeOptions } from "selenium-webdriver/edge.js";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox.js";
import { VALID_BROWSERS } from "../constants.js";
import { BROWSER_OPTION_KEYS } from "../options.js";
import type { ClassicContext } from "./context.js";

export function createSessionHandlers(ctx: ClassicContext): SessionHandlers {
	return {
		async status() {
			try {
				ctx.getDriver();
				return { ready: true, message: "Session is active" };
			} catch {
				return { ready: false, message: "No active session" };
			}
		},
		async newSession(params) {
			const alwaysMatch = params.capabilities?.alwaysMatch ?? {};
			const firstMatch = params.capabilities?.firstMatch ?? [{}];

			// Merge alwaysMatch with first firstMatch entry (W3C §7.1 processing)
			const merged = { ...alwaysMatch, ...firstMatch[0] };

			const builder = new Builder();

			// Validate and set browser name
			if (merged.browserName) {
				if (!VALID_BROWSERS.has(merged.browserName)) {
					throw new SessionNotCreatedError(
						`Unsupported browserName: '${merged.browserName}'. ` +
							`Must be one of: ${[...VALID_BROWSERS].join(", ")}`,
					);
				}
				builder.forBrowser(merged.browserName);
			}

			// Apply all capabilities including vendor extensions
			builder.withCapabilities(merged);

			// Build browser options from vendor-prefixed capabilities when not
			// already configured via SeleniumDriverOptions (explicit opts win).
			const k = BROWSER_OPTION_KEYS;
			if (!ctx.browserOptions.has(k.chrome) && merged[k.chrome]) {
				ctx.browserOptions.set(
					k.chrome,
					new ChromeOptions(merged[k.chrome] as object),
				);
			}
			if (!ctx.browserOptions.has(k.firefox) && merged[k.firefox]) {
				ctx.browserOptions.set(
					k.firefox,
					new FirefoxOptions(merged[k.firefox] as object),
				);
			}
			if (!ctx.browserOptions.has(k.edge) && merged[k.edge]) {
				ctx.browserOptions.set(
					k.edge,
					new EdgeOptions(merged[k.edge] as object),
				);
			}

			// Apply all configured browser options to the builder
			const chromeOpts = ctx.browserOptions.get(k.chrome);
			if (chromeOpts) builder.setChromeOptions(chromeOpts as ChromeOptions);
			const firefoxOpts = ctx.browserOptions.get(k.firefox);
			if (firefoxOpts) builder.setFirefoxOptions(firefoxOpts as FirefoxOptions);
			const edgeOpts = ctx.browserOptions.get(k.edge);
			if (edgeOpts) builder.setEdgeOptions(edgeOpts as EdgeOptions);

			const driver = await builder.build();
			ctx.setDriver(driver);

			const session = await driver.getSession();
			const matchedCaps = session.getCapabilities();

			// Extract matched capabilities from the session
			const capabilities: Capabilities = {};
			for (const key of matchedCaps.keys()) {
				(capabilities as Record<string, unknown>)[key] = matchedCaps.get(key);
			}

			return { sessionId: session.getId(), capabilities };
		},
		async deleteSession() {
			await ctx.getDriver().quit();
			ctx.clearDriver();
		},
		async getTimeouts() {
			const driver = ctx.getDriver();
			const raw = await driver.manage().getTimeouts();
			const result: Timeouts = {};
			result.script = raw.script ?? null;
			if (raw.pageLoad !== undefined) result.pageLoad = raw.pageLoad;
			if (raw.implicit !== undefined) result.implicit = raw.implicit;
			return result;
		},
		async setTimeouts(params) {
			await ctx
				.getDriver()
				.manage()
				.setTimeouts({
					script: params.script ?? undefined,
					pageLoad: params.pageLoad,
					implicit: params.implicit,
				});
		},
	};
}
