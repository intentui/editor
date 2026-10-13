import { useEffect, useState } from "react";

import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { BackspaceIcon, TrashIcon } from "@heroicons/react/16/solid";

import { clearFormatting } from "@/components/editor/extensions/format-state";
import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

function $isEditorEmpty() {
  const children = $getRoot().getChildren();
  if (children.length > 1) {
    return false;
  }
  const firstChild = children[0];
  if (firstChild === undefined) {
    return true;
  }
  return $isParagraphNode(firstChild) && firstChild.isEmpty();
}

export function ClearToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  useEffect(() => {
    setIsEditorEmpty(editor.read($isEditorEmpty));
    return editor.registerUpdateListener(() => {
      setIsEditorEmpty(editor.read($isEditorEmpty));
    });
  }, [editor]);

  return (
    <ToolbarGroup aria-label="Clear">
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Clear formatting"
          isDisabled={!isEditable}
          onPress={() => {
            clearFormatting(editor);
          }}
        >
          <BackspaceIcon />
        </Button>
        <Tooltip>Clear formatting</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Clear editor"
          isDisabled={!isEditable || isEditorEmpty}
          onPress={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor.focus();
          }}
        >
          <TrashIcon />
        </Button>
        <Tooltip>Clear editor</Tooltip>
      </TooltipTrigger>
    </ToolbarGroup>
  );
}
