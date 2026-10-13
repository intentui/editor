import { useCallback, useRef } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { PhotoIcon } from "@heroicons/react/16/solid";

import { INSERT_IMAGE_COMMAND } from "@/components/editor/nodes/image-node";
import { Button } from "@/components/ui/button";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function useImageFilePicker() {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) {
        return;
      }
      readFileAsDataUrl(file).then((src) => {
        editor.update(() => {
          if (!$getSelection()) {
            $getRoot().selectEnd();
          }
        });
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: file.name,
          src,
        });
      });
    },
    [editor],
  );

  const input = (
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
  );

  return { pick, input };
}

export function InsertImagePlugin() {
  const isEditable = useLexicalEditable();
  const { pick, input } = useImageFilePicker();

  return (
    <>
      <TooltipTrigger>
        <Button
          intent="outline"
          size="sq-xs"
          aria-label="Insert image"
          isDisabled={!isEditable}
          onPress={pick}
        >
          <PhotoIcon />
        </Button>
        <Tooltip>Insert image</Tooltip>
      </TooltipTrigger>
      {input}
    </>
  );
}
