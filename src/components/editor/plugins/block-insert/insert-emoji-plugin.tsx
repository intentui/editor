import { $getRoot, $getSelection, $isRangeSelection, type LexicalEditor } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { FaceSmileIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

function insertEmojiTrigger(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection() ?? $getRoot().selectEnd();
    if ($isRangeSelection(selection)) {
      selection.insertText(":");
    }
  });
  editor.focus();
}

export function InsertEmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return (
    <TooltipTrigger>
      <Button
        intent="outline"
        size="sq-xs"
        aria-label="Insert emoji"
        isDisabled={!isEditable}
        onPress={() => insertEmojiTrigger(editor)}
      >
        <FaceSmileIcon />
      </Button>
      <Tooltip>Insert emoji</Tooltip>
    </TooltipTrigger>
  );
}
