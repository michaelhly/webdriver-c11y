import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "./context.js";

export function createPrintHandlers(ctx: PlaywrightContext): PrintHandlers {
  return {
    async printPage(params) {
      const pdfOptions: Record<string, unknown> = {};
      if (params.orientation !== undefined)
        pdfOptions.landscape = params.orientation === "landscape";
      if (params.scale !== undefined) pdfOptions.scale = params.scale;
      if (params.background !== undefined)
        pdfOptions.printBackground = params.background;
      if (params.page !== undefined) {
        pdfOptions.width = params.page.width;
        pdfOptions.height = params.page.height;
      }
      if (params.margin !== undefined) {
        pdfOptions.margin = {
          top: params.margin.top,
          bottom: params.margin.bottom,
          left: params.margin.left,
          right: params.margin.right,
        };
      }
      if (params.pageRanges !== undefined) {
        pdfOptions.pageRanges = (params.pageRanges as string[]).join(",");
      }

      const buffer = await ctx.getPage().pdf(pdfOptions);
      return { data: buffer.toString("base64") };
    },
  };
}
