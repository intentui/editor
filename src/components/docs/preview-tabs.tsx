"use client"

import { useState } from "react"
import { Group } from "react-aria-components/Group"
import { ToggleButton } from "react-aria-components/ToggleButton"
import { Toolbar } from "react-aria-components/Toolbar"
import { cn, twJoin } from "cn"
import { CopyButton } from "@/components/docs/copy-button"

interface PreviewTabsProps {
  preview: React.ReactNode
  html: string
  source: string
  /** File shown above the code, e.g. `text-format-editor.tsx`. */
  filename: string
  className?: string
  /** Remove the padding around the live preview. */
  bleed?: boolean
}

export function PreviewTabs({ preview, html, source, filename, className, bleed }: PreviewTabsProps) {
  const [currentTab, setCurrentTab] = useState<"tab_preview" | "tab_code">("tab_preview")

  return (
    <div className="not-typeset mt-3">
      <Toolbar className="mb-1 flex items-center justify-between sm:*:-mx-2">
        <Group>
          <ToggleButton
            className={twJoin(
              "p-2 font-medium text-sm/6 outline-hidden focus-visible:text-blue-500 dark:focus-visible:text-blue-300",
              currentTab === "tab_preview" ? "text-fg focus:text-fg" : "text-muted-fg hover:text-fg"
            )}
            onPress={() => setCurrentTab("tab_preview")}
          >
            Preview
          </ToggleButton>
          <ToggleButton
            className={twJoin(
              "p-2 font-medium text-sm/6 outline-hidden focus:text-fg",
              currentTab === "tab_code" ? "text-fg focus:text-fg" : "text-muted-fg hover:text-fg"
            )}
            onPress={() => setCurrentTab("tab_code")}
          >
            Code
          </ToggleButton>
        </Group>
        <Group>
          <CopyButton className="grid size-10 place-content-center" text={source} />
        </Group>
      </Toolbar>

      <div className="h-fit w-full">
        {currentTab === "tab_preview" ? (
          <div
            className={cn(
              "w-full overflow-y-auto",
              !bleed ? "relative gap-4 rounded-lg border px-4 py-8 *:w-full sm:p-8 dark:bg-muted/30" : ""
            )}
          >
            <div className={cn("not-typeset", className)}>{preview}</div>
          </div>
        ) : (
          <div className="group relative rounded-lg bg-shiki-bg border">
            <div className="flex items-center border-b px-4 py-1.5 text-muted-fg text-sm/6">
              {filename}
            </div>
            <div
              className="max-h-150 overflow-auto text-sm/6 [&_pre]:p-4"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, build-time Shiki output
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
