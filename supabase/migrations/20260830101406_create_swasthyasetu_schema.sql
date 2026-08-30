/*
# SwasthyaSetu — Core Database Schema

## Overview
Creates the persistent data layer for the SwasthyaSetu rural healthcare
continuity app. Replaces the prototype's localStorage + mock-data approach
with real Postgres tables so patient records, consultations, and referrals
survive across devices and reloads.

This is a single-tenant app with NO sign-in screen. The frontend talks to
Supabase with the anon key for its entire lifetime, so every policy lists
`TO anon, authenticated` and the data is intentionally shared across the
facility staff using the app.

## New Tables

1. **patients** — Master patient registry keyed by Swasthya ID.
   - `id` uuid PK
   - `swasthya_id` text, unique — the QR-scannable universal ID
   - `name`, `age`, `gender`, `blood_group`, `phone`, `village`
   - `primary_concern` — current main health concern
   - `risk` — high | moderate | stable
   - `last_visit_facility`, `last_visit` — most recent visit info
   - `active_referral` — text or null
   - `follow_up_due`, `recently_scanned` — booleans
   - `created_at`, `updated_at`

2. **consultations** — Visit records linked to a patient.
   - `id` uuid PK
   - `patient_id` FK → patients (CASCADE)
   - `patient_swasthya_id`, `patient_name` — denormalized for quick display
   - `date` timestamptz, `date_label` text
   - `facility`, `facility_type`
   - `vitals` jsonb — BP, HR, temp, glucose, SpO₂, weight
   - `symptoms` jsonb (array), `notes` text
   - `diagnosis`, `clinical_notes`, `recommended_action`
   - `medications` jsonb (array of {name, dosage, frequency})
   - `risk_level` — stable | moderate | high
   - `created_at`

3. **referrals** — Inter-facility referrals with full medical context.
   - `id` uuid PK
   - `patient_id` FK → patients (CASCADE)
   - `patient_name`, `patient_swasthya_id`, `patient_age`, `patient_gender`, `patient_blood_group`
   - `from_facility`, `to_facility`, `specialty`
   - `priority` — emergency | urgent | routine
   - `reason`, `clinical_notes`, `treatment_provided`, `required_tests`
   - `status` — created | sent | accepted | arrived | consultation | follow-up
   - `stages` jsonb — array of stage objects with facility, worker, action, timestamp, done
   - `medical_context` jsonb — diagnosis, vitals summary, medications, allergies, test reports, doctor notes
   - `created_at`, `created_at_label`

4. **activity_log** — Dashboard recent-activity feed.
   - `id` uuid PK
   - `type` — scan | consultation | referral | lab | registration
   - `title`, `detail`, `time`
   - `created_at`

5. **access_log** — Patient-record access audit trail.
   - `id` uuid PK
   - `action`, `detail`, `time`
   - `type` — access | consent | referral | consultation | emergency
   - `created_at`

## Security
- RLS enabled on ALL tables.
- All policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
  because this is a single-tenant, no-auth app where the data is intentionally
  shared among facility staff using the anon-key frontend.
- No `user_id` columns or `auth.uid()` checks — there is no sign-in flow.

## Notes
1. JSONB columns store complex nested structures (vitals, medications, stages,
   medical context) that the frontend already serializes — this keeps the
   schema lean without needing 10+ join tables for a prototype-to-production
   transition.
2. `updated_at` on patients auto-updates via a trigger.
3. Indexes on `swasthya_id`, `patient_id`, `priority`, and `status` for query speed.
*/

-- ============================================================
-- patients
-- ============================================================

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swasthya_id text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  blood_group text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  village text NOT NULL DEFAULT '',
  primary_concern text NOT NULL DEFAULT '',
  risk text NOT NULL DEFAULT 'stable' CHECK (risk IN ('high', 'moderate', 'stable')),
  last_visit_facility text NOT NULL DEFAULT '',
  last_visit text NOT NULL DEFAULT '',
  active_referral text,
  follow_up_due boolean NOT NULL DEFAULT false,
  recently_scanned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patients" ON patients;
