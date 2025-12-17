-- Corrige usuários com status 'incomplete' (travados no meio do cadastro ou erro de pagamento)
-- Passa para 'trialing' para liberar o acesso

UPDATE organizations
SET subscription_status = 'trialing', trial_ends_at = NOW() + INTERVAL '3 days'
WHERE subscription_status = 'incomplete' 
   OR subscription_status = 'inactive' 
   OR subscription_status IS NULL;
