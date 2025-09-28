// Water & Nature Pool Management System - JavaScript
// Hebrew RTL Pool and Garden Management Application

document.addEventListener('DOMContentLoaded', function() {
  console.log('מים וטבע - Water & Nature Application Loaded');
  
  // Initialize application
  initializeApp();
});

function initializeApp() {
  // Initialize service tabs
  initializeServiceTabs();
  
  // Initialize camera functionality
  initializeCamera();
  
  // Initialize form handlers
  initializeForms();
  
  // Initialize animations
  initializeAnimations();
  
  // Initialize notifications
  initializeNotifications();
  
  // Initialize mobile menu
  initializeMobileMenu();
}

// Service Tabs Management
function initializeServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const contents = document.querySelectorAll('.service-content');
  
  if (tabs.length === 0) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const service = this.dataset.service;
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const content = document.getElementById(service + '-content');
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

// Camera Functionality
function initializeCamera() {
  // Camera button handlers
  const cameraBtn = document.getElementById('cameraBtn');
  if (cameraBtn) {
    cameraBtn.addEventListener('click', openCameraCapture);
  }
  
  // Initialize capture buttons
  initializeCaptureButtons();
}

function initializeCaptureButtons() {
  // New photo button
  document.addEventListener('click', function(e) {
    if (e.target.closest('button') && e.target.textContent.includes('צילום חדש')) {
      openCamera();
    }
    
    if (e.target.closest('button') && e.target.textContent.includes('העלאה מהגלריה')) {
      openGallery();
    }
  });
}

function openCameraCapture() {
  showNotification('פותח מצלמה לאבחון...', 'info');
  // Here you would implement camera capture functionality
  // For now, we'll show a placeholder
  setTimeout(() => {
    showNotification('המצלמה מוכנה לשימוש', 'success');
  }, 1000);
}

function openCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        showNotification('המצלמה פעילה', 'success');
        // Here you would display the camera stream
      })
      .catch(function(error) {
        console.error('Camera access error:', error);
        showNotification('שגיאה בגישה למצלמה', 'error');
      });
  } else {
    showNotification('המצלמה אינה זמינה בדפדפן זה', 'warning');
  }
}

function openGallery() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
      showNotification('תמונה נבחרה: ' + file.name, 'success');
      // Here you would process the uploaded image
    }
  };
  input.click();
}

// Form Handlers
function initializeForms() {
  // Scheduler form
  const schedulerForm = document.querySelector('#scheduler-content form');
  if (schedulerForm) {
    schedulerForm.addEventListener('submit', handleSchedulerSubmit);
  }
  
  // Contact form
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  // Subscription buttons
  document.addEventListener('click', function(e) {
    const button = e.target.closest('button');
    if (button && (button.textContent.includes('בחר תוכנית') || button.textContent.includes('בחירה'))) {
      handleSubscriptionSelection(button);
    }
  });
}

function handleSchedulerSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  showNotification('שולח בקשה...', 'info');
  
  // Simulate API call
  setTimeout(() => {
    showNotification('הבקשה נשלחה בהצלחה! נחזור אליכם בהקדם', 'success');
    e.target.reset();
  }, 1500);
}

function handleContactSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  showNotification('שולח הודעה...', 'info');
  
  // Simulate API call
  setTimeout(() => {
    showNotification('ההודעה נשלחה בהצלחה!', 'success');
    e.target.reset();
  }, 1500);
}

function handleSubscriptionSelection(button) {
  const planCard = button.closest('.glass-card, .bg-white, .bg-gradient-to-br');
  const planName = planCard.querySelector('h4, h5').textContent;
  
  showNotification(`בחרתם בתוכנית: ${planName}`, 'success');
  
  // Here you would redirect to payment or registration
  setTimeout(() => {
    showNotification('מעביר לעמוד ההרשמה...', 'info');
  }, 1000);
}

// Animations
function initializeAnimations() {
  // Add scroll animations
  observeElements();
  
  // Initialize water animations
  createWaterElements();
  
  // Initialize counters
  animateCounters();
}

function observeElements() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    },
    { threshold: 0.1 }
  );
  
  // Observe service cards
  document.querySelectorAll('.glass-card, .glass-card-dark').forEach(card => {
    observer.observe(card);
  });
}

function createWaterElements() {
  // Create floating water bubbles
  const hero = document.querySelector('section.gradient-bg');
  if (!hero) return;
  
  for (let i = 0; i < 5; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'absolute w-2 h-2 bg-white/20 rounded-full';
    bubble.style.left = Math.random() * 100 + '%';
    bubble.style.top = Math.random() * 100 + '%';
    bubble.style.animation = `float 3s ease-in-out infinite ${Math.random() * 2}s`;
    hero.appendChild(bubble);
  }
}

function animateCounters() {
  const counters = document.querySelectorAll('.text-3xl.font-bold');
  
  counters.forEach(counter => {
    const text = counter.textContent;
    const number = text.match(/\d+/);
    
    if (number) {
      const target = parseInt(number[0]);
      let current = 0;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = text.replace(/\d+/, Math.floor(current));
      }, 50);
    }
  });
}

// Notifications
function initializeNotifications() {
  // Create notification container
  if (!document.getElementById('notifications')) {
    const container = document.createElement('div');
    container.id = 'notifications';
    container.className = 'fixed top-4 left-4 z-50 space-y-2';
    container.style.direction = 'rtl';
    document.body.appendChild(container);
  }
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  const notification = document.createElement('div');
  
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.className = `${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transform translate-x-full transition-transform duration-300`;
  notification.innerHTML = `
    <i class="${icons[type]}"></i>
    <span class="font-medium">${message}</span>
    <button class="ml-auto text-white hover:text-gray-200" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Mobile Menu
function initializeMobileMenu() {
  const menuButton = document.querySelector('.md\\:hidden button');
  if (menuButton) {
    menuButton.addEventListener('click', toggleMobileMenu);
  }
}

function toggleMobileMenu() {
  showNotification('תפריט נייד - בפיתוח', 'info');
}

// Phone functionality
document.addEventListener('click', function(e) {
  const button = e.target.closest('button');
  if (button && (button.textContent.includes('התקשרו עכשיו') || button.textContent.includes('צור קשר'))) {
    initiateCall();
  }
});

function initiateCall() {
  const phoneNumber = '052-123-4567';
  if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    showNotification(`התקשרו אלינו: ${phoneNumber}`, 'info');
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        showNotification('מספר הטלפון הועתק', 'success');
      });
    }
  }
}

// Utility Functions
function formatHebrewNumber(num) {
  return new Intl.NumberFormat('he-IL').format(num);
}

function formatHebrewDate(date) {
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Add Hebrew keyboard support
document.addEventListener('keydown', function(e) {
  // Add any Hebrew-specific keyboard shortcuts here
});

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registered successfully');
      })
      .catch(function(registrationError) {
        console.log('ServiceWorker registration failed: ', registrationError);
      });
  });
}

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
  .service-tab {
    @apply glass-card px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-2 font-medium;
  }
  
  .service-tab.active {
    @apply bg-blue-500 text-white;
  }
  
  .service-tab:hover {
    @apply transform scale-105;
  }
  
  .service-content {
    @apply hidden;
  }
  
  .service-content.active {
    @apply block;
  }
  
  .animate-in {
    @apply transform translate-y-0 opacity-100 transition-all duration-700;
  }
  
  .glass-card:not(.animate-in) {
    @apply transform translate-y-10 opacity-0;
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);