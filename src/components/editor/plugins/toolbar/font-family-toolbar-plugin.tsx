import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $patchStyleText } from "@lexical/selection";

import { useFormatStateValue } from "@/components/editor/extensions/format-state";
import {
  ComboBox,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxLabel,
} from "@/components/ui/combo-box";

const FONT_FAMILIES = [
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
].map((family) => ({ id: family }));

export function FontFamilyToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const fontFamily = useFormatStateValue("fontFamily");
  const isEditable = useLexicalEditable();

  return (
    <ComboBox
      aria-label="Font family"
      className="w-44"
      defaultItems={FONT_FAMILIES}
      value={fontFamily || FONT_FAMILIES[0].id}
      isDisabled={!isEditable}
      onChange={(key) => {
        if (key === null) {
          return;
        }
        const value = String(key);
        editor.update(() => {
          const selection = $getSelection() ?? $getRoot().selectEnd();
          $patchStyleText(selection, { "font-family": value });
        });
      }}
    >
      <ComboBoxInput className="h-7 py-0 sm:py-0 sm:text-xs" />
      <ComboBoxContent
        renderEmptyState={() => <span className="block p-2 text-sm text-muted-foreground">No matches</span>}
      >
        {(family: { id: string }) => (
          <ComboBoxItem id={family.id} textValue={family.id}>
            <ComboBoxLabel style={{ fontFamily: family.id }}>{family.id}</ComboBoxLabel>
          </ComboBoxItem>
        )}
      </ComboBoxContent>
    </ComboBox>
  );
}
