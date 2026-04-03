import type { PrintHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { HttpContext } from "../context.js";
import { post } from "../http.js";

export function createPrintHandlers(ctx: HttpContext): PrintHandlers {
  return {
    async printPage(params) {
      const data = await post<string>(ctx, "/print", params);
      return { data };
    },
  };
}
