import { localBrowserLaunchOptionsSchema, Stagehand, type V3Options } from "@browserbasehq/stagehand";
import type {
	Capabilities,
	SessionHandlers,
	Timeouts,
} from "@michaelhly.webdriver-c11y/schemas";
import type { StagehandContext } from "./context.js";

export function createSessionHandlers(
	ctx: StagehandContext,
	driverStagehandOptions: Partial<V3Options> = {},
): SessionHandlers {
	return {
		async status() {
			try {
				ctx.getStagehand();
				return { ready: true, message: "Session is active" };
			} catch {
				return { ready: false, message: "No active session" };
			}
		},
		async newSession(params) {
			const alwaysMatch = params.capabilities?.alwaysMatch ?? {};
			const firstMatch = params.capabilities?.firstMatch ?? [{}];
			const capabilities: Capabilities = { ...alwaysMatch, ...firstMatch[0] };
			const stagehand = new Stagehand({
				...driverStagehandOptions,
				env: driverStagehandOptions.env ?? "LOCAL",
				localBrowserLaunchOptions: localBrowserLaunchOptionsSchema.parse({
					...driverStagehandOptions.localBrowserLaunchOptions,
					...capabilities,
				}),
			});
			await stagehand.init();
			ctx.setStagehand(stagehand);
			return {
				sessionId: stagehand.browserbaseSessionID ?? "local",
				capabilities: capabilities as Capabilities,
			};
		},
		async deleteSession() {
			await ctx.getStagehand().close();
			ctx.clearStagehand();
		},
		async getTimeouts() {
			// Stagehand doesn't expose timeout getters; return defaults
			const result: Timeouts = {
				script: 30000,
				pageLoad: 300000,
				implicit: 0,
			};
			return result;
		},
		async setTimeouts(_params) {
			// Stagehand doesn't support setting WebDriver-style timeouts
		},
	};
}
