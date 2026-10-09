import { codeToHtml } from "shiki"

/**
 * Highlights code with the same dual (light/dark) CSS-variable output that the
 * MDX pipeline produces, so both render identically with `.shiki` styles.
 */
export async function highlight(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}
