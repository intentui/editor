import { useMemo } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { TableCellsIcon } from "@heroicons/react/16/solid";

import { insertTable } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
  useComponentPickerQuery,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

const FULL_TABLE_REGEX = /^([1-9]|10)x([1-9]|10)$/;
const PARTIAL_TABLE_REGEX = /^([1-9]|10)x?$/;

export function TablePickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const queryString = useComponentPickerQuery();

  const items = useMemo<ComponentPickerItem[]>(() => {
    const items: ComponentPickerItem[] = [
      {
        value: "table",
        label: "Insert table",
        group: "Advanced",
        description: "Add a simple table.",
        icon: <TableCellsIcon className="text-muted-foreground" />,
        keywords: ["table", "grid", "spreadsheet", "rows", "columns"],
        onSelect: () => insertTable(editor, 3, 3),
      },
    ];

    const query = (queryString ?? "").trim();
    const fullMatch = FULL_TABLE_REGEX.exec(query);
    const partialMatch = fullMatch ? null : PARTIAL_TABLE_REGEX.exec(query);

    const sizes = fullMatch
      ? [{ rows: Number(fullMatch[1]), columns: Number(fullMatch[2]) }]
      : partialMatch
        ? Array.from({ length: 5 }, (_, index) => ({
            rows: Number(partialMatch[1]),
            columns: index + 1,
          }))
        : [];

    for (const { rows, columns } of sizes) {
      items.push({
        value: `table-${rows}x${columns}`,
        label: `${rows}x${columns} Insert table`,
        group: "Advanced",
        description: "Insert a table with this size.",
        icon: <TableCellsIcon className="text-muted-foreground" />,
        keywords: ["table", `${rows}x${columns}`],
        onSelect: () => insertTable(editor, rows, columns),
      });
    }

    return items;
  }, [editor, queryString]);

  useComponentPickerItems(items);

  return null;
}
