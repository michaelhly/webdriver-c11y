import type { BidiStorageHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

const UNIMPLEMENTED =
  "BiDi storage handlers are not yet implemented for the Kernel driver";

export function createBidiStorageHandlers(): BidiStorageHandlers {
  return {
    storageGetCookies: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    storageSetCookie: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
    storageDeleteCookies: () => {
      throw new UnsupportedOperationError(UNIMPLEMENTED);
    },
  };
}
