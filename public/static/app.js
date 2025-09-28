// Water & Nature Pool Management System - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('מים וטבע - Pool Management System Loaded');

    // Initialize animations and interactions
    initializeAnimations();
    initializeServiceTabs();
    initializePlanSelection();
    initializeContactForms();

    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.glass-card, .glass-card-dark').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Create ripple effect on button click
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);

    // Remove ripple after animation
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Initialize Service Tabs
function initializeServiceTabs() {
    const serviceTabs = document.querySelectorAll('.glass-card-dark');
    
    serviceTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const serviceType = this.querySelector('h4').textContent;
            handleServiceSelection(serviceType);
        });

        // Add hover effects
        tab.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });

        tab.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// Handle Service Selection
function handleServiceSelection(serviceType) {
    console.log(`Selected service: ${serviceType}`);
    
    // Show loading state
    showLoadingToast(`טוען ${serviceType}...`);

    // Simulate service loading (replace with actual navigation)
    setTimeout(() => {
        switch(serviceType) {
            case 'אבחון':
                showCameraCapture();
                break;
            case 'תיאום טכנאי':
                showScheduler();
                break;
            case 'ארון תחזוקה':
                showMaintenanceCabinet();
                break;
            case 'מנויים':
                scrollToElement('subscription-plans');
                break;
            case 'גינון':
                showGardenServices();
                break;
            case 'מנוי גינון':
                showGardenSubscription();
                break;
            default:
                showToast('השירות יהיה זמין בקרוב', 'info');
        }
    }, 1000);
}

// Initialize Plan Selection
function initializePlanSelection() {
    const planButtons = document.querySelectorAll('button[class*="btn-"]');
    
    planButtons.forEach(button => {
        if (button.textContent.includes('בחר תוכנית') || button.textContent.includes('בחר מנוי')) {
            button.addEventListener('click', function() {
                const planCard = this.closest('div[class*="bg-"]');
                const planName = planCard.querySelector('h4').textContent;
                const planPrice = planCard.querySelector('div[class*="text-3xl"]').textContent;
                
                handlePlanSelection(planName, planPrice);
            });
        }
    });
}

// Handle Plan Selection
function handlePlanSelection(planName, planPrice) {
    console.log(`Selected plan: ${planName} - ${planPrice}`);
    
    showConfirmationModal({
        title: 'בחירת מנוי',
        message: `בחרת במנוי: ${planName}<br>מחיר: ${planPrice}<br>האם תרצה להמשיך?`,
        confirmText: 'המשך',
        cancelText: 'ביטול',
        onConfirm: () => {
            showToast('מועבר לעמוד התשלום...', 'success');
            // Redirect to payment page
            setTimeout(() => {
                window.location.href = '/checkout';
            }, 1500);
        }
    });
}

// Initialize Contact Forms
function initializeContactForms() {
    // Phone button in hero section
    const phoneButton = document.querySelector('button[class*="border-2"]');
    if (phoneButton) {
        phoneButton.addEventListener('click', function() {
            window.open('tel:+972501234567');
        });
    }

    // Contact section interactions
    const contactCards = document.querySelectorAll('section[class*="bg-gray-100"] .bg-white');
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const contactType = this.querySelector('h4').textContent;
            const contactValue = this.querySelector('p').textContent;
            
            handleContactAction(contactType, contactValue);
        });
    });
}

// Handle Contact Actions
function handleContactAction(type, value) {
    switch(type) {
        case 'טלפון':
            window.open(`tel:${value.replace(/[^0-9+]/g, '')}`);
            break;
        case 'אימייל':
            window.open(`mailto:${value}`);
            break;
        case 'כתובת':
            window.open(`https://maps.google.com/?q=${encodeURIComponent(value)}`);
            break;
    }
}

// Service Functions (Placeholders for future implementation)
function showCameraCapture() {
    showModal({
        title: 'אבחון בריכה',
        content: `
            <div class="text-center">
                <div class="text-6xl mb-4">📸</div>
                <p class="mb-4">צלם את הבריכה לאבחון מהיר</p>
                <button class="btn-water text-white px-6 py-2 rounded-lg" onclick="openCamera()">
                    פתח מצלמה
                </button>
            </div>
        `
    });
}

function showScheduler() {
    showModal({
        title: 'תיאום טכנאי',
        content: `
            <div class="space-y-4">
                <div class="text-6xl text-center mb-4">📅</div>
                <div>
                    <label class="block text-sm font-bold mb-2">בחר תאריך:</label>
                    <input type="date" class="w-full p-2 border rounded-lg" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">בחר שעה:</label>
                    <select class="w-full p-2 border rounded-lg">
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                    </select>
                </div>
                <button class="btn-water text-white px-6 py-2 rounded-lg w-full" onclick="scheduleAppointment()">
                    קבע תור
                </button>
            </div>
        `
    });
}

function showMaintenanceCabinet() {
    showToast('ארון התחזוקה יהיה זמין בקרוב', 'info');
}

function showGardenServices() {
    showToast('שירותי גינון יהיו זמינים בקרוב', 'info');
}

function showGardenSubscription() {
    showToast('מנוי גינון יהיה זמין בקרוב', 'info');
}

// Utility Functions
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-bold max-w-sm ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.transition = 'transform 0.3s ease';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showLoadingToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg bg-blue-500 text-white font-bold max-w-sm flex items-center gap-3';
    toast.innerHTML = `
        <div class="loading-spinner"></div>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 2000);
}

function showModal({ title, content }) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold hebrew-title">${title}</h3>
                <button class="text-gray-500 hover:text-gray-700 text-xl" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showConfirmationModal({ title, message, confirmText, cancelText, onConfirm }) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold hebrew-title mb-4">${title}</h3>
            <div class="mb-6">${message}</div>
            <div class="flex gap-3 justify-end">
                <button class="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50" onclick="closeModal()">
                    ${cancelText}
                </button>
                <button class="btn-water text-white px-4 py-2 rounded-lg" onclick="confirmAction()">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Store callback
    window.currentConfirmCallback = onConfirm;
}

function closeModal() {
    const modals = document.querySelectorAll('[class*="fixed inset-0 z-50"]');
    modals.forEach(modal => {
        document.body.removeChild(modal);
    });
    document.body.style.overflow = 'auto';
}

function confirmAction() {
    if (window.currentConfirmCallback) {
        window.currentConfirmCallback();
        window.currentConfirmCallback = null;
    }
    closeModal();
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function openCamera() {
    // Placeholder for camera functionality
    showToast('מצלמה תיפתח בגרסה הבאה', 'info');
    closeModal();
}

function scheduleAppointment() {
    const dateInput = document.querySelector('input[type="date"]');
    const timeSelect = document.querySelector('select');
    
    if (dateInput.value && timeSelect.value) {
        showToast(`תור נקבע ל-${dateInput.value} בשעה ${timeSelect.value}`, 'success');
        closeModal();
    } else {
        showToast('אנא בחר תאריך ושעה', 'error');
    }
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);