CREATE POLICY "anon_select_patients" ON patients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_patients" ON patients;
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_patients" ON patients;
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_patients" ON patients;
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- consultations
-- ============================================================

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  patient_swasthya_id text NOT NULL DEFAULT '',
  patient_name text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  date_label text NOT NULL DEFAULT '',
  facility text NOT NULL DEFAULT '',
  facility_type text NOT NULL DEFAULT '',
  vitals jsonb NOT NULL DEFAULT '{}'::jsonb,
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text NOT NULL DEFAULT '',
  diagnosis text NOT NULL DEFAULT '',
  clinical_notes text NOT NULL DEFAULT '',
  recommended_action text NOT NULL DEFAULT '',
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  risk_level text NOT NULL DEFAULT 'stable' CHECK (risk_level IN ('stable', 'moderate', 'high')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_consultations" ON consultations;
CREATE POLICY "anon_select_consultations" ON consultations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_consultations" ON consultations;
CREATE POLICY "anon_insert_consultations" ON consultations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_consultations" ON consultations;
CREATE POLICY "anon_update_consultations" ON consultations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_consultations" ON consultations;
CREATE POLICY "anon_delete_consultations" ON consultations FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- referrals
-- ============================================================

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  patient_name text NOT NULL DEFAULT '',
  patient_swasthya_id text NOT NULL DEFAULT '',
  patient_age integer,
  patient_gender text,
  patient_blood_group text,
  from_facility text NOT NULL DEFAULT '',
  to_facility text NOT NULL DEFAULT '',
  specialty text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'routine' CHECK (priority IN ('emergency', 'urgent', 'routine')),
  reason text NOT NULL DEFAULT '',
  clinical_notes text NOT NULL DEFAULT '',
  treatment_provided text NOT NULL DEFAULT '',
  required_tests text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'sent', 'accepted', 'arrived', 'consultation', 'follow-up')),
  stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  medical_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_at_label text NOT NULL DEFAULT ''
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_referrals" ON referrals;
CREATE POLICY "anon_select_referrals" ON referrals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_referrals" ON referrals;
CREATE POLICY "anon_insert_referrals" ON referrals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_referrals" ON referrals;
CREATE POLICY "anon_update_referrals" ON referrals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_referrals" ON referrals;
CREATE POLICY "anon_delete_referrals" ON referrals FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- activity_log
-- ============================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('scan', 'consultation', 'referral', 'lab', 'registration')),
  title text NOT NULL,
  detail text NOT NULL DEFAULT '',
  time text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_activity_log" ON activity_log;
CREATE POLICY "anon_select_activity_log" ON activity_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_activity_log" ON activity_log;
CREATE POLICY "anon_insert_activity_log" ON activity_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_activity_log" ON activity_log;
CREATE POLICY "anon_update_activity_log" ON activity_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_activity_log" ON activity_log;
CREATE POLICY "anon_delete_activity_log" ON activity_log FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- access_log
-- ============================================================

CREATE TABLE IF NOT EXISTS access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  detail text NOT NULL DEFAULT '',
  time text NOT NULL DEFAULT '',
  type text NOT NULL CHECK (type IN ('access', 'consent', 'referral', 'consultation', 'emergency')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_access_log" ON access_log;
CREATE POLICY "anon_select_access_log" ON access_log FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_access_log" ON access_log;
CREATE POLICY "anon_insert_access_log" ON access_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_access_log" ON access_log;
CREATE POLICY "anon_update_access_log" ON access_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_access_log" ON access_log;
CREATE POLICY "anon_delete_access_log" ON access_log FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_patients_swasthya_id ON patients (swasthya_id);
CREATE INDEX IF NOT EXISTS idx_patients_risk ON patients (risk);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations (patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_swasthya_id ON consultations (patient_swasthya_id);
CREATE INDEX IF NOT EXISTS idx_referrals_patient_id ON referrals (patient_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals (status);
CREATE INDEX IF NOT EXISTS idx_referrals_priority ON referrals (priority);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_log_created_at ON access_log (created_at DESC);

-- ============================================================
-- updated_at trigger for patients
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_patients_updated_at ON patients;
CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();