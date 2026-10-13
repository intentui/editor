import { Aside } from "@/components/docs/aside";
import { Footer } from "@/components/docs/footer";
import { PageContainer } from "@/components/page-container";
import { SiteHeader } from "@/components/site-header";
import { getSidebarSections } from "@/lib/docs-nav";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <SiteHeader />
      <PageContainer>
        <div className="relative flex w-full flex-auto justify-center border-page xl:border-x">
          <div className="hidden lg:relative lg:block lg:flex-none">
            <Aside sections={getSidebarSections()} />
          </div>
          <div className="w-full min-w-0">
            {children}
            <Footer />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
