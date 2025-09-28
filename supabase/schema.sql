-- Water & Nature Pool Management System - Database Schema
-- Complete schema for Hebrew RTL pool and garden maintenance management

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Users and Authentication (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  pool_type TEXT,
  pool_size TEXT,
  garden_size TEXT,
  special_instructions TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties/Pools
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  pool_type TEXT,
  pool_size TEXT,
  garden_size TEXT,
  equipment_details JSONB DEFAULT '{}',
  special_notes TEXT,
  coordinates POINT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Plans (reference data)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name_he TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  period TEXT NOT NULL CHECK (period IN ('month', 'year')),
  visits_per_period INTEGER,
  services TEXT[] DEFAULT '{}', -- ['pool', 'garden', 'house', 'car']
  features JSONB DEFAULT '{}',
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  price DECIMAL(10,2) NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  payment_method_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES profiles(id),
  subscription_id UUID REFERENCES subscriptions(id),
  service_type TEXT NOT NULL, -- 'maintenance', 'diagnosis', 'emergency', 'installation'
  services TEXT[] DEFAULT '{}', -- ['pool', 'garden']
  scheduled_date TIMESTAMPTZ NOT NULL,
  estimated_duration INTERVAL DEFAULT '2 hours',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
  notes TEXT,
  customer_notes TEXT,
  technician_notes TEXT,
  before_photos TEXT[] DEFAULT '{}',
  after_photos TEXT[] DEFAULT '{}',
  work_performed TEXT,
  next_visit_date DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests (from website forms)
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  request_type TEXT NOT NULL, -- 'diagnosis', 'emergency', 'maintenance', 'consultation', 'quote'
  service_category TEXT NOT NULL, -- 'pool', 'garden', 'both'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'emergency')),
  preferred_date DATE,
  preferred_time TIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'assigned', 'in_progress', 'completed', 'cancelled')),
  assigned_technician UUID REFERENCES profiles(id),
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  response_notes TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices and Payments
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  appointment_id UUID REFERENCES appointments(id),
  service_request_id UUID REFERENCES service_requests(id),
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  line_items JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Reports
CREATE TABLE IF NOT EXISTS work_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  work_description TEXT NOT NULL,
  chemicals_used JSONB DEFAULT '{}',
  equipment_checked JSONB DEFAULT '{}',
  issues_found TEXT,
  recommendations TEXT,
  photos_before TEXT[] DEFAULT '{}',
  photos_after TEXT[] DEFAULT '{}',
  work_duration INTERVAL,
  customer_present BOOLEAN DEFAULT false,
  customer_signature TEXT,
  customer_feedback TEXT,
  weather_conditions TEXT,
  next_visit_recommendations TEXT,
  report_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment and Inventory
CREATE TABLE IF NOT EXISTS equipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_he TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL, -- 'chemical', 'tool', 'part', 'accessory'
  subcategory TEXT,
  sku TEXT UNIQUE,
  description TEXT,
  unit_price DECIMAL(10,2),
  currency TEXT DEFAULT 'ILS',
  stock_quantity INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  supplier TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment Usage Tracking
CREATE TABLE IF NOT EXISTS equipment_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_report_id UUID REFERENCES work_reports(id) ON DELETE CASCADE,
  equipment_item_id UUID REFERENCES equipment_items(id),
  quantity_used DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'appointment', 'payment', 'emergency', 'system', 'promotion'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- File Storage
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  original_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT, -- 'pool_photos', 'garden_photos', 'invoices', 'reports', 'profile_images'
  related_table TEXT,
  related_id UUID,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Reviews and Ratings
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  value_for_money INTEGER CHECK (value_for_money >= 1 AND value_for_money <= 5),
  would_recommend BOOLEAN,
  is_public BOOLEAN DEFAULT true,
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Subscription Plans
INSERT INTO subscription_plans (id, name_he, name_en, price, period, visits_per_period, services, features, popular) VALUES
('basic', 'מנוי בסיסי', 'Basic Plan', 600, 'month', 2, '["pool"]', '["2 ביקורים בחודש", "תחזוקה בסיסית", "בדיקת כימיקלים", "ניקוי פילטרים"]', false),
('monthly', 'מנוי חודשי', 'Monthly Plan', 1000, 'month', 4, '["pool"]', '["4 ביקורים בחודש", "תחזוקה מלאה", "כימיקלים כלולים", "ניקוי עמוק", "תמיכה טלפונית"]', false),
('yearly', 'מנוי שנתי', 'Yearly Plan', 9000, 'year', 48, '["pool"]', '["תחזוקה שנתית מלאה", "כל הכימיקלים כלולים", "שירות חירום 24/7", "הנחה של 25%", "דוח תחזוקה חודשי"]', true),
('vip', 'מנוי VIP', 'VIP Plan', 15000, 'year', 52, '["pool", "house", "car"]', '["תחזוקה שבועית", "כל הכימיקלים", "ריסוס בית", "שטיפת רכב (פעם בשבוע)", "שירות VIP 24/7", "אחריות מלאה"]', false),
('premium-complete', 'מנוי פרימיום מושלם', 'Premium Complete', 2500, 'month', 4, '["pool", "garden"]', '["תחזוקת בריכה מלאה שבועית", "תחזוקת גינה מקצועית שבועית", "כל הכימיקלים והדשנים", "כל הציוד והאביזרים", "החלפת צמחים עונתית", "אחריות מלאה על הציוד", "שירות חירום 24/7", "יועץ אישי מוקצה"]', false)
ON CONFLICT (id) DO NOTHING;

