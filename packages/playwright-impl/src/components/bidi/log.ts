import type {
  BidiLogHandlers,
  LogEntry,
  LogLevel,
} from "@michaelhly.webdriver-c11y/schemas";
import type { PlaywrightContext } from "../context.js";

function toLogLevel(type: string): LogLevel {
  switch (type) {
    case "debug":
      return "debug";
    case "info":
    case "log":
      return "info";
    case "warning":
    case "warn":
      return "warn";
    case "error":
      return "error";
    default:
      return "info";
  }
}

export function createBidiLogHandlers(ctx: PlaywrightContext): BidiLogHandlers {
  return {
    onLogEntry(callback) {
      let active = true;

      const page = ctx.getPage();
      const handler = (msg: import("playwright").ConsoleMessage) => {
        if (!active) return;
        const entry: LogEntry = {
          level: toLogLevel(msg.type()),
          source: { realm: "default" },
          text: msg.text(),
          timestamp: Date.now(),
          type: "console",
          method: msg.type(),
          args: [],
        };
        callback(entry);
      };

      page.on("console", handler);

      return () => {
        active = false;
        page.off("console", handler);
      };
    },
  };
}
