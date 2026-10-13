import { Footer } from "@/components/docs/footer"
import { HeroActions } from "@/components/docs/hero-actions"
import { DemoEditor } from "@/components/editor/editor"
import { PageContainer } from "@/components/page-container"
import { SiteHeader } from "@/components/site-header"
import { app } from "@/config/app"

export default function Page() {
  return (
    <div>
      <SiteHeader />
      <PageContainer>
        <div className="border-page xl:border-x">
          <div className="px-0 pt-16 pb-24 sm:px-6 sm:pt-24 xl:px-20">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance font-medium text-4xl tracking-tight sm:text-5xl">
                A rich text editor for your React app
              </h1>
              <p className="mt-5 text-pretty text-base/7 text-muted-foreground sm:text-lg/8">
                {app.description}
              </p>
              <HeroActions />
            </div>
            <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
              <DemoEditor />
            </div>
          </div>
          <Footer />
        </div>
      </PageContainer>
    </div>
  )
}
