// Generated types — derived from JSON Schema via json-schema-to-typescript

// Driver interfaces
export {
  type ActionHandlers,
  type AlertHandlers,
  type BidiBrowserHandlers,
  type BidiBrowsingContextHandlers,
  type BidiDriver,
  type BidiDriverComponents,
  type BidiInputHandlers,
  type BidiLogHandlers,
  type BidiNetworkHandlers,
  type BidiResponse,
  type BidiScriptHandlers,
  type BidiStorageHandlers,
  type ClassicDriver,
  type ClassicDriverComponents,
  type ContextHandlers,
  type CookieHandlers,
  // BiDi
  createBidiDriver,
  // Classic
  createClassicDriver,
  // Combined
  createDriver,
  type Driver,
  type DriverComponents,
  type ElementHandlers,
  type NavigationHandlers,
  type PrintHandlers,
  type Protocol,
  type ScreenshotHandlers,
  type ScriptHandlers,
  type SessionHandlers,
  type WindowHandlers,
} from "./driver/index.js";

// Error types
export {
  DriverError,
  ElementNotInteractableError,
  InvalidSelectorError,
  NoSuchAlertError,
  NoSuchElementError,
  NoSuchWindowError,
  ScriptTimeoutError,
  SessionNotCreatedError,
  StaleElementReferenceError,
  TimeoutError,
  UnsupportedOperationError,
} from "./errors.js";

// Classic generated types
export type {
  ActionSequence,
  KeyAction,
  NullAction,
  PerformActionsParams,
  PointerAction,
  PointerType,
  SourceActionType,
  WheelAction,
} from "./generated/actions.js";
export type {
  AlertTextResult,
  SendAlertTextParams,
} from "./generated/alert.js";
// BiDi generated types
export type {
  ClientWindowInfo,
  CreateUserContextResult,
  GetClientWindowsResult,
  GetUserContextsResult,
  RemoveUserContextParams,
  SetClientWindowStateParams,
  UserContext,
  UserContextInfo,
} from "./generated/bidi/browser.js";
export type {
  ActivateParams,
  BrowsingContext,
  CloseParams,
  CreateParams,
  CreateResult,
  CreateType,
  GetTreeParams,
  Info,
  InfoListResult,
  NavigateParams as BidiNavigateParams,
  NavigateResult,
  Navigation,
  PrintParams as BidiPrintParams,
  PrintResult as BidiPrintResult,
  ReadinessState,
  ReloadParams,
  SetViewportParams,
  TraverseHistoryParams,
} from "./generated/bidi/browsing-context.js";
export type {
  KeyAction as BidiKeyAction,
  PerformActionsParams as BidiPerformActionsParams,
  PointerAction as BidiPointerAction,
  PointerType as BidiPointerType,
  ReleaseActionsParams,
  SetFilesParams,
  SourceActions,
  SourceActionType as BidiSourceActionType,
  WheelAction as BidiWheelAction,
} from "./generated/bidi/input.js";
export type {
  LogEntry,
  LogLevel,
  StackFrame,
  StackTrace,
} from "./generated/bidi/log.js";
export type {
  AddInterceptParams,
  AddInterceptResult,
  ContinueRequestParams,
  ContinueResponseParams,
  ContinueWithAuthParams,
  FailRequestParams,
  Header,
  Intercept,
  InterceptPhase,
  ProvideResponseParams,
  RemoveInterceptParams,
  Request,
  SetCacheBehaviorParams,
  UrlPattern,
} from "./generated/bidi/network.js";
export type {
  AddPreloadScriptParams,
  AddPreloadScriptResult,
  CallFunctionParams,
  DisownParams,
  EvaluateParams,
  GetRealmsParams,
  GetRealmsResult,
  RealmInfo,
  RealmType,
  RemovePreloadScriptParams,
  ResultOwnership,
  SerializationOptions,
  Target,
} from "./generated/bidi/script.js";
export type {
  CookieFilter,
  DeleteCookiesParams,
  DeleteCookiesResult,
  GetCookiesParams,
  GetCookiesResult,
  PartitionDescriptor,
  PartitionKey,
  SetCookieParams,
  SetCookieResult,
} from "./generated/bidi/storage.js";
export type {
  NewWindowParams,
  NewWindowResult,
  SwitchToFrameParams,
  SwitchToWindowParams,
  WindowHandleResult,
  WindowHandlesResult,
} from "./generated/context.js";
export type {
  AddCookieParams,
  Cookie,
  DeleteCookieParams,
  GetAllCookiesResult,
  GetCookieParams,
  GetCookieResult,
} from "./generated/cookie.js";
export type {
  ActiveElementResult,
  AttributeResult,
  BooleanResult,
  ComputedLabelResult,
  ComputedRoleResult,
  CssValueResult,
  ElementIdParams,
  FindElementFromShadowRootParams,
  FindElementParams,
  FindElementResult,
  FindElementsResult,
  GetAttributeParams,
  GetCssValueParams,
  GetPropertyParams,
  Locator,
  LocatorStrategy,
  PropertyResult,
  ScreenshotResult,
  SendKeysParams,
  ShadowRootResult,
  TagNameResult,
  TextResult,
} from "./generated/element.js";
export type {
  GetCurrentUrlResult,
  GetPageSourceResult,
  GetTitleResult,
  NavigateParams,
} from "./generated/navigation.js";
export type { PrintParams, PrintResult } from "./generated/print.js";
export type { TakeScreenshotParams } from "./generated/screenshot.js";
export type { ExecuteScriptParams, ScriptResult } from "./generated/script.js";
export type {
  Capabilities,
  CapabilitiesRequest,
  NewSessionParams,
  NewSessionResult,
  ProxyConfiguration,
  StatusResult,
  Timeouts,
} from "./generated/session.js";
export type { Rect, SetWindowRectParams } from "./generated/window.js";
