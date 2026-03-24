# @michaelhly.webdriver-c11y/schema

Shared schema and driver interface for WebDriver Classic and BiDi.

Types are generated from JSON Schema definitions using [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript). Three driver interfaces are available depending on your needs.

## Driver interfaces

| Interface | Factory | Use case |
|---|---|---|
| `ClassicDriver` | `createClassicDriver()` | WebDriver Classic only |
| `BidiDriver` | `createBidiDriver()` | WebDriver BiDi only |
| `Driver` | `createDriver()` | Combined Classic + BiDi |

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
├── generated/                 # Auto-generated Classic types (do not edit)
├── generated/bidi/            # Auto-generated BiDi types (do not edit)
├── driver/classic.ts           # Classic handler groups + createClassicDriver
├── driver/bidi.ts             # BiDi handler groups + createBidiDriver
├── driver/index.ts            # Protocol, combined Driver + createDriver
├── errors.ts                  # Shared error hierarchy
└── index.ts                   # Public API barrel
```

## Regenerating types

After editing any `.json` file in `json/` or `json/bidi/`:

```sh
pnpm generate
```

## Classic handler groups

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

## BiDi handler groups

| Group | Handlers |
|---|---|
| `BidiBrowsingContextHandlers` | `browsingContextCreate`, `browsingContextClose`, `browsingContextActivate`, `browsingContextNavigate`, `browsingContextReload`, `browsingContextTraverseHistory`, `browsingContextGetTree`, `browsingContextSetViewport`, `browsingContextPrint` |
| `BidiNetworkHandlers` | `networkAddIntercept`, `networkRemoveIntercept`, `networkContinueRequest`, `networkContinueResponse`, `networkProvideResponse`, `networkFailRequest`, `networkContinueWithAuth`, `networkSetCacheBehavior` |
| `BidiScriptHandlers` | `scriptEvaluate`, `scriptCallFunction`, `scriptAddPreloadScript`, `scriptRemovePreloadScript`, `scriptGetRealms`, `scriptDisown` |
| `BidiLogHandlers` | `onLogEntry` |
| `BidiInputHandlers` | `inputPerformActions`, `inputReleaseActions`, `inputSetFiles` |
| `BidiStorageHandlers` | `storageGetCookies`, `storageSetCookie`, `storageDeleteCookies` |
| `BidiBrowserHandlers` | `browserClose`, `browserCreateUserContext`, `browserGetUserContexts`, `browserRemoveUserContext`, `browserGetClientWindows`, `browserSetClientWindowState` |

## Usage

### Classic only

```ts
import { createClassicDriver, type ClassicDriver } from "@michaelhly.webdriver-c11y/schema";

const driver = createClassicDriver({
  protocol: "webdriver",
  session:    createSessionHandlers(wd),
  navigation: createNavigationHandlers(wd),
  context:    createContextHandlers(wd),
  element:    createElementHandlers(wd),
  script:     createScriptHandlers(wd),
  cookie:     createCookieHandlers(wd),
  window:     createWindowHandlers(wd),
  action:     createActionHandlers(wd),
  screenshot: createScreenshotHandlers(wd),
  print:      createPrintHandlers(wd),
  alert:      createAlertHandlers(wd),
});
```

### BiDi only

```ts
import { createBidiDriver, type BidiDriver } from "@michaelhly.webdriver-c11y/schema";

const driver = createBidiDriver({
  protocol: "webdriver",
  browsingContext: createBrowsingContextHandlers(session),
  network:        createNetworkHandlers(session),
  script:         createScriptHandlers(session),
  log:            createLogHandlers(session),
  input:          createInputHandlers(session),
  storage:        createStorageHandlers(session),
  browser:        createBrowserHandlers(session),
});
```

### Combined (Classic + BiDi)

```ts
import { createDriver, type Driver } from "@michaelhly.webdriver-c11y/schema";

const driver = createDriver({
  protocol: "webdriver",
  classic: {
    session:    createSessionHandlers(wd),
    navigation: createNavigationHandlers(wd),
    // ... all classic handler groups
  },
  bidi: {
    browsingContext: createBrowsingContextHandlers(session),
    network:        createNetworkHandlers(session),
    // ... all bidi handler groups
  },
});
```

### Consumer code

Consumer code is backend-agnostic:

```ts
async function run(driver: ClassicDriver) {
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
