-- Script para inspecionar as colunas das tabelas organizations e profiles
-- Rode este script e me mande o resultado (em JSON ou CSV se possível)

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('organizations', 'profiles')
ORDER BY table_name, ordinal_position;
