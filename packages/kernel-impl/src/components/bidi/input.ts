import type { BidiInputHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED =
  "BiDi input handlers are not yet implemented for the Kernel driver";

export function createBidiInputHandlers(): BidiInputHandlers {
  return {
    inputPerformActions: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    inputReleaseActions: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    inputSetFiles: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
  };
}
