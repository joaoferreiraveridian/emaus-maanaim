-- Base: perfis + papéis. Módulos do Emaús entram em migrations seguintes.

create type user_role as enum ('pastor', 'lider', 'ministrador');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text not null,
  avatar_url text,
  role user_role not null default 'ministrador',
  telefone text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "perfis visiveis para autenticados"
  on profiles for select to authenticated using (true);

create policy "usuario edita o proprio perfil"
  on profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

-- Cria o perfil junto com o usuário do auth.
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
