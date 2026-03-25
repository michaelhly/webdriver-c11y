import type {
	AddInterceptResult,
	BidiNetworkHandlers,
	BidiResponse,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiNetworkHandlers(
	ctx: ClassicContext,
): BidiNetworkHandlers {
	return {
		async networkAddIntercept(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "network.addIntercept",
				params: {
					phases: params.phases,
					urlPatterns: params.urlPatterns,
					contexts: params.contexts,
				},
			});
			return (response as BidiResponse<AddInterceptResult>).result;
		},
		async networkRemoveIntercept(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.removeIntercept",
				params: { intercept: params.intercept },
			});
		},
		async networkContinueRequest(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.continueRequest",
				params: {
					request: params.request,
					body: params.body,
					cookies: params.cookies,
					headers: params.headers,
					method: params.method,
					url: params.url,
				},
			});
		},
		async networkContinueResponse(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.continueResponse",
				params: {
					request: params.request,
					cookies: params.cookies,
					headers: params.headers,
					reasonPhrase: params.reasonPhrase,
					statusCode: params.statusCode,
				},
			});
		},
		async networkProvideResponse(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.provideResponse",
				params: {
					request: params.request,
					body: params.body,
					cookies: params.cookies,
					headers: params.headers,
					reasonPhrase: params.reasonPhrase,
					statusCode: params.statusCode,
				},
			});
		},
		async networkFailRequest(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.failRequest",
				params: { request: params.request },
			});
		},
		async networkContinueWithAuth(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.continueWithAuth",
				params: {
					request: params.request,
					action: params.action,
					credentials: params.credentials,
				},
			});
		},
		async networkSetCacheBehavior(params) {
			const bidi = await ctx.getDriver().getBidi();
			await bidi.send({
				method: "network.setCacheBehavior",
				params: {
					cacheBehavior: params.cacheBehavior,
					contexts: params.contexts,
				},
			});
		},
	};
}
