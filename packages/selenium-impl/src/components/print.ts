import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { Command } from "selenium-webdriver/lib/command.js";
import type { ClassicContext } from "./context.js";

// PRINT_PAGE exists at runtime but is missing from @types/selenium-webdriver
const PRINT_PAGE: string = "printPage";

export function createPrintHandlers(ctx: ClassicContext): PrintHandlers {
  return {
    async printPage(params) {
      const cmd = new Command(PRINT_PAGE);
      if (params.orientation !== undefined)
        cmd.setParameter("orientation", params.orientation);
      if (params.scale !== undefined) cmd.setParameter("scale", params.scale);
      if (params.background !== undefined)
        cmd.setParameter("background", params.background);
      if (params.page !== undefined) cmd.setParameter("page", params.page);
      if (params.margin !== undefined)
        cmd.setParameter("margin", params.margin);
      if (params.pageRanges !== undefined)
        cmd.setParameter("pageRanges", params.pageRanges);
      if (params.shrinkToFit !== undefined)
        cmd.setParameter("shrinkToFit", params.shrinkToFit);
      const result = (await ctx.getDriver().execute(cmd)) as unknown;
      return { data: result as string };
    },
  };
}
