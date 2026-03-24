import type { Cookie, CookieHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { IWebDriverOptionsCookie } from "selenium-webdriver";
import type { ClassicContext } from "./context.js";

function toCookie(c: IWebDriverOptionsCookie): Cookie {
	const cookie: Cookie = { name: c.name, value: c.value };
	if (c.path !== undefined) cookie.path = c.path;
	if (c.domain !== undefined) cookie.domain = c.domain;
	if (c.secure !== undefined) cookie.secure = c.secure;
	if (c.httpOnly !== undefined) cookie.httpOnly = c.httpOnly;
	if (c.expiry !== undefined) {
		cookie.expiry =
			c.expiry instanceof Date
				? Math.floor(c.expiry.getTime() / 1000)
				: c.expiry;
	}
	if (c.sameSite != null)
		cookie.sameSite = c.sameSite as NonNullable<Cookie["sameSite"]>;
	return cookie;
}

export function createCookieHandlers(ctx: ClassicContext): CookieHandlers {
	return {
		async getAllCookies() {
			const raw = await ctx.getDriver().manage().getCookies();
			return { cookies: raw.map(toCookie) };
		},
		async getCookie({ name }) {
			const c = await ctx.getDriver().manage().getCookie(name);
			return { cookie: toCookie(c) };
		},
		async addCookie({ cookie }) {
			await ctx.getDriver().manage().addCookie(cookie);
		},
		async deleteCookie({ name }) {
			await ctx.getDriver().manage().deleteCookie(name);
		},
		async deleteAllCookies() {
			await ctx.getDriver().manage().deleteAllCookies();
		},
	};
}
