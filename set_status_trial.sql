-- Transforma o usuário em TRIAL (Teste Grátis)
-- Define o status como 'trialing' e dá 3 dias a partir de agora

UPDATE organizations
SET 
  subscription_status = 'trialing',
  trial_ends_at = NOW() + INTERVAL '3 days'
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com';

-- Confirmação
SELECT organizations.name, subscription_status, trial_ends_at
FROM organizations 
JOIN profiles ON profiles.organization_id = organizations.id
JOIN auth.users ON profiles.id = auth.users.id
WHERE auth.users.email = 'emailteste@gmail.com';
