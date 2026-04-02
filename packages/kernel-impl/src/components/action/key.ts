import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

export function mapKeyAction(
  action: Record<string, unknown>,
): BatchAction | undefined {
  switch (action.type) {
    case "keyDown":
      return {
        type: "press_key",
        press_key: { keys: [action.value as string] },
      };
    case "keyUp":
      // computer API doesn't have separate keyUp — handled by releaseActions
      return undefined;
    case "pause":
      if (action.duration)
        return {
          type: "sleep",
          sleep: { duration_ms: action.duration as number },
        };
      return undefined;
    default:
      return undefined;
  }
}
