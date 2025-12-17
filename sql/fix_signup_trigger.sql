-- Script para corrigir a criação de novos usuários (Garantir Trial Grátis)
-- Rode este script no Editor SQL do Supabase

-- 1. Atualizar ou Criar a função que lida com novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  org_id uuid;
BEGIN
  -- Cria uma organização para o usuário com status TRIALING (Teste Grátis)
  INSERT INTO public.organizations (name, subscription_status, trial_ends_at)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'company_name', 'Minha Oficina'),
    'trialing',
    NOW() + INTERVAL '3 days'
  )
  RETURNING id INTO org_id;

  -- Cria o perfil do usuário vinculado à organização
  INSERT INTO public.profiles (id, organization_id, full_name, role)
  VALUES (
    new.id,
    org_id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    'owner'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Garantir que o trigger esteja ativo (caso não esteja)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. (Opcional) Corrigir usuários criados recentemente que ficaram travados
UPDATE organizations
SET subscription_status = 'trialing', trial_ends_at = NOW() + INTERVAL '3 days'
WHERE subscription_status = 'inactive' OR subscription_status IS NULL;
