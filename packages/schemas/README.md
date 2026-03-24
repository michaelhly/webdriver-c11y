# @michaelhly.webdriver-c11y/schemas

Shared schemas and driver interface for WebDriver Classic and BiDi.

Types are generated from JSON Schema definitions using [json-schema-to-typescript](https://github.com/bcherny/json-schema-to-typescript). Implementations provide handler groups that compose into a typed driver.

## Driver interfaces

| Interface | Factory | Use case |
|---|---|---|
| `ClassicDriver` | `createClassicDriver()` | WebDriver Classic only |
| `BidiDriver` | `createBidiDriver()` | WebDriver BiDi only |
| `Driver` | `createDriver()` | Combined Classic + BiDi |

## Development

### Regenerating types

After editing any `.json` file in `json/` or `json/bidi/`:

```sh
pnpm generate
```

### Project layout

```
json/                          # W3C WebDriver 2 schemas
json/bidi/                     # WebDriver BiDi-only schemas
scripts/generate.ts            # Codegen script
src/
├── generated/                 # Auto-generated Classic types (do not edit)
├── generated/bidi/            # Auto-generated BiDi types (do not edit)
├── driver/classic.ts          # Classic handler groups + createClassicDriver
├── driver/bidi.ts             # BiDi handler groups + createBidiDriver
├── driver/index.ts            # Protocol, combined Driver + createDriver
├── errors.ts                  # Shared error hierarchy
└── index.ts                   # Public API barrel
```

## Example: implementing with selenium-webdriver

Each handler group wraps the underlying library. For example, a navigation handler group:

```ts
import type { NavigationHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { WebDriver } from "selenium-webdriver";

export function createNavigationHandlers(wd: WebDriver): NavigationHandlers {
  return {
    navigateTo: async ({ url }) => { await wd.get(url); },
    getCurrentUrl: async () => ({ url: await wd.getCurrentUrl() }),
    getTitle: async () => ({ title: await wd.getTitle() }),
    getPageSource: async () => ({ source: await wd.getPageSource() }),
    back: async () => { await wd.navigate().back(); },
    forward: async () => { await wd.navigate().forward(); },
    refresh: async () => { await wd.navigate().refresh(); },
  };
}
```

Handler groups compose into a driver:

```ts
import { createClassicDriver } from "@michaelhly.webdriver-c11y/schemas";

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

All implementations should throw errors from the shared hierarchy in `errors.ts`.

```ts
import { NoSuchElementError, UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
```
