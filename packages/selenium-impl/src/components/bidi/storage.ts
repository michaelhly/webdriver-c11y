import type {
	BidiResponse,
	BidiStorageHandlers,
	DeleteCookiesResult,
	GetCookiesResult,
	SetCookieResult,
} from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiStorageHandlers(
	ctx: ClassicContext,
): BidiStorageHandlers {
	return {
		async storageGetCookies(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "storage.getCookies",
				params: {
					filter: params.filter,
					partition: params.partition,
				},
			});
			return (response as BidiResponse<GetCookiesResult>).result;
		},
		async storageSetCookie(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "storage.setCookie",
				params: {
					cookie: params.cookie,
					partition: params.partition,
				},
			});
			return (response as BidiResponse<SetCookieResult>).result;
		},
		async storageDeleteCookies(params) {
			const bidi = await ctx.getDriver().getBidi();
			const response = await bidi.send({
				method: "storage.deleteCookies",
				params: {
					filter: params.filter,
					partition: params.partition,
				},
			});
			return (response as BidiResponse<DeleteCookiesResult>).result;
		},
	};
}
