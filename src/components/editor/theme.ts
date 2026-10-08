import type { EditorThemeClasses } from "lexical";

import "./theme.css";

export const editorTheme: EditorThemeClasses = {
  root: "relative outline-none",
  autocomplete: "text-muted-fg select-none",
  characterLimit: "inline bg-danger-subtle text-danger-subtle-fg",
  paragraph: "relative m-0 mb-2 last:mb-0",
  heading: {
    h1: "relative mt-6 mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance first:mt-0 last:mb-0",
    h2: "relative mt-6 mb-3 scroll-m-20 border-b border-border pb-2 text-3xl font-semibold tracking-tight first:mt-0 last:mb-0",
    h3: "relative mt-4 mb-2 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 last:mb-0",
    h4: "relative mt-4 mb-2 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0 last:mb-0",
    h5: "relative mt-3 mb-2 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0 last:mb-0",
    h6: "relative mt-3 mb-2 scroll-m-20 text-base font-semibold tracking-tight first:mt-0 last:mb-0",
  },
  quote: "relative my-4 border-s-2 ps-6 text-muted-fg italic first:mt-0 last:mb-0",
  list: {
    checklist: "ps-1!",
    listitem: "relative",
    listitemChecked:
      "relative list-none ps-6 text-muted-fg line-through outline-none before:absolute before:start-0 before:top-1 before:size-4 before:cursor-pointer before:rounded-sm before:border before:border-primary before:bg-primary before:shadow-xs after:absolute after:start-[5px] after:top-[6px] after:h-[9px] after:w-[5px] after:rotate-45 after:cursor-pointer after:border-r-2 after:border-b-2 after:border-primary-fg focus:before:ring-2 focus:before:ring-ring/20",
    listitemUnchecked:
      "relative list-none ps-6 outline-none before:absolute before:start-0 before:top-1 before:size-4 before:cursor-pointer before:rounded-sm before:border before:border-input before:shadow-xs focus:before:ring-2 focus:before:ring-ring/20 before:bg-bg",
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
    ol: "m-0 mb-2 ps-6 last:mb-0",
    olDepth: [
      "list-decimal",
      "list-[upper-alpha]",
      "list-[lower-alpha]",
      "list-[upper-roman]",
      "list-[lower-roman]",
    ],
    ul: "m-0 mb-2 ps-6 last:mb-0",
    ulDepth: ["list-disc", "list-[circle]", "list-[square]"],
  },
  indent: "editor-indent",
  link: "cursor-pointer text-primary underline underline-offset-2 hover:text-primary/80",
  hashtag: "rounded bg-primary-subtle px-0.5 text-primary-subtle-fg",
  mark: "editor-mark",
  markOverlap: "editor-mark-overlap",
  ruby: "editor-ruby relative inline-block align-baseline leading-[1.3]",
  specialText: "rounded bg-warning-subtle px-1 font-semibold text-warning-subtle-fg",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "[text-decoration-line:underline_line-through]",
    code: "rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm",
    subscript: "align-sub text-xs",
    superscript: "align-super text-xs",
    highlight: "rounded bg-warning-subtle",
    lowercase: "lowercase",
    uppercase: "uppercase",
    capitalize: "capitalize",
  },
  card: "editor-card relative my-3 grid w-full gap-0.5 rounded-lg border border-border bg-muted px-2.5 py-2 text-start text-sm text-fg transition-[color,box-shadow] first:mt-0 last:mb-0 data-[current-slot]:border-ring data-[selected=true]:border-primary data-[selected=true]:ring-2 data-[selected=true]:ring-ring/20",
  code: "editor-code relative mb-3 block overflow-x-auto rounded-lg border border-border bg-muted py-3 pe-4 ps-0 font-mono text-[13px] leading-relaxed [tab-size:2] [white-space:pre]",
  collapsibleContainer:
    "editor-collapsible my-2 w-full rounded-lg border border-border bg-overlay text-fg first:mt-0 last:mb-0",
  collapsibleTitle:
    "relative block cursor-pointer list-none rounded-lg py-2 pe-3 ps-7 text-start text-sm font-medium outline-none select-none hover:underline",
  collapsibleContent: "pt-0 pe-3 pb-2 ps-7 text-sm",
  codeHighlight: {
    inserted: "bg-success-subtle text-success-subtle-fg",
    deleted: "bg-danger-subtle text-danger-subtle-fg",
  },
  review:
    "relative my-3 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-fg first:mt-0 last:mb-0",
  pullQuote:
    "relative my-4 rounded-lg border-s-4 border-primary bg-muted px-5 py-4 transition-[color,box-shadow] first:mt-0 last:mb-0 data-[selected=true]:ring-2 data-[selected=true]:ring-ring/20",
  embedBlock: {
    base: "relative my-3 select-none first:mt-0 last:mb-0",
    focus: "rounded-md outline-2 outline-offset-2 outline-primary",
  },
  layoutContainer: "editor-layout-container my-3 grid gap-4",
  layoutItem: "min-w-0 rounded-md border border-dashed border-border p-2",
  tableScrollableWrapper:
    "editor-table-scrollable-wrapper relative my-3 w-full overflow-x-auto rounded-lg border border-border first:mt-0 last:mb-0",
  table: "w-full min-w-full table-fixed caption-bottom text-sm/6",
  tableRow: "[&:last-child>*]:border-b-0",
  tableCell:
    "editor-table-cell relative border-b border-s border-border px-4 py-2 text-start align-middle outline-hidden first:border-s-0",
  tableCellHeader: "text-start font-medium text-muted-fg",
  tableCellSelected: "editor-table-cell-selected",
  tableSelected: "editor-table-selected",
  tableSelection: "editor-table-selection",
  tableAlignment: {
    center: "mx-auto",
    right: "ms-auto",
  },
};
