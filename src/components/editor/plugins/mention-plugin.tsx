import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { TextNode } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { UserIcon } from "@heroicons/react/16/solid";
import { twJoin } from "cn";

import { $createMentionNode } from "@/components/editor/nodes/mention-node";

const MAX_SUGGESTIONS = 5;

const PUNCTUATION = "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

const TRIGGERS = ["@"].join("");

const VALID_CHARS = "[^" + TRIGGERS + PUNCTUATION + "\\s]";

const VALID_JOINS = "(?:" + "\\.[ |$]|" + " |" + "[" + PUNCTUATION + "]|" + ")";

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$",
);

const ALIAS_LENGTH_LIMIT = 50;

const AtSignMentionsRegexAliasRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    "){0," +
    ALIAS_LENGTH_LIMIT +
    "})" +
    ")$",
);

const MENTIONS = [
  "Aayla Secura",
  "Admiral Gial Ackbar",
  "Ahsoka Tano",
  "Anakin Skywalker",
  "Asajj Ventress",
  "BB-8",
  "Bail Organa",
  "Beru Lars",
  "Boba Fett",
  "Bodhi Rook",
  "C-3PO",
  "Captain Phasma",
  "Captain Rex",
  "Cassian Andor",
  "Chewbacca",
  "Chirrut Îmwe",
  "Count Dooku",
  "Darth Maul",
  "Darth Vader",
  "Ezra Bridger",
  "Finn",
  "Galen Erso",
  "General Grievous",
  "Grand Moff Tarkin",
  "Greedo",
  "Han Solo",
  "Hera Syndulla",
  "Jabba the Hutt",
  "Jango Fett",
  "Jar Jar Binks",
  "Jyn Erso",
  "K-2SO",
  "Kanan Jarrus",
  "Ki-Adi-Mundi",
  "Kit Fisto",
  "Kylo Ren",
  "Lando Calrissian",
  "Leia Organa",
  "Luke Skywalker",
  "Mace Windu",
  "Maz Kanata",
  "Mon Mothma",
  "Obi-Wan Kenobi",
  "Owen Lars",
  "Padmé Amidala",
  "Plo Koon",
  "Poe Dameron",
  "Qui-Gon Jinn",
  "R2-D2",
  "Rey",
  "Rose Tico",
  "Sabine Wren",
  "Saw Gerrera",
  "Sheev Palpatine",
  "Shmi Skywalker",
  "Wedge Antilles",
  "Yoda",
];

const mentionsCache = new Map<string, string[] | null>();

const lookupService = {
  search(query: string, callback: (results: string[]) => void): void {
    setTimeout(() => {
      const results = MENTIONS.filter((mention) =>
        mention.toLowerCase().includes(query.toLowerCase()),
      );
      callback(results);
    }, 250);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (mentionString === null) {
      setResults([]);
      return;
    }

    const cachedResults = mentionsCache.get(mentionString);
    if (cachedResults === null) {
      return;
    }
    if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    lookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}

function checkForAtSignMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];
    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

class MentionTypeaheadOption extends MenuOption {
  name: string;

  constructor(name: string) {
    super(name);
    this.name = name;
  }
}

export function MentionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(queryString);

  const options = useMemo(
    () => results.slice(0, MAX_SUGGESTIONS).map((result) => new MentionTypeaheadOption(result)),
    [results],
  );

  const onSelectOption = useCallback(
    (option: MentionTypeaheadOption, nodeToReplace: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(option.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const checkForMentionMatch = useCallback(
    (text: string) => {
      if (checkForSlashTriggerMatch(text, editor) !== null) {
        return null;
      }
      return checkForAtSignMentions(text, 1);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
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
                      className={twJoin(
                        "flex cursor-default select-none items-center gap-x-2 rounded-md px-3 py-2 text-base/6 text-foreground outline-0 sm:px-2.5 sm:py-1.5 sm:text-sm/6",
                        selectedIndex === index && "bg-accent text-accent-foreground",
                      )}
                    >
                      <UserIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{option.name}</span>
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
