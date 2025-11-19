// Personal Center JavaScript functionality

// Global variables
let currentUser = null;
let currentRating = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeTabs();
    initializeFilters();
    initializeModals();
});

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginOverlay = document.getElementById('loginOverlay');
    const personalCenter = document.getElementById('personalCenter');
    
    if (isLoggedIn) {
        loginOverlay.style.display = 'none';
        personalCenter.style.display = 'block';
        loadUserData();
    } else {
        loginOverlay.style.display = 'flex';
        personalCenter.style.display = 'none';
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const phone = formData.get('phone');
    const code = formData.get('code');
    
    // Simulate login validation
    if (phone && code) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', phone);
        
        // Hide login overlay and show personal center
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('personalCenter').style.display = 'block';
        
        loadUserData();
        alert('登录成功！');
    } else {
        alert('请填写完整信息');
    }
}

// Send verification code
function sendVerificationCode() {
    const phoneInput = document.querySelector('input[name="phone"]');
    const phone = phoneInput.value;
    
    if (!phone) {
        alert('请先输入手机号');
        return;
    }
    
    // Simulate sending code
    alert('验证码已发送到您的手机，请查收');
}

// Load user data
function loadUserData() {
    const phone = localStorage.getItem('userPhone');
    
    // Simulate user data
    currentUser = {
        name: '张三',
        phone: phone,
        memberLevel: '银牌会员',
        avatar: 'assets/images/default-avatar.png',
        availablePoints: 1250,
        expiringPoints: 100,
        expiryDate: '2024年12月31日'
    };
    
    // Update UI
    document.getElementById('username').textContent = currentUser.name;
    document.getElementById('phoneNumber').textContent = currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    document.getElementById('memberLevel').textContent = currentUser.memberLevel;
    document.getElementById('userAvatar').src = currentUser.avatar;
    document.getElementById('availablePoints').textContent = currentUser.availablePoints.toLocaleString();
    document.getElementById('expiringPoints').textContent = currentUser.expiringPoints;
}

// Initialize tabs
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.textContent.trim();
            showTab(getTabId(tabName));
        });
    });
}

// Get tab ID from name
function getTabId(tabName) {
    const tabMap = {
        '积分明细': 'points',
        '捐赠历史': 'donations',
        '预约记录': 'appointments',
        '公益动态': 'charity-updates'
    };
    return tabMap[tabName] || 'points';
}

// Show tab
function showTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activate selected tab
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
        getTabId(btn.textContent.trim()) === tabId
    );
    const activeContent = document.getElementById(tabId + 'Tab');
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
}

// Initialize filters
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.textContent.trim();
            filterPoints(getFilterType(filterType));
        });
    });
}

// Get filter type
function getFilterType(filterName) {
    const filterMap = {
        '全部': 'all',
        '获取': 'earn',
        '支出': 'spend'
    };
    return filterMap[filterName] || 'all';
}

// Filter points records
function filterPoints(type) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = Array.from(document.querySelectorAll('.filter-btn')).find(btn => 
        getFilterType(btn.textContent.trim()) === type
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    // Filter records
    const records = document.querySelectorAll('.record-item');
    records.forEach(record => {
        if (type === 'all') {
            record.style.display = 'flex';
        } else {
            const isMatch = record.classList.contains(type);
            record.style.display = isMatch ? 'flex' : 'none';
        }
    });
}

// Initialize modals
function initializeModals() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Show edit profile modal
function showEditProfile() {
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editPhone').value = currentUser.phone;
    showModal('editProfileModal');
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Update profile
function updateProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    currentUser.name = formData.get('name');
    currentUser.phone = formData.get('phone');
    
    // Update UI
    document.getElementById('username').textContent = currentUser.name;
    document.getElementById('phoneNumber').textContent = currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    
    // Update localStorage
    localStorage.setItem('userPhone', currentUser.phone);
    
    closeModal('editProfileModal');
    alert('个人信息更新成功！');
}

// Show member rules
function showMemberRules() {
    const memberLevel = document.querySelector('.member-level');
    let tooltip = memberLevel.querySelector('.member-rules-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'member-rules-tooltip';
        tooltip.innerHTML = `
            <strong>会员等级规则：</strong><br>
            铜牌会员：1-5次捐赠<br>
            银牌会员：6-15次捐赠<br>
            金牌会员：16-30次捐赠<br>
            钻石会员：31次以上捐赠
        `;
        memberLevel.appendChild(tooltip);
    }
    
    tooltip.style.opacity = '1';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
    }, 3000);
}

