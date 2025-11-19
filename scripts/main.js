// Main JavaScript functionality

// Global variables
let currentSlide = 0;
let slideInterval;
let searchTimeout;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBanner();
    initializeSearch();
    initializeModals();
    initializePointsCalculator();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown menu for touch devices
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

// Banner slider functionality
function initializeBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

    // Set background images
    slides.forEach(slide => {
        const bgImage = slide.dataset.bg;
        if (bgImage) {
            slide.style.backgroundImage = `url(${bgImage})`;
        }
    });

    // Auto-slide functionality
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    // Start auto-slide
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 3000);
    }

    // Stop auto-slide
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            if (index !== currentSlide) {
                slides[currentSlide].classList.remove('active');
                indicators[currentSlide].classList.remove('active');
                
                currentSlide = index;
                
                slides[currentSlide].classList.add('active');
                indicators[currentSlide].classList.add('active');
            }
        });
    });

    // Pause on hover
    const banner = document.querySelector('.hero-banner');
    if (banner) {
        banner.addEventListener('mouseenter', stopSlideshow);
        banner.addEventListener('mouseleave', startSlideshow);
    }

    // Start the slideshow
    startSlideshow();
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchInput || !searchSuggestions) return;

    const suggestions = [
        { text: '回收规则', section: 'donation' },
        { text: '积分兑换', section: 'points-rules' },
        { text: '公益案例', section: 'charity-cases' },
        { text: '项目理念', section: 'concept' },
        { text: '体验店活动', section: 'experience-store' },
        { text: '环保价值', section: 'concept' },
        { text: '捐赠流程', section: 'donation' },
        { text: '积分计算', section: 'points-rules' }
    ];

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(() => {
            const matches = suggestions.filter(item => 
                item.text.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                searchSuggestions.innerHTML = matches.map(item => 
                    `<div class="suggestion-item" onclick="selectSuggestion('${item.section}')">${item.text}</div>`
                ).join('');
                searchSuggestions.style.display = 'block';
            } else {
                searchSuggestions.style.display = 'none';
            }
        }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

// Select search suggestion
function selectSuggestion(section) {
    const target = document.getElementById(section);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
    document.getElementById('searchSuggestions').style.display = 'none';
    document.getElementById('searchInput').value = '';
}

// Modal functionality
function initializeModals() {
    // Quick action buttons
    const bookStoreBtn = document.getElementById('bookStoreBtn');
    
    if (bookStoreBtn) {
        bookStoreBtn.addEventListener('click', () => showModal('storeBookingModal'));
    }

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Points calculator
function initializePointsCalculator() {
    const adultCoats = document.getElementById('adultCoats');
    const childClothes = document.getElementById('childClothes');
    const fabricWeight = document.getElementById('fabricWeight');
    const totalPoints = document.getElementById('totalPoints');
    
    if (!adultCoats || !childClothes || !fabricWeight || !totalPoints) return;

    function calculatePoints() {
        const coats = parseInt(adultCoats.value) || 0;
        const child = parseInt(childClothes.value) || 0;
        const fabric = parseFloat(fabricWeight.value) || 0;
        
        const total = (coats * 50) + (child * 30) + (fabric * 20);
        totalPoints.textContent = total;
    }

    adultCoats.addEventListener('input', calculatePoints);
    childClothes.addEventListener('input', calculatePoints);
    fabricWeight.addEventListener('input', calculatePoints);
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.business-card, .value-card, .method-card, .reference-card').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Flow details modal
function showFlowDetails(type) {
    const details = {
        donation: {
            title: '用户捐赠',
            content: '用户通过线上预约、线下投递或社区回收点等方式捐赠旧衣物。我们提供便民的回收服务，让捐赠变得简单易行。'
        },
        sorting: {
            title: 'AI分拣+设计师改造',
            content: '采用AI智能分拣技术，按材质、颜色、款式等维度分类。专业设计师团队根据衣物特点进行创意改造设计。'
        },
        remake: {
            title: 'Remake成品',
            content: '经过专业改造的衣物焕发新生，成为独特的时尚单品、艺术品或实用物品，展现可持续设计的魅力。'
        },
        impact: {
            title: '碳减排+积分激励',
            content: '每件改造衣物都能减少碳排放，用户获得相应积分奖励，可用于兑换商品或参与公益项目。'
        }
    };

    const detail = details[type];
    if (detail) {
        alert(`${detail.title}\n\n${detail.content}`);
    }
}

// Pain point data display
function showPainData(element, data) {
    let tooltip = element.querySelector('.pain-data-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'pain-data-tooltip';
        element.appendChild(tooltip);
    }
    tooltip.textContent = data;
    tooltip.style.opacity = '1';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
    }, 3000);
}

// Case image preview
function showCaseImage(element, imageSrc) {
    let preview = element.querySelector('.case-image-preview');
    if (!preview) {
        preview = document.createElement('img');
        preview.className = 'case-image-preview';
        element.appendChild(preview);
    }
    preview.src = imageSrc;
    preview.style.opacity = '1';
    
    element.addEventListener('mouseleave', function() {
        preview.style.opacity = '0';
    });
}

// External link handler
function openExternal(url) {
    window.open(url, '_blank');
}

// Pickup form modal
function showPickupForm() {
    showModal('pickupModal');
}

// Order tracking
function trackOrder() {
    const orderNumber = document.getElementById('orderNumber').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    if (!orderNumber || !phoneNumber) {
        alert('请输入回收单号和手机号');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        document.getElementById('trackingResult').style.display = 'block';
        alert('查询成功！您的回收进度已更新。');
    }, 1000);
}

