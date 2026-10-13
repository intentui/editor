import { $getRoot, $getSelection } from "lexical";

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { MinusIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

export function InsertHorizontalRulePlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return (
    <TooltipTrigger>
      <Button
        intent="outline"
        size="sq-xs"
        aria-label="Insert divider"
        isDisabled={!isEditable}
        onPress={() => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        }}
      >
        <MinusIcon />
      </Button>
      <Tooltip>Insert divider</Tooltip>
    </TooltipTrigger>
  );
}
