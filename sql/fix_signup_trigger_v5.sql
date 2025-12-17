-- CORREÇÃO TRIGGER DEBUG V5
-- Adiciona logs de erro EXPLÍCITOS para sabermos onde está falhando.

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
DECLARE
  org_id uuid;
BEGIN
  org_id := gen_random_uuid();
  
  -- Bloco para capturar erro na Organização
  BEGIN
    INSERT INTO public.organizations (id, name, document, subscription_status, trial_ends_at)
    VALUES (
      org_id,
      COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Oficina'),
      COALESCE(new.raw_user_meta_data->>'doc_number', 'DOC-' || substr(md5(random()::text), 1, 8)),
      'trialing',
      NOW() + INTERVAL '3 days'
    );
  EXCEPTION 
    WHEN unique_violation THEN
      RAISE EXCEPTION 'ERRO: Este Documento (CPF/CNPJ) já está cadastrado no sistema.';
    WHEN not_null_violation THEN
      RAISE EXCEPTION 'ERRO: Campo obrigatório faltando (Documento ou Nome) na Organização.';
    WHEN OTHERS THEN
      RAISE EXCEPTION 'ERRO AO CRIAR ORGANIZAÇÃO: %', SQLERRM;
  END;

  -- Bloco para capturar erro no Perfil
  BEGIN
    INSERT INTO public.profiles (id, organization_id, name, full_name, phone, role)
    VALUES (
      new.id, 
      org_id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'), 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
      COALESCE(new.raw_user_meta_data->>'phone', ''),
      'owner'
    );
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE EXCEPTION 'ERRO AO CRIAR PERFIL: %', SQLERRM;
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
