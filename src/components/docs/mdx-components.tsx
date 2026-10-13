import type { MDXComponents } from "mdx/types"
import { cn } from "cn"
import {
  ApiDescription,
  ApiParameter,
  ApiParameters,
  ApiReference,
} from "@/components/docs/api-parameters"
import { ComponentPreview } from "@/components/docs/component-preview"
import { DocNote } from "@/components/docs/doc-note"
import { Heading } from "@/components/docs/heading"
import { PackageCommand } from "@/components/docs/package-command"
import { PlainCode, Pre } from "@/components/docs/plain-code"

export const mdxComponents: MDXComponents = {
  pre: (props: React.ComponentProps<typeof PlainCode>) => (
    <PlainCode className="not-typeset bg-black" {...props}>
      <Pre>{props.children}</Pre>
    </PlainCode>
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="not-typeset overflow-hidden overflow-x-auto">
      <table className="not-typeset w-full" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<"thead">) => (
    <thead className="border-border border-b-2" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="px-6 py-2.5 text-left font-medium text-foreground text-sm/6 first:px-0" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td
      className="border-border/70 border-t px-6 py-2.5 text-muted-foreground text-sm first:px-0 *:[code]:font-medium *:[code]:text-foreground"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <Heading {...props} as="h2" className={cn("text-xl", props.className)} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <Heading {...props} as="h3" className={cn("text-lg", props.className)} />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <Heading {...props} as="h4" className={cn("text-base", props.className)} />
  ),
  Kbd: (props: React.ComponentProps<"kbd">) => <kbd {...props} />,
  Note: DocNote,
  PackageCommand,
  ComponentPreview,
  ApiParameters,
  ApiDescription,
  ApiParameter,
  ApiReference,
}
