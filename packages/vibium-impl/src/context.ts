import type { Browser, Page, BrowserContext, Element } from "vibium";
import {
	SessionNotCreatedError,
	NoSuchElementError,
} from "@michaelhly.webdriver-interop/c11y";

export interface VibiumContext {
	getBrowser(): Browser;
	getPage(): Page;
	getContext(): BrowserContext;
	setBrowser(browser: Browser): void;
	setPage(page: Page): void;
	setContext(ctx: BrowserContext): void;
	clear(): void;
	elements: Map<string, Element>;
}

export function createVibiumContext(): VibiumContext {
	let bro: Browser | null = null;
	let page: Page | null = null;
	let context: BrowserContext | null = null;
	const elements = new Map<string, Element>();

	return {
		getBrowser() {
			if (!bro) throw new SessionNotCreatedError("No active session");
			return bro;
		},
		getPage() {
			if (!page) throw new SessionNotCreatedError("No active page");
			return page;
		},
		getContext() {
			if (!context) throw new SessionNotCreatedError("No active context");
			return context;
		},
		setBrowser(b: Browser) {
			bro = b;
		},
		setPage(p: Page) {
			page = p;
		},
		setContext(c: BrowserContext) {
			context = c;
		},
		clear() {
			bro = null;
			page = null;
			context = null;
			elements.clear();
		},
		elements,
	};
}

let nextId = 0;
export function storeElement(ctx: VibiumContext, el: Element): string {
	const id = `el-${String(nextId++)}`;
	ctx.elements.set(id, el);
	return id;
}

export function getElement(ctx: VibiumContext, elementId: string): Element {
	const el = ctx.elements.get(elementId);
	if (!el) throw new NoSuchElementError(`Element not found: ${elementId}`);
	return el;
}
