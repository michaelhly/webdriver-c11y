import type { BidiLogHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

export function createBidiLogHandlers(): BidiLogHandlers {
  return {
    onLogEntry: () => {
      throw new UnsupportedOperationError(
        "BiDi log handlers are not yet implemented for the Kernel driver",
      );
    },
  };
}
