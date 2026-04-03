import type { ActionHandlers } from "@michaelhly.webdriver-c11y/schemas";
import { UnsupportedOperationError } from "@michaelhly.webdriver-c11y/schemas";
import type { ComputerBatchParams } from "@onkernel/sdk/resources/browsers/computer.js";
import type { KernelContext } from "../../context.js";
import { mapKeyAction } from "./key.js";
import { mapNoneAction } from "./none.js";
import { mapPointerAction } from "./pointer.js";
import { mapWheelAction } from "./wheel.js";

type BatchAction = ComputerBatchParams["actions"][number];

function mapAction(
  seqType: string,
  action: Record<string, unknown>,
): BatchAction {
  switch (seqType) {
    case "pointer":
      return mapPointerAction(action);
    case "key":
      return mapKeyAction(action);
    case "wheel":
      return mapWheelAction(action);
    case "none":
      return mapNoneAction(action);
    default:
      throw new UnsupportedOperationError(
        `Unsupported action sequence type: ${seqType}`,
      );
  }
}

export function createActionHandlers(ctx: KernelContext): ActionHandlers {
  const computer = () => ctx.getClient().browsers.computer;
  const sid = () => ctx.getSessionId();

  return {
    async performActions({ actions }) {
      const batch: BatchAction[] = [];

      for (const seq of actions) {
        for (const action of seq.actions as Record<string, unknown>[]) {
          batch.push(mapAction(seq.type, action));
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
