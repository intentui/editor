import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { CodeBracketIcon } from "@heroicons/react/16/solid";

import { insertCodeBlock } from "@/components/editor/extensions/code";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

export function InsertCodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return (
    <Tooltip>
      <Button
        intent="outline"
        size="sq-xs"
        aria-label="Insert code block"
        isDisabled={!isEditable}
        onPress={() => insertCodeBlock(editor)}
      >
        <CodeBracketIcon />
      </Button>
      <TooltipContent>Insert code block</TooltipContent>
    </Tooltip>
  );
}
