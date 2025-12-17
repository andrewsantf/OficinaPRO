# Guia de Gestão Manual de Assinaturas (SQL)

Este documento contém os scripts SQL para alterar manualmente o status de assinatura de organizações no Supabase. Útil para testes, concessão de acesso vitalício, bloqueio ou liberação de trials.

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

## 3. Liberar TRIAL de 3 Dias (Desbloquear)
Define o status como `trialing` e ajusta a data de término para 3 dias a partir de agora. 
**Use este comando para desbloquear usuários travados ou renovar o teste.**

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

## 4. BLOQUEAR Usuário (Expirar Teste)
Simula um usuário com o período de teste expirado. O sistema vai redirecionar para a tela de bloqueio pedindo assinatura.

```sql
-- Primeiro verifique se o status 'inactive' existe no enum (rode uma única vez):
-- ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'inactive';

UPDATE organizations
SET 
  subscription_status = 'inactive',
  trial_ends_at = NOW() - INTERVAL '1 day' -- Define fim para ontem
FROM profiles, auth.users
WHERE organizations.id = profiles.organization_id
AND profiles.id = auth.users.id
AND auth.users.email = 'emailteste@gmail.com';
```

## 5. Destravar Status 'Incomplete'
Caso o usuário fique travado com status `incomplete` (erro no cadastro), use este comando para forçar o trial:

```sql
UPDATE organizations
SET subscription_status = 'trialing', trial_ends_at = NOW() + INTERVAL '3 days'
WHERE subscription_status = 'incomplete';
```
