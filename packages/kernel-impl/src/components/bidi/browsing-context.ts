import type { BidiBrowsingContextHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED = "BiDi browsing context handlers are not yet implemented for the Kernel driver";

export function createBidiBrowsingContextHandlers(): BidiBrowsingContextHandlers {
  return {
    browsingContextCreate: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextClose: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextActivate: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextNavigate: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextReload: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextTraverseHistory: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextGetTree: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextSetViewport: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browsingContextPrint: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
  };
}
