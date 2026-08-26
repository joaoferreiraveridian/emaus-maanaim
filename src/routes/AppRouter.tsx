import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DefinirSenhaPage } from '@/pages/auth/DefinirSenhaPage'
import { UnauthorizedPage } from '@/pages/UnauthorizedPage'
import { RelatoriosPage } from '@/pages/relatorios/RelatoriosPage'
import { NovoRelatorioPage } from '@/pages/relatorios/NovoRelatorioPage'
import { RelatorioDetalhePage } from '@/pages/relatorios/RelatorioDetalhePage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { UsuariosPage } from '@/pages/usuarios/UsuariosPage'
import { ROLES_GESTAO } from '@/lib/constants'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/definir-senha" element={<DefinirSenhaPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<RelatoriosPage />} />
            <Route path="/relatorios/novo" element={<NovoRelatorioPage />} />
            <Route path="/relatorios/:id" element={<RelatorioDetalhePage />} />
            <Route path="/perfil" element={<ProfilePage />} />

            <Route element={<ProtectedRoute roles={ROLES_GESTAO} />}>
              <Route path="/usuarios" element={<UsuariosPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
