import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { type KernelContext, exec } from "./context.js";

export function createPrintHandlers(ctx: KernelContext): PrintHandlers {
  return {
    async printPage(params) {
      const opts: Record<string, unknown> = {};
      if (params.orientation !== undefined)
        opts.landscape = params.orientation === "landscape";
      if (params.scale !== undefined) opts.scale = params.scale;
      if (params.background !== undefined)
        opts.printBackground = params.background;
      if (params.page !== undefined) {
        opts.width = params.page.width ? `${params.page.width}cm` : undefined;
        opts.height = params.page.height
          ? `${params.page.height}cm`
          : undefined;
      }
      if (params.margin !== undefined) {
        opts.margin = {
          top: params.margin.top ? `${params.margin.top}cm` : undefined,
          bottom: params.margin.bottom
            ? `${params.margin.bottom}cm`
            : undefined,
          left: params.margin.left ? `${params.margin.left}cm` : undefined,
          right: params.margin.right ? `${params.margin.right}cm` : undefined,
        };
      }
      if (params.pageRanges !== undefined)
        opts.pageRanges = params.pageRanges.join(",");

      const data = await exec<string>(
        ctx,
        `
        const buf = await page.pdf(${JSON.stringify(opts)});
        return buf.toString('base64');
      `,
      );
      return { data };
    },
  };
}
