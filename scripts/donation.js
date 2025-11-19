// Donation page specific functionality

let currentStep = 1;
let selectedMethod = '';

// Initialize donation page
document.addEventListener('DOMContentLoaded', function() {
    initializeDonationForm();
    updatePointsCalculation();
});

// Initialize donation form
function initializeDonationForm() {
    // Add event listeners for clothing type checkboxes
    document.querySelectorAll('input[name="clothingType"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePointsCalculation);
    });
    
    // Add event listener for quantity input
    document.getElementById('quantity').addEventListener('input', updatePointsCalculation);
    
    // Form submission
    document.getElementById('donationForm').addEventListener('submit', submitDonationForm);
}

// Select donation method
function selectMethod(method) {
    selectedMethod = method;
    
    // Remove active class from all cards
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected card
    event.currentTarget.classList.add('active');
    
    // Update form based on selected method
    updateFormForMethod(method);
    
    // Scroll to form
    document.querySelector('.donation-form-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Update form based on selected method
function updateFormForMethod(method) {
    const addressGroup = document.getElementById('address').closest('.form-group');
    const appointmentGroup = document.getElementById('appointmentTime').closest('.form-group');
    
    switch(method) {
        case 'pickup':
            addressGroup.style.display = 'block';
            appointmentGroup.style.display = 'block';
            document.querySelector('label[for="address"]').textContent = '上门回收地址 *';
            break;
        case 'store':
            addressGroup.style.display = 'none';
            appointmentGroup.style.display = 'block';
            document.querySelector('label[for="appointmentTime"]').textContent = '到店时间';
            break;
        case 'community':
            addressGroup.style.display = 'block';
            appointmentGroup.style.display = 'none';
            document.querySelector('label[for="address"]').textContent = '就近回收点 *';
            break;
    }
}

// Change form step
function changeStep(direction) {
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    
    // Validate current step before proceeding
    if (direction > 0 && !validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    steps[currentStep - 1].classList.remove('active');
    stepIndicators[currentStep - 1].classList.remove('active');
    
    // Update step number
    currentStep += direction;
    
    // Show new step
    steps[currentStep - 1].classList.add('active');
    stepIndicators[currentStep - 1].classList.add('active');
    
    // Mark previous steps as completed
    for (let i = 0; i < currentStep - 1; i++) {
        stepIndicators[i].classList.add('completed');
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update summary if on step 3
    if (currentStep === 3) {
        updateSummary();
    }
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const selectedTypes = document.querySelectorAll('input[name="clothingType"]:checked');
            const quantity = document.getElementById('quantity').value;
            const condition = document.getElementById('condition').value;
            
            if (selectedTypes.length === 0) {
                alert('请至少选择一种衣物类型');
                return false;
            }
            if (!quantity || quantity < 1) {
                alert('请输入有效的数量');
                return false;
            }
            if (!condition) {
                alert('请选择衣物状况');
                return false;
            }
            break;
            
        case 2:
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            if (!name.trim()) {
                alert('请输入姓名');
                return false;
            }
            if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone)) {
                alert('请输入有效的手机号');
                return false;
            }
            if (selectedMethod !== 'store' && !address.trim()) {
                alert('请输入详细地址');
                return false;
            }
            break;
    }
    return true;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    
    // Show/hide next/submit buttons
    if (currentStep === 3) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Update points calculation
function updatePointsCalculation() {
    const selectedTypes = document.querySelectorAll('input[name="clothingType"]:checked');
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    
    let totalPoints = 0;
    
    selectedTypes.forEach(checkbox => {
        const points = parseInt(checkbox.dataset.points);
        totalPoints += points;
    });
    
    // Multiply by quantity (assuming even distribution)
    if (selectedTypes.length > 0 && quantity > 0) {
        totalPoints = Math.floor((totalPoints / selectedTypes.length) * quantity);
    }
    
    // Update display
    const totalPointsElement = document.getElementById('totalPoints');
    if (totalPointsElement) {
        totalPointsElement.textContent = totalPoints + ' 分';
    }
}

// Update summary
function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const selectedTypes = document.querySelectorAll('input[name="clothingType"]:checked');
    const quantity = document.getElementById('quantity').value;
    const condition = document.getElementById('condition').value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    let html = '';
    
    // Clothing types
    html += '<div class="summary-item"><span>衣物类型：</span><span>';
    const typeLabels = Array.from(selectedTypes).map(cb => 
        cb.nextElementSibling.textContent
    );
    html += typeLabels.join(', ') + '</span></div>';
    
    // Quantity and condition
    html += `<div class="summary-item"><span>数量：</span><span>${quantity} 件</span></div>`;
    html += `<div class="summary-item"><span>状况：</span><span>${getConditionText(condition)}</span></div>`;
    
    // Contact info
    html += `<div class="summary-item"><span>联系人：</span><span>${name}</span></div>`;
    html += `<div class="summary-item"><span>手机号：</span><span>${phone}</span></div>`;
    
    if (selectedMethod !== 'store') {
        html += `<div class="summary-item"><span>地址：</span><span>${address}</span></div>`;
    }
    
    // Method
    html += `<div class="summary-item"><span>回收方式：</span><span>${getMethodText(selectedMethod)}</span></div>`;
    
    summaryContent.innerHTML = html;
}

// Get condition text
function getConditionText(condition) {
    const conditions = {
        'excellent': '九成新以上',
        'good': '七八成新',
        'fair': '五六成新',
        'poor': '需要修补'
    };
    return conditions[condition] || condition;
}

// Get method text
function getMethodText(method) {
    const methods = {
        'pickup': '上门回收',
        'store': '门店投递',
        'community': '社区回收点'
    };
    return methods[method] || method;
}

// Submit donation form
function submitDonationForm(event) {
    event.preventDefault();
    
    // Check agreement
    const agreement = document.getElementById('agreement').checked;
    if (!agreement) {
        alert('请阅读并同意捐赠协议');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'D' + Date.now().toString().slice(-8);
        
        // Show success message
        alert(`捐赠申请提交成功！\n\n您的捐赠单号：${orderNumber}\n\n我们将在24小时内联系您确认具体安排。感谢您对环保事业的支持！`);
        
        // Reset form or redirect
        if (confirm('是否返回首页？')) {
            window.location.href = 'index.html';
        } else {
            // Reset form
            document.getElementById('donationForm').reset();
            currentStep = 1;
            document.querySelectorAll('.form-step').forEach((step, index) => {
                step.classList.toggle('active', index === 0);
            });
            document.querySelectorAll('.step').forEach((step, index) => {
                step.classList.toggle('active', index === 0);
                step.classList.remove('completed');
            });
            updateNavigationButtons();
            updatePointsCalculation();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// Add CSS for active method card
const style = document.createElement('style');
style.textContent = `
    .method-card.active {
        border-color: #28a745 !important;
        background: #f8fff9;
        transform: translateY(-5px);
    }
    
    .method-card.active .btn {
        background: #20c997;
    }
    
    .step.completed .step-number::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);