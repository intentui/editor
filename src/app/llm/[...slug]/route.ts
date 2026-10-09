import { readFile } from "node:fs/promises"
import path from "node:path"
import { source } from "@/lib/source"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

/** The raw Markdown of a docs page, served at `/docs/<slug>.md` through a rewrite. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return new Response("Not found", { status: 404 })

  const text = await readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), "src/content/docs", page.path), "utf8")
  return new Response(text, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
