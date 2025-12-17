-- CORREÇÃO DEFINITIVA DO TRIGGER (V3)
-- Adiciona inserção de 'document' e 'phone', que provavelmente são obrigatórios.
-- Rode este script no Editor SQL.

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE
  org_id uuid;
BEGIN
  -- 1. Cria a organizacao (INSERINDO O DOCUMENTO)
  INSERT INTO public.organizations (
    name, 
    document, 
    subscription_status, 
    trial_ends_at
  )
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Oficina'),
    new.raw_user_meta_data->>'doc_number', -- Campo Documento (CPF/CNPJ)
    'trialing',
    NOW() + INTERVAL '3 days'
  )
  RETURNING id INTO org_id;

  -- 2. Cria o perfil (INSERINDO NOME E TELEFONE CORRETOS)
  INSERT INTO public.profiles (
    id, 
    organization_id, 
    name, 
    phone, 
    role
  )
  VALUES (
    new.id, 
    org_id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'), 
    new.raw_user_meta_data->>'phone', -- Campo Telefone
    'owner'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
