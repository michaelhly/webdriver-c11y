import type { PerformActionsParams } from "../generated/actions.js";
import type {
  AlertTextResult,
  SendAlertTextParams,
} from "../generated/alert.js";
import type {
  NewWindowParams,
  NewWindowResult,
  SwitchToFrameParams,
  SwitchToWindowParams,
  WindowHandleResult,
  WindowHandlesResult,
} from "../generated/context.js";
import type {
  AddCookieParams,
  DeleteCookieParams,
  GetAllCookiesResult,
  GetCookieParams,
  GetCookieResult,
} from "../generated/cookie.js";
import type {
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
  PropertyResult,
  ScreenshotResult,
  SendKeysParams,
  ShadowRootResult,
  TagNameResult,
  TextResult,
} from "../generated/element.js";
import type {
  GetCurrentUrlResult,
  GetPageSourceResult,
  GetTitleResult,
  NavigateParams,
} from "../generated/navigation.js";
import type { PrintParams, PrintResult } from "../generated/print.js";
import type { TakeScreenshotParams } from "../generated/screenshot.js";
import type { ExecuteScriptParams, ScriptResult } from "../generated/script.js";
import type {
  NewSessionParams,
  NewSessionResult,
  StatusResult,
  Timeouts,
} from "../generated/session.js";
import type { Rect, SetWindowRectParams } from "../generated/window.js";
import type { Protocol } from "./index.js";

// ---------------------------------------------------------------------------
// Classic handler groups — each domain is an independent composable unit.
// ---------------------------------------------------------------------------

export interface SessionHandlers {
  status: () => Promise<StatusResult>;
  newSession: (params: NewSessionParams) => Promise<NewSessionResult>;
  deleteSession: () => Promise<void>;
  getTimeouts: () => Promise<Timeouts>;
  setTimeouts: (params: Timeouts) => Promise<void>;
}

export interface NavigationHandlers {
  navigateTo: (params: NavigateParams) => Promise<void>;
  getCurrentUrl: () => Promise<GetCurrentUrlResult>;
  getTitle: () => Promise<GetTitleResult>;
  getPageSource: () => Promise<GetPageSourceResult>;
  back: () => Promise<void>;
  forward: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface ElementHandlers {
  findElement: (params: FindElementParams) => Promise<FindElementResult>;
  findElements: (params: FindElementParams) => Promise<FindElementsResult>;
  getActiveElement: () => Promise<ActiveElementResult>;
  elementClick: (params: ElementIdParams) => Promise<void>;
  elementSendKeys: (params: SendKeysParams) => Promise<void>;
  elementClear: (params: ElementIdParams) => Promise<void>;
  elementGetText: (params: ElementIdParams) => Promise<TextResult>;
  elementGetAttribute: (params: GetAttributeParams) => Promise<AttributeResult>;
  elementGetProperty: (params: GetPropertyParams) => Promise<PropertyResult>;
  elementGetCssValue: (params: GetCssValueParams) => Promise<CssValueResult>;
  elementGetTagName: (params: ElementIdParams) => Promise<TagNameResult>;
  elementGetRect: (params: ElementIdParams) => Promise<Rect>;
  elementIsDisplayed: (params: ElementIdParams) => Promise<BooleanResult>;
  elementIsEnabled: (params: ElementIdParams) => Promise<BooleanResult>;
  elementIsSelected: (params: ElementIdParams) => Promise<BooleanResult>;
  elementGetComputedRole: (
    params: ElementIdParams,
  ) => Promise<ComputedRoleResult>;
  elementGetComputedLabel: (
    params: ElementIdParams,
  ) => Promise<ComputedLabelResult>;
  elementGetShadowRoot: (params: ElementIdParams) => Promise<ShadowRootResult>;
  findElementFromShadowRoot: (
    params: FindElementFromShadowRootParams,
  ) => Promise<FindElementResult>;
  findElementsFromShadowRoot: (
    params: FindElementFromShadowRootParams,
  ) => Promise<FindElementsResult>;
  elementTakeScreenshot: (params: ElementIdParams) => Promise<ScreenshotResult>;
}

export interface ScriptHandlers {
  executeScript: (params: ExecuteScriptParams) => Promise<ScriptResult>;
  executeAsyncScript: (params: ExecuteScriptParams) => Promise<ScriptResult>;
}

export interface CookieHandlers {
  getAllCookies: () => Promise<GetAllCookiesResult>;
  getCookie: (params: GetCookieParams) => Promise<GetCookieResult>;
  addCookie: (params: AddCookieParams) => Promise<void>;
  deleteCookie: (params: DeleteCookieParams) => Promise<void>;
  deleteAllCookies: () => Promise<void>;
}

export interface ContextHandlers {
  getWindowHandle: () => Promise<WindowHandleResult>;
  closeWindow: () => Promise<void>;
  switchToWindow: (params: SwitchToWindowParams) => Promise<void>;
  getWindowHandles: () => Promise<WindowHandlesResult>;
  newWindow: (params: NewWindowParams) => Promise<NewWindowResult>;
  switchToFrame: (params: SwitchToFrameParams) => Promise<void>;
  switchToParentFrame: () => Promise<void>;
}

export interface WindowHandlers {
  getWindowRect: () => Promise<Rect>;
  setWindowRect: (params: SetWindowRectParams) => Promise<Rect>;
  maximizeWindow: () => Promise<Rect>;
  minimizeWindow: () => Promise<Rect>;
  fullscreenWindow: () => Promise<Rect>;
}

export interface ActionHandlers {
  performActions: (params: PerformActionsParams) => Promise<void>;
  releaseActions: () => Promise<void>;
}

export interface PrintHandlers {
  printPage: (params: PrintParams) => Promise<PrintResult>;
}

export interface ScreenshotHandlers {
  takeScreenshot: (params: TakeScreenshotParams) => Promise<ScreenshotResult>;
}

export interface AlertHandlers {
  getAlertText: () => Promise<AlertTextResult>;
  acceptAlert: () => Promise<void>;
  dismissAlert: () => Promise<void>;
  sendAlertText: (params: SendAlertTextParams) => Promise<void>;
}

// ---------------------------------------------------------------------------
// ClassicDriver — WebDriver Classic only.
// ---------------------------------------------------------------------------

export type ClassicDriver = { readonly protocol: Protocol } & SessionHandlers &
  NavigationHandlers &
  ContextHandlers &
  ElementHandlers &
  ScriptHandlers &
  CookieHandlers &
  WindowHandlers &
  ActionHandlers &
  ScreenshotHandlers &
  PrintHandlers &
  AlertHandlers;

export interface ClassicDriverComponents {
  protocol: Protocol;
  session: SessionHandlers;
  navigation: NavigationHandlers;
  context: ContextHandlers;
  element: ElementHandlers;
  script: ScriptHandlers;
  cookie: CookieHandlers;
  window: WindowHandlers;
  action: ActionHandlers;
  screenshot: ScreenshotHandlers;
  print: PrintHandlers;
  alert: AlertHandlers;
}

export function createClassicDriver(
  components: ClassicDriverComponents,
): ClassicDriver {
  return {
    protocol: components.protocol,
    ...components.session,
    ...components.navigation,
    ...components.context,
    ...components.element,
    ...components.script,
    ...components.cookie,
    ...components.window,
    ...components.action,
    ...components.screenshot,
    ...components.print,
    ...components.alert,
  };
}
