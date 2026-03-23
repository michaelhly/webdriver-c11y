import type {
	CookieHandlers,
	Cookie,
} from "@michaelhly.webdriver-interop/c11y";
import type { Cookie as VibiumCookie, SetCookieParam } from "vibium";
import type { BidiContext } from "./context.js";

function toCookie(c: VibiumCookie): Cookie {
	const cookie: Cookie = { name: c.name, value: c.value };
	if (c.domain !== undefined) cookie.domain = c.domain;
	if (c.path !== undefined) cookie.path = c.path;
	if (c.secure !== undefined) cookie.secure = c.secure;
	if (c.httpOnly !== undefined) cookie.httpOnly = c.httpOnly;
	if (c.expiry !== undefined) cookie.expiry = c.expiry;
	if (c.sameSite !== undefined)
		cookie.sameSite = c.sameSite as NonNullable<Cookie["sameSite"]>;
	return cookie;
}

export function createCookieHandlers(ctx: BidiContext): CookieHandlers {
	return {
		async getAllCookies() {
			const raw = await ctx.getPage().context.cookies();
			return { cookies: raw.map(toCookie) };
		},
		async getCookie({ name }) {
			const all = await ctx.getPage().context.cookies();
			const found = all.find((c) => c.name === name);
			if (!found) {
				return { cookie: { name, value: "" } };
			}
			return { cookie: toCookie(found) };
		},
		async addCookie({ cookie }) {
			const param: SetCookieParam = {
				name: cookie.name,
				value: cookie.value,
			};
			if (cookie.domain !== undefined) param.domain = cookie.domain;
			if (cookie.path !== undefined) param.path = cookie.path;
			if (cookie.secure !== undefined) param.secure = cookie.secure;
			if (cookie.httpOnly !== undefined)
				param.httpOnly = cookie.httpOnly;
			if (cookie.sameSite !== undefined)
				param.sameSite = cookie.sameSite;
			if (cookie.expiry !== undefined) param.expiry = cookie.expiry;
			await ctx.getPage().context.setCookies([param]);
		},
		async deleteCookie({ name }) {
			const all = await ctx.getPage().context.cookies();
			await ctx.getPage().context.clearCookies();
			const remaining = all.filter((c) => c.name !== name);
			if (remaining.length > 0) {
				await ctx.getPage().context.setCookies(
					remaining.map((c) => ({
						name: c.name,
						value: c.value,
						domain: c.domain,
						path: c.path,
						httpOnly: c.httpOnly,
						secure: c.secure,
						sameSite: c.sameSite,
						...(c.expiry !== undefined
							? { expiry: c.expiry }
							: {}),
					})),
				);
			}
		},
		async deleteAllCookies() {
			await ctx.getPage().context.clearCookies();
		},
	};
}
