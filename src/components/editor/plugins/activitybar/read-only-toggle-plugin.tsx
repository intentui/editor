import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/16/solid";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

export function ReadOnlyTogglePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  useEffect(() => {
    return editor.registerEditableListener(setIsEditable);
  }, [editor]);

  const label = isEditable ? "Switch to read-only" : "Switch to edit mode";

  return (
    <TooltipTrigger>
      <Button
        intent="plain"
        size="sq-xs"
        aria-label={label}
        onPress={() => editor.setEditable(!editor.isEditable())}
      >
        {isEditable ? <LockOpenIcon /> : <LockClosedIcon />}
      </Button>
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}
