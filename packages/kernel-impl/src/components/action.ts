import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";
import type { KernelContext } from "./context.js";

type BatchAction = ComputerBatchParams["actions"][number];

function buttonName(button: number | undefined): "left" | "right" | "middle" {
  if (button === 1) return "middle";
  if (button === 2) return "right";
  return "left";
}

export function createActionHandlers(ctx: KernelContext): ActionHandlers {
  const computer = () => ctx.getClient().browsers.computer;
  const sid = () => ctx.getSessionId();

  return {
    async performActions({ actions }) {
      const batch: BatchAction[] = [];

      for (const seq of actions) {
        for (const action of seq.actions as Record<string, unknown>[]) {
          const type = action.type as string;

          if (seq.type === "pointer") {
            if (type === "pointerMove") {
              batch.push({
                type: "move_mouse",
                move_mouse: {
                  x: (action.x as number) ?? 0,
                  y: (action.y as number) ?? 0,
                },
              });
            } else if (type === "pointerDown") {
              batch.push({
                type: "click_mouse",
                click_mouse: {
                  x: 0,
                  y: 0,
                  button: buttonName(action.button as number | undefined),
                  click_type: "down",
                },
              });
            } else if (type === "pointerUp") {
              batch.push({
                type: "click_mouse",
                click_mouse: {
                  x: 0,
                  y: 0,
                  button: buttonName(action.button as number | undefined),
                  click_type: "up",
                },
              });
            } else if (type === "pause" && action.duration) {
              batch.push({
                type: "sleep",
                sleep: { duration_ms: action.duration as number },
              });
            }
          } else if (seq.type === "key") {
            if (type === "keyDown") {
              batch.push({
                type: "press_key",
                press_key: { keys: [action.value as string] },
              });
            } else if (type === "keyUp") {
              // computer API doesn't have separate keyUp — handled by release
            } else if (type === "pause" && action.duration) {
              batch.push({
                type: "sleep",
                sleep: { duration_ms: action.duration as number },
              });
            }
          } else if (seq.type === "wheel") {
            if (type === "scroll") {
              const scroll: NonNullable<BatchAction["scroll"]> = {
                x: (action.x as number) ?? 0,
                y: (action.y as number) ?? 0,
              };
              if (action.deltaX != null)
                scroll.delta_x = action.deltaX as number;
              if (action.deltaY != null)
                scroll.delta_y = action.deltaY as number;
              batch.push({ type: "scroll", scroll });
            } else if (type === "pause" && action.duration) {
              batch.push({
                type: "sleep",
                sleep: { duration_ms: action.duration as number },
              });
            }
          } else if (seq.type === "none") {
            if (type === "pause" && action.duration) {
              batch.push({
                type: "sleep",
                sleep: { duration_ms: action.duration as number },
              });
            }
          }
        }
      }

      if (batch.length > 0) {
        await computer().batch(sid(), { actions: batch });
      }
    },

    async releaseActions() {
      await computer().pressKey(sid(), { keys: ["Shift"], duration: 0 });
      await computer().pressKey(sid(), { keys: ["Control"], duration: 0 });
      await computer().pressKey(sid(), { keys: ["Alt"], duration: 0 });
      await computer().pressKey(sid(), { keys: ["Super"], duration: 0 });
      await computer().clickMouse(sid(), { x: 0, y: 0, click_type: "up" });
    },
  };
}
