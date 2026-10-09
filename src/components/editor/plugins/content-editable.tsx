import {
  type ContentEditableElementProps,
  ContentEditable as LexicalContentEditable,
} from "@lexical/react/LexicalContentEditable";

import { twMerge } from "cn";
import { type VariantProps, tv } from "tailwind-variants";

const contentEditableVariants = tv({
  base: "min-h-full w-full bg-transparent text-sm outline-none",
  variants: {
    variant: {
      default: "px-2.5 py-2",
      toolbar: "px-4 py-4",
      draggable: "px-12 py-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const placeholderVariants = tv({
  base: "pointer-events-none absolute text-sm text-muted-foreground select-none",
  variants: {
    variant: {
      default: "start-2.5 top-2",
      toolbar: "start-4 top-4",
      draggable: "start-12 top-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function ContentEditable({
  variant,
  className,
  placeholder = "",
  placeholderClassName,
  ...props
}: VariantProps<typeof contentEditableVariants> &
  Omit<ContentEditableElementProps, "editor" | "className"> & {
    className?: string;
    placeholder?: string;
    placeholderClassName?: string;
  }) {
  return (
    <LexicalContentEditable
      {...props}
      className={twMerge(contentEditableVariants({ variant }), className)}
      aria-placeholder={placeholder}
      placeholder={
        <div className={twMerge(placeholderVariants({ variant }), placeholderClassName)}>
          {placeholder}
        </div>
      }
    />
  );
}
