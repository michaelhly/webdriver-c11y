import { NoSuchElementError } from "@michaelhly.webdriver-interop/c11y";
import type { StagehandContext } from "./context.js";
import { getActivePage } from "./page.js";

let nextId = 0;

export function generateElementId(): string {
	return `e-${++nextId}`;
}

export function getElementLocator(ctx: StagehandContext, elementId: string) {
	const ref = ctx.elements.get(elementId);
	if (!ref) throw new NoSuchElementError(`Element not found: ${elementId}`);
	const page = getActivePage(ctx);
	return page.locator(ref.selector).nth(ref.index);
}

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
