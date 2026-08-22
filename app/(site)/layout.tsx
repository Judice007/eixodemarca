import ScrollProgress from '@/components/ScrollProgress'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ScrollProgress />
    </>
  )
}
