import type {
	BidiStorageHandlers,
	DeleteCookiesResult,
	GetCookiesResult,
	PartitionKey,
	SetCookieResult,
} from "@michaelhly.webdriver-c11y/schema";
import type { StagehandContext } from "../context.js";

export function createBidiStorageHandlers(
	ctx: StagehandContext,
): BidiStorageHandlers {
	return {
		async storageGetCookies(params) {
			const cdpParams: Record<string, unknown> = {};
			if (params.filter?.domain) {
				cdpParams.urls = [`https://${params.filter.domain}`];
			}
			const { cookies } = await ctx.getPage().sendCDP<{
				cookies: Array<{
					name: string;
					value: string;
					domain: string;
					path: string;
					secure: boolean;
					httpOnly: boolean;
					expires: number;
					sameSite?: string;
					size: number;
				}>;
			}>("Network.getCookies", cdpParams);

			const filtered = cookies.filter((c) => {
				if (params.filter?.name && c.name !== params.filter.name) return false;
				if (params.filter?.path && c.path !== params.filter.path) return false;
				if (
					params.filter?.secure !== undefined &&
					c.secure !== params.filter.secure
				)
					return false;
				if (
					params.filter?.httpOnly !== undefined &&
					c.httpOnly !== params.filter.httpOnly
				)
					return false;
				return true;
			});

			const partitionKey: PartitionKey = {
				sourceOrigin: ctx.getPage().url(),
			};

			return {
				cookies: filtered,
				partitionKey,
			} satisfies GetCookiesResult;
		},
		async storageSetCookie(params) {
			const c = params.cookie;
			await ctx.getPage().sendCDP("Network.setCookie", {
				name: c.name,
				value: c.value.value,
				domain: c.domain,
				path: c.path,
				secure: c.secure,
				httpOnly: c.httpOnly,
				sameSite: c.sameSite,
				expires: c.expiry,
			});
			const partitionKey: PartitionKey = {
				sourceOrigin: ctx.getPage().url(),
			};
			return { partitionKey } satisfies SetCookieResult;
		},
		async storageDeleteCookies(params) {
			if (params.filter?.name) {
				await ctx.getPage().sendCDP("Network.deleteCookies", {
					name: params.filter.name,
					domain: params.filter.domain,
					path: params.filter.path,
				});
			} else {
				await ctx.getPage().sendCDP("Network.clearBrowserCookies");
			}
			const partitionKey: PartitionKey = {
				sourceOrigin: ctx.getPage().url(),
			};
			return { partitionKey } satisfies DeleteCookiesResult;
		},
	};
}
