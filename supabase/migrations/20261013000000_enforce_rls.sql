-- ==============================================================================
-- OPTIMUS DRP PLATFORM - ROW LEVEL SECURITY (RLS) HARDENING
-- Protects Supabase public schema tables from unauthorized PostgREST Data API exposure.
-- Application server-side routes query PostgreSQL via Prisma (postgres role),
-- which bypasses RLS, ensuring zero performance penalty or route breakage.
-- ==============================================================================

-- 1. Enable Row Level Security on all application entity tables
ALTER TABLE IF EXISTS "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "BrandAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "BrandSimilarityResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Analysis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "DetectionSignal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Incident" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "InvestigationNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "ThreatIntelResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "AuditEvent" ENABLE ROW LEVEL SECURITY;

-- 2. Revoke unrestricted anonymous access from PostgREST Data API
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- 3. Explicitly deny anonymous access (defense-in-depth)
DO $$
DECLARE
  t text;
  table_list text[] := ARRAY[
    'Organization',
    'User',
    'BrandAsset',
    'BrandSimilarityResult',
    'Analysis',
    'DetectionSignal',
    'Incident',
    'InvestigationNote',
    'ThreatIntelResult',
    'AuditEvent'
  ];
BEGIN
  FOREACH t IN ARRAY table_list LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Deny anon access" ON %I;', t);
    EXECUTE format('CREATE POLICY "Deny anon access" ON %I FOR ALL TO anon USING (false);', t);
  END LOOP;
END $$;
