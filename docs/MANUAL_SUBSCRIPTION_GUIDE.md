# Guia de Gestão Manual de Assinaturas (SQL)

Este documento contém os scripts SQL para alterar manualmente o status de assinatura de organizações no Supabase. Útil para testes, concessão de acesso vitalício ou liberação de trials.

> **Nota:** Substitua `'emailteste@gmail.com'` pelo e-mail do usuário que você deseja alterar.

## 1. Conceder Acesso VITALÍCIO
Define o status como `lifetime`. O usuário terá acesso total sem cobrança recorrente.

```sql
UPDATE organizations
SET subscription_status = 'lifetime'
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com';
```

## 2. Conceder Acesso ATIVO (Plano Padrão)
Define o status como `active`. Simula um usuário que pagou a assinatura.

```sql
UPDATE organizations
SET subscription_status = 'active'
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com';
```

## 3. Liberar TRIAL de 3 Dias
Define o status como `trialing` e ajusta a data de término para 3 dias a partir de agora. O usuário verá um contador de dias restantes.

```sql
UPDATE organizations
SET 
  subscription_status = 'trialing',
  trial_ends_at = NOW() + INTERVAL '3 days'
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com';
```
