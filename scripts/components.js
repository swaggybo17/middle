// Component-specific JavaScript functionality

// Component initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeTooltips();
    initializeCarousels();
    initializeLazyLoading();
});

// Animation system
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different components
                if (entry.target.classList.contains('stat-number')) {
                    animateNumber(entry.target);
                }
                
                if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.business-card, .value-card, .method-card, .reference-card, .stat, .timeline-item').forEach(el => {
        animationObserver.observe(el);
    });
}

// Number animation
function animateNumber(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const suffix = element.textContent.replace(/[\d,]/g, '');
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Progress bar animation
function animateProgressBar(element) {
    const width = element.dataset.width || '100%';
    element.style.width = '0%';
    
    setTimeout(() => {
        element.style.transition = 'width 2s ease-out';
        element.style.width = width;
    }, 100);
}

// Tooltip system
function initializeTooltips() {
    // Create tooltip container
    const tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'tooltip-container';
    tooltipContainer.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 200px;
        word-wrap: break-word;
    `;
    document.body.appendChild(tooltipContainer);

    // Add tooltip functionality to elements with data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('mousemove', moveTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.getElementById('tooltip-container');
    const text = event.target.dataset.tooltip;
    
    if (text) {
        tooltip.textContent = text;
        tooltip.style.opacity = '1';
        moveTooltip(event);
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip-container');
    tooltip.style.opacity = '0';
}

function moveTooltip(event) {
    const tooltip = document.getElementById('tooltip-container');
    const x = event.clientX + 10;
    const y = event.clientY - 30;
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Carousel/Slider components
function initializeCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        new CarouselComponent(carousel);
    });
}

class CarouselComponent {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.prevBtn = element.querySelector('.carousel-prev');
        this.nextBtn = element.querySelector('.carousel-next');
        this.indicators = element.querySelectorAll('.carousel-indicator');
        this.currentSlide = 0;
        this.autoPlay = element.dataset.autoplay === 'true';
        this.interval = parseInt(element.dataset.interval) || 3000;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.showSlide(0);
        this.bindEvents();
        
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => {
            if (this.autoPlay) this.startAutoPlay();
        });
    }
    
    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => this.nextSlide(), this.interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Card hover effects
function initializeCardEffects() {
    document.querySelectorAll('.business-card, .value-card, .method-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Form validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.validate(e));
        
        // Real-time validation
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }
    
    addRule(fieldName, validator, message) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push({ validator, message });
    }
    
    validate(event) {
        let isValid = true;
        const formData = new FormData(this.form);
        
        for (const [fieldName, rules] of Object.entries(this.rules)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            const value = formData.get(fieldName);
            
            for (const rule of rules) {
                if (!rule.validator(value)) {
                    this.showError(field, rule.message);
                    isValid = false;
                    break;
                }
            }
        }
        
        if (!isValid) {
            event.preventDefault();
        }
        
        return isValid;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        const rules = this.rules[fieldName];
        
        if (rules) {
            for (const rule of rules) {
                if (!rule.validator(value)) {
                    this.showError(field, rule.message);
                    return false;
                }
            }
        }
        
        this.clearError(field);
        return true;
    }
    
    showError(field, message) {
        this.clearError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc3545';
    }
    
    clearError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
}

// Common validators
const Validators = {
    required: (value) => value && value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^1[3-9]\d{9}$/.test(value),
    minLength: (min) => (value) => value && value.length >= min,
    maxLength: (max) => (value) => !value || value.length <= max,
    numeric: (value) => !value || /^\d+$/.test(value),
    positiveNumber: (value) => !value || (parseFloat(value) > 0)
};

// Initialize form validation for all forms
document.addEventListener('DOMContentLoaded', function() {
    // Donation form validation
    const donationForm = document.querySelector('.donation-form');
    if (donationForm) {
        const validator = new FormValidator(donationForm);
        validator.addRule('clothingType', Validators.required, '请选择衣物类型');
        validator.addRule('quantity', Validators.required, '请输入数量');
        validator.addRule('quantity', Validators.positiveNumber, '数量必须大于0');
        validator.addRule('address', Validators.required, '请输入收取地址');
    }
    
    // Booking form validation
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const validator = new FormValidator(bookingForm);
        validator.addRule('name', Validators.required, '请输入姓名');
        validator.addRule('phone', Validators.required, '请输入手机号');
        validator.addRule('phone', Validators.phone, '请输入正确的手机号');
        validator.addRule('time', Validators.required, '请选择预约时间');
    }
    
    // Pickup form validation
    const pickupForm = document.querySelector('.pickup-form');
    if (pickupForm) {
        const validator = new FormValidator(pickupForm);
        validator.addRule('address', Validators.required, '请输入收取地址');
        validator.addRule('clothingType', Validators.required, '请选择衣物类型');
        validator.addRule('appointmentTime', Validators.required, '请选择预约时间');
        validator.addRule('timePreference', Validators.required, '请选择时间偏好');
    }
});

// Loading states
function showLoading(element, text = '加载中...') {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">${text}</div>
    `;
    loader.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.appendChild(loader);
}

function hideLoading(element) {
    const loader = element.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

// Notification system
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 300px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.remove(notification);
        });
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
    }
    
    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Global notification instance
const notifications = new NotificationSystem();

// Export for use in other scripts
window.ComponentUtils = {
    FormValidator,
    Validators,
    showLoading,
    hideLoading,
    notifications
};