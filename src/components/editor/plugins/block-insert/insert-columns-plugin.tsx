import { ViewColumnsIcon } from "@heroicons/react/16/solid";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $getRoot, $getSelection, type LexicalEditor } from "lexical";

import { INSERT_LAYOUT_COMMAND } from "@/components/editor/extensions/layout-extension";
import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

type ColumnOption = {
  value: string;
  label: string;
  templateColumns: string;
};

const COLUMN_OPTIONS: ColumnOption[] = [
  { value: "one", label: "1 column", templateColumns: "1fr" },
  { value: "two", label: "2 columns", templateColumns: "1fr 1fr" },
  { value: "three", label: "3 columns", templateColumns: "1fr 1fr 1fr" },
];

function insertColumns(editor: LexicalEditor, value: string) {
  const option = COLUMN_OPTIONS.find((candidate) => candidate.value === value);
  if (!option) {
    return;
  }
  editor.update(() => {
    if (!$getSelection()) {
      $getRoot().selectEnd();
    }
  });
  editor.dispatchCommand(INSERT_LAYOUT_COMMAND, option.templateColumns);
}

export function InsertColumnsPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return (
    <MenuTrigger>
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Columns"
          isDisabled={!isEditable}
        >
          <ViewColumnsIcon />
        </Button>
        <Tooltip>Columns</Tooltip>
      </TooltipTrigger>
      <Menu items={COLUMN_OPTIONS}>
        {({ value, label }) => (
          <MenuItem
            id={value}
            textValue={label}
            onAction={() => insertColumns(editor, value)}
          >
            {label}
          </MenuItem>
        )}
      </Menu>
    </MenuTrigger>
  );
}
