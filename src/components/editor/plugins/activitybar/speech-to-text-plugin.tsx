import { useEffect, useState } from "react";

import { COMMAND_PRIORITY_LOW } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { twJoin } from "cn";

import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "@/components/editor/extensions/speech-to-text";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

const LABEL = "Speech to text";

function SpeechToTextButton() {
  const [editor] = useLexicalComposerContext();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SPEECH_TO_TEXT_COMMAND,
      (enabled) => {
        setIsListening(enabled);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return (
    <Tooltip>
      <Button
        intent="plain"
        size="sq-xs"
        aria-label={LABEL}
        aria-pressed={isListening}
        className={twJoin(isListening && "text-danger hover:text-danger")}
        onPress={() => editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isListening)}
      >
        <MicrophoneIcon />
      </Button>
      <TooltipContent>{LABEL}</TooltipContent>
    </Tooltip>
  );
}

export function SpeechToTextPlugin() {
  if (SUPPORT_SPEECH_RECOGNITION) {
    return <SpeechToTextButton />;
  }

  return (
    <Button intent="plain" size="sq-xs" aria-label={LABEL} isDisabled>
      <MicrophoneIcon />
    </Button>
  );
}
