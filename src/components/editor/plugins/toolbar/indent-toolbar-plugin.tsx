import { INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

export function IndentToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const indent = useFormatStateValue("indent");
  const isEditable = useLexicalEditable();

  return (
    <ToolbarGroup aria-label="Indentation">
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Outdent"
          isDisabled={!isEditable || indent === 0}
          onPress={() => {
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }}
        >
          <ArrowLeftStartOnRectangleIcon className="rtl:-scale-x-100" />
        </Button>
        <Tooltip>Outdent</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Indent"
          isDisabled={!isEditable}
          onPress={() => {
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }}
        >
          <ArrowRightEndOnRectangleIcon className="rtl:-scale-x-100" />
        </Button>
        <Tooltip>Indent</Tooltip>
      </TooltipTrigger>
    </ToolbarGroup>
  );
}
