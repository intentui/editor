import { CommandLineIcon } from "@heroicons/react/16/solid";

import {
  type BuiltinShortcutName,
  type ShortcutName,
  formatShortcut,
} from "@/components/editor/extensions/shortcuts-extension";
import { Button } from "@/components/ui/button";
import { Keyboard } from "@/components/ui/keyboard";
import { Dialog, DialogBody, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

type ShortcutRow = {
  name: ShortcutName | BuiltinShortcutName;
  label: string;
};

const SHORTCUT_GROUPS: { title: string; rows: ShortcutRow[] }[] = [
  {
    title: "History",
    rows: [
      { name: "UNDO", label: "Undo" },
      { name: "REDO", label: "Redo" },
    ],
  },
  {
    title: "Formatting",
    rows: [
      { name: "BOLD", label: "Bold" },
      { name: "ITALIC", label: "Italic" },
      { name: "UNDERLINE", label: "Underline" },
      { name: "STRIKETHROUGH", label: "Strikethrough" },
      { name: "INSERT_CODE_BLOCK", label: "Inline code" },
      { name: "SUBSCRIPT", label: "Subscript" },
      { name: "SUPERSCRIPT", label: "Superscript" },
      { name: "LOWERCASE", label: "Lowercase" },
      { name: "UPPERCASE", label: "Uppercase" },
      { name: "CAPITALIZE", label: "Title case" },
      { name: "LEFT_ALIGN", label: "Align left" },
      { name: "CENTER_ALIGN", label: "Align center" },
      { name: "RIGHT_ALIGN", label: "Align right" },
      { name: "JUSTIFY_ALIGN", label: "Justify" },
      { name: "INDENT", label: "Indent" },
      { name: "OUTDENT", label: "Outdent" },
      { name: "CLEAR_FORMATTING", label: "Clear formatting" },
    ],
  },
  {
    title: "Blocks",
    rows: [
      { name: "NORMAL", label: "Paragraph" },
      { name: "HEADING1", label: "Heading 1" },
      { name: "HEADING2", label: "Heading 2" },
      { name: "HEADING3", label: "Heading 3" },
      { name: "QUOTE", label: "Quote" },
      { name: "CODE_BLOCK", label: "Code block" },
    ],
  },
  {
    title: "Lists",
    rows: [
      { name: "NUMBERED_LIST", label: "Numbered list" },
      { name: "BULLET_LIST", label: "Bulleted list" },
      { name: "CHECK_LIST", label: "Check list" },
    ],
  },
];

const LABEL = "Keyboard shortcuts";

export function ShortcutPlugin() {
  return (
    <DialogTrigger>
      <TooltipTrigger>
        <Button intent="plain" size="sq-xs" aria-label={LABEL}>
          <CommandLineIcon />
        </Button>
        <Tooltip>{LABEL}</Tooltip>
      </TooltipTrigger>
      <Dialog>
        <DialogHeader>
          <DialogTitle>{LABEL}</DialogTitle>
        </DialogHeader>
        <DialogBody className="max-h-[60vh] space-y-4">
          {SHORTCUT_GROUPS.map(({ title, rows }) => (
            <section key={title}>
              <h3 className="mb-1.5 text-xs font-medium text-muted-foreground">{title}</h3>
              <div className="divide-y divide-border rounded-lg border border-border">
                {rows.map(({ name, label }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm"
                  >
                    <span>{label}</span>
                    <span className="flex items-center gap-1">
                      {formatShortcut(name).map((segment, index) => (
                        <Keyboard key={index} className="inline text-foreground">
                          {segment}
                        </Keyboard>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </DialogBody>
      </Dialog>
    </DialogTrigger>
  );
}
