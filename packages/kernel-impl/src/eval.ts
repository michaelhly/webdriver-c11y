import { DriverError } from "@michaelhly.webdriver-c11y/schemas";
import type { BrowserContext, Page } from "playwright-core";
import type { KernelContext } from "./context.js";

/**
 * A function to be serialized and executed remotely against a Kernel browser.
 * Mirrors Playwright's `PageFunction<Arg, R>` convention.
 */
export type PageFunction<Arg, R> = (
  page: Page,
  context: BrowserContext,
  args: Arg,
) => Promise<R> | R;

export async function evaluate<R>(ctx: KernelContext, fn: string): Promise<R>;
export async function evaluate<R>(
  ctx: KernelContext,
  fn: PageFunction<void, R>,
): Promise<R>;
export async function evaluate<Arg, R>(
  ctx: KernelContext,
  fn: PageFunction<Arg, R>,
  args: Arg,
): Promise<R>;
export async function evaluate<R>(
  ctx: KernelContext,
  fn: string | PageFunction<void, R> | PageFunction<unknown, R>,
  args?: unknown,
): Promise<R> {
  let code: string;
  if (typeof fn === "string") {
    code = fn;
  } else if (args !== undefined) {
    code = `return await (${fn.toString()})(page, context, ${JSON.stringify(args)});`;
  } else {
    code = `return await (${fn.toString()})(page, context);`;
  }
  const response = await ctx
    .getClient()
    .browsers.playwright.execute(ctx.getSessionId(), { code });
  if (!response.success) {
    throw new DriverError(response.error ?? "Playwright execution failed");
  }
  return response.result as R;
}
