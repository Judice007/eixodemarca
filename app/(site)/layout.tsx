import SiteNav from '@/components/visual/SiteNav'
import BottomNav from '@/components/visual/BottomNav'
import ScrollRail from '@/components/visual/ScrollRail'
import IntroWrapper from '@/components/IntroWrapper'
import SmoothScroll from '@/components/visual/SmoothScroll'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <BottomNav />
      <ScrollRail />
      <IntroWrapper />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  )
}
