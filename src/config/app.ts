export const app = {
  name: "Intent Editor",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://editor.intentui.com",
  description:
    "A rich text editor for React. Built on Lexical, React Aria Components and Tailwind CSS, and installed with the shadcn CLI.",
  installCommand: "shadcn@latest add @intentui/editor",
  links: {
    twitter: "https://x.com/intent/follow?screen_name=intentui",
    github: "https://github.com/intentui",
    discord: "https://discord.gg/DYmVJ66JUD",
    lexical: "https://lexical.dev",
  },
  repo: {
    url: "https://github.com/intentui",
  },
  // Pages that live on the main Intent UI site.
  site: {
    url: "https://intentui.com",
    components: "https://intentui.com/components",
    blocks: "https://intentui.com/blocks",
    showcase: "https://intentui.com/showcase",
    docs: "https://intentui.com/docs/getting-started/introduction",
    design: "https://design.intentui.com",
    themes: "https://design.intentui.com/themes",
  },
  editorThemes: {
    light: "github-light",
    dark: "github-dark",
  },
} as const
