import { useCallback, useEffect, useRef, useState } from "react";

import {
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  type NodeKey,
  SELECTION_CHANGE_COMMAND,
  getDOMSelection,
  registerEventListener,
} from "lexical";

import { $createLinkNode, $isAutoLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

import { CheckIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/16/solid";

import {
  $getSelectedLinkNode,
  $getSelectedNode,
} from "@/components/editor/extensions/format-state-extension";
import { OPEN_LINK_EDITOR_COMMAND, sanitizeUrl } from "@/components/editor/extensions/link-extension";
import {
  getDOMRangeRect,
  hideFloatingAnchor,
  setFloatingAnchorRect,
} from "@/components/editor/plugins/floating/floating-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Popover } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TextField } from "@/components/ui/text-field";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

export function LinkEditorPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [linkNodeKey, setLinkNodeKey] = useState<NodeKey | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [editedLinkUrl, setEditedLinkUrl] = useState("https://");
  const [isEditMode, setIsEditMode] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isOpen = isEditable && linkNodeKey !== null && !dismissed;

  const positionToRect = useCallback((rect: DOMRect | null) => {
    const triggerElem = triggerRef.current;
    if (triggerElem === null) {
      return;
    }
    if (rect === null) {
      hideFloatingAnchor(triggerElem);
    } else {
      setFloatingAnchorRect(triggerElem, rect);
    }
  }, []);

  const $updateLinkState = useCallback(() => {
    const selection = $getSelection();
    const linkNode = $isRangeSelection(selection) ? $getSelectedLinkNode(selection) : null;
    if (linkNode) {
      setLinkNodeKey(linkNode.getKey());
      setLinkUrl(linkNode.getURL());
    } else {
      setLinkNodeKey(null);
      setLinkUrl("");
    }
  }, []);

  const close = useCallback(() => {
    setDismissed(true);
    setIsEditMode(false);
  }, []);

  useEffect(() => {
    editor.read("latest", () => {
      $updateLinkState();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkState();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          setDismissed(false);
          $updateLinkState();
          const selection = $getSelection();
          if (!($isRangeSelection(selection) && $getSelectedLinkNode(selection))) {
            setIsEditMode(false);
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = $getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), "_blank");
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        OPEN_LINK_EDITOR_COMMAND,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          const linkNode = $getSelectedLinkNode(selection);
          if (!linkNode && selection.isCollapsed()) {
            return false;
          }
          setDismissed(false);
          setEditedLinkUrl(linkNode ? linkNode.getURL() : "https://");
          setIsEditMode(true);
          if (!linkNode) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
          }
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateLinkState]);

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        if (isOpen) {
          close();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      positionToRect(null);
      return;
    }
    const update = () => {
      const element = linkNodeKey !== null ? editor.getElementByKey(linkNodeKey) : null;
      if (element) {
        positionToRect(element.getBoundingClientRect());
        return;
      }
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();
      positionToRect(
        nativeSelection && rootElement ? getDOMRangeRect(nativeSelection, rootElement) : null,
      );
    };
    update();
    return mergeRegister(
      editor.registerUpdateListener(update),
      registerEventListener(window, "resize", update),
      registerEventListener(document, "scroll", update, true),
    );
  }, [editor, isOpen, linkNodeKey, positionToRect]);

  const handleLinkSubmission = (event?: React.SyntheticEvent) => {
    event?.preventDefault();
    if (linkNodeKey === null) {
      return;
    }
    editor.update(() => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const parent = $getSelectedNode(selection).getParent();
        if ($isAutoLinkNode(parent)) {
          const linkNode = $createLinkNode(parent.getURL(), {
            rel: parent.__rel,
            target: parent.__target,
            title: parent.__title,
          });
          parent.replace(linkNode, true);
        }
      }
    });
    setEditedLinkUrl("https://");
    setIsEditMode(false);
  };

  const iconButtonProps = {
    intent: "plain",
    size: "sq-sm",
    preventFocusOnPress: true,
  } as const;

  return (
    <>
      <span
        ref={triggerRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 opacity-0"
        style={{ transform: "translate(-10000px, -10000px)" }}
      />
      <Popover
        ref={contentRef}
        isOpen={isOpen}
        isNonModal
        triggerRef={triggerRef}
        placement="bottom start"
        offset={8}
        className="w-auto min-w-0 max-w-md"
      >
        <div
          role="group"
          aria-label="Link"
          className="flex items-center gap-1.5 p-1.5 [&_button]:before:hidden!"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              close();
            }
          }}
        >
          {isEditMode ? (
            <form
              className="flex items-center gap-1.5"
              onSubmit={handleLinkSubmission}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setIsEditMode(false);
                }
              }}
            >
              <TextField
                autoFocus
                aria-label="Link URL"
                type="url"
                value={editedLinkUrl}
                onChange={setEditedLinkUrl}
                className="w-64"
              >
                <Input placeholder="Paste a link" className="h-8 py-0 sm:py-0" />
              </TextField>
              <TooltipTrigger>
                <Button
                  {...iconButtonProps}
                  aria-label="Cancel"
                  onPress={() => setIsEditMode(false)}
                >
                  <XMarkIcon />
                </Button>
                <Tooltip>Cancel</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <Button {...iconButtonProps} intent="primary" type="submit" aria-label="Save link">
                  <CheckIcon />
                </Button>
                <Tooltip>Save link</Tooltip>
              </TooltipTrigger>
            </form>
          ) : (
            <>
              <Link
                href={sanitizeUrl(linkUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-64 truncate ps-2 text-sm font-normal text-primary-subtle-foreground underline underline-offset-2"
              >
                {linkUrl}
              </Link>
              <Separator orientation="vertical" className="mx-0.5 h-5" />
              <TooltipTrigger>
                <Button
                  {...iconButtonProps}
                  aria-label="Edit link"
                  onPress={() => {
                    setEditedLinkUrl(linkUrl);
                    setIsEditMode(true);
                  }}
                >
                  <PencilIcon />
                </Button>
                <Tooltip>Edit link</Tooltip>
              </TooltipTrigger>
              <TooltipTrigger>
                <Button
                  {...iconButtonProps}
                  aria-label="Remove link"
                  onPress={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
                >
                  <TrashIcon />
                </Button>
                <Tooltip>Remove link</Tooltip>
              </TooltipTrigger>
            </>
          )}
        </div>
      </Popover>
    </>
  );
}
