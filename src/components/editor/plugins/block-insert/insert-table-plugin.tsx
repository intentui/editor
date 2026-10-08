import { useCallback, useState } from "react";

import {
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $findTableNode, INSERT_TABLE_COMMAND } from "@lexical/table";

import { twMerge } from "cn";
import { TableCellsIcon } from "@heroicons/react/16/solid";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

const MAX_ROWS = 8;
const MAX_COLUMNS = 10;

export function insertTable(editor: LexicalEditor, rows: number, columns: number) {
  editor.update(() => {
    if (!$getSelection()) {
      $getRoot().selectEnd();
    }
  });
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    columns: String(columns),
    rows: String(rows),
    includeHeaders: { columns: true, rows: true },
  });

  editor.update(() => {
    const selection = $getSelection();
    const tableNode = $isRangeSelection(selection)
      ? $findTableNode(selection.anchor.getNode())
      : null;
    if (!tableNode) {
      return;
    }

    const previousSibling = tableNode.getPreviousSibling();
    if ($isParagraphNode(previousSibling) && previousSibling.isEmpty()) {
      previousSibling.remove();
    }

    const nextSibling = tableNode.getNextSibling();
    if ($isParagraphNode(nextSibling) && nextSibling.isEmpty()) {
      nextSibling.remove();
    }
  });
}

function TableGridPicker({ onSelect }: { onSelect: (rows: number, columns: number) => void }) {
  const [hovered, setHovered] = useState({ rows: 1, columns: 1 });

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${MAX_COLUMNS}, 1.125rem)` }}
        onPointerLeave={() => setHovered({ rows: 1, columns: 1 })}
      >
        {Array.from({ length: MAX_ROWS * MAX_COLUMNS }, (_, index) => {
          const row = Math.floor(index / MAX_COLUMNS) + 1;
          const column = (index % MAX_COLUMNS) + 1;
          const active = row <= hovered.rows && column <= hovered.columns;

          return (
            <div
              key={index}
              role="button"
              aria-label={`${column} x ${row}`}
              onPointerEnter={() => setHovered({ rows: row, columns: column })}
              onClick={() => onSelect(row, column)}
              className={twMerge(
                "size-[1.125rem] rounded-xs border",
                active ? "border-primary bg-primary/20" : "border-border",
              )}
            />
          );
        })}
      </div>
      <p className="text-xs text-muted-fg">
        {hovered.columns} x {hovered.rows}
      </p>
    </div>
  );
}

export function InsertTablePlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [open, setOpen] = useState(false);

  const onSelect = useCallback(
    (rows: number, columns: number) => {
      insertTable(editor, rows, columns);
      setOpen(false);
    },
    [editor],
  );

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Tooltip>
        <Button intent="outline" size="sq-xs" aria-label="Insert table" isDisabled={!isEditable}>
          <TableCellsIcon />
        </Button>
        <TooltipContent>Insert table</TooltipContent>
      </Tooltip>
      <PopoverContent placement="bottom start" className="w-auto max-w-none p-3">
        <TableGridPicker onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
