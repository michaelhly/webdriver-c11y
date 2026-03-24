import { Stagehand } from "@browserbasehq/stagehand";
import type {
	SessionHandlers,
	Timeouts,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "./context.js";

export function createSessionHandlers(ctx: StagehandContext): SessionHandlers {
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
			const stagehand = new Stagehand({
				env: "LOCAL",
				localBrowserLaunchOptions: {
					headless: params.capabilities?.headless,
					executablePath: params.capabilities?.executablePath,
					args: params.capabilities?.args,
				},
			});
			await stagehand.init();
			ctx.setStagehand(stagehand);
			return { sessionId: stagehand.browserbaseSessionID ?? "local" };
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
