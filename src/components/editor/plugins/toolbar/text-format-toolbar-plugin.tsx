import {
  BoldIcon,
  CodeBracketIcon,
  ItalicIcon,
  PaintBrushIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@heroicons/react/16/solid";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { FORMAT_TEXT_COMMAND, type TextFormatType } from "lexical";
import { Fragment } from "react";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { ToolbarGroup, ToolbarItem, ToolbarSeparator } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

type IconComponent = React.ComponentType<{ className?: string }>;

// Heroicons has no glyphs for these formats, so draw them as SVG text. Being real
// <svg> elements, they get the same size and tone as the other toolbar icons.
const glyph = (children: React.ReactNode): IconComponent =>
  function Glyph({ className }) {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        fontSize={9}
        fontWeight={700}
        textAnchor="middle"
        aria-hidden="true"
        className={className}
      >
        {children}
      </svg>
    );
  };

const SubscriptIcon = glyph(
  <>
    <text x="6" y="10" fontSize={10}>
      x
    </text>
    <text x="12" y="13.5" fontSize={7}>
      2
    </text>
  </>,
);
const SuperscriptIcon = glyph(
  <>
    <text x="6" y="12" fontSize={10}>
      x
    </text>
    <text x="12" y="7" fontSize={7}>
      2
    </text>
  </>,
);
const UppercaseIcon = glyph(
  <text x="8" y="11.5" fontSize={10}>
    AA
  </text>,
);
const LowercaseIcon = glyph(
  <text x="8" y="11.5" fontSize={10}>
    aa
  </text>,
);
const TitleCaseIcon = glyph(
  <text x="8" y="11.5" fontSize={10}>
    Aa
  </text>,
);

const FORMAT_GROUPS: {
  format: TextFormatType;
  label: string;
  icon: IconComponent;
}[][] = [
  [
    { format: "bold", label: "Bold", icon: BoldIcon },
    { format: "italic", label: "Italic", icon: ItalicIcon },
    { format: "underline", label: "Underline", icon: UnderlineIcon },
    {
      format: "strikethrough",
      label: "Strikethrough",
      icon: StrikethroughIcon,
    },
  ],
  [
    { format: "highlight", label: "Highlight", icon: PaintBrushIcon },
    { format: "code", label: "Inline code", icon: CodeBracketIcon },
  ],
  [
    { format: "subscript", label: "Subscript", icon: SubscriptIcon },
    { format: "superscript", label: "Superscript", icon: SuperscriptIcon },
  ],
  [
    { format: "uppercase", label: "Uppercase", icon: UppercaseIcon },
    { format: "lowercase", label: "Lowercase", icon: LowercaseIcon },
    { format: "capitalize", label: "Title case", icon: TitleCaseIcon },
  ],
];

function FormatToggleGroup({
  items,
}: {
  items: (typeof FORMAT_GROUPS)[number];
}) {
  const [editor] = useLexicalComposerContext();
  const formats = useFormatStateValue("formats");
  const isEditable = useLexicalEditable();
  return (
    <ToolbarGroup aria-label="Text formatting" isDisabled={!isEditable}>
      {items.map(({ format, label, icon: Icon }) => (
        <TooltipTrigger key={format}>
          <ToolbarItem
            size="sq-xs"
            aria-label={label}
            isSelected={formats.includes(format)}
            onChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
          >
            <Icon />
          </ToolbarItem>
          <Tooltip>{label}</Tooltip>
        </TooltipTrigger>
      ))}
    </ToolbarGroup>
  );
}

// The formats Markdown can write: **bold**, *italic*, ~~strikethrough~~ and `code`.
const MARKDOWN_FORMATS: TextFormatType[] = [
  "bold",
  "italic",
  "strikethrough",
  "code",
];
const MARKDOWN_GROUP = FORMAT_GROUPS.flat().filter(({ format }) =>
  MARKDOWN_FORMATS.includes(format),
);

export function TextFormatToolbarPlugin({
  formats = "all",
}: {
  formats?: "basic" | "markdown" | "all";
}) {
  const groups =
    formats === "basic"
      ? FORMAT_GROUPS.slice(0, 1)
      : formats === "markdown"
        ? [MARKDOWN_GROUP]
        : FORMAT_GROUPS;
  return (
    <>
      {groups.map((items, groupIndex) => (
        <Fragment key={items.map((item) => item.format).join("-")}>
          {groupIndex > 0 && <ToolbarSeparator />}
          <FormatToggleGroup items={items} />
        </Fragment>
      ))}
    </>
  );
}
