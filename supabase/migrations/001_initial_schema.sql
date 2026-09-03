-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('school', 'college', 'NGO', 'municipality', 'CSR', 'community', 'RWA')),
    location TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles (extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'institutional_anchor', 'custodian', 'verifier', 'volunteer')),
    organization_id UUID REFERENCES organizations(id),
    reliability_score INTEGER DEFAULT 75,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Trees
CREATE TABLE trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_code TEXT UNIQUE NOT NULL,
    qr_code TEXT,
    species TEXT NOT NULL,
    nickname TEXT,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    planting_date DATE NOT NULL,
    planting_photo_url TEXT,
    institutional_anchor_id UUID REFERENCES organizations(id) NOT NULL,
    current_status TEXT NOT NULL CHECK (current_status IN ('healthy', 'needs_attention', 'at_risk', 'critical', 'dead', 'orphaned', 'verification_pending')),
    health_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Custody Assignments
CREATE TABLE custody_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    custodian_id UUID REFERENCES profiles(id),
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'expiring', 'handoff_required', 'urgent', 'transferred', 'expired', 'escalated')),
    reliability_at_assignment INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Custody Handoffs
CREATE TABLE custody_handoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    previous_custodian_id UUID REFERENCES profiles(id),
    new_custodian_id UUID REFERENCES profiles(id),
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    status TEXT NOT NULL CHECK (status IN ('initiated', 'candidate_matching', 'pending_acceptance', 'completed', 'rejected', 'escalated')),
    pledge_accepted BOOLEAN DEFAULT FALSE,
    certificate_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Checkpoints
CREATE TABLE checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    checkpoint_type TEXT NOT NULL CHECK (checkpoint_type IN ('planting', '1_month', '6_month', '1_year', '3_year', 'manual')),
    photo_url TEXT NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    submitted_by UUID REFERENCES profiles(id),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    health_status TEXT,
    ai_confidence_score DECIMAL,
    gps_match BOOLEAN,
    timestamp_valid BOOLEAN,
    verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'flagged', 'rejected', 'human_review')),
    ai_analysis JSONB,
    verifier_id UUID REFERENCES profiles(id),
    notes TEXT
);

-- 7. Maintenance Logs
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    custodian_id UUID REFERENCES profiles(id),
    action_type TEXT NOT NULL CHECK (action_type IN ('watered', 'fertilized', 'pruned', 'inspected', 'protected', 'emergency_intervention')),
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Risk Events
CREATE TABLE risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    risk_type TEXT NOT NULL CHECK (risk_type IN ('custody_expiring', 'missed_checkpoint', 'health_decline', 'verification_mismatch', 'orphan_risk', 'no_custodian')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    reason TEXT,
    risk_score INTEGER,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'escalated')) DEFAULT 'active'
);

-- 9. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    type TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('in_app', 'sms_simulated', 'whatsapp_simulated')),
    status TEXT NOT NULL CHECK (status IN ('unread', 'read')) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- 10. Failure Autopsies
CREATE TABLE failure_autopsies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    failure_category TEXT NOT NULL,
    primary_cause TEXT NOT NULL,
    contributing_factors JSONB,
    preventability TEXT,
    lessons TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Row Level Security Setup
-- For the hackathon MVP, we will keep policies simple.

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_handoffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE failure_autopsies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to organizations and trees for simplicity in demo
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read trees" ON trees FOR SELECT USING (true);
CREATE POLICY "Public write trees" ON trees FOR ALL USING (true);

-- Profiles: Users can read all, update their own
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Custody assignments, handoffs, risks, notifications: Public read for demo, authenticated write
CREATE POLICY "Public read custody" ON custody_assignments FOR SELECT USING (true);
CREATE POLICY "Authenticated write custody" ON custody_assignments FOR ALL USING (true);

CREATE POLICY "Public read handoffs" ON custody_handoffs FOR SELECT USING (true);
CREATE POLICY "Authenticated write handoffs" ON custody_handoffs FOR ALL USING (true);

CREATE POLICY "Public read checkpoints" ON checkpoints FOR SELECT USING (true);
CREATE POLICY "Authenticated write checkpoints" ON checkpoints FOR ALL USING (true);

CREATE POLICY "Public read maintenance" ON maintenance_logs FOR SELECT USING (true);
CREATE POLICY "Authenticated write maintenance" ON maintenance_logs FOR ALL USING (true);

CREATE POLICY "Public read risks" ON risk_events FOR SELECT USING (true);
CREATE POLICY "Authenticated write risks" ON risk_events FOR ALL USING (true);

CREATE POLICY "Public read notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can write notifications" ON notifications FOR ALL USING (true);

CREATE POLICY "Public read autopsies" ON failure_autopsies FOR SELECT USING (true);
CREATE POLICY "Authenticated write autopsies" ON failure_autopsies FOR ALL USING (true);

-- Note: In a real app we'd use `auth.uid() IS NOT NULL` instead of `true` for writes, 
-- but we'll use `true` for all operations in the MVP for the demo fallback and ease of hacking.
