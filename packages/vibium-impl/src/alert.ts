import type { AlertHandlers } from "@michaelhly.webdriver-interop/c11y";
import { NoSuchAlertError } from "@michaelhly.webdriver-interop/c11y";
import type { BidiContext } from "./context.js";

export function createAlertHandlers(ctx: BidiContext): AlertHandlers {
	return {
		async getAlertText() {
			const dialog = ctx.alert.pendingDialog;
			if (!dialog)
				throw new NoSuchAlertError("No alert is currently open");
			return { text: dialog.message() };
		},
		async acceptAlert() {
			const dialog = ctx.alert.pendingDialog;
			if (!dialog)
				throw new NoSuchAlertError("No alert is currently open");
			await dialog.accept();
			ctx.alert.pendingDialog = null;
		},
		async dismissAlert() {
			const dialog = ctx.alert.pendingDialog;
			if (!dialog)
				throw new NoSuchAlertError("No alert is currently open");
			await dialog.dismiss();
			ctx.alert.pendingDialog = null;
		},
		async sendAlertText({ text }) {
			const dialog = ctx.alert.pendingDialog;
			if (!dialog)
				throw new NoSuchAlertError("No alert is currently open");
			await dialog.accept(text);
			ctx.alert.pendingDialog = null;
		},
	};
}
