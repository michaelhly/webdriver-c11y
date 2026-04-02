import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

export function mapNoneAction(
  action: Record<string, unknown>,
): BatchAction | undefined {
  switch (action.type) {
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
