import type { AlertHandlers } from "@michaelhly.webdriver-interop/c11y";
import {
	NoSuchAlertError,
	UnsupportedOperationError,
} from "@michaelhly.webdriver-interop/c11y";
import type { Dialog } from "vibium";
import type { VibiumContext } from "./context.js";

export interface AlertState {
	pendingDialog: Dialog | null;
	lastDialogText: string | null;
}

export function createAlertState(): AlertState {
	return { pendingDialog: null, lastDialogText: null };
}

export function createAlertHandlers(
	ctx: VibiumContext,
	alertState: AlertState,
): AlertHandlers {
	return {
		async getAlertText() {
			if (!alertState.pendingDialog)
				throw new NoSuchAlertError("No alert is open");
			return { text: alertState.pendingDialog.message() };
		},
		async acceptAlert() {
			if (!alertState.pendingDialog)
				throw new NoSuchAlertError("No alert is open");
			await alertState.pendingDialog.accept();
			alertState.pendingDialog = null;
		},
		async dismissAlert() {
			if (!alertState.pendingDialog)
				throw new NoSuchAlertError("No alert is open");
			await alertState.pendingDialog.dismiss();
			alertState.pendingDialog = null;
		},
		async sendAlertText({ text }) {
			if (!alertState.pendingDialog)
				throw new NoSuchAlertError("No alert is open");
			await alertState.pendingDialog.accept(text);
			alertState.pendingDialog = null;
		},
	};
}
