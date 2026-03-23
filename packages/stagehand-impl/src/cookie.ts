import type {
	Cookie as SeleniumCookie,
	CookieHandlers,
} from "@michaelhly.webdriver-interop/c11y";
import { DriverError } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./compat/context.js";
import { getActivePage } from "./compat/page.js";

export function createCookieHandlers(ctx: StagehandContext): CookieHandlers {
	return {
		async getAllCookies() {
			const shCookies = await ctx.stagehand.context.cookies();
			return { cookies: shCookies.map(mapStagehandCookie) };
		},

		async getCookie(params) {
			const shCookies = await ctx.stagehand.context.cookies();
			const found = shCookies.find((c) => c.name === params.name);
			if (!found) {
				throw new DriverError(`Cookie not found: ${params.name}`);
			}
			return { cookie: mapStagehandCookie(found) };
		},

		async addCookie(params) {
			const page = getActivePage(ctx);
			const c = params.cookie;

			await ctx.stagehand.context.addCookies([
				{
					name: c.name,
					value: c.value,
					...(c.domain !== undefined
						? { domain: c.domain }
						: { url: page.url() }),
					...(c.path !== undefined ? { path: c.path } : {}),
					...(c.httpOnly !== undefined ? { httpOnly: c.httpOnly } : {}),
					...(c.secure !== undefined ? { secure: c.secure } : {}),
					...(c.sameSite !== undefined ? { sameSite: c.sameSite } : {}),
					...(c.expiry !== undefined ? { expires: c.expiry } : {}),
				},
			]);
		},

		async deleteCookie(params) {
			await ctx.stagehand.context.clearCookies({ name: params.name });
		},

		async deleteAllCookies() {
			await ctx.stagehand.context.clearCookies();
		},
	};
}

// ---------------------------------------------------------------------------
// Cookie mapping — Stagehand Cookie → c11y Cookie
// ---------------------------------------------------------------------------

function mapStagehandCookie(sh: {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: "Strict" | "Lax" | "None";
}): SeleniumCookie {
	return {
		name: sh.name,
		value: sh.value,
		domain: sh.domain,
		path: sh.path,
		httpOnly: sh.httpOnly,
		secure: sh.secure,
		sameSite: sh.sameSite,
		...(sh.expires >= 0 ? { expiry: sh.expires } : {}),
	};
}
