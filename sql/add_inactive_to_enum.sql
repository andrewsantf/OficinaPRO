-- Script para adicionar o valor 'inactive' ao enum de status
-- Rode este script no Editor SQL do Supabase ANTES de rodar o set_status_expired.sql

ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'inactive';

-- Garantindo também o 'canceled' caso precise no futuro
ALTER TYPE subscription_status ADD VALUE IF NOT EXISTS 'canceled';
