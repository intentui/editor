import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { LinkIcon } from "@heroicons/react/16/solid";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { OPEN_LINK_EDITOR_COMMAND } from "@/components/editor/extensions/link-extension";
import { ToolbarGroup, ToolbarItem } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

export function LinkToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const isLink = useFormatStateValue("isLink");

  return (
    <ToolbarGroup aria-label="Link" isDisabled={!isEditable}>
      <TooltipTrigger>
        <ToolbarItem
          size="sq-xs"
          aria-label="Insert link"
          isSelected={isLink}
          onChange={() => {
            if (isLink) {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            } else {
              editor.dispatchCommand(OPEN_LINK_EDITOR_COMMAND, undefined);
            }
          }}
        >
          <LinkIcon />
        </ToolbarItem>
        <Tooltip>Insert link</Tooltip>
      </TooltipTrigger>
    </ToolbarGroup>
  );
}
