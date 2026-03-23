import type { Stagehand } from "@browserbasehq/stagehand";
import type { LocatorStrategy } from "@michaelhly.webdriver-interop/c11y";
import {
	NoSuchElementError,
	NoSuchWindowError,
} from "@michaelhly.webdriver-interop/c11y";

// ---------------------------------------------------------------------------
// Shared context — threaded through every handler factory.
// ---------------------------------------------------------------------------

export interface ElementRef {
	selector: string;
	index: number;
}

export interface DialogState {
	type: string;
	message: string;
	defaultPrompt?: string;
}

export interface StagehandContext {
	stagehand: Stagehand;
	elements: Map<string, ElementRef>;
	dialog: DialogState | null;
	sessionId: string | null;
}

// ---------------------------------------------------------------------------
// Element ID generation
// ---------------------------------------------------------------------------

let nextId = 0;

export function generateElementId(): string {
	return `e-${++nextId}`;
}

// ---------------------------------------------------------------------------
// Page / locator access helpers
// ---------------------------------------------------------------------------

export function getActivePage(ctx: StagehandContext) {
	const page = ctx.stagehand.context.activePage();
	if (!page) throw new NoSuchWindowError("No active page");
	return page;
}

export function getElementLocator(ctx: StagehandContext, elementId: string) {
	const ref = ctx.elements.get(elementId);
	if (!ref) throw new NoSuchElementError(`Element not found: ${elementId}`);
	const page = getActivePage(ctx);
	return page.locator(ref.selector).nth(ref.index);
}

// ---------------------------------------------------------------------------
// Locator strategy → CSS / XPath selector conversion
// ---------------------------------------------------------------------------

export function toSelector(strategy: LocatorStrategy, value: string): string {
	switch (strategy) {
		case "css":
			return value;
		case "xpath":
			return `xpath/${value}`;
		case "id":
			return `[id="${escapeAttr(value)}"]`;
		case "name":
			return `[name="${escapeAttr(value)}"]`;
		case "tag-name":
			return value;
		case "class-name":
			return `.${value.replace(/ /g, ".")}`;
		case "link-text":
			return `xpath//a[normalize-space()=${xpathLiteral(value)}]`;
		case "partial-link-text":
			return `xpath//a[contains(normalize-space(),${xpathLiteral(value)})]`;
		case "text":
			return `xpath//*[normalize-space()=${xpathLiteral(value)}]`;
		case "role":
			return `[role="${escapeAttr(value)}"]`;
		case "label":
			return `[aria-label="${escapeAttr(value)}"]`;
		case "placeholder":
			return `[placeholder="${escapeAttr(value)}"]`;
	}
}

function escapeAttr(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function xpathLiteral(s: string): string {
	if (!s.includes("'")) return `'${s}'`;
	if (!s.includes('"')) return `"${s}"`;
	const parts = s
		.split("'")
		.map((p, i) => (i > 0 ? `"'",'${p}'` : `'${p}'`));
	return `concat(${parts.join(",")})`;
}

// ---------------------------------------------------------------------------
// CDP helper — call a JS function on a resolved element via objectId
// ---------------------------------------------------------------------------

interface CdpCallResult<T> {
	result: { value: T };
	exceptionDetails?: { text: string };
}

export async function callOnElement<T>(
	ctx: StagehandContext,
	elementId: string,
	fnBody: string,
): Promise<T> {
	const page = getActivePage(ctx);
	const locator = getElementLocator(ctx, elementId);
	const { objectId } = await locator.resolveNode();
	const response = await page.sendCDP<CdpCallResult<T>>(
		"Runtime.callFunctionOn",
		{
			objectId,
			functionDeclaration: fnBody,
			returnByValue: true,
		},
	);
	if (response.exceptionDetails) {
		throw new Error(response.exceptionDetails.text);
	}
	return response.result.value;
}
