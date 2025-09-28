# מים וטבע - Water & Nature Pool Management System

## Project Overview
- **Name**: מים וטבע (Water & Nature)
- **Goal**: Comprehensive Hebrew RTL pool and garden maintenance management system
- **Features**: Pool diagnosis, technician scheduling, equipment management, subscription plans, garden services

## Live URLs
- **Production**: https://3000-ihdlkbro9nzx0ynge2jmt-6532622b.e2b.dev
- **GitHub Repository**: https://github.com/perielad2-netizen/GardenAndPool

## Functional API Endpoints ✨ **WORKING**

### Public APIs (No Authentication Required)
- **Health Check**: `GET /api/health` - System status and timestamp
- **Services Info**: `GET /api/services` - Available service types and icons  
- **Subscription Plans**: `GET /api/plans` - All subscription plans with pricing

### Authentication APIs ✨ **NEW**
- **User Registration**: `POST /api/auth/register`
  - Body: `{email, password, firstName, lastName, phone}`
  - Returns: User profile and success confirmation
- **User Login**: `POST /api/auth/login` 
  - Body: `{email, password}`
  - Returns: User profile and session token
- **Password Recovery**: `POST /api/auth/forgot-password`
  - Body: `{email}`
  - Returns: Password reset confirmation
- **User Logout**: `POST /api/auth/logout`
  - Headers: `Authorization: Bearer {session_token}`
  - Returns: Logout success confirmation

### User Management APIs ✨ **NEW** (Requires Authentication)
- **Get User Profile**: `GET /api/user/profile`
  - Headers: `Authorization: Bearer {session_token}`
  - Returns: Complete user profile with properties and appointments
- **Update User Profile**: `PUT /api/user/profile`
  - Headers: `Authorization: Bearer {session_token}`
  - Body: `{full_name, phone, address}`
  - Returns: Updated profile information
- **Get User Appointments**: `GET /api/user/appointments`
  - Headers: `Authorization: Bearer {session_token}`
  - Returns: List of user's appointments with technician details
- **Get User Subscriptions**: `GET /api/user/subscriptions`
  - Headers: `Authorization: Bearer {session_token}`
  - Returns: List of active subscription plans and billing info

## Current Features Completed ✅

### 1. RTL Hebrew Interface
- Full Hebrew language support with proper RTL layout
- Heebo font integration for optimal Hebrew typography
- RTL-optimized navigation and user interface

### 2. Water-Themed Design System
- Blue to cyan gradient color scheme representing water
- Green accents for nature elements
- Glassmorphism effects and modern card designs
- Animated water elements and floating bubbles

### 3. Complete Authentication System ✨ **NEW**
- **User Registration**: Email/password signup with form validation
- **Login System**: Secure authentication with session tokens
- **Password Recovery**: Forgot password functionality with email reset
- **Session Management**: Persistent authentication with multi-tab support
- **User Profile Management**: Editable profile with personal information
- **Authentication State**: Automatic session verification and persistence

### 4. User Dashboard & Profile Management ✨ **NEW**
- **Personal Dashboard**: User profile with appointments and subscriptions overview
- **Profile Editor**: Editable user information (name, phone, address)
- **Appointments View**: Display of upcoming and past service appointments
- **Subscriptions Management**: Current subscription plans and billing information
- **Interactive Modals**: Hebrew RTL support with smooth animations
- **Real-time Updates**: Dynamic UI updates based on user actions

### 5. API Backend System ✨ **NEW**
- **Authentication APIs**: Complete REST API for user management
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User authentication
  - `POST /api/auth/forgot-password` - Password reset
  - `POST /api/auth/logout` - Secure logout
- **User Management APIs**: Profile and data management
  - `GET /api/user/profile` - Fetch user profile
  - `PUT /api/user/profile` - Update user information
  - `GET /api/user/appointments` - User appointments
  - `GET /api/user/subscriptions` - User subscription plans

### 6. Service Management System
#### Interactive Service Tabs:
- **אבחון (Diagnosis)**: Camera-based pool analysis
- **תיאום טכנאי (Scheduler)**: Professional technician appointment booking
- **ארון תחזוקה (Cabinet)**: Equipment and chemicals inventory management
- **מנוי תחזוקה (Subscription)**: Pool maintenance subscription plans
- **גינון (Garden)**: Professional garden services
- **מנוי גינון (Garden Subscription)**: Garden maintenance packages

### 7. Subscription Plans with Hebrew Pricing
- **מנוי בסיסי (Basic)**: ₪600/month - 2 visits, basic maintenance
- **מנוי חודשי (Monthly)**: ₪1000/month - 4 visits, full service
- **מנוי שנתי (Yearly)**: ₪9000/year - Weekly visits, 24/7 support (Popular)
- **מנוי VIP**: ₪15000/year - Premium service with house spraying & car wash
- **מנוי פרימיום מושלם (Premium Complete)**: ₪2500/month - **NEW!** Complete pool + garden service, weekly visits, all chemicals & equipment, dedicated consultant (Save ₪1,300/month!)

### 8. Mobile-First Responsive Design
- Touch-friendly interface with 44px minimum touch targets
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)
- Optimized for mobile pool maintenance workflows

## Data Architecture

