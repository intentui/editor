import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { twJoin } from "cn";
import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState, useSyncExternalStore } from "react";

import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "@/components/editor/extensions/speech-to-text";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

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
    <TooltipTrigger>
      <Button
        intent="plain"
        size="sq-xs"
        aria-label={LABEL}
        aria-pressed={isListening}
        className={twJoin(isListening && "text-danger hover:text-danger")}
        onPress={() =>
          editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isListening)
        }
      >
        <MicrophoneIcon />
      </Button>
      <Tooltip>{LABEL}</Tooltip>
    </TooltipTrigger>
  );
}

const subscribe = () => () => {};

export function SpeechToTextPlugin() {
  // The server cannot know whether the browser supports speech recognition, so it
  // renders the disabled button. The client switches over right after hydrating.
  const isSupported = useSyncExternalStore(
    subscribe,
    () => SUPPORT_SPEECH_RECOGNITION,
    () => false,
  );

  if (isSupported) {
    return <SpeechToTextButton />;
  }

  return (
    <Button intent="plain" size="sq-xs" aria-label={LABEL} isDisabled>
      <MicrophoneIcon />
    </Button>
  );
}
