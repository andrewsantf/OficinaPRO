-- Simula um usuário com o PERÍODO DE TESTE EXPIRADO (Bloqueado)
-- Define o status como 'inactive' e coloca o fim do trial para ontem

UPDATE organizations
SET 
  subscription_status = 'inactive',
  trial_ends_at = NOW() - INTERVAL '1 day'
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com'; -- SUBSTITUA PELO SEU EMAIL DE TESTE

-- Confirmação
SELECT organizations.name, subscription_status, trial_ends_at
FROM organizations 
JOIN profiles ON profiles.organization_id = organizations.id
JOIN auth.users ON profiles.id = auth.users.id
WHERE auth.users.email = 'emailteste@gmail.com';
