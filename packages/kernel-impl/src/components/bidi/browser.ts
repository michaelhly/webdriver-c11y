import type { BidiBrowserHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED = "BiDi browser handlers are not yet implemented for the Kernel driver";

export function createBidiBrowserHandlers(): BidiBrowserHandlers {
  return {
    browserClose: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browserCreateUserContext: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browserGetUserContexts: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browserRemoveUserContext: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browserGetClientWindows: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
    browserSetClientWindowState: () => { throw new UnsupportedOperationError(UNIMPLEMENTED); },
  };
}
