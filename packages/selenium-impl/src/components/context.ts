import {
	NoSuchElementError,
	SessionNotCreatedError,
} from "@michaelhly.webdriver-c11y/schemas";
import type { WebDriver, WebElement } from "selenium-webdriver";
import type { ShadowRoot } from "selenium-webdriver/lib/webdriver.js";

export interface ClassicContext {
	getDriver(): WebDriver;
	setDriver(driver: WebDriver): void;
	clearDriver(): void;
	elements: Map<string, WebElement>;
	shadowRoots: Map<string, ShadowRoot>;
}

export function createContext(): ClassicContext {
	let driver: WebDriver | null = null;
	const elements = new Map<string, WebElement>();
	const shadowRoots = new Map<string, ShadowRoot>();

	return {
		getDriver() {
			if (!driver) throw new SessionNotCreatedError("No active session");
			return driver;
		},
		setDriver(d: WebDriver) {
			driver = d;
		},
		clearDriver() {
			driver = null;
			elements.clear();
			shadowRoots.clear();
		},
		elements,
		shadowRoots,
	};
}

let nextId = 0;
export function storeElement(ctx: ClassicContext, el: WebElement): string {
	const id = `el-${String(nextId++)}`;
	ctx.elements.set(id, el);
	return id;
}

export function getElement(ctx: ClassicContext, elementId: string): WebElement {
	const el = ctx.elements.get(elementId);
	if (!el) throw new NoSuchElementError(`Element not found: ${elementId}`);
	return el;
}

let nextShadowId = 0;
export function storeShadowRoot(ctx: ClassicContext, root: ShadowRoot): string {
	const id = `sr-${String(nextShadowId++)}`;
	ctx.shadowRoots.set(id, root);
	return id;
}

export function getShadowRoot(
	ctx: ClassicContext,
	shadowRootId: string,
): ShadowRoot {
	const root = ctx.shadowRoots.get(shadowRootId);
	if (!root)
		throw new NoSuchElementError(`Shadow root not found: ${shadowRootId}`);
	return root;
}
