// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "Cookie".
 */
export interface Cookie {
	name: string;
	value: string;
	path?: string;
	domain?: string;
	secure?: boolean;
	httpOnly?: boolean;
	expiry?: number;
	sameSite?: "Strict" | "Lax" | "None";
}
/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "GetCookieParams".
 */
export interface GetCookieParams {
	name: string;
}
/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "GetAllCookiesResult".
 */
export interface GetAllCookiesResult {
	cookies: Cookie[];
}
/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "GetCookieResult".
 */
export interface GetCookieResult {
	cookie: Cookie;
}
/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "AddCookieParams".
 */
export interface AddCookieParams {
	cookie: Cookie;
}
/**
 * This interface was referenced by `WebdriverCookie`'s JSON-Schema
 * via the `definition` "DeleteCookieParams".
 */
export interface DeleteCookieParams {
	name: string;
}
