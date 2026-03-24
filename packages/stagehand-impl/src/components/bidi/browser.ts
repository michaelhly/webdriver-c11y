import type {
	BidiBrowserHandlers,
	ClientWindowInfo,
	CreateUserContextResult,
	GetClientWindowsResult,
	GetUserContextsResult,
	UserContextInfo,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiBrowserHandlers(
	ctx: StagehandContext,
): BidiBrowserHandlers {
	return {
		async browserClose() {
			await ctx.getStagehand().close();
			ctx.clearStagehand();
		},
		async browserCreateUserContext() {
			const { browserContextId } = await ctx
				.getPage()
				.sendCDP<{ browserContextId: string }>("Target.createBrowserContext");
			return {
				userContext: browserContextId,
			} satisfies CreateUserContextResult;
		},
		async browserGetUserContexts() {
			const { browserContextIds } = await ctx
				.getPage()
				.sendCDP<{ browserContextIds: string[] }>("Target.getBrowserContexts");
			const userContexts: UserContextInfo[] = browserContextIds.map((id) => ({
				userContext: id,
			}));
			return { userContexts } satisfies GetUserContextsResult;
		},
		async browserRemoveUserContext(params) {
			await ctx.getPage().sendCDP("Target.disposeBrowserContext", {
				browserContextId: params.userContext,
			});
		},
		async browserGetClientWindows() {
			const { windowId } = await ctx
				.getPage()
				.sendCDP<{ windowId: number }>("Browser.getWindowForTarget");
			const { bounds } = await ctx.getPage().sendCDP<{
				bounds: {
					left: number;
					top: number;
					width: number;
					height: number;
					windowState: string;
				};
			}>("Browser.getWindowBounds", { windowId });

			const info: ClientWindowInfo = {
				clientWindow: String(windowId),
				state: bounds.windowState as ClientWindowInfo["state"],
				x: bounds.left,
				y: bounds.top,
				width: bounds.width,
				height: bounds.height,
				active: true,
			};
			return { clientWindows: [info] } satisfies GetClientWindowsResult;
		},
		async browserSetClientWindowState(params) {
			const windowId = Number(params.clientWindow);
			const bounds: Record<string, unknown> = {};
			if (params.state) bounds.windowState = params.state;
			if (params.width !== undefined) bounds.width = params.width;
			if (params.height !== undefined) bounds.height = params.height;
			if (params.x !== undefined) bounds.left = params.x;
			if (params.y !== undefined) bounds.top = params.y;

			await ctx
				.getPage()
				.sendCDP("Browser.setWindowBounds", { windowId, bounds });

			const { bounds: updated } = await ctx.getPage().sendCDP<{
				bounds: {
					left: number;
					top: number;
					width: number;
					height: number;
					windowState: string;
				};
			}>("Browser.getWindowBounds", { windowId });

			return {
				clientWindow: params.clientWindow,
				state: updated.windowState as ClientWindowInfo["state"],
				x: updated.left,
				y: updated.top,
				width: updated.width,
				height: updated.height,
				active: true,
			} satisfies ClientWindowInfo;
		},
	};
}