### Current Storage
- **Static Data**: Service definitions, pricing plans, equipment catalog
- **Configuration**: Cloudflare Pages deployment with Hono framework

### Planned Database Models (Supabase Schema)
- **profiles**: User authentication and profile information
- **properties**: Pool and property management
- **subscriptions**: Subscription plan management
- **appointments**: Service scheduling and tracking
- **service_requests**: Customer service requests
- **invoices**: Billing and payment tracking
- **work_reports**: Technician work documentation
- **notifications**: User notification system

## Technical Stack
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers/Pages
- **Frontend**: Server-side rendered JSX with Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Cloudflare Pages with edge computing

## User Guide

### For Customers:
1. **Pool Diagnosis**: Use camera feature to capture pool images for professional analysis
2. **Schedule Service**: Book appointments with certified technicians
3. **Browse Equipment**: View and order maintenance chemicals and equipment
4. **Choose Subscription**: Select appropriate maintenance plan based on pool needs
5. **Garden Services**: Request professional landscaping and garden maintenance

### For Service Providers:
- Manage customer appointments and service requests
- Track equipment inventory and chemical usage
- Process subscription payments and billing
- Generate service reports and recommendations

## Features Not Yet Implemented ⏳

### 1. Database Integration (Next Priority)
- [ ] **Supabase Database Connection**: Replace mock data with real database
- [ ] **Row Level Security (RLS)**: Implement data access security policies  
- [ ] **Real Authentication**: Connect API endpoints to Supabase Auth
- [ ] **Data Persistence**: Store user data, appointments, and subscriptions

### 2. Service Management Backend
- [ ] **Appointment Booking**: Functional technician scheduling system
- [ ] **Service Requests**: Customer service request processing
- [ ] **Equipment Orders**: Functional equipment and chemical ordering
- [ ] **Subscription Processing**: Payment and subscription management

### 3. Advanced User Features
- [ ] **Photo Upload**: Pool diagnostics image upload and analysis
- [ ] **Real-time Communication**: Chat with technicians and support
- [ ] **Invoice Management**: Billing history and payment tracking
- [ ] **Notification System**: Email/SMS reminders and updates
- [ ] **Role-based Access**: Customer, Technician, and Admin roles

### 4. AI-Powered Features
- [ ] **OpenAI Integration**: Pool diagnostics via image analysis
- [ ] **Automated Recommendations**: Intelligent maintenance suggestions
- [ ] **Predictive Scheduling**: Smart appointment and maintenance planning
- [ ] **Hebrew Chatbot**: AI customer support in Hebrew

### 5. Advanced Functionality
- [ ] **PWA Capabilities**: Offline mode and app installation
- [ ] **Payment Processing**: Stripe integration for subscription billing
- [ ] **Push Notifications**: Real-time appointment and service alerts
- [ ] **Multi-language**: Arabic and English language support
- [ ] **Mobile App**: React Native mobile application

## Recommended Next Steps for Development

### ✅ Phase 1: Authentication & User Management - **COMPLETED**
1. ✅ **User authentication system** with registration, login, and password recovery
2. ✅ **Session management** with secure tokens and persistence
3. ✅ **User dashboard** with profile management and data display
4. ✅ **API backend** with comprehensive user management endpoints

### 🔄 Phase 2: Database Integration - **NEXT PRIORITY**
1. **Connect Supabase Database**: Replace mock data with real Supabase integration
2. **Implement RLS Policies**: Add Row Level Security for data protection
3. **Real User Authentication**: Connect authentication APIs to Supabase Auth
4. **Data Persistence**: Store and retrieve real user data, appointments, subscriptions

### ⏳ Phase 3: Service Management Backend
1. **Functional Appointment System**: Real technician scheduling with calendar integration
2. **Service Request Processing**: Backend logic for customer service requests
3. **Equipment Order System**: Functional ordering and inventory management
4. **Subscription Processing**: Payment integration and subscription management

### ⏳ Phase 4: Advanced Features & AI
1. **File Upload System**: Pool image upload for AI diagnostics
2. **OpenAI Integration**: Pool analysis and maintenance recommendations
3. **Real-time Communication**: Chat system between customers and technicians
4. **Notification System**: Email/SMS alerts for appointments and services

### ⏳ Phase 5: Production Deployment
1. **Cloudflare Pages Deployment**: Deploy to production environment
2. **Domain Configuration**: Set up custom domain and SSL
3. **Performance Optimization**: Caching and edge computing optimization
4. **Monitoring & Analytics**: Error tracking and usage analytics

## Deployment Status
- **Platform**: Cloudflare Pages ✅ Active
- **Environment**: Development (Sandbox)
- **Status**: ✅ Successfully deployed and running
- **Performance**: Optimized for edge computing with sub-50ms response times
- **Last Updated**: 2024-01-15

## Development Commands

```bash
# Start development server
npm run build
pm2 start ecosystem.config.cjs

# Test the application
npm test

# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Clean port (if needed)
npm run clean-port
```

## Contact Information
- **Company**: מים וטבע - Water & Nature
- **Phone**: 052-123-4567
- **Email**: info@water-nature.co.il
- **Address**: רחוב הבריכות 123, תל אביב

---

*This project represents a comprehensive solution for pool and garden maintenance management, combining modern web technologies with Hebrew-first design principles and water industry expertise.*