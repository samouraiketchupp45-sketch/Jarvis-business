import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#020a18' }}>
      {children}
      <BottomNav />
    </div>
  )
}
