import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $patchStyleText } from "@lexical/selection";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberField } from "@/components/ui/number-field";
import { ToolbarGroup } from "@/components/ui/toolbar";

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;
const FONT_SIZE_STEP = 2;

export function FontSizeToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const fontSize = useFormatStateValue("fontSize");
  const isEditable = useLexicalEditable();
  const currentSize = Number.parseInt(fontSize, 10) || DEFAULT_FONT_SIZE;

  return (
    <ToolbarGroup aria-label="Font size">
      <NumberField
        aria-label="Font size"
        className="flex w-auto flex-row items-center gap-1"
        isDisabled={!isEditable}
        minValue={MIN_FONT_SIZE}
        maxValue={MAX_FONT_SIZE}
        step={FONT_SIZE_STEP}
        value={currentSize}
        onChange={(size) => {
          if (Number.isNaN(size)) {
            return;
          }
          editor.update(() => {
            const selection = $getSelection() ?? $getRoot().selectEnd();
            $patchStyleText(selection, { "font-size": `${size}px` });
          });
        }}
      >
        <Button slot="decrement" intent="outline" size="sq-xs" aria-label="Decrease font size">
          <MinusIcon />
        </Button>
        <Input className="h-7 w-14 px-1 py-0 text-center tabular-nums sm:px-1 sm:py-0 sm:text-xs" />
        <Button slot="increment" intent="outline" size="sq-xs" aria-label="Increase font size">
          <PlusIcon />
        </Button>
      </NumberField>
    </ToolbarGroup>
  );
}
