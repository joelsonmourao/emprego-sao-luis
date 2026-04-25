-- Limpeza pontual de dados existentes.
--
-- Como rodar:
-- 1. Neon SQL Editor: cole este arquivo e execute no banco production.
-- 2. psql: psql "$DATABASE_URL" -f scripts/fix-data.sql
--
-- Observacao: o schema Prisma atual usa jobs.stateId e nao possui jobs.state/area.
-- Por isso os updates pedidos ficam protegidos por checagem de coluna. Se o banco
-- production ainda tiver colunas legadas state/area, elas serao corrigidas.

CREATE TEMP TABLE IF NOT EXISTS fix_data_checks (
  check_name text,
  result text
) ON COMMIT DROP;

TRUNCATE fix_data_checks;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'state'
  ) THEN
    EXECUTE 'UPDATE jobs SET state = NULL WHERE state = ''BR''';
    EXECUTE 'INSERT INTO fix_data_checks SELECT ''jobs.state = BR restantes'', count(*)::text FROM jobs WHERE state = ''BR''';
  ELSE
    INSERT INTO fix_data_checks VALUES ('jobs.state = BR restantes', 'coluna ausente');
  END IF;
END $$;

SELECT * FROM fix_data_checks WHERE check_name = 'jobs.state = BR restantes';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'state'
  ) THEN
    EXECUTE 'UPDATE jobs SET state = NULL WHERE state = ''Brasil''';
    EXECUTE 'INSERT INTO fix_data_checks SELECT ''jobs.state = Brasil restantes'', count(*)::text FROM jobs WHERE state = ''Brasil''';
  ELSE
    INSERT INTO fix_data_checks VALUES ('jobs.state = Brasil restantes', 'coluna ausente');
  END IF;
END $$;

SELECT * FROM fix_data_checks WHERE check_name = 'jobs.state = Brasil restantes';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'state'
  ) THEN
    EXECUTE 'UPDATE jobs SET state = NULL WHERE length(state) <> 2';
    EXECUTE 'INSERT INTO fix_data_checks SELECT ''jobs.state com tamanho diferente de 2'', count(*)::text FROM jobs WHERE state IS NOT NULL AND length(state) <> 2';
  ELSE
    INSERT INTO fix_data_checks VALUES ('jobs.state com tamanho diferente de 2', 'coluna ausente');
  END IF;
END $$;

SELECT * FROM fix_data_checks WHERE check_name = 'jobs.state com tamanho diferente de 2';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'area'
  ) THEN
    EXECUTE 'UPDATE jobs SET area = ''Administrativo'' WHERE area ILIKE ''%caxias%'' AND company_name ILIKE ''%randoncorp%''';
    EXECUTE 'INSERT INTO fix_data_checks SELECT ''areas Randoncorp/Caxias restantes'', count(*)::text FROM jobs WHERE area ILIKE ''%caxias%'' AND company_name ILIKE ''%randoncorp%''';
  ELSE
    INSERT INTO fix_data_checks VALUES ('areas Randoncorp/Caxias restantes', 'coluna ausente');
  END IF;
END $$;

SELECT * FROM fix_data_checks WHERE check_name = 'areas Randoncorp/Caxias restantes';
