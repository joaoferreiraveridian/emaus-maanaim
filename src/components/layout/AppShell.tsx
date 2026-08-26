import { Outlet } from 'react-router-dom'
import { BottomNav } from '@/components/ui/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuthStore } from '@/stores/authStore'

/**
 * Um só shell para os dois mundos.
 * < lg  → moldura de celular centralizada (idêntica ao que já existia).
 * ≥ lg  → sidebar fixa + área de conteúdo ocupando a tela inteira.
 * As páginas são as mesmas nos dois casos — só o enquadramento muda.
 */
export function AppShell() {
  const profile = useAuthStore((s) => s.profile)

  return (
    <div
      className="min-h-dvh w-full flex justify-center lg:justify-start"
      style={{ background: '#1B2634' }}
    >
      {profile && <Sidebar />}

      <div
        className="relative w-full flex flex-col bg-bg-base max-w-[440px] lg:max-w-none shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] lg:shadow-none"
        style={{ minHeight: '100dvh' }}
      >
        <main className="flex-1 px-5 pb-28 lg:px-12 lg:pb-16">
          <div className="w-full mx-auto lg:max-w-[1080px]">
            <Outlet />
          </div>
        </main>

        {profile && <BottomNav />}
      </div>
    </div>
  )
}
