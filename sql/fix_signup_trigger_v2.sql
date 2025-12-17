-- CORREÇÃO: Coluna 'name' em vez de 'full_name' na tabela profiles
-- Rode este script no Editor SQL do Supabase

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE
  org_id uuid;
BEGIN
  -- 1. Cria a ORGANIZAÇÃO
  INSERT INTO public.organizations (name, subscription_status, trial_ends_at)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Oficina'),
    'trialing',
    NOW() + INTERVAL '3 days'
  )
  RETURNING id INTO org_id;

  -- 2. Cria o PERFIL (Atenção: coluna é 'name', não 'full_name')
  INSERT INTO public.profiles (id, organization_id, name, role)
  VALUES (
    new.id, 
    org_id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'), 
    'owner'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
