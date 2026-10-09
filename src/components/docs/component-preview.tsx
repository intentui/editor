import { readFile } from "node:fs/promises"
import path from "node:path"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import { highlight } from "@/lib/highlight"

interface ComponentPreviewProps {
  /**
   * `full-editor` previews the real `src/components/editor/editor.tsx`, and `markdown-editor`
   * the real `src/components/editor/editor-md.tsx`, `block-editor` the real `editor-block.tsx`.
   * Anything else is a pattern: `text-format` resolves to `examples/patterns/text-format.tsx`.
   */
  name: string
  className?: string
  bleed?: boolean
}

type AnyComponent = React.ComponentType

/** Picks the component a module exports, whether it is the default or the first named function. */
function pickComponent(mod: Record<string, unknown>, preferred?: string): AnyComponent {
  const candidate =
    (preferred ? mod[preferred] : undefined) ??
    mod.default ??
    Object.values(mod).find((value) => typeof value === "function")
  if (typeof candidate !== "function") {
    throw new Error("[docs] The example module does not export a component.")
  }
  return candidate as AnyComponent
}

async function load(name: string): Promise<{ Example: AnyComponent; file: string; filename: string }> {
  if (name === "full-editor") {
    const mod = (await import("@/components/editor/editor")) as Record<string, unknown>
    return {
      Example: pickComponent(mod, "DemoEditor"),
      file: path.join(process.cwd(), "src/components/editor/editor.tsx"),
      filename: "components/editor/editor.tsx",
    }
  }

  if (name === "markdown-editor") {
    const mod = (await import("@/components/editor/editor-md")) as Record<string, unknown>
    return {
      Example: pickComponent(mod, "DemoMarkdownEditor"),
      file: path.join(process.cwd(), "src/components/editor/editor-md.tsx"),
      filename: "components/editor/editor-md.tsx",
    }
  }

  if (name === "block-editor") {
    const mod = (await import("@/components/editor/editor-block")) as Record<string, unknown>
    return {
      Example: pickComponent(mod, "DemoBlockEditor"),
      file: path.join(process.cwd(), "src/components/editor/editor-block.tsx"),
      filename: "components/editor/editor-block.tsx",
    }
  }

  // Each pattern is its own module, so a broken one only affects the page that renders it.
  const mod = (await import(`./examples/patterns/${name}.tsx`)) as Record<string, unknown>
  return {
    Example: pickComponent(mod),
    file: path.join(process.cwd(), "src/components/docs/examples/patterns", `${name}.tsx`),
    filename: `${name}-editor.tsx`,
  }
}

export async function ComponentPreview({ name, className, bleed }: ComponentPreviewProps) {
  const { Example, file, filename } = await load(name)

  // The code tab shows the file exactly as users would write it, with nothing stripped.
  const source = await readFile(file, "utf8")
  const html = await highlight(source)

  return (
    <PreviewTabs
      preview={<Example />}
      html={html}
      source={source}
      filename={filename}
      className={className}
      bleed={bleed}
    />
  )
}
