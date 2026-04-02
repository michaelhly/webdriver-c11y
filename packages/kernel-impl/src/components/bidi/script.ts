import type { BidiScriptHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED =
  "BiDi script handlers are not yet implemented for the Kernel driver";

export function createBidiScriptHandlers(): BidiScriptHandlers {
  return {
    scriptEvaluate: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    scriptCallFunction: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    scriptAddPreloadScript: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    scriptRemovePreloadScript: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    scriptGetRealms: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    scriptDisown: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
  };
}
