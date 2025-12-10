-- Função que roda automaticamente quando alguém cria conta
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- 1. Cria uma organização (Oficina) para o usuário
  insert into public.organizations (name, document)
  values (COALESCE(new.raw_user_meta_data->>'name', new.email) || ' Oficina', 'COMPLETAR_CNPJ_' || md5(random()::text))
  returning id into new_org_id;

  -- 2. Cria o perfil do usuário vinculado à oficina
  insert into public.profiles (id, organization_id, full_name, role)
  values (new.id, new_org_id, new.raw_user_meta_data->>'name', 'owner');

  return new;
end;
$$;

-- Trigger (Gatilho)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
