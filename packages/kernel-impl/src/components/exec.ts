import type { BrowserContext, Page } from "playwright-core";
import { DriverError } from "@michaelhly.webdriver-c11y/schemas";
import type { KernelContext } from "./context.js";

type RemoteFn<T> = (page: Page, context: BrowserContext) => Promise<T> | T;
type RemoteFnWithArgs<T, A> = (
  page: Page,
  context: BrowserContext,
  args: A,
) => Promise<T> | T;

export async function execFn<T>(
  ctx: KernelContext,
  fn: RemoteFn<T>,
): Promise<T>;
export async function execFn<T, A>(
  ctx: KernelContext,
  fn: RemoteFnWithArgs<T, A>,
  args: A,
): Promise<T>;
export async function execFn<T>(
  ctx: KernelContext,
  fn: (...args: never) => unknown,
  args?: unknown,
): Promise<T> {
  const code =
    args !== undefined
      ? `return await (${fn.toString()})(page, context, ${JSON.stringify(args)});`
      : `return await (${fn.toString()})(page, context);`;
  const response = await ctx
    .getClient()
    .browsers.playwright.execute(ctx.getSessionId(), { code });
  if (!response.success) {
    throw new DriverError(response.error ?? "Playwright execution failed");
  }
  return response.result as T;
}
