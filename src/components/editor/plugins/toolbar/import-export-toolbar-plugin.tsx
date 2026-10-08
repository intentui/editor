import { exportFile, importFile } from "@lexical/file";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS, type Transformer } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { DocumentArrowDownIcon, DocumentArrowUpIcon } from "@heroicons/react/16/solid";

import { Button, buttonStyles } from "@/components/ui/button";
import { ToolbarGroup } from "@/components/ui/toolbar";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

function toSafeFileName(value: string) {
  return value
    .replace(/[^a-zA-Z0-9-_. ]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-. ]+|[-. ]+$/g, "");
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ImportExportToolbarPlugin({
  transformers = TRANSFORMERS,
}: {
  transformers?: Transformer[];
}) {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  const namespace = editor._config.namespace;

  const getFileName = () => toSafeFileName(`${namespace} ${new Date().toISOString()}`);

  const exportLexical = () => {
    exportFile(editor, {
      fileName: getFileName(),
      source: namespace,
    });
  };

  const exportMarkdown = () => {
    const markdown = editor.read(() => $convertToMarkdownString(transformers));
    downloadFile(markdown, `${getFileName()}.md`, "text/markdown");
  };

  const exportHtml = () => {
    const body = editor.read(() => $generateHtmlFromNodes(editor));
    const html = `<!doctype html>\n<html lang="en">\n<body>\n${body}\n</body>\n</html>`;
    downloadFile(html, `${getFileName()}.html`, "text/html");
  };

  return (
    <ToolbarGroup aria-label="Import and export">
      <Tooltip>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Import file"
          isDisabled={!isEditable}
          onPress={() => {
            importFile(editor);
          }}
        >
          <DocumentArrowUpIcon />
        </Button>
        <TooltipContent>Import file</TooltipContent>
      </Tooltip>
      <Menu>
        <Tooltip>
          <MenuTrigger
            aria-label="Export as"
            className={buttonStyles({ intent: "outline", size: "sq-xs" })}
          >
            <DocumentArrowDownIcon />
          </MenuTrigger>
          <TooltipContent>Export as</TooltipContent>
        </Tooltip>
        <MenuContent placement="bottom end">
          <MenuItem onAction={exportLexical}>Lexical JSON</MenuItem>
          <MenuItem onAction={exportMarkdown}>Markdown</MenuItem>
          <MenuItem onAction={exportHtml}>HTML</MenuItem>
        </MenuContent>
      </Menu>
    </ToolbarGroup>
  );
}
