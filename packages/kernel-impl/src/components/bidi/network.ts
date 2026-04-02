import type { BidiNetworkHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED =
  "BiDi network handlers are not yet implemented for the Kernel driver";

export function createBidiNetworkHandlers(): BidiNetworkHandlers {
  return {
    networkAddIntercept: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkRemoveIntercept: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkContinueRequest: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkContinueResponse: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkProvideResponse: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkFailRequest: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkContinueWithAuth: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    networkSetCacheBehavior: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
  };
}
