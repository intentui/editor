import Link from "next/link"
import { PageContainer } from "@/components/page-container"
import { SiteHeader } from "@/components/site-header"

export default function NotFound() {
  return (
    <div>
      <SiteHeader />
      <PageContainer>
        <div className="border-page xl:border-x">
          <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
            <p className="font-mono text-muted-foreground text-sm">404</p>
            <h1 className="mt-3 font-medium text-3xl tracking-tight">Page not found</h1>
            <p className="mt-3 text-muted-foreground">The page you are looking for does not exist or has moved.</p>
            <Link
              href="/docs/getting-started/introduction"
              className="mt-8 rounded-lg border px-4 py-2 font-medium text-sm hover:bg-secondary/60"
            >
              Go to the docs
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
