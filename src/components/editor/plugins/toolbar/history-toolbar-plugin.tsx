import { REDO_COMMAND, UNDO_COMMAND } from "lexical";

import { HistoryExtension } from "@lexical/history";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

export function HistoryToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { canUndo, canRedo } = useExtensionDependency(HistoryExtension).output;
  const canUndoValue = useSignalValue(canUndo);
  const canRedoValue = useSignalValue(canRedo);
  const isEditable = useLexicalEditable();

  return (
    <ToolbarGroup aria-label="History">
      <Tooltip>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Undo"
          isDisabled={!isEditable || !canUndoValue}
          onPress={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <ArrowUturnLeftIcon className="rtl:-scale-x-100" />
        </Button>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Redo"
          isDisabled={!isEditable || !canRedoValue}
          onPress={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <ArrowUturnRightIcon className="rtl:-scale-x-100" />
        </Button>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </ToolbarGroup>
  );
}
