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
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.updateUIForAuthenticatedUser();
      } else {
        this.updateUIForGuestUser();
      }
    } catch (error) {
      console.error('Auth state check error:', error);
      this.updateUIForGuestUser();
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