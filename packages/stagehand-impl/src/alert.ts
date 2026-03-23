import type { AlertHandlers } from "@michaelhly.webdriver-interop/c11y";
import { NoSuchAlertError } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./shared.js";
import { getActivePage } from "./shared.js";

export function createAlertHandlers(ctx: StagehandContext): AlertHandlers {
	return {
		async getAlertText() {
			if (!ctx.dialog) {
				throw new NoSuchAlertError("No alert present");
			}
			return { text: ctx.dialog.message };
		},

		async acceptAlert() {
			const page = getActivePage(ctx);
			try {
				await page.sendCDP("Page.handleJavaScriptDialog", {
					accept: true,
				});
			} catch {
				throw new NoSuchAlertError("No alert present");
			}
			ctx.dialog = null;
		},

		async dismissAlert() {
			const page = getActivePage(ctx);
			try {
				await page.sendCDP("Page.handleJavaScriptDialog", {
					accept: false,
				});
			} catch {
				throw new NoSuchAlertError("No alert present");
			}
			ctx.dialog = null;
		},

		async sendAlertText(params) {
			const page = getActivePage(ctx);
			try {
				await page.sendCDP("Page.handleJavaScriptDialog", {
					accept: true,
					promptText: params.text,
				});
			} catch {
				throw new NoSuchAlertError("No alert present");
			}
			ctx.dialog = null;
		},
	};
}
