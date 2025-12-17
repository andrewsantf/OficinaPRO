-- Script simplificado para liberar CPF travado
-- Rode uma linha por vez ou tudo junto.
-- Substitua '00000000000' pelo CPF/CNPJ real.

-- 1. Remove perfis vinculados (para evitar erro)
DELETE FROM profiles 
WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');

-- 2. Remove a organização trava (libera o CPF)
DELETE FROM organizations 
WHERE document = '00000000000';
