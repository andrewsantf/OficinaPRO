-- CORREÇÃO DEFINITIVA V4 - A MISSÃO
-- Problemas identificados pelo schema:
-- 1. organizations.id é NOT NULL (precisa gerar UUID)
-- 2. organizations.document é NOT NULL (precisa evitar NULL)
-- 3. profiles tem 'name' e 'full_name' (vamos preencher ambos)

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE
  org_id uuid;
BEGIN
  -- 1. Gerar ID na mão para garantir
  org_id := gen_random_uuid();

  -- 2. Inserir Organização (Blindada contra NULL)
  INSERT INTO public.organizations (
    id,
    name, 
    document, 
    subscription_status, 
    trial_ends_at
  )
  VALUES (
    org_id,
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Oficina'),
    COALESCE(new.raw_user_meta_data->>'doc_number', ''), -- Nunca deixa ser NULL
    'trialing',
    NOW() + INTERVAL '3 days'
  );

  -- 3. Inserir Perfil (Preenchendo tudo que é possível)
  INSERT INTO public.profiles (
    id, 
    organization_id, 
    name, 
    full_name,
    phone, 
    role
  )
  VALUES (
    new.id, 
    org_id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'), 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'owner'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
