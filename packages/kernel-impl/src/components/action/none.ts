import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

export function mapNoneAction(action: Record<string, unknown>): BatchAction {
  switch (action.type) {
    case "pause":
      return {
        type: "sleep",
        sleep: { duration_ms: (action.duration as number) ?? 0 },
      };
    default:
      throw new UnsupportedOperationError(
        `Unsupported none action type: ${action.type as string}`,
      );
  }
}
