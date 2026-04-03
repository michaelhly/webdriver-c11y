import {
  type ClassicDriver,
  createClassicDriver,
} from "@michaelhly.webdriver-c11y/schemas";
import { createActionHandlers } from "../components/action/index.js";
import { createAlertHandlers } from "../components/alert.js";
import { createContextHandlers } from "../components/browsing-context.js";
import { createCookieHandlers } from "../components/cookie.js";
import { createElementHandlers } from "../components/element.js";
import { createNavigationHandlers } from "../components/navigation.js";
import { createPrintHandlers } from "../components/print.js";
import { createScreenshotHandlers } from "../components/screenshot.js";
import { createScriptHandlers } from "../components/script.js";
import { createSessionHandlers } from "../components/session.js";
import { createWindowHandlers } from "../components/window.js";
import {
  createContext,
  type KernelContext,
  type KernelContextOptions,
} from "../context.js";

export function buildClassicComponents(ctx: KernelContext) {
  return {
    session: createSessionHandlers(ctx),
    navigation: createNavigationHandlers(ctx),
    browsingContext: createContextHandlers(ctx),
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

export function createKernelClassicDriverFromContext(
  ctx: KernelContext,
): ClassicDriver {
  return createClassicDriver({
    protocol: "playwright",
    ...buildClassicComponents(ctx),
  });
}

export function createKernelDriver(
  options?: KernelContextOptions,
): ClassicDriver {
  return createKernelClassicDriverFromContext(
    createContext(options ?? { mode: "new" }),
  );
}
