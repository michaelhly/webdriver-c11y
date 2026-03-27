import {
  NoSuchElementError,
  SessionNotCreatedError,
} from "@michaelhly.webdriver-c11y/schemas";
import type {
  Browser,
  BrowserContext,
  Dialog,
  ElementHandle,
  JSHandle,
  Page,
} from "playwright";

export interface PlaywrightContext {
  getBrowser(): Browser;
  setBrowser(browser: Browser): void;
  getContext(): BrowserContext;
  setContext(context: BrowserContext): void;
  getPage(): Page;
  setPage(page: Page): void;
  clearBrowser(): void;
  elements: Map<string, ElementHandle>;
  shadowRoots: Map<string, JSHandle<ShadowRoot>>;
  pages: Map<string, Page>;
  userContexts: Map<string, BrowserContext>;
  pendingDialog: Dialog | null;
  timeouts: { script?: number | null; pageLoad?: number; implicit?: number };
}

export function createContext(): PlaywrightContext {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let page: Page | null = null;
  const elements = new Map<string, ElementHandle>();
  const shadowRoots = new Map<string, JSHandle<ShadowRoot>>();

  return {
    getBrowser() {
      if (!browser) throw new SessionNotCreatedError("No active session");
      return browser;
    },
    setBrowser(b: Browser) {
      browser = b;
    },
    getContext() {
      if (!context) throw new SessionNotCreatedError("No active session");
      return context;
    },
    setContext(c: BrowserContext) {
      context = c;
    },
    getPage() {
      if (!page) throw new SessionNotCreatedError("No active session");
      return page;
    },
    setPage(p: Page) {
      page = p;
    },
    clearBrowser() {
      browser = null;
      context = null;
      page = null;
      elements.clear();
      shadowRoots.clear();
    },
    elements,
    shadowRoots,
    pages: new Map(),
    userContexts: new Map(),
    pendingDialog: null,
    timeouts: {},
  };
}

let nextId = 0;
export function storeElement(
  ctx: PlaywrightContext,
  el: ElementHandle,
): string {
  const id = `el-${String(nextId++)}`;
  ctx.elements.set(id, el);
  return id;
}

export function getElement(
  ctx: PlaywrightContext,
  elementId: string,
): ElementHandle {
  const el = ctx.elements.get(elementId);
  if (!el) throw new NoSuchElementError(`Element not found: ${elementId}`);
  return el;
}

let nextShadowId = 0;
export function storeShadowRoot(
  ctx: PlaywrightContext,
  root: JSHandle<ShadowRoot>,
): string {
  const id = `sr-${String(nextShadowId++)}`;
  ctx.shadowRoots.set(id, root);
  return id;
}

export function getShadowRoot(
  ctx: PlaywrightContext,
  shadowRootId: string,
): JSHandle<ShadowRoot> {
  const root = ctx.shadowRoots.get(shadowRootId);
  if (!root)
    throw new NoSuchElementError(`Shadow root not found: ${shadowRootId}`);
  return root;
}

let nextPageId = 0;
export function storePage(ctx: PlaywrightContext, page: Page): string {
  const id = `pw-ctx-${String(nextPageId++)}`;
  ctx.pages.set(id, page);
  return id;
}

export function getPage(ctx: PlaywrightContext, contextId: string): Page {
  const page = ctx.pages.get(contextId);
  if (!page)
    throw new NoSuchElementError(`Browsing context not found: ${contextId}`);
  return page;
}

let nextUserContextId = 0;
export function storeUserContext(
  ctx: PlaywrightContext,
  browserContext: BrowserContext,
): string {
  const id = `pw-uc-${String(nextUserContextId++)}`;
  ctx.userContexts.set(id, browserContext);
  return id;
}
