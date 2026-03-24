import type {
	BidiBrowserHandlers,
	ClientWindowInfo,
	CreateUserContextResult,
	GetClientWindowsResult,
	GetUserContextsResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiBrowserHandlers(
	ctx: ClassicContext,
): BidiBrowserHandlers {
	return {
		async browserClose() {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({ method: "browser.close", params: {} });
		},
		async browserCreateUserContext() {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browser.createUserContext",
				params: {},
			});
			return (response as { result: CreateUserContextResult }).result;
		},
		async browserGetUserContexts() {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browser.getUserContexts",
				params: {},
			});
			return (response as { result: GetUserContextsResult }).result;
		},
		async browserRemoveUserContext(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "browser.removeUserContext",
				params: { userContext: params.userContext },
			});
		},
		async browserGetClientWindows() {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browser.getClientWindows",
				params: {},
			});
			return (response as { result: GetClientWindowsResult }).result;
		},
		async browserSetClientWindowState(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "browser.setClientWindowState",
				params: {
					clientWindow: params.clientWindow,
					state: params.state,
					width: params.width,
					height: params.height,
					x: params.x,
					y: params.y,
				},
			});
			return (response as { result: ClientWindowInfo }).result;
		},
	};
}
