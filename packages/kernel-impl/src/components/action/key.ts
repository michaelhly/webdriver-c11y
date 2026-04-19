import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

export function mapKeyAction(action: Record<string, unknown>): BatchAction {
  switch (action.type) {
    case "keyDown":
      return {
        type: "press_key",
        press_key: { keys: [action.value as string] },
      };
    case "keyUp":
      // computer API doesn't have separate keyUp — handled by releaseActions
      return {
        type: "sleep",
        sleep: { duration_ms: 0 },
      };
    case "pause":
      return {
        type: "sleep",
        sleep: { duration_ms: (action.duration as number) ?? 0 },
      };
    default:
      throw new UnsupportedOperationError(
        `Unsupported key action type: ${action.type as string}`,
      );
  }
}
