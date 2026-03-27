import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { sendCDP } from "../cdp.js";
import type { StagehandContext } from "./context.js";

export function createPrintHandlers(ctx: StagehandContext): PrintHandlers {
  return {
    async printPage(params) {
      const result = await sendCDP(ctx.getPage(), "Page.printToPDF", {
        landscape: params.orientation === "landscape",
        preferCSSPageSize: !params.shrinkToFit,
        ...(params.background != null && {
          printBackground: params.background,
        }),
        ...(params.scale != null && { scale: params.scale }),
        ...(params.page?.width != null && { paperWidth: params.page.width }),
        ...(params.page?.height != null && { paperHeight: params.page.height }),
        ...(params.margin?.top != null && { marginTop: params.margin.top }),
        ...(params.margin?.bottom != null && {
          marginBottom: params.margin.bottom,
        }),
        ...(params.margin?.left != null && { marginLeft: params.margin.left }),
        ...(params.margin?.right != null && {
          marginRight: params.margin.right,
        }),
        ...(params.pageRanges != null && {
          pageRanges: params.pageRanges.join(","),
        }),
      });
      return { data: result.data };
    },
  };
}
