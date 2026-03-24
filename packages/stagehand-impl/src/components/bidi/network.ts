import type {
	AddInterceptResult,
	BidiNetworkHandlers,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

let nextInterceptId = 0;

export function createBidiNetworkHandlers(
	ctx: StagehandContext,
): BidiNetworkHandlers {
	return {
		async networkAddIntercept(params) {
			// CDP Fetch.enable to intercept requests matching patterns
			const patterns = (params.urlPatterns ?? []).map((p) => ({
				urlPattern: p.pattern ?? "*",
			}));
			await ctx.getPage().sendCDP("Fetch.enable", {
				patterns: patterns.length > 0 ? patterns : [{ urlPattern: "*" }],
			});
			const id = `intercept-${String(nextInterceptId++)}`;
			return { intercept: id } satisfies AddInterceptResult;
		},
		async networkRemoveIntercept(_params) {
			await ctx.getPage().sendCDP("Fetch.disable");
		},
		async networkContinueRequest(params) {
			await ctx.getPage().sendCDP("Fetch.continueRequest", {
				requestId: params.request,
				url: params.url,
				method: params.method,
				headers: params.headers,
			});
		},
		async networkContinueResponse(params) {
			await ctx.getPage().sendCDP("Fetch.continueResponse", {
				requestId: params.request,
				responseCode: params.statusCode,
				responseHeaders: params.headers,
				responsePhrase: params.reasonPhrase,
			});
		},
		async networkProvideResponse(params) {
			await ctx.getPage().sendCDP("Fetch.fulfillRequest", {
				requestId: params.request,
				responseCode: params.statusCode ?? 200,
				responseHeaders: params.headers,
				body: params.body ? btoa(JSON.stringify(params.body)) : undefined,
				responsePhrase: params.reasonPhrase,
			});
		},
		async networkFailRequest(params) {
			await ctx.getPage().sendCDP("Fetch.failRequest", {
				requestId: params.request,
				errorReason: "Failed",
			});
		},
		async networkContinueWithAuth(params) {
			if (params.credentials) {
				await ctx.getPage().sendCDP("Fetch.continueWithAuth", {
					requestId: params.request,
					authChallengeResponse: {
						response: "ProvideCredentials",
						username: params.credentials.username,
						password: params.credentials.password,
					},
				});
			} else {
				await ctx.getPage().sendCDP("Fetch.continueWithAuth", {
					requestId: params.request,
					authChallengeResponse: {
						response: params.action === "cancel" ? "CancelAuth" : "Default",
					},
				});
			}
		},
		async networkSetCacheBehavior(params) {
			await ctx.getPage().sendCDP("Network.setCacheDisabled", {
				cacheDisabled: params.cacheBehavior === "bypass",
			});
		},
	};
}
