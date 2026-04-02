import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";

type BatchAction = ComputerBatchParams["actions"][number];

function buttonName(button: number | undefined): "left" | "right" | "middle" {
  if (button === 1) return "middle";
  if (button === 2) return "right";
  return "left";
}

export function mapPointerAction(
  action: Record<string, unknown>,
): BatchAction | undefined {
  switch (action.type) {
    case "pointerMove":
      return {
        type: "move_mouse",
        move_mouse: {
          x: (action.x as number) ?? 0,
          y: (action.y as number) ?? 0,
        },
      };
    case "pointerDown":
      return {
        type: "click_mouse",
        click_mouse: {
          x: 0,
          y: 0,
          button: buttonName(action.button as number | undefined),
          click_type: "down",
        },
      };
    case "pointerUp":
      return {
        type: "click_mouse",
        click_mouse: {
          x: 0,
          y: 0,
          button: buttonName(action.button as number | undefined),
          click_type: "up",
        },
      };
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
