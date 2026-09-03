-- 002_seed_demo_data.sql

-- Clear existing data if necessary (order matters due to foreign keys)
-- DELETE FROM trees;
-- DELETE FROM profiles;
-- DELETE FROM organizations;

-- 1. Insert Demo Organizations
INSERT INTO organizations (id, name, type, location, contact_email) VALUES
('b39c0f80-60b6-4df0-b2cc-375d0b9821a1', 'Green Roots Foundation', 'NGO', 'Bengaluru, India', 'contact@greenroots.demo'),
('a7d89020-f4ca-43bc-9106-9bd94291c78e', 'Greenfield College', 'college', 'Campus Zone A', 'admin@greenfield.demo');

-- Note: We can't insert into `profiles` directly without corresponding `auth.users` records.
-- In a real Supabase instance, you must create the users via the Auth API first.
-- For the demo seed, we will create dummy auth.users if we are in local development, 
-- or we can assume the profiles will be created when demo users sign in. 
-- For this SQL, we'll skip inserting into profiles unless we do it dynamically, 
-- but let's insert trees using the Greenfield College as the institutional anchor.

-- Insert Trees
INSERT INTO trees (id, tree_code, species, nickname, latitude, longitude, planting_date, institutional_anchor_id, current_status, health_score) VALUES
('11111111-1111-1111-1111-111111111111', 'TG-IND-001', 'Neem', 'Campus Guardian', 12.971598, 77.594562, '2024-06-01', 'a7d89020-f4ca-43bc-9106-9bd94291c78e', 'healthy', 95),
('22222222-2222-2222-2222-222222222222', 'TG-IND-002', 'Banyan', 'Heritage Tree', 12.972000, 77.595000, '2023-01-15', 'a7d89020-f4ca-43bc-9106-9bd94291c78e', 'healthy', 90),
('33333333-3333-3333-3333-333333333333', 'TG-IND-003', 'Peepal', 'Wisdom Tree', 12.971000, 77.594000, '2024-05-10', 'a7d89020-f4ca-43bc-9106-9bd94291c78e', 'at_risk', 45);

-- Insert Risks
INSERT INTO risk_events (tree_id, risk_type, severity, reason, risk_score) VALUES
('33333333-3333-3333-3333-333333333333', 'custody_expiring', 'high', 'Custodian graduating in 14 days', 85);
