-- SCRIPT DE LIMPEZA BRUTA V2 (Adicionado Mechanics)
-- Substitua '00000000000' pelo CPF/CNPJ.

DELETE FROM service_orders WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');
DELETE FROM vehicles WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');
DELETE FROM customers WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');
DELETE FROM mechanics WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');
DELETE FROM profiles WHERE organization_id IN (SELECT id FROM organizations WHERE document = '00000000000');
DELETE FROM organizations WHERE document = '00000000000';
