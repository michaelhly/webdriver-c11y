import type { WebDriver, WebElement } from "selenium-webdriver";
import {
	SessionNotCreatedError,
	NoSuchElementError,
} from "@michaelhly.webdriver-interop/c11y";

export interface ClassicContext {
	getDriver(): WebDriver;
	setDriver(driver: WebDriver): void;
	clearDriver(): void;
	elements: Map<string, WebElement>;
}

export function createContext(): ClassicContext {
	let driver: WebDriver | null = null;
	const elements = new Map<string, WebElement>();

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
		},
		elements,
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
