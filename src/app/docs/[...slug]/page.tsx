import type { Metadata } from "next"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { notFound } from "next/navigation"
import { DocRefs } from "@/components/docs/doc-refs"
import { mdxComponents } from "@/components/docs/mdx-components"
import { OpenIn } from "@/components/docs/open-in"
import { Pager } from "@/components/docs/pager"
import { Toc } from "@/components/docs/toc"
import { app } from "@/config/app"
import { getNeighbours } from "@/lib/docs-nav"
import { source } from "@/lib/source"

interface DocPageProps {
  params: Promise<{ slug: string[] }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: DocPageProps): Promise<Metadata> {
  const { slug } = await props.params
  const page = source.getPage(slug)
  if (!page) return {}

  const { title, description } = page.data
  const url = `${app.url}${page.url}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${title} / ${app.name}`,
      description,
      url,
      siteName: app.name,
    },
    twitter: { card: "summary", title: `${title} / ${app.name}`, description },
  }
}

export default async function Page(props: DocPageProps) {
  const { slug } = await props.params
  const page = source.getPage(slug)
  if (!page) notFound()

  const { title, body: MDX, toc, references } = page.data
  const pageText = await readFile(path.join(process.cwd(), "src/content/docs", page.path), "utf8")

  return (
    <div className="flex w-full items-start">
      {/* Center */}
      <div className="w-full min-w-0 border-page py-8 sm:pb-24 sm:pt-10 xl:border-x">
        <div className="mx-auto xl:max-w-3xl sm:px-6">
          <div className="mb-3 flex flex-col justify-between sm:flex-row gap-6 sm:items-center sm:mb-12">
            <h1 className="flex-1 font-normal text-3xl tracking-tight">{title}</h1>
            <div className="flex items-center gap-x-1.5">
              {references && references.length > 0 && <DocRefs references={references} />}
              <OpenIn page={pageText} url={page.url} />
            </div>
          </div>
          <div className="typeset typeset-docs">
            <MDX components={mdxComponents} />
          </div>

          <Pager {...getNeighbours(page.url)} />
        </div>
      </div>

      {/* Right side */}
      <div className="sticky top-16 hidden flex-1 flex-col xl:flex">
        <Toc items={toc} />
      </div>
    </div>
  )
}
