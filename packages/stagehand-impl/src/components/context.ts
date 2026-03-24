import type { Stagehand } from "@browserbasehq/stagehand";
import {
	NoSuchElementError,
	SessionNotCreatedError,
} from "@michaelhly.webdriver-c11y/schema";

// Page/Locator types are not re-exported from stagehand's public API
type Page = NonNullable<ReturnType<Stagehand["context"]["activePage"]>>;
type Locator = ReturnType<Page["locator"]>;

export type { Locator, Page };

export interface StagehandContext {
	getStagehand(): Stagehand;
	setStagehand(stagehand: Stagehand): void;
	clearStagehand(): void;
	getPage(): Page;
	elements: Map<string, Locator>;
}

export function createContext(): StagehandContext {
	let stagehand: Stagehand | null = null;
	const elements = new Map<string, Locator>();

	return {
		getStagehand() {
			if (!stagehand) throw new SessionNotCreatedError("No active session");
			return stagehand;
		},
		setStagehand(s: Stagehand) {
			stagehand = s;
		},
		clearStagehand() {
			stagehand = null;
			elements.clear();
		},
		getPage() {
			if (!stagehand) throw new SessionNotCreatedError("No active session");
			const page = stagehand.context.activePage();
			if (!page) throw new SessionNotCreatedError("No active page");
			return page;
		},
		elements,
	};
}

let nextId = 0;
export function storeElement(ctx: StagehandContext, locator: Locator): string {
	const id = `el-${String(nextId++)}`;
	ctx.elements.set(id, locator);
	return id;
}

export function getLocator(ctx: StagehandContext, elementId: string): Locator {
	const locator = ctx.elements.get(elementId);
	if (!locator) throw new NoSuchElementError(`Element not found: ${elementId}`);
	return locator;
}
