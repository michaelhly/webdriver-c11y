import type { SessionHandlers } from "@michaelhly.webdriver-interop/c11y";
import { SessionNotCreatedError } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./compat/context.js";
import { getActivePage } from "./compat/page.js";

export function createSessionHandlers(ctx: StagehandContext): SessionHandlers {
	return {
		async newSession(_params) {
			try {
				await ctx.stagehand.init();
			} catch (err) {
				throw new SessionNotCreatedError(
					err instanceof Error ? err.message : String(err),
				);
			}

			const sessionId = `sh-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			ctx.sessionId = sessionId;

			// Wire up dialog event listener for alert handling.
			setupDialogListener(ctx);

			return { sessionId };
		},

		async deleteSession() {
			await ctx.stagehand.close();
			ctx.sessionId = null;
			ctx.elements.clear();
			ctx.dialog = null;
		},
	};
}

// ---------------------------------------------------------------------------
// Dialog event tracking — captures Page.javascriptDialogOpening so that
// getAlertText / acceptAlert / dismissAlert have access to the dialog info.
// ---------------------------------------------------------------------------

function setupDialogListener(ctx: StagehandContext): void {
	const page = getActivePage(ctx);
	const sessionId = page.mainFrame().sessionId;

	const handler = (params: {
		message: string;
		type: string;
		defaultPrompt?: string;
	}) => {
		ctx.dialog = {
			type: params.type,
			message: params.message,
			...(params.defaultPrompt !== undefined
				? { defaultPrompt: params.defaultPrompt }
				: {}),
		};
	};

	if (sessionId) {
		const session = ctx.stagehand.context.conn.getSession(sessionId);
		session?.on("Page.javascriptDialogOpening", handler);
	} else {
		ctx.stagehand.context.conn.on("Page.javascriptDialogOpening", handler);
	}
}
