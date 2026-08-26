-- Relatório de estudo na casa (Projeto Emaús).

create table relatorios (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references auth.users on delete cascade,

  -- Identificação
  data_estudo date not null,
  semana int not null,
  parte_apostila text not null,
  anfitriao text not null,
  ministrador text not null,
  auxiliares text,

  -- Presença
  presentes int not null default 0,
  visitantes int not null default 0,
  nao_convertidos int not null default 0,
  religioes text,

  -- Resultado
  conversoes int not null default 0,
  interessados text,

  -- Execução (esperado: 1h10)
  duracao_ok boolean not null default true,
  duracao_motivo text,

  -- Alertas
  membros_ausentes text,
  dificuldade text,
  necessita_suporte boolean not null default false,

  sugestoes text,
  criado_em timestamptz not null default now()
);

create index relatorios_data_idx on relatorios (data_estudo desc);
create index relatorios_autor_idx on relatorios (autor_id);

-- Sigilo para o pastor. Tabela separada de propósito: RLS filtra linha, não coluna —
-- se o texto morasse em relatorios, o líder veria o sigilo junto com o relatório.
create table relatorio_sigilos (
  relatorio_id uuid primary key references relatorios on delete cascade,
  texto text not null,
  criado_em timestamptz not null default now()
);

alter table relatorios enable row level security;
alter table relatorio_sigilos enable row level security;

create function meu_papel() returns user_role
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

-- Relatórios: liderança vê todos, ministrador vê os seus.
create policy "leitura de relatorios"
  on relatorios for select to authenticated
  using (autor_id = auth.uid() or meu_papel() in ('pastor', 'lider'));

create policy "ministrador cria o proprio relatorio"
  on relatorios for insert to authenticated
  with check (autor_id = auth.uid());

create policy "autor edita o proprio relatorio"
  on relatorios for update to authenticated
  using (autor_id = auth.uid()) with check (autor_id = auth.uid());

-- Sigilos: só o pastor lê. O autor escreve, mas não relê depois de enviar.
create policy "somente pastor le sigilos"
  on relatorio_sigilos for select to authenticated
  using (meu_papel() = 'pastor');

create policy "autor do relatorio escreve sigilo"
  on relatorio_sigilos for insert to authenticated
  with check (
    exists (select 1 from relatorios r where r.id = relatorio_id and r.autor_id = auth.uid())
  );
