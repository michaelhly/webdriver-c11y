import type {
	ClientWindowInfo,
	CreateUserContextResult,
	GetClientWindowsResult,
	GetUserContextsResult,
	RemoveUserContextParams,
	SetClientWindowStateParams,
} from "../generated/bidi/browser.js";
import type {
	ActivateParams,
	NavigateParams as BidiNavigateParams,
	PrintParams as BidiPrintParams,
	PrintResult as BidiPrintResult,
	CloseParams,
	CreateParams,
	CreateResult,
	GetTreeParams,
	InfoListResult,
	NavigateResult,
	ReloadParams,
	SetViewportParams,
	TraverseHistoryParams,
} from "../generated/bidi/browsing-context.js";
import type {
	PerformActionsParams as BidiPerformActionsParams,
	ReleaseActionsParams,
	SetFilesParams,
} from "../generated/bidi/input.js";
import type { LogEntry } from "../generated/bidi/log.js";
import type {
	AddInterceptParams,
	AddInterceptResult,
	ContinueRequestParams,
	ContinueResponseParams,
	ContinueWithAuthParams,
	FailRequestParams,
	ProvideResponseParams,
	RemoveInterceptParams,
	SetCacheBehaviorParams,
} from "../generated/bidi/network.js";
import type {
	AddPreloadScriptParams,
	AddPreloadScriptResult,
	CallFunctionParams,
	DisownParams,
	EvaluateParams,
	GetRealmsParams,
	GetRealmsResult,
	RemovePreloadScriptParams,
} from "../generated/bidi/script.js";
import type {
	DeleteCookiesParams,
	DeleteCookiesResult,
	GetCookiesParams,
	GetCookiesResult,
	SetCookieParams,
	SetCookieResult,
} from "../generated/bidi/storage.js";
import type { Protocol } from "./index.js";

// ---------------------------------------------------------------------------
// Generic BiDi response wrapper — bidi.send() returns { result: T }.
// ---------------------------------------------------------------------------

export interface BidiResponse<T> {
	result: T;
}

// ---------------------------------------------------------------------------
// BiDi handler groups — domains unique to WebDriver BiDi.
// ---------------------------------------------------------------------------

export interface BidiBrowsingContextHandlers {
	browsingContextCreate: (params: CreateParams) => Promise<CreateResult>;
	browsingContextClose: (params: CloseParams) => Promise<void>;
	browsingContextActivate: (params: ActivateParams) => Promise<void>;
	browsingContextNavigate: (
		params: BidiNavigateParams,
	) => Promise<NavigateResult>;
	browsingContextReload: (params: ReloadParams) => Promise<NavigateResult>;
	browsingContextTraverseHistory: (
		params: TraverseHistoryParams,
	) => Promise<void>;
	browsingContextGetTree: (params: GetTreeParams) => Promise<InfoListResult>;
	browsingContextSetViewport: (params: SetViewportParams) => Promise<void>;
	browsingContextPrint: (params: BidiPrintParams) => Promise<BidiPrintResult>;
}

export interface BidiNetworkHandlers {
	networkAddIntercept: (
		params: AddInterceptParams,
	) => Promise<AddInterceptResult>;
	networkRemoveIntercept: (params: RemoveInterceptParams) => Promise<void>;
	networkContinueRequest: (params: ContinueRequestParams) => Promise<void>;
	networkContinueResponse: (params: ContinueResponseParams) => Promise<void>;
	networkProvideResponse: (params: ProvideResponseParams) => Promise<void>;
	networkFailRequest: (params: FailRequestParams) => Promise<void>;
	networkContinueWithAuth: (params: ContinueWithAuthParams) => Promise<void>;
	networkSetCacheBehavior: (params: SetCacheBehaviorParams) => Promise<void>;
}

export interface BidiScriptHandlers {
	scriptEvaluate: (params: EvaluateParams) => Promise<unknown>;
	scriptCallFunction: (params: CallFunctionParams) => Promise<unknown>;
	scriptAddPreloadScript: (
		params: AddPreloadScriptParams,
	) => Promise<AddPreloadScriptResult>;
	scriptRemovePreloadScript: (
		params: RemovePreloadScriptParams,
	) => Promise<void>;
	scriptGetRealms: (params: GetRealmsParams) => Promise<GetRealmsResult>;
	scriptDisown: (params: DisownParams) => Promise<void>;
}

export interface BidiLogHandlers {
	onLogEntry: (callback: (entry: LogEntry) => void) => () => void;
}

export interface BidiInputHandlers {
	inputPerformActions: (params: BidiPerformActionsParams) => Promise<void>;
	inputReleaseActions: (params: ReleaseActionsParams) => Promise<void>;
	inputSetFiles: (params: SetFilesParams) => Promise<void>;
}

export interface BidiStorageHandlers {
	storageGetCookies: (params: GetCookiesParams) => Promise<GetCookiesResult>;
	storageSetCookie: (params: SetCookieParams) => Promise<SetCookieResult>;
	storageDeleteCookies: (
		params: DeleteCookiesParams,
	) => Promise<DeleteCookiesResult>;
}

export interface BidiBrowserHandlers {
	browserClose: () => Promise<void>;
	browserCreateUserContext: () => Promise<CreateUserContextResult>;
	browserGetUserContexts: () => Promise<GetUserContextsResult>;
	browserRemoveUserContext: (params: RemoveUserContextParams) => Promise<void>;
	browserGetClientWindows: () => Promise<GetClientWindowsResult>;
	browserSetClientWindowState: (
		params: SetClientWindowStateParams,
	) => Promise<ClientWindowInfo>;
}

// ---------------------------------------------------------------------------
// BidiDriver — the complete BiDi functional interface.
// ---------------------------------------------------------------------------

export type BidiDriver = {
	readonly protocol: Protocol;
} & BidiBrowsingContextHandlers &
	BidiNetworkHandlers &
	BidiScriptHandlers &
	BidiLogHandlers &
	BidiInputHandlers &
	BidiStorageHandlers &
	BidiBrowserHandlers;

export interface BidiDriverComponents {
	protocol: Protocol;
	browsingContext: BidiBrowsingContextHandlers;
	network: BidiNetworkHandlers;
	script: BidiScriptHandlers;
	log: BidiLogHandlers;
	input: BidiInputHandlers;
	storage: BidiStorageHandlers;
	browser: BidiBrowserHandlers;
}

export function createBidiDriver(components: BidiDriverComponents): BidiDriver {
	return {
		protocol: components.protocol,
		...components.browsingContext,
		...components.network,
		...components.script,
		...components.log,
		...components.input,
		...components.storage,
		...components.browser,
	};
}
