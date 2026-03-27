import type { BidiLogHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ClassicContext } from "../context.js";

export function createBidiLogHandlers(ctx: ClassicContext): BidiLogHandlers {
  return {
    onLogEntry(callback) {
      let active = true;

      (async () => {
        const bidi = await ctx.getDriver().getBidi();
        await bidi.subscribe(["log.entryAdded"]);

        const listener = (event: MessageEvent) => {
          if (!active) return;
          const data = JSON.parse(String(event.data)) as {
            method?: string;
            params?: unknown;
          };
          if (data.method === "log.entryAdded" && data.params) {
            callback(data.params as Parameters<typeof callback>[0]);
          }
        };

        bidi.socket.addEventListener("message", listener);
      })();

      return () => {
        active = false;
      };
    },
  };
}
