import type {
	Browser,
	Page,
	Element as VibiumElement,
	Dialog,
} from "vibium";
import {
	SessionNotCreatedError,
	NoSuchElementError,
} from "@michaelhly.webdriver-interop/c11y";

export interface AlertState {
	pendingDialog: Dialog | null;
}

export interface BidiContext {
	getBrowser(): Browser;
	getPage(): Page;
	setBrowser(browser: Browser): void;
	setPage(page: Page): void;
	clearSession(): void;
	elements: Map<string, VibiumElement>;
	alert: AlertState;
}

export function createContext(): BidiContext {
	let browser: Browser | null = null;
	let page: Page | null = null;
	const elements = new Map<string, VibiumElement>();
	const alert: AlertState = { pendingDialog: null };

	return {
		getBrowser() {
			if (!browser) throw new SessionNotCreatedError("No active session");
			return browser;
		},
		getPage() {
			if (!page) throw new SessionNotCreatedError("No active session");
			return page;
		},
		setBrowser(b: Browser) {
			browser = b;
		},
		setPage(p: Page) {
			page = p;
		},
		clearSession() {
			browser = null;
			page = null;
			elements.clear();
			alert.pendingDialog = null;
		},
		elements,
		alert,
	};
}

let nextId = 0;
export function storeElement(ctx: BidiContext, el: VibiumElement): string {
	const id = `el-${String(nextId++)}`;
	ctx.elements.set(id, el);
	return id;
}

export function getElement(
	ctx: BidiContext,
	elementId: string,
): VibiumElement {
	const el = ctx.elements.get(elementId);
	if (!el) throw new NoSuchElementError(`Element not found: ${elementId}`);
	return el;
}
