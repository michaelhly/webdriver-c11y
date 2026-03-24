# @michaelhly.webdriver-interop/c11y

Compatibility interface between WebDriver Classic (`selenium-webdriver`) and WebDriver BiDi (`vibium`).

Types are generated from JSON Schema definitions using [quicktype](https://github.com/glideapps/quicktype). The driver interface is functional — implementations provide independent handler groups that compose into a full `Driver`.

## Project layout

```
schema/                  # JSON Schema source of truth
├── session.json         # Capabilities, NewSessionParams, NewSessionResult
├── navigation.json      # NavigateParams, GetCurrentUrlResult, ...
├── element.json         # Locator, LocatorStrategy, FindElementParams, ...
├── script.json          # ExecuteScriptParams, ScriptResult
├── cookie.json          # Cookie, GetCookieParams, AddCookieParams, ...
├── window.json          # Rect, SetWindowRectParams
├── screenshot.json      # TakeScreenshotParams
└── alert.json           # SendAlertTextParams, AlertTextResult
scripts/
└── codegen.ts           # quicktype codegen script
src/
├── generated/types.ts   # Auto-generated TypeScript interfaces (do not edit)
├── driver.ts            # Functional handler group interfaces + createDriver
├── errors.ts            # Shared error hierarchy
└── index.ts             # Public API barrel
```

Each shared type lives in the domain that owns it (`Locator` in `element.json`, `Cookie` in `cookie.json`, `Rect` in `window.json`, `Capabilities` in `session.json`). Cross-domain references use `$ref` and are resolved at codegen time.

## Regenerating types

After editing any `.json` file in `schema/`:

```sh
pnpm generate
```

## Handler groups

The driver is composed of 8 handler groups. Each group is an independent interface that an implementation must satisfy:

| Group | Handlers |
|---|---|
| `SessionHandlers` | `newSession`, `deleteSession` |
| `NavigationHandlers` | `navigateTo`, `getCurrentUrl`, `getTitle`, `getPageSource`, `back`, `forward`, `refresh` |
| `ElementHandlers` | `findElement`, `findElements`, `elementClick`, `elementSendKeys`, `elementClear`, `elementGetText`, `elementGetAttribute`, `elementGetProperty`, `elementGetCssValue`, `elementGetTagName`, `elementGetRect`, `elementIsDisplayed`, `elementIsEnabled`, `elementIsSelected`, `elementTakeScreenshot` |
| `ScriptHandlers` | `executeScript`, `executeAsyncScript` |
| `CookieHandlers` | `getAllCookies`, `getCookie`, `addCookie`, `deleteCookie`, `deleteAllCookies` |
| `WindowHandlers` | `getWindowRect`, `setWindowRect`, `maximizeWindow`, `minimizeWindow`, `fullscreenWindow` |
| `ScreenshotHandlers` | `takeScreenshot` |
| `AlertHandlers` | `getAlertText`, `acceptAlert`, `dismissAlert`, `sendAlertText` |

`Driver` is the intersection of all groups:

```ts
type Driver = SessionHandlers & NavigationHandlers & ElementHandlers
  & ScriptHandlers & CookieHandlers & WindowHandlers
  & ScreenshotHandlers & AlertHandlers;
```

## Implementing a driver

Each implementation package (`selenium-impl`, `vibium-impl`) provides factory functions that return handler groups, then composes them with `createDriver`.

### Step 1 — implement handler groups

Write a factory for each group that wraps the underlying library:

```ts
// selenium-impl/src/navigation.ts
import type { NavigationHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { WebDriver } from "selenium-webdriver";

export function createNavigationHandlers(
  driver: WebDriver,
): NavigationHandlers {
  return {
    navigateTo: async ({ url }) => {
      await driver.get(url);
    },
    getCurrentUrl: async () => ({
      url: await driver.getCurrentUrl(),
    }),
    getTitle: async () => ({
      title: await driver.getTitle(),
    }),
    getPageSource: async () => ({
      source: await driver.getPageSource(),
    }),
    back: async () => {
      await driver.navigate().back();
    },
    forward: async () => {
      await driver.navigate().forward();
    },
    refresh: async () => {
      await driver.navigate().refresh();
    },
  };
}
```

The same group in the BiDi implementation:

```ts
// vibium-impl/src/navigation.ts
import type { NavigationHandlers } from "@michaelhly.webdriver-interop/c11y";
import type { Page } from "vibium";

export function createNavigationHandlers(page: Page): NavigationHandlers {
  return {
    navigateTo: async ({ url }) => {
      await page.go(url);
    },
    getCurrentUrl: async () => ({
      url: await page.url(),
    }),
    getTitle: async () => ({
      title: await page.title(),
    }),
    getPageSource: async () => ({
      source: await page.content(),
    }),
    back: async () => {
      await page.back();
    },
    forward: async () => {
      await page.forward();
    },
    refresh: async () => {
      await page.reload();
    },
  };
}
```

### Step 2 — compose into a Driver

```ts
import { createDriver } from "@michaelhly.webdriver-interop/c11y";

export function createClassicDriver(webDriver: WebDriver): Driver {
  return createDriver({
    session:    createSessionHandlers(webDriver),
    navigation: createNavigationHandlers(webDriver),
    element:    createElementHandlers(webDriver),
    script:     createScriptHandlers(webDriver),
    cookie:     createCookieHandlers(webDriver),
    window:     createWindowHandlers(webDriver),
    screenshot: createScreenshotHandlers(webDriver),
    alert:      createAlertHandlers(webDriver),
  });
}
```

### Step 3 — use the driver

Consumer code is backend-agnostic:

```ts
async function run(driver: Driver) {
  await driver.navigateTo({ url: "https://example.com" });

  const { title } = await driver.getTitle();
  console.log(title);

  const { elementId } = await driver.findElement({
    locator: { using: "css", value: "h1" },
  });
  const { text } = await driver.elementGetText({ elementId });
  console.log(text);

  await driver.deleteSession();
}
```

## Locator strategies

The `LocatorStrategy` union covers both Classic and BiDi locator types:

| Strategy | Classic (selenium-webdriver) | BiDi (vibium) |
|---|---|---|
| `css` | `By.css()` | `page.find()` |
| `xpath` | `By.xpath()` | translate or unsupported |
| `id` | `By.id()` | translate to `#id` css |
| `name` | `By.name()` | translate to `[name="..."]` css |
| `tag-name` | `By.tagName()` | translate to tag css |
| `class-name` | `By.className()` | translate to `.class` css |
| `link-text` | `By.linkText()` | translate to text locator |
| `partial-link-text` | `By.partialLinkText()` | translate or unsupported |
| `text` | translate to xpath | semantic text locator |
| `role` | translate or unsupported | semantic role locator |
| `label` | translate or unsupported | semantic label locator |
| `placeholder` | translate to `[placeholder="..."]` css | semantic placeholder locator |

Implementations are responsible for translating strategies that aren't natively supported by their backend. Throw `UnsupportedOperationError` for strategies that can't be translated.

## Errors

All implementations should throw errors from the shared hierarchy:

```ts
import {
  NoSuchElementError,
  UnsupportedOperationError,
} from "@michaelhly.webdriver-interop/c11y";
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
