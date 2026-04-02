import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

export function mapWheelAction(
  action: Record<string, unknown>,
): BatchAction | undefined {
  switch (action.type) {
    case "scroll": {
      const scroll: NonNullable<BatchAction["scroll"]> = {
        x: (action.x as number) ?? 0,
        y: (action.y as number) ?? 0,
      };
      if (action.deltaX != null) scroll.delta_x = action.deltaX as number;
      if (action.deltaY != null) scroll.delta_y = action.deltaY as number;
      return { type: "scroll", scroll };
    }
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
