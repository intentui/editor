import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { twJoin } from "cn";
import compactEmojis from "emojibase-data/en/compact.json";
import type { TextNode } from "lexical";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  $createEmojiNode,
  EMOJI_CLASS_NAME,
} from "@/components/editor/nodes/emoji-node";

const MAX_SUGGESTIONS = 8;

const EXCLUDED_GROUPS = new Set([2]);

type EmojiEntry = {
  emoji: string;
  name: string;
  keywords: string[];
  hexcode: string;
};

const EMOJI_ENTRIES: EmojiEntry[] = compactEmojis
  .filter(
    (entry) => entry.group !== undefined && !EXCLUDED_GROUPS.has(entry.group),
  )
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((entry) => ({
    emoji: entry.unicode,
    name: entry.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, ""),
    keywords: entry.tags ?? [],
    hexcode: entry.hexcode,
  }));

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "");
}

function searchEmojis(query: string): EmojiEntry[] {
  const q = normalize(query);
  if (!q) {
    return [];
  }

  const startsWith: EmojiEntry[] = [];
  const includes: EmojiEntry[] = [];

  for (const entry of EMOJI_ENTRIES) {
    const name = normalize(entry.name);
    if (name.startsWith(q)) {
      startsWith.push(entry);
      continue;
    }
    const keywordMatch = entry.keywords.some((keyword) =>
      normalize(keyword).startsWith(q),
    );
    if (keywordMatch) {
      startsWith.push(entry);
      continue;
    }
    if (
      name.includes(q) ||
      entry.keywords.some((keyword) => normalize(keyword).includes(q))
    ) {
      includes.push(entry);
    }
  }

  return [...startsWith, ...includes];
}

class EmojiTypeaheadOption extends MenuOption {
  entry: EmojiEntry;

  constructor(entry: EmojiEntry) {
    super(entry.hexcode);
    this.entry = entry;
  }
}

export function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(":", {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (queryString === null) {
      return [];
    }
    const matches =
      queryString === "" ? EMOJI_ENTRIES : searchEmojis(queryString);
    return matches
      .slice(0, MAX_SUGGESTIONS)
      .map((entry) => new EmojiTypeaheadOption(entry));
  }, [queryString]);

  const onSelectOption = useCallback(
    (
      option: EmojiTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const emojiNode = $createEmojiNode(
          EMOJI_CLASS_NAME,
          option.entry.emoji,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(emojiNode);
        }
        emojiNode.selectNext();
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<EmojiTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length > 0
          ? createPortal(
              <div className="absolute inset-s-0 top-full z-50 -mt-4 w-56 rounded-lg bg-overlay text-overlay-foreground shadow-xs ring ring-muted-foreground/20 drop-shadow-xl dark:ring-border">
                <div
                  role="listbox"
                  className="scrollbar-thin flex max-h-64 flex-col gap-y-1 overflow-y-auto overscroll-contain p-1 sm:text-sm"
                >
                  {options.map((option, index) => (
                    <div
                      key={option.key}
                      ref={option.setRefElement}
                      role="option"
                      aria-selected={selectedIndex === index}
                      tabIndex={-1}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectOptionAndCleanUp(option)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectOptionAndCleanUp(option);
                        }
                      }}
                      className={twJoin(
                        "flex cursor-default select-none items-center gap-x-2 rounded-md px-3 py-2 text-base/6 text-foreground outline-0 sm:px-2.5 sm:py-1.5 sm:text-sm/6",
                        selectedIndex === index &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      <span className="text-base leading-none">
                        {option.entry.emoji}
                      </span>
                      <span className="truncate text-muted-foreground">
                        :{option.entry.name}:
                      </span>
                    </div>
                  ))}
                </div>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
  );
}
