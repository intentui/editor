import {
  ClipboardDocumentIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  LinkSlashIcon,
  ScissorsIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { $isAutoLinkNode, $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isDecoratorNode,
  $isNodeSelection,
  COPY_COMMAND,
  CUT_COMMAND,
  PASTE_COMMAND,
  registerEventListener,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-aria-components/Button";

import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";

export function ContextMenuPlugin() {
  const [editor] = useLexicalComposerContext();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [target, setTarget] = useState<{ key: string; isLink: boolean } | null>(
    null,
  );

  useEffect(() => {
    function onContextMenu(event: MouseEvent) {
      const trigger = triggerRef.current;
      if (trigger === null || !(event.target instanceof Node)) {
        return;
      }
      event.preventDefault();
      trigger.style.left = `${event.clientX}px`;
      trigger.style.top = `${event.clientY}px`;
      editor.read(() => {
        const node =
          $getNearestNodeFromDOMNode(event.target as Node) ?? $getRoot();
        setTarget({
          key: node.getKey(),
          isLink: $isLinkNode(node) || $isLinkNode(node.getParent()),
        });
      });
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
        }),
      );
    }

    return editor.registerRootListener((rootElement) => {
      if (rootElement !== null) {
        return registerEventListener(rootElement, "contextmenu", onContextMenu);
      }
    });
  }, [editor]);

  const removeLink = useCallback(() => {
    if (target === null) {
      return;
    }
    editor.update(() => {
      const node = $getNodeByKey(target.key);
      const parent = node?.getParent();
      const link = $isLinkNode(node)
        ? node
        : $isLinkNode(parent)
          ? parent
          : null;
      if (link === null) {
        return;
      }
      if ($isAutoLinkNode(link)) {
        link.setIsUnlinked(true);
        return;
      }
      for (const child of link.getChildren()) {
        link.insertBefore(child);
      }
      link.remove();
    });
  }, [editor, target]);

  const pasteFromClipboard = useCallback(
    async (plainText: boolean) => {
      try {
        const data = new DataTransfer();
        if (plainText) {
          data.setData("text/plain", await navigator.clipboard.readText());
        } else {
          const [item] = await navigator.clipboard.read();
          for (const type of item.types) {
            data.setData(type, await (await item.getType(type)).text());
          }
        }
        editor.dispatchCommand(
          PASTE_COMMAND,
          new ClipboardEvent("paste", { clipboardData: data }),
        );
      } catch {
        window.alert("Clipboard access is not allowed");
      }
    },
    [editor],
  );

  const deleteNode = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isNodeSelection(selection)) {
        for (const node of selection.getNodes()) {
          if ($isDecoratorNode(node)) {
            node.remove();
          }
        }
        return;
      }
      const node = target === null ? null : $getNodeByKey(target.key);
      if (node === null) {
        return;
      }
      if ($isDecoratorNode(node)) {
        node.remove();
      } else {
        node.getTopLevelElement()?.remove();
      }
    });
  }, [editor, target]);

  return (
    <MenuTrigger trigger="contextMenu">
      <span aria-hidden="true" className="contents">
        <Button
          ref={triggerRef}
          excludeFromTabOrder
          className="pointer-events-none fixed size-0 opacity-0"
        />
      </span>
      <Menu className="w-52">
        {target?.isLink && (
          <>
            <MenuItem onAction={removeLink}>
              <LinkSlashIcon />
              Remove link
            </MenuItem>
            <MenuSeparator />
          </>
        )}
        <MenuItem onAction={() => editor.dispatchCommand(CUT_COMMAND, null)}>
          <ScissorsIcon />
          Cut
        </MenuItem>
        <MenuItem onAction={() => editor.dispatchCommand(COPY_COMMAND, null)}>
          <DocumentDuplicateIcon />
          Copy
        </MenuItem>
        <MenuItem onAction={() => pasteFromClipboard(false)}>
          <ClipboardIcon />
          Paste
        </MenuItem>
        <MenuItem onAction={() => pasteFromClipboard(true)}>
          <ClipboardDocumentIcon />
          Paste as plain text
        </MenuItem>
        <MenuSeparator />
        <MenuItem intent="danger" onAction={deleteNode}>
          <TrashIcon />
          Delete
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
