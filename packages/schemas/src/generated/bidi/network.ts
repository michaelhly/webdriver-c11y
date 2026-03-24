// -----------------------------------------------------------------------
// AUTO-GENERATED from JSON Schema files in json/
// Do not edit manually — run `pnpm generate` to regenerate.
// -----------------------------------------------------------------------

/**
 * Opaque intercept ID
 *
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "Intercept".
 */
export type Intercept = string;
/**
 * Opaque request ID
 *
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "Request".
 */
export type Request = string;
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "InterceptPhase".
 */
export type InterceptPhase =
	| "beforeRequestSent"
	| "responseStarted"
	| "authRequired";

/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "UrlPattern".
 */
export interface UrlPattern {
	type: "string" | "pattern";
	pattern?: string;
	protocol?: string;
	hostname?: string;
	port?: string;
	pathname?: string;
	search?: string;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "Header".
 */
export interface Header {
	name: string;
	value: {
		type: "string" | "base64";
		value: string;
	};
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "AddInterceptParams".
 */
export interface AddInterceptParams {
	phases: InterceptPhase[];
	contexts?: string[];
	urlPatterns?: UrlPattern[];
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "AddInterceptResult".
 */
export interface AddInterceptResult {
	intercept: Intercept;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "RemoveInterceptParams".
 */
export interface RemoveInterceptParams {
	intercept: Intercept;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "ContinueRequestParams".
 */
export interface ContinueRequestParams {
	request: Request;
	body?: {
		type: "string" | "base64";
		value: string;
	};
	cookies?: Header[];
	headers?: Header[];
	method?: string;
	url?: string;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "ContinueResponseParams".
 */
export interface ContinueResponseParams {
	request: Request;
	cookies?: Header[];
	headers?: Header[];
	reasonPhrase?: string;
	statusCode?: number;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "ProvideResponseParams".
 */
export interface ProvideResponseParams {
	request: Request;
	body?: {
		type: "string" | "base64";
		value: string;
	};
	cookies?: Header[];
	headers?: Header[];
	reasonPhrase?: string;
	statusCode?: number;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "FailRequestParams".
 */
export interface FailRequestParams {
	request: Request;
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "ContinueWithAuthParams".
 */
export interface ContinueWithAuthParams {
	request: Request;
	action: "provideCredentials" | "default" | "cancel";
	credentials?: {
		type: "password";
		username: string;
		password: string;
	};
}
/**
 * This interface was referenced by `WebdriverBidiNetwork`'s JSON-Schema
 * via the `definition` "SetCacheBehaviorParams".
 */
export interface SetCacheBehaviorParams {
	cacheBehavior: "default" | "bypass";
	contexts?: string[];
}
