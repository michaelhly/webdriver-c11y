import type {
	CookieHandlers,
	Cookie,
} from "@michaelhly.webdriver-interop/c11y";
import type { CookieData } from "vibium";
import type { VibiumContext } from "./context.js";

function toCookie(c: CookieData): Cookie {
	const cookie: Cookie = { name: c.name, value: c.value };
	if (c.domain !== undefined) cookie.domain = c.domain;
	if (c.path !== undefined) cookie.path = c.path;
	if (c.secure !== undefined) cookie.secure = c.secure;
	if (c.httpOnly !== undefined) cookie.httpOnly = c.httpOnly;
	if (c.expires !== undefined) cookie.expiry = c.expires;
	if (c.sameSite != null)
		cookie.sameSite = c.sameSite as NonNullable<Cookie["sameSite"]>;
	return cookie;
}

function toVibiumCookie(c: Cookie): CookieData {
	const cookie: CookieData = { name: c.name, value: c.value };
	if (c.domain !== undefined) cookie.domain = c.domain;
	if (c.path !== undefined) cookie.path = c.path;
	if (c.secure !== undefined) cookie.secure = c.secure;
	if (c.httpOnly !== undefined) cookie.httpOnly = c.httpOnly;
	if (c.expiry !== undefined) cookie.expires = c.expiry;
	if (c.sameSite != null) cookie.sameSite = c.sameSite;
	return cookie;
}

export function createCookieHandlers(ctx: VibiumContext): CookieHandlers {
	return {
		async getAllCookies() {
			const raw = await ctx.getContext().cookies();
			return { cookies: raw.map(toCookie) };
		},
		async getCookie({ name }) {
			const all = await ctx.getContext().cookies();
			const found = all.find((c) => c.name === name);
			if (!found) throw new Error(`Cookie not found: ${name}`);
			return { cookie: toCookie(found) };
		},
		async addCookie({ cookie }) {
			const existing = await ctx.getContext().cookies();
			await ctx
				.getContext()
				.setCookies([...existing, toVibiumCookie(cookie)]);
		},
		async deleteCookie({ name }) {
			const existing = await ctx.getContext().cookies();
			await ctx.getContext().clearCookies();
			await ctx
				.getContext()
				.setCookies(existing.filter((c) => c.name !== name));
		},
		async deleteAllCookies() {
			await ctx.getContext().clearCookies();
		},
	};
}
