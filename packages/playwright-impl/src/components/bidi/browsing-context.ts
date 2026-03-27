import type { BidiBrowsingContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";
import { getPage, storePage } from "../context.js";

export function createBidiBrowsingContextHandlers(
  ctx: PlaywrightContext,
): BidiBrowsingContextHandlers {
  return {
    async browsingContextCreate(_params) {
      const browserContext = ctx.getContext();
      const page = await browserContext.newPage();
      page.on("dialog", (dialog) => {
        ctx.pendingDialog = dialog;
      });
      const contextId = storePage(ctx, page);
      return { context: contextId };
    },
    async browsingContextClose(params) {
      const page = getPage(ctx, params.context);
      await page.close();
      ctx.pages.delete(params.context);
    },
    async browsingContextActivate(params) {
      const page = getPage(ctx, params.context);
      await page.bringToFront();
      ctx.setPage(page);
    },
    async browsingContextNavigate(params) {
      const page = getPage(ctx, params.context);
      const waitUntil =
        params.wait === "complete"
          ? ("load" as const)
          : params.wait === "interactive"
            ? ("domcontentloaded" as const)
            : ("commit" as const);
      const response = await page.goto(params.url, { waitUntil });
      return { url: response?.url() ?? params.url };
    },
    async browsingContextReload(params) {
      const page = getPage(ctx, params.context);
      const waitUntil =
        params.wait === "complete"
          ? ("load" as const)
          : params.wait === "interactive"
            ? ("domcontentloaded" as const)
            : ("commit" as const);
      await page.reload({ waitUntil });
      return { url: page.url() };
    },
    async browsingContextTraverseHistory(params) {
      const page = getPage(ctx, params.context);
      if (params.delta < 0) {
        for (let i = 0; i < Math.abs(params.delta); i++) {
          await page.goBack();
        }
      } else if (params.delta > 0) {
        for (let i = 0; i < params.delta; i++) {
          await page.goForward();
        }
      }
    },
    async browsingContextGetTree(_params) {
      const pages = ctx.getContext().pages();
      const contexts = [];
      for (const page of pages) {
        let contextId: string | undefined;
        for (const [id, p] of ctx.pages) {
          if (p === page) {
            contextId = id;
            break;
          }
        }
        if (!contextId) contextId = storePage(ctx, page);
        contexts.push({
          context: contextId,
          url: page.url(),
          children: [],
        });
      }
      return { contexts };
    },
    async browsingContextSetViewport(params) {
      const page = getPage(ctx, params.context);
      if (params.viewport) {
        await page.setViewportSize({
          width: params.viewport.width,
          height: params.viewport.height,
        });
      }
    },
    async browsingContextPrint(params) {
      const page = getPage(ctx, params.context);
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
      const buffer = await page.pdf(pdfOptions);
      return { data: buffer.toString("base64") };
    },
  };
}
