import {
  type ClassicDriver,
  createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import type { Options as ChromeWebOptions } from "selenium-webdriver/chrome.js";
import type { Options as EdgeWebOptions } from "selenium-webdriver/edge.js";
import type { Options as FirefoxWebOptions } from "selenium-webdriver/firefox.js";
import { createActionHandlers } from "../components/action.js";
import { createAlertHandlers } from "../components/alert.js";
import type { ClassicContext } from "../components/context.js";
import { createContext } from "../components/context.js";
import { createContextHandlers } from "../components/context-handlers.js";
import { createCookieHandlers } from "../components/cookie.js";
import { createElementHandlers } from "../components/element.js";
import { createNavigationHandlers } from "../components/navigation.js";
import { createPrintHandlers } from "../components/print.js";
import { createScreenshotHandlers } from "../components/screenshot.js";
import { createScriptHandlers } from "../components/script.js";
import { createSessionHandlers } from "../components/session.js";
import { createWindowHandlers } from "../components/window.js";
import { BROWSER_OPTION_KEYS } from "../options.js";

export function buildClassicComponents(ctx: ClassicContext) {
  return {
    session: createSessionHandlers(ctx),
    navigation: createNavigationHandlers(ctx),
    context: createContextHandlers(ctx),
    element: createElementHandlers(ctx),
    script: createScriptHandlers(ctx),
    cookie: createCookieHandlers(ctx),
    window: createWindowHandlers(ctx),
    action: createActionHandlers(ctx),
    screenshot: createScreenshotHandlers(ctx),
    print: createPrintHandlers(ctx),
    alert: createAlertHandlers(ctx),
  };
}

export interface SeleniumDriverOptions {
  chrome?: ChromeWebOptions;
  firefox?: FirefoxWebOptions;
  edge?: EdgeWebOptions;
}

export function applyBrowserOptions(
  ctx: ClassicContext,
  options: SeleniumDriverOptions,
): void {
  if (options.chrome !== undefined) {
    ctx.browserOptions.set(BROWSER_OPTION_KEYS.chrome, options.chrome);
  }
  if (options.firefox !== undefined) {
    ctx.browserOptions.set(BROWSER_OPTION_KEYS.firefox, options.firefox);
  }
  if (options.edge !== undefined) {
    ctx.browserOptions.set(BROWSER_OPTION_KEYS.edge, options.edge);
  }
}

export function createSeleniumClassicDriver(
  options?: SeleniumDriverOptions,
): ClassicDriver {
  const ctx = createContext();
  if (options) applyBrowserOptions(ctx, options);
  return createClassicDriver({
    protocol: "webdriver",
    ...buildClassicComponents(ctx),
  });
}
