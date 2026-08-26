export type UserRole = 'pastor' | 'lider' | 'ministrador'

export type Profile = {
  id: string
  nome: string
  avatar_url: string | null
  role: UserRole
  telefone: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export type Relatorio = {
  id: string
  autor_id: string
  data_estudo: string
  semana: number
  parte_apostila: string
  anfitriao: string
  ministrador: string
  auxiliares: string | null
  presentes: number
  visitantes: number
  nao_convertidos: number
  religioes: string | null
  conversoes: number
  interessados: string | null
  duracao_ok: boolean
  duracao_motivo: string | null
  membros_ausentes: string | null
  dificuldade: string | null
  necessita_suporte: boolean
  sugestoes: string | null
  criado_em: string
}

export type NovoRelatorio = Omit<Relatorio, 'id' | 'criado_em'>

export type RelatorioSigilo = {
  relatorio_id: string
  texto: string
  criado_em: string
}

export type ConvitePendente = {
  email: string
  role: UserRole
  convidado_por: string
  criado_em: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; nome: string }
        Update: Partial<Profile>
        Relationships: []
      }
      relatorios: {
        Row: Relatorio
        Insert: NovoRelatorio
        Update: Partial<NovoRelatorio>
        Relationships: []
      }
      relatorio_sigilos: {
        Row: RelatorioSigilo
        Insert: Omit<RelatorioSigilo, 'criado_em'>
        Update: Partial<RelatorioSigilo>
        Relationships: []
      }
      convites_pendentes: {
        Row: ConvitePendente
        Insert: Pick<ConvitePendente, 'email'> & Partial<ConvitePendente>
        Update: Partial<ConvitePendente>
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: {
      promover_usuario: {
        Args: { usuario_id: string; novo_papel: UserRole }
        Returns: void
      }
      alterar_status_usuario: {
        Args: { usuario_id: string; novo_ativo: boolean }
        Returns: void
      }
      meu_papel: {
        Args: Record<string, never>
        Returns: UserRole
      }
    }
    Enums: { user_role: UserRole }
    CompositeTypes: Record<never, never>
  }
}