// Example image display
function showExampleImage(element, imageSrc) {
    let tooltip = element.querySelector('.example-image-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('img');
        tooltip.className = 'example-image-tooltip';
        element.appendChild(tooltip);
    }
    tooltip.src = imageSrc;
    tooltip.style.opacity = '1';
    
    element.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
    });
}

// Charity donation modal
function showCharityDonation() {
    const points = prompt('请输入要捐赠的积分数量：');
    if (points && !isNaN(points) && points > 0) {
        const amount = Math.floor(points / 10);
        const confirmed = confirm(`确认捐赠 ${points} 积分 = ${amount} 元，将用于乡村艺术教育项目？`);
        if (confirmed) {
            alert('捐赠成功！感谢您的爱心支持。');
        }
    }
}

// Points expiry reminder
function showExpiryReminder() {
    alert('您有100积分将于2024年12月31日到期，请及时使用！');
}

// Login requirement
function requireLogin(section) {
    alert('此功能需要登录，请先登录您的账户。');
    window.location.href = 'personal-center.html';
}

// Form submissions
function submitStoreBooking(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Simulate form submission
    setTimeout(() => {
        alert('预约成功！我们将发送确认短信到您的手机。');
        closeModal('storeBookingModal');
        event.target.reset();
    }, 1000);
}

function submitPickup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Generate order number
    const orderNumber = 'R' + Date.now().toString().slice(-8);
    
    // Simulate form submission
    setTimeout(() => {
        alert(`预约成功！您的回收单号是：${orderNumber}，请保存好以便查询进度。`);
        closeModal('pickupModal');
        event.target.reset();
    }, 1000);
}

// Mobile value content expansion
function toggleValueContent(button) {
    const content = button.parentElement.querySelector('.value-content');
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
        content.classList.remove('expanded');
        button.textContent = '展开';
    } else {
        content.classList.add('expanded');
        button.textContent = '收起';
    }
}

// Add expand buttons for mobile
if (window.innerWidth <= 480) {
    document.querySelectorAll('.value-card').forEach(card => {
        const content = card.querySelector('.value-content');
        if (content && content.scrollHeight > 100) {
            const button = document.createElement('button');
            button.className = 'expand-btn';
            button.textContent = '展开';
            button.onclick = () => toggleValueContent(button);
            card.appendChild(button);
        }
    });
}