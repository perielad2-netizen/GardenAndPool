// Supabase Configuration for Water & Nature Pool Management System
import { createClient } from '@supabase/supabase-js'

// Types for our database schema
export interface Profile {
  id: string
  full_name: string
  phone?: string
  address?: string
  pool_type?: string
  pool_size?: string
  garden_size?: string
  special_instructions?: string
  role: 'customer' | 'technician' | 'admin'
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  owner_id: string
  name: string
  address: string
  pool_type?: string
  pool_size?: string
  garden_size?: string
  equipment_details?: Record<string, any>
  special_notes?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name_he: string
  name_en: string
  price: number
  currency: string
  period: 'month' | 'year'
  visits_per_period?: number
  services: string[]
  features: Record<string, any>
  popular: boolean
  active: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  property_id: string
  plan_id: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  start_date: string
  end_date?: string
  next_billing_date?: string
  price: number
  auto_renew: boolean
  payment_method_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  property_id: string
  customer_id: string
  technician_id?: string
  subscription_id?: string
  service_type: 'maintenance' | 'diagnosis' | 'emergency' | 'installation'
  services: string[]
  scheduled_date: string
  estimated_duration?: string
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  priority: 'low' | 'normal' | 'high' | 'emergency'
  notes?: string
  customer_notes?: string
  technician_notes?: string
  before_photos?: string[]
  after_photos?: string[]
  work_performed?: string
  next_visit_date?: string
  rating?: number
  review?: string
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  id: string
  user_id?: string
  property_id?: string
  request_type: 'diagnosis' | 'emergency' | 'maintenance' | 'consultation' | 'quote'
  service_category: 'pool' | 'garden' | 'both'
  title: string
  description: string
  photos?: string[]
  priority: 'low' | 'normal' | 'high' | 'emergency'
  preferred_date?: string
  preferred_time?: string
  status: 'pending' | 'reviewed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assigned_technician?: string
  estimated_cost?: number
  actual_cost?: number
  response_notes?: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
  contact_address?: string
  created_at: string
  updated_at: string
}

export interface EquipmentItem {
  id: string
  name_he: string
  name_en?: string
  category: 'chemical' | 'tool' | 'part' | 'accessory'
  subcategory?: string
  sku?: string
  description?: string
  unit_price?: number
  currency: string
  stock_quantity: number
  minimum_stock: number
  supplier?: string
  active: boolean
  created_at: string
  updated_at: string
}

// Supabase client configuration for Cloudflare Workers
// Note: In Cloudflare Workers, environment variables come from the context
let supabaseClient: any = null;

export function createSupabaseClient(env?: any) {
  const supabaseUrl = env?.SUPABASE_URL || 'https://your-project.supabase.co';
  const supabaseAnonKey = env?.SUPABASE_ANON_KEY || 'your-anon-key';
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Disable session persistence in Workers environment
      detectSessionInUrl: false
    }
  });
}

// Create default client for development
export const supabase = createSupabaseClient();

// Authentication service for Supabase Auth
export class AuthService {
  private supabase: any;
  
  constructor(env?: any) {
    this.supabase = createSupabaseClient(env);
  }

  async signUp(email: string, password: string, userData: {firstName: string, lastName: string, phone: string}) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
            phone: userData.phone,
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // If user is created, also create profile
      if (data.user) {
        const profileData = {
          id: data.user.id,
          full_name: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
          role: 'customer' as const
        };

        await DatabaseService.createProfile(profileData, this.supabase);
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Auth signup error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Get user profile
      let profile = null;
      if (data.user) {
        profile = await DatabaseService.getProfile(data.user.id, this.supabase);
      }

      return { 
        success: true, 
        user: data.user, 
        session: data.session,
        profile 
      };
    } catch (error) {
      console.error('Auth signin error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    } catch (error) {
      console.error('Auth signout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${globalThis.location?.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Auth reset password error:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      console.error('Auth get user error:', error);
      return null;
    }
  }

  async verifySession(sessionToken: string) {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(sessionToken);
      
      if (error) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Auth verify session error:', error);
      return null;
    }
  }
}

// Database service functions
export class DatabaseService {
  // Profiles
  static async getProfile(userId: string, client?: any): Promise<Profile | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  }

  static async createProfile(profileData: Omit<Profile, 'created_at' | 'updated_at'>, client?: any): Promise<Profile | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating profile:', error)
      return null
    }
    return data
  }

  static async updateProfile(userId: string, updates: Partial<Profile>, client?: any): Promise<Profile | null> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      return null
    }
    return data
  }

  // Properties
  static async getUserProperties(userId: string, client?: any): Promise<Property[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }
    return data || []
  }

  static async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating property:', error)
      return null
    }
    return data
  }

  // Subscription Plans
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true })
    
    if (error) {
      console.error('Error fetching subscription plans:', error)
      return []
    }
    return data || []
  }

  // Subscriptions
  static async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans(*), properties(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching subscriptions:', error)
      return []
    }
    return data || []
  }

  static async createSubscription(subscription: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }
    return data
  }

  // Appointments
  static async getUserAppointments(userId: string, client?: any): Promise<Appointment[]> {
    const supabaseClient = client || supabase;
    const { data, error } = await supabaseClient
      .from('appointments')
      .select('*, properties(*), profiles!appointments_technician_id_fkey(*)')
      .or(`customer_id.eq.${userId},technician_id.eq.${userId}`)
      .order('scheduled_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching appointments:', error)
      return []
    }
    return data || []
  }

  static async createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating appointment:', error)
      return null
    }
    return data
  }

  // Service Requests
  static async createServiceRequest(request: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests')
      .insert(request)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating service request:', error)
      return null
    }
    return data
  }

  static async getUserServiceRequests(userId: string): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching service requests:', error)
      return []
    }
    return data || []
  }

  // Equipment Items
  static async getEquipmentItems(): Promise<EquipmentItem[]> {
    const { data, error } = await supabase
      .from('equipment_items')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true })
    
    if (error) {
      console.error('Error fetching equipment items:', error)
      return []
    }
    return data || []
  }
}