// Show donation details
function showDonationDetails(donationId) {
    const details = {
        'D001': {
            id: 'D001',
            date: '2024-11-15',
            type: '成人外套 2件',
            method: '上门回收',
            status: '已完成改造',
            carbonReduction: '2.5kg CO₂',
            pointsEarned: 100,
            charityProject: '乡村艺术教育教具捐赠',
            images: ['assets/images/donation-before.jpg', 'assets/images/donation-after.jpg']
        },
        'D002': {
            id: 'D002',
            date: '2024-10-28',
            type: '儿童衣物 5件',
            method: '线下回收',
            status: '已送达分拣中心',
            carbonReduction: '1.8kg CO₂',
            pointsEarned: 150,
            charityProject: '环保教具制作项目',
            images: ['assets/images/donation2-before.jpg']
        }
    };
    
    const detail = details[donationId];
    if (detail) {
        const content = document.getElementById('donationDetailContent');
        content.innerHTML = `
            <div class="detail-section">
                <h4>捐赠信息</h4>
                <p><strong>捐赠编号：</strong>${detail.id}</p>
                <p><strong>捐赠时间：</strong>${detail.date}</p>
                <p><strong>衣物类型：</strong>${detail.type}</p>
                <p><strong>回收方式：</strong>${detail.method}</p>
                <p><strong>当前状态：</strong>${detail.status}</p>
            </div>
            
            <div class="detail-section">
                <h4>环保贡献</h4>
                <p><strong>碳减排量：</strong>${detail.carbonReduction}</p>
                <p><strong>获得积分：</strong>${detail.pointsEarned}分</p>
                <p><strong>对应公益项目：</strong>${detail.charityProject}</p>
            </div>
            
            <div class="detail-section">
                <h4>改造过程</h4>
                <div class="detail-images">
                    ${detail.images.map(img => `<img src="${img}" alt="改造过程" style="width: 150px; height: 100px; object-fit: cover; border-radius: 8px; margin: 5px;">`).join('')}
                </div>
            </div>
        `;
        showModal('donationDetailsModal');
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    const confirmed = confirm('确定要取消这个预约吗？取消后不可恢复。');
    if (confirmed) {
        // Find and update appointment status
        const appointments = document.querySelectorAll('.appointment-item');
        appointments.forEach(item => {
            const actions = item.querySelector('.appointment-actions');
            if (actions && actions.querySelector(`[onclick*="${appointmentId}"]`)) {
                const status = item.querySelector('.appointment-status');
                status.textContent = '已取消';
                status.className = 'appointment-status cancelled';
                actions.innerHTML = '<span style="color: #6c757d;">已取消</span>';
            }
        });
        
        alert('预约已取消');
    }
}

// Show review form
function showReviewForm(appointmentId) {
    currentAppointmentId = appointmentId;
    showModal('reviewModal');
}

// Set rating
function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Submit review
function submitReview(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const review = formData.get('review');
    
    if (currentRating === 0) {
        alert('请选择评分');
        return;
    }
    
    // Simulate review submission
    setTimeout(() => {
        alert('评价提交成功！感谢您的反馈。');
        closeModal('reviewModal');
        event.target.reset();
        currentRating = 0;
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
        });
    }, 1000);
}

// Show points exchange
function showPointsExchange() {
    alert('积分兑换功能开发中，敬请期待！');
}

// Logout
function logout() {
    const confirmed = confirm('确定要退出登录吗？');
    if (confirmed) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userPhone');
        window.location.reload();
    }
}

// Scroll to section (for navigation from personal center)
function scrollToSection(sectionId) {
    window.location.href = `index.html#${sectionId}`;
}

// Mobile responsive adjustments
function adjustForMobile() {
    if (window.innerWidth <= 768) {
        // Adjust tab layout for mobile
        const centerTabs = document.querySelector('.center-tabs');
        if (centerTabs) {
            centerTabs.style.flexDirection = 'column';
        }
        
        // Adjust points overview for mobile
        const pointsOverview = document.querySelector('.points-overview');
        if (pointsOverview) {
            pointsOverview.style.gridTemplateColumns = '1fr';
        }
    }
}

// Call mobile adjustments on load and resize
window.addEventListener('load', adjustForMobile);
window.addEventListener('resize', adjustForMobile);

// Auto-refresh points data (simulate real-time updates)
setInterval(() => {
    if (currentUser && document.getElementById('personalCenter').style.display !== 'none') {
        // Simulate small points changes
        const change = Math.floor(Math.random() * 10) - 5;
        if (change !== 0) {
            currentUser.availablePoints += change;
            document.getElementById('availablePoints').textContent = currentUser.availablePoints.toLocaleString();
        }
    }
}, 30000); // Update every 30 seconds