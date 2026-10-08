import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import type { TextNode } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { twJoin } from "cn";

export type ComponentPickerItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
  onSelect: (queryString: string) => void;
};

type ComponentPickerContextValue = {
  registerItems: (id: string, items: ComponentPickerItem[]) => () => void;
  queryString: string | null;
};

const ComponentPickerContext = createContext<ComponentPickerContextValue | null>(null);

function useComponentPickerContext(): ComponentPickerContextValue {
  const context = useContext(ComponentPickerContext);
  if (context === null) {
    throw new Error("ComponentPicker plugins must be rendered inside <ComponentPicker>");
  }
  return context;
}

export function useComponentPickerQuery(): string | null {
  return useComponentPickerContext().queryString;
}

export function useComponentPickerItems(items: ComponentPickerItem[]) {
  const { registerItems } = useComponentPickerContext();
  const id = useId();

  useEffect(() => registerItems(id, items), [registerItems, id, items]);
}

class ComponentPickerOption extends MenuOption {
  item: ComponentPickerItem;

  constructor(item: ComponentPickerItem) {
    super(item.value);
    this.item = item;
  }
}

export function ComponentPicker({ children }: { children: React.ReactNode }) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [itemsById, setItemsById] = useState(() => new Map<string, ComponentPickerItem[]>());
  const registrationOrderRef = useRef(new Map<string, number>());

  const registerItems = useCallback((id: string, items: ComponentPickerItem[]) => {
    const order = registrationOrderRef.current;
    if (!order.has(id)) {
      order.set(id, order.size);
    }
    setItemsById((prev) => new Map(prev).set(id, items));
    return () => {
      setItemsById((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    };
  }, []);

  const contextValue = useMemo(
    () => ({ registerItems, queryString }),
    [registerItems, queryString],
  );

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    allowWhitespace: true,
    minLength: 0,
  });

  const options = useMemo(() => {
    const order = registrationOrderRef.current;
    const allItems = Array.from(itemsById.entries())
      .sort(([a], [b]) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
      .flatMap(([, items]) => items);
    const query = (queryString ?? "").trim().toLowerCase();
    const matches =
      query === ""
        ? allItems
        : allItems.filter(
            (item) =>
              item.label.toLowerCase().includes(query) ||
              (item.keywords ?? []).some((keyword) => keyword.toLowerCase().includes(query)),
          );
    return matches.map((item) => new ComponentPickerOption(item));
  }, [itemsById, queryString]);

  const onSelectOption = useCallback(
    (
      option: ComponentPickerOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        if (nodeToReplace) {
          nodeToReplace.remove();
        }
      });
      closeMenu();
      option.item.onSelect(matchingString);
    },
    [editor],
  );

  return (
    <ComponentPickerContext.Provider value={contextValue}>
      {children}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
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
                <div className="absolute start-0 top-full z-50 -mt-4 w-56 overflow-hidden rounded-lg bg-overlay text-overlay-fg shadow-xs ring ring-muted-fg/20 drop-shadow-xl dark:ring-border">
                  <div
                    role="listbox"
                    aria-label="Components"
                    className="grid max-h-64 grid-cols-[auto_minmax(0,1fr)] gap-y-1 overflow-y-auto overscroll-contain p-1 text-sm"
                  >
                    {options.map((option, index) => (
                      <div
                        key={option.key}
                        ref={option.setRefElement}
                        role="option"
                        tabIndex={-1}
                        aria-selected={selectedIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => selectOptionAndCleanUp(option)}
                        className={twJoin(
                          "col-span-full grid cursor-default grid-cols-subgrid items-center gap-x-2 rounded-[calc(var(--radius-lg)-(--spacing(1)))] px-2.5 py-2 outline-hidden sm:px-2 sm:py-1.5",
                          "[&_svg]:size-4 [&_svg]:shrink-0",
                          selectedIndex === index
                            ? "bg-accent text-accent-fg [&_svg]:text-accent-fg"
                            : "text-fg",
                        )}
                      >
                        {option.item.icon ?? <span />}
                        <span className="truncate">{option.item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>,
                anchorElementRef.current,
              )
            : null
        }
      />
    </ComponentPickerContext.Provider>
  );
}
