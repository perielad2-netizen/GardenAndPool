// Authentication JavaScript for Water & Nature Pool Management System
// Hebrew RTL Authentication Logic

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.supabaseUrl = 'https://your-project-id.supabase.co';
    this.supabaseKey = 'your-anon-key-here';
    this.init();
  }

  init() {
    // Check for existing session
    this.checkAuthState();
    
    // Bind event listeners
    this.bindAuthEvents();
    
    // Initialize auth state change listener
    this.initAuthStateListener();
  }

  // API-based authentication methods
  async signIn(email, password) {
    try {
      showNotification('מתחבר...', 'info');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהתחברות');
      }
      
      if (data.success) {
        this.setCurrentUser(data.user);
        if (data.session_token) {
          localStorage.setItem('session_token', data.session_token);
        }
        showNotification('התחברתם בהצלחה!', 'success');
        this.closeAuthModal();
        this.updateUIForAuthenticatedUser();
      }
      
    } catch (error) {
      console.error('Sign in error:', error);
      showNotification(error.message || 'שגיאה בהתחברות. אנא נסו שוב.', 'error');
    }
  }

  async signUp(email, password, firstName, lastName, phone) {
    try {
      showNotification('יוצר חשבון חדש...', 'info');
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          phone 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהרשמה');
      }
      
      if (data.success) {
        showNotification('החשבון נוצר בהצלחה! אנא התחברו למערכת.', 'success');
        this.closeAuthModal();
        // Show login modal for user to sign in
        setTimeout(() => {
          this.showLoginModal();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      showNotification(error.message || 'שגיאה ביצירת החשבון. אנא נסו שוב.', 'error');
    }
  }

  async resetPassword(email) {
    try {
      showNotification('שולח קישור לאיפוס סיסמה...', 'info');
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת קישור האיפוס');
      }
      
      if (data.success) {
        showNotification('קישור לאיפוס הסיסמה נשלח לאימייל!', 'success');
        this.closeAuthModal();
      }
      
    } catch (error) {
      console.error('Reset password error:', error);
      showNotification(error.message || 'שגיאה בשליחת קישור האיפוס. אנא נסו שוב.', 'error');
    }
  }

  async signOut() {
    try {
      showNotification('מתנתק...', 'info');
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('session_token')}`
        }
      });
      
      // Clear user data regardless of API response
      this.setCurrentUser(null);
      localStorage.removeItem('session_token');
      showNotification('התנתקתם בהצלחה', 'success');
      this.updateUIForGuestUser();
      
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local data on error
      this.setCurrentUser(null);
      localStorage.removeItem('session_token');
      this.updateUIForGuestUser();
      showNotification('התנתקתם מהמערכת', 'info');
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  checkAuthState() {
    try {
      const savedUser = localStorage.getItem('currentUser');
      const sessionToken = localStorage.getItem('session_token');
      
      if (savedUser && sessionToken) {
        this.currentUser = JSON.parse(savedUser);
        this.updateUIForAuthenticatedUser();
        // Verify session is still valid by fetching profile
        this.verifySession();
      } else {
        this.updateUIForGuestUser();
      }
    } catch (error) {
      console.error('Auth state check error:', error);
      this.updateUIForGuestUser();
    }
  }

  async verifySession() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) return;

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        // Session expired or invalid
        this.signOut();
      }
    } catch (error) {
      console.error('Session verification error:', error);
    }
  }

  async fetchUserProfile() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData) {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      
      // Update current user in memory and storage
      this.setCurrentUser(data.profile);
      
      return data.profile;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async fetchUserAppointments() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/user/appointments', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      return data.appointments;
    } catch (error) {
      console.error('Appointments fetch error:', error);
      throw error;
    }
  }

  async fetchUserSubscriptions() {
    try {
      const sessionToken = localStorage.getItem('session_token');
      if (!sessionToken) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/user/subscriptions', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      return data.subscriptions;
    } catch (error) {
      console.error('Subscriptions fetch error:', error);
      throw error;
    }
  }

  // Dashboard UI Methods
  async showUserProfile() {
    try {
      showNotification('טוען פרופיל משתמש...', 'info');
      const profile = await this.fetchUserProfile();
      
      // Create and show profile modal
      const profileModal = this.createProfileModal(profile);
      document.body.appendChild(profileModal);
      profileModal.classList.remove('hidden');
      
    } catch (error) {
      showNotification('שגיאה בטעינת הפרופיל: ' + error.message, 'error');
    }
  }

  async showUserAppointments() {
    try {
      showNotification('טוען תורים...', 'info');
      const appointments = await this.fetchUserAppointments();
      
      // Create and show appointments modal
      const appointmentsModal = this.createAppointmentsModal(appointments);
      document.body.appendChild(appointmentsModal);
      appointmentsModal.classList.remove('hidden');
      
    } catch (error) {
      showNotification('שגיאה בטעינת התורים: ' + error.message, 'error');
    }
  }

  async showUserSubscriptions() {
    try {
      showNotification('טוען מנויים...', 'info');
      const subscriptions = await this.fetchUserSubscriptions();
      
      // Create and show subscriptions modal
      const subscriptionsModal = this.createSubscriptionsModal(subscriptions);
      document.body.appendChild(subscriptionsModal);
      subscriptionsModal.classList.remove('hidden');
      
    } catch (error) {
      showNotification('שגיאה בטעינת המנויים: ' + error.message, 'error');
    }
  }

  showUserInvoices() {
    showNotification('תכונת החשבוניות תהיה זמינה בקרוב', 'info');
  }

  createProfileModal(profile) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.id = 'profile-modal';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 hebrew-title">פרופיל אישי</h2>
            <button class="modal-close-profile text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          
          <form id="profile-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">שם מלא</label>
                <input
                  type="text"
                  name="full_name"
                  value="${profile.full_name || ''}"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 text-right">טלפון</label>
                <input
                  type="tel"
                  name="phone"
                  value="${profile.phone || ''}"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                  required
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 text-right">אימייל</label>
              <input
                type="email"
                value="${profile.email || ''}"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-right"
                readonly
              />
              <p class="text-xs text-gray-500 mt-1 text-right">לא ניתן לערוך את כתובת האימייל</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 text-right">כתובת</label>
              <input
                type="text"
                name="address"
                value="${profile.address || ''}"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none text-right"
                placeholder="רחוב, מספר בית, עיר"
              />
            </div>
            
            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                class="flex-1 btn-water text-white py-3 rounded-xl font-medium text-lg"
              >
                <i class="fas fa-save ml-2"></i>
                שמירת שינויים
              </button>
              
              <button
                type="button"
                class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-medium text-lg modal-close-profile"
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Bind events
    modal.querySelector('.modal-close-profile').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.querySelector('#profile-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleProfileUpdate(e.target, modal);
    });
    
    return modal;
  }

  createAppointmentsModal(appointments) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.id = 'appointments-modal';
    
    const appointmentsList = appointments.map(appointment => `
      <div class="bg-white border rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-gray-800">${appointment.service_name}</h4>
          <span class="text-xs px-2 py-1 rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}">
            ${appointment.status === 'confirmed' ? 'מאושר' : 'ממתין'}
          </span>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <div><i class="fas fa-calendar ml-2"></i>${new Date(appointment.scheduled_date).toLocaleString('he-IL')}</div>
          <div><i class="fas fa-user ml-2"></i>${appointment.technician_name}</div>
          <div><i class="fas fa-phone ml-2"></i>${appointment.technician_phone}</div>
        </div>
      </div>
    `).join('');
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 hebrew-title">התורים שלי</h2>
            <button class="modal-close-appointments text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          
          <div class="space-y-4">
            ${appointmentsList || '<p class="text-center text-gray-500">אין תורים קרובים</p>'}
          </div>
          
          <div class="mt-6 pt-4 border-t">
            <button class="w-full btn-water text-white py-3 rounded-xl font-medium">
              <i class="fas fa-plus ml-2"></i>
              קביעת תור חדש
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.querySelector('.modal-close-appointments').addEventListener('click', () => {
      modal.remove();
    });
    
    return modal;
  }

  createSubscriptionsModal(subscriptions) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.id = 'subscriptions-modal';
    
    const subscriptionsList = subscriptions.map(subscription => `
      <div class="bg-white border rounded-xl p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-gray-800">${subscription.plan_name}</h4>
          <span class="text-xs px-2 py-1 rounded-full ${subscription.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}">
            ${subscription.status === 'active' ? 'פעיל' : 'לא פעיל'}
          </span>
        </div>
        <div class="text-sm text-gray-600 space-y-1">
          <div><i class="fas fa-money-bill ml-2"></i>₪${subscription.price} לחודש</div>
          <div><i class="fas fa-calendar ml-2"></i>${subscription.visits_per_month} ביקורים בחודש</div>
          <div><i class="fas fa-credit-card ml-2"></i>חיוב הבא: ${new Date(subscription.next_billing_date).toLocaleDateString('he-IL')}</div>
        </div>
      </div>
    `).join('');
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800 hebrew-title">המנויים שלי</h2>
            <button class="modal-close-subscriptions text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          
          <div class="space-y-4">
            ${subscriptionsList || '<p class="text-center text-gray-500">אין מנויים פעילים</p>'}
          </div>
          
          <div class="mt-6 pt-4 border-t">
            <button class="w-full btn-water text-white py-3 rounded-xl font-medium">
              <i class="fas fa-plus ml-2"></i>
              הוספת מנוי חדש
            </button>
          </div>
        </div>
      </div>
    `;
    
    modal.querySelector('.modal-close-subscriptions').addEventListener('click', () => {
      modal.remove();
    });
    
    return modal;
  }

  async handleProfileUpdate(form, modal) {
    try {
      const formData = new FormData(form);
      const profileData = {
        full_name: formData.get('full_name'),
        phone: formData.get('phone'),
        address: formData.get('address')
      };

      showNotification('שומר שינויים...', 'info');
      
      await this.updateUserProfile(profileData);
      
      showNotification('הפרופיל עודכן בהצלחה!', 'success');
      modal.remove();
      
      // Update UI with new user name
      this.updateUIForAuthenticatedUser();
      
    } catch (error) {
      showNotification('שגיאה בעדכון הפרופיל: ' + error.message, 'error');
    }
  }

  initAuthStateListener() {
    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', (e) => {
      if (e.key === 'currentUser') {
        this.checkAuthState();
      }
    });
  }

  bindAuthEvents() {
    // Login form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'login-form') {
        e.preventDefault();
        this.handleLogin(e.target);
      }
    });

    // Register form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'register-form') {
        e.preventDefault();
        this.handleRegister(e.target);
      }
    });

    // Forgot password form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'forgot-password-form') {
        e.preventDefault();
        this.handleForgotPassword(e.target);
      }
    });

    // Modal navigation buttons
    document.addEventListener('click', (e) => {
      if (e.target.id === 'show-register-btn') {
        this.showRegisterModal();
      } else if (e.target.id === 'show-login-btn') {
        this.showLoginModal();
      } else if (e.target.id === 'forgot-password-btn') {
        this.showForgotPasswordModal();
      } else if (e.target.id === 'back-to-login-btn') {
        this.showLoginModal();
      } else if (e.target.id === 'logout-btn') {
        this.signOut();
      }
    });

    // Login/Register trigger buttons
    document.addEventListener('click', (e) => {
      const loginButtons = e.target.closest('.login-trigger, .register-trigger');
      if (loginButtons) {
        if (loginButtons.classList.contains('login-trigger')) {
          this.showLoginModal();
        } else if (loginButtons.classList.contains('register-trigger')) {
          this.showRegisterModal();
        }
      }
    });

    // User menu toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('#user-menu-button')) {
        this.toggleUserMenu();
      } else if (!e.target.closest('#user-menu')) {
        this.closeUserMenu();
      }
    });

    // User dashboard navigation
    document.addEventListener('click', (e) => {
      const menuItem = e.target.closest('#user-menu-dropdown a[href="#"]');
      if (menuItem) {
        e.preventDefault();
        const icon = menuItem.querySelector('i');
        
        if (icon && icon.classList.contains('fa-user')) {
          this.showUserProfile();
        } else if (icon && icon.classList.contains('fa-calendar')) {
          this.showUserAppointments();
        } else if (icon && icon.classList.contains('fa-credit-card')) {
          this.showUserSubscriptions();
        } else if (icon && icon.classList.contains('fa-file-invoice')) {
          this.showUserInvoices();
        }
      }
    });
  }

  handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      showNotification('אנא מלאו את כל השדות הנדרשים', 'warning');
      return;
    }

    this.signIn(email, password);
  }

  handleRegister(form) {
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const termsAccepted = formData.get('terms');

    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
      showNotification('אנא מלאו את כל השדות הנדרשים', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('הסיסמאות אינן תואמות', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('הסיסמה חייבת להכיל לפחות 6 תווים', 'error');
      return;
    }

    if (!termsAccepted) {
      showNotification('יש להסכים לתנאי השימוש', 'warning');
      return;
    }

    this.signUp(email, password, firstName, lastName, phone);
  }

  handleForgotPassword(form) {
    const formData = new FormData(form);
    const email = formData.get('email');

    if (!email) {
      showNotification('אנא הכניסו כתובת אימייל', 'warning');
      return;
    }

    if (!this.isValidEmail(email)) {
      showNotification('אנא הכניסו כתובת אימייל תקינה', 'error');
      return;
    }

    this.resetPassword(email);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showLoginModal() {
    this.hideAllModals();
    this.showModal('login-modal');
  }

  showRegisterModal() {
    this.hideAllModals();
    this.showModal('register-modal');
  }

  showForgotPasswordModal() {
    this.hideAllModals();
    this.showModal('forgot-password-modal');
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Focus first input
      const firstInput = modal.querySelector('input');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }

  hideAllModals() {
    const modals = ['login-modal', 'register-modal', 'forgot-password-modal'];
    modals.forEach(modalId => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      }
    });
    document.body.style.overflow = '';
  }

  closeAuthModal() {
    this.hideAllModals();
  }

  toggleUserMenu() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  closeUserMenu() {
    const dropdown = document.getElementById('user-menu-dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  }

  updateUIForAuthenticatedUser() {
    // Hide login/register buttons
    const authButtons = document.querySelectorAll('.login-trigger, .register-trigger');
    authButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    // Show user menu
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.style.display = 'block';
    }

    // Update user name in menu
    if (this.currentUser) {
      const userNameElement = document.getElementById('user-name');
      if (userNameElement) {
        userNameElement.textContent = this.currentUser.full_name || 'משתמש';
      }
    }

    // Update header login button
    this.updateHeaderAuthButton();
  }

  updateUIForGuestUser() {
    // Show login/register buttons
    const authButtons = document.querySelectorAll('.login-trigger, .register-trigger');
    authButtons.forEach(btn => {
      btn.style.display = '';
    });

    // Hide user menu
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
      userMenu.style.display = 'none';
    }

    // Update header login button
    this.updateHeaderAuthButton();
  }

  updateHeaderAuthButton() {
    // Find header login button and update it
    const headerLoginButtons = document.querySelectorAll('header button');
    headerLoginButtons.forEach(button => {
      if (button.textContent.includes('התחברות') || button.textContent.includes('התחבר')) {
        if (this.currentUser) {
          // User is logged in
          button.innerHTML = `
            <i class="fas fa-user ml-2"></i>
            שלום, ${this.currentUser.full_name || 'משתמש'}
          `;
          button.classList.remove('login-trigger');
          button.onclick = () => this.toggleUserMenu();
        } else {
          // User is logged out
          button.innerHTML = `
            <i class="fas fa-user-plus ml-2"></i>
            התחברות
          `;
          button.classList.add('login-trigger');
          button.onclick = () => this.showLoginModal();
        }
      }
    });
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user info
  getCurrentUser() {
    return this.currentUser;
  }
}

// Global auth manager instance
window.authManager = new AuthManager();

// Global functions for modal management
window.closeAuthModal = () => {
  window.authManager.closeAuthModal();
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.authManager.closeAuthModal();
    window.authManager.closeUserMenu();
  }
});

console.log('🔐 Authentication system initialized for Water & Nature Pool Management');