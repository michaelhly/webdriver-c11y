# @michaelhly.webdriver-c11y/schema

Shared schema and driver interface for WebDriver Classic and BiDi.

Types are generated from JSON Schema definitions using [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript). The driver interface is functional — implementations provide independent handler groups that compose into a full `Driver`.

## Project layout

```
json/                          # W3C WebDriver 2 schemas
├── actions.json               # PerformActionsParams, ActionSequence, ...
├── alert.json                 # SendAlertTextParams, AlertTextResult
├── context.json               # WindowHandle, SwitchToWindow/Frame, NewWindow
├── cookie.json                # Cookie, GetCookie, AddCookie, DeleteCookie
├── element.json               # Locator, FindElement, ShadowRoot, ComputedRole/Label
├── navigation.json            # NavigateParams, GetCurrentUrl, GetTitle, ...
├── print.json                 # PrintParams, PrintResult
├── screenshot.json            # TakeScreenshotParams
├── script.json                # ExecuteScriptParams, ScriptResult
├── session.json               # Capabilities, Timeouts, StatusResult
└── window.json                # Rect, SetWindowRectParams
json/bidi/                     # WebDriver BiDi-only schemas
├── browser.json               # UserContext, ClientWindow
├── browsing-context.json      # Create, Navigate, GetTree, SetViewport, Print
├── input.json                 # PerformActions, ReleaseActions, SetFiles
├── log.json                   # LogEntry, StackTrace
├── network.json               # Intercept, ContinueRequest/Response, ProvideResponse
├── script.json                # Evaluate, CallFunction, PreloadScript, Realms
└── storage.json               # Partition-aware cookie operations
scripts/
└── generate.ts                # json-schema-to-typescript codegen script
src/
├── generated/                 # Auto-generated TypeScript interfaces (do not edit)
├── driver.ts                  # Handler group interfaces + createDriver
├── errors.ts                  # Shared error hierarchy
└── index.ts                   # Public API barrel
```

## Regenerating types

After editing any `.json` file in `json/`:

```sh
pnpm generate
```

## Handler groups

The driver is composed of 11 handler groups. Each group is an independent interface:

| Group | Handlers |
|---|---|
| `SessionHandlers` | `status`, `newSession`, `deleteSession`, `getTimeouts`, `setTimeouts` |
| `NavigationHandlers` | `navigateTo`, `getCurrentUrl`, `getTitle`, `getPageSource`, `back`, `forward`, `refresh` |
| `ContextHandlers` | `getWindowHandle`, `closeWindow`, `switchToWindow`, `getWindowHandles`, `newWindow`, `switchToFrame`, `switchToParentFrame` |
| `ElementHandlers` | `findElement`, `findElements`, `getActiveElement`, `elementClick`, `elementSendKeys`, `elementClear`, `elementGetText`, `elementGetAttribute`, `elementGetProperty`, `elementGetCssValue`, `elementGetTagName`, `elementGetRect`, `elementIsDisplayed`, `elementIsEnabled`, `elementIsSelected`, `elementGetComputedRole`, `elementGetComputedLabel`, `elementGetShadowRoot`, `findElementFromShadowRoot`, `findElementsFromShadowRoot`, `elementTakeScreenshot` |
| `ScriptHandlers` | `executeScript`, `executeAsyncScript` |
| `CookieHandlers` | `getAllCookies`, `getCookie`, `addCookie`, `deleteCookie`, `deleteAllCookies` |
| `WindowHandlers` | `getWindowRect`, `setWindowRect`, `maximizeWindow`, `minimizeWindow`, `fullscreenWindow` |
| `ActionHandlers` | `performActions`, `releaseActions` |
| `ScreenshotHandlers` | `takeScreenshot` |
| `PrintHandlers` | `printPage` |
| `AlertHandlers` | `getAlertText`, `acceptAlert`, `dismissAlert`, `sendAlertText` |

`Driver` is the intersection of all groups:

```ts
type Driver = { readonly protocol: Protocol }
  & SessionHandlers & NavigationHandlers & ContextHandlers
  & ElementHandlers & ScriptHandlers & CookieHandlers
  & WindowHandlers & ActionHandlers & ScreenshotHandlers
  & PrintHandlers & AlertHandlers;
```

## Implementing a driver

Implementation packages (e.g. `selenium-impl`) provide factory functions that return handler groups, then compose them with `createDriver`.

```ts
import { createDriver } from "@michaelhly.webdriver-c11y/schema";

const driver = createDriver({
  protocol: "webdriver",
  session:    createSessionHandlers(webDriver),
  navigation: createNavigationHandlers(webDriver),
  context:    createContextHandlers(webDriver),
  element:    createElementHandlers(webDriver),
  script:     createScriptHandlers(webDriver),
  cookie:     createCookieHandlers(webDriver),
  window:     createWindowHandlers(webDriver),
  action:     createActionHandlers(webDriver),
  screenshot: createScreenshotHandlers(webDriver),
  print:      createPrintHandlers(webDriver),
  alert:      createAlertHandlers(webDriver),
});
```

Consumer code is backend-agnostic:

```ts
async function run(driver: Driver) {
  await driver.navigateTo({ url: "https://example.com" });

  const { title } = await driver.getTitle();
  const { elementId } = await driver.findElement({
    locator: { using: "css", value: "h1" },
  });
  const { text } = await driver.elementGetText({ elementId });

  await driver.deleteSession();
}
```

## Errors

All implementations should throw errors from the shared hierarchy:

```ts
import {
  NoSuchElementError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-c11y/schema";
```

| Error | When to throw |
|---|---|
| `SessionNotCreatedError` | Browser session failed to start |
| `NoSuchElementError` | Element not found |
| `StaleElementReferenceError` | Element reference is stale |
| `ElementNotInteractableError` | Element exists but can't be interacted with |
| `NoSuchAlertError` | No alert/dialog is open |
| `NoSuchWindowError` | Target window/tab doesn't exist |
| `ScriptTimeoutError` | Script execution exceeded timeout |
| `TimeoutError` | General operation timeout |
| `InvalidSelectorError` | Locator syntax is invalid |
| `UnsupportedOperationError` | Operation not supported by this backend |
