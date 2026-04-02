import type { BidiDriver } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";

export function createKernelBidiDriver(): BidiDriver {
  throw new UnsupportedOperationError(
    "BiDi is not supported by the Kernel driver",
  );
}