-- Insert Sample Equipment Items
INSERT INTO equipment_items (name_he, name_en, category, sku, unit_price, stock_quantity, minimum_stock) VALUES
('כלור גרנולרי 5 ק״ג', 'Granular Chlorine 5kg', 'chemical', 'CHEM-001', 89.00, 50, 10),
('כלור טבליות איטיות 200 גר׳', 'Slow Chlorine Tablets 200g', 'chemical', 'CHEM-002', 156.00, 30, 5),
('מוריד pH - 1.5 ק״ג', 'pH Minus 1.5kg', 'chemical', 'CHEM-003', 45.00, 25, 5),
('מעלה pH - 1.5 ק״ג', 'pH Plus 1.5kg', 'chemical', 'CHEM-004', 45.00, 25, 5),
('אלגיסייד נגד אצות - 1 ליטר', 'Algicide 1L', 'chemical', 'CHEM-005', 78.00, 20, 3),
('מברשת דפנות אלומיניום', 'Aluminum Wall Brush', 'tool', 'TOOL-001', 120.00, 15, 3),
('רשת לעלים עם מוט 3 מטר', 'Leaf Net with 3m Pole', 'tool', 'TOOL-002', 95.00, 10, 2),
('שואב בריכה ידני', 'Manual Pool Vacuum', 'tool', 'TOOL-003', 180.00, 8, 2),
('ערכת בדיקה pH וכלור', 'pH and Chlorine Test Kit', 'tool', 'TOOL-004', 65.00, 20, 5),
('פילטרים לסנן חול', 'Sand Filter Elements', 'part', 'PART-001', 340.00, 12, 2)
ON CONFLICT (sku) DO NOTHING;

-- Insert System Settings
INSERT INTO system_settings (key, value, description, category) VALUES
('business_info', '{
  "name": "מים וטבע",
  "name_en": "Water & Nature", 
  "tagline": "שירותי בריכות, גינון ונקיון מקצועי",
  "phone": "052-123-4567",
  "email": "info@water-nature.co.il",
  "address": "רחוב הבריכות 123, תל אביב",
  "website": "https://water-nature.co.il"
}', 'Business information and contact details', 'business'),
('scheduling', '{
  "work_hours_start": "07:00",
  "work_hours_end": "18:00",
  "work_days": ["sunday", "monday", "tuesday", "wednesday", "thursday"],
  "appointment_duration_default": 120,
  "emergency_surcharge": 1.5,
  "advance_booking_days": 14
}', 'Scheduling and appointment settings', 'operations'),
('notifications', '{
  "reminder_hours": [24, 2],
  "sms_enabled": true,
  "email_enabled": true,
  "whatsapp_enabled": true,
  "emergency_contacts": ["052-123-4567"]
}', 'Notification preferences and settings', 'communications')
ON CONFLICT (key) DO NOTHING;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_technician ON appointments(technician_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_files_related ON files(related_table, related_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can view their own properties
CREATE POLICY "Users can view own properties" ON properties FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can update own properties" ON properties FOR UPDATE USING (auth.uid() = owner_id);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Users can view their appointments (as customer or technician)
CREATE POLICY "Users can view related appointments" ON appointments FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = technician_id);

-- Users can create service requests
CREATE POLICY "Users can create service requests" ON service_requests FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own service requests" ON service_requests FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans are publicly readable
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscription plans are publicly readable" ON subscription_plans FOR SELECT USING (active = true);

-- Equipment items are publicly readable
ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Equipment items are publicly readable" ON equipment_items FOR SELECT USING (active = true);

-- System settings are publicly readable (for business info, etc.)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public system settings are readable" ON system_settings FOR SELECT USING (category IN ('business', 'public'));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_items_updated_at BEFORE UPDATE ON equipment_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT;
    sequence_num INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM NOW())::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || current_year || '-%';
    
    RETURN 'INV-' || current_year || '-' || LPAD(sequence_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Auto-generate invoice numbers
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION set_invoice_number();