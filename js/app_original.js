// API Configuration
const API_BASE_URL = 'http://localhost:8080/OnlineBank/api';

// Global variables
let currentUser = null;
let userAccounts = [];
let allAccounts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadPage('index');
});

// Check if user is authenticated
function checkAuthStatus() {
    // For now, we'll use session storage to maintain login state
    // In a real application, you might want to use JWT tokens
    const userData = sessionStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        showUserMenu();
        
        // Update navbar brand for logged-in users
        const navbarBrand = document.querySelector('.navbar-brand');
        navbarBrand.textContent = 'Dashboard';
        navbarBrand.onclick = () => loadPage('dashboard');
    } else {
        showAuthButtons();
        
        // Reset navbar brand for logged-out users
        const navbarBrand = document.querySelector('.navbar-brand');
        navbarBrand.textContent = 'Online Bank';
        navbarBrand.onclick = () => loadPage('index');
    }
}

// Show user menu when logged in
function showUserMenu() {
    document.getElementById('auth-buttons').classList.add('d-none');
    document.getElementById('user-menu').classList.remove('d-none');
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.userName;
    }
}

// Show auth buttons when logged out
function showAuthButtons() {
    document.getElementById('auth-buttons').classList.remove('d-none');
    document.getElementById('user-menu').classList.add('d-none');
    currentUser = null;
}

// Load different pages
function loadPage(page) {
    const mainContent = document.getElementById('main-content');
    
    switch(page) {
        case 'index':
            if (currentUser) {
                loadDashboardPage();
            } else {
                loadHomePage();
            }
            break;
        case 'login':
            loadLoginPage();
            break;
        case 'register':
            loadRegisterPage();
            break;
        case 'dashboard':
            if (currentUser) {
                loadDashboardPage();
            } else {
                loadLoginPage();
            }
            break;
        case 'accounts':
            if (currentUser) {
                loadAccountsPage();
            } else {
                loadLoginPage();
            }
            break;
        case 'transfer':
            if (currentUser) {
                loadTransferPage();
            } else {
                loadLoginPage();
            }
            break;
        case 'transfer-confirm':
            if (currentUser) {
                loadTransferConfirmPage();
            } else {
                loadLoginPage();
            }
            break;
        case 'addAccount':
            if (currentUser) {
                loadAddAccountPage();
            } else {
                loadLoginPage();
            }
            break;
        default:
            loadHomePage();
    }
}

// Load home page
function loadHomePage() {
    // Reset navbar brand to Online Bank
    const navbarBrand = document.querySelector('.navbar-brand');
    navbarBrand.textContent = 'Online Bank';
    navbarBrand.onclick = () => loadPage('index');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-4 fw-bold mb-4">Welcome to Online Bank</h1>
                        <p class="lead mb-4">Experience secure and convenient banking with our modern online platform. Transfer money, check balances, and manage your accounts with ease.</p>
                        <div class="d-flex gap-3">
                            <a href="#" class="btn btn-primary btn-lg" onclick="loadPage('register')">Get Started</a>
                            <a href="#" class="btn btn-outline-primary btn-lg" onclick="loadPage('login')">Login</a>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <img src="https://via.placeholder.com/600x400/0d6efd/ffffff?text=Online+Banking" alt="Online Banking" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-5">
            <div class="container">
                <h2 class="text-center mb-5">Our Features</h2>
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h4>Secure Banking</h4>
                            <p>Your money is protected with state-of-the-art security measures and encryption.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <h4>Mobile Friendly</h4>
                            <p>Access your accounts from anywhere with our responsive mobile-friendly interface.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <h4>Quick Transfers</h4>
                            <p>Transfer money instantly between accounts with our fast and reliable system.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-5 bg-light">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h2>About Online Bank</h2>
                        <p class="lead">We are committed to providing you with the best banking experience possible. Our platform combines security, convenience, and innovation to meet all your banking needs.</p>
                        <p>With years of experience in the financial industry, we understand what our customers need and continuously work to improve our services.</p>
                    </div>
                    <div class="col-lg-6">
                        <img src="https://via.placeholder.com/500x300/6c757d/ffffff?text=About+Us" alt="About Us" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </section>
    `;
}

// Load login page
function loadLoginPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container">
            <div class="form-container fade-in">
                <h2 class="text-center mb-4">Login to Your Account</h2>
                <div id="login-alert"></div>
                <form id="login-form">
                    <div class="mb-3">
                        <label for="phoneNumber" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phoneNumber" name="phoneNumber" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
                <div class="text-center mt-3">
                    <p>Don't have an account? <a href="#" onclick="loadPage('register')">Register here</a></p>
                    <div class="mt-2">
                        <a href="#" onclick="loadPage('index')" class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-arrow-left me-1"></i>Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add form submit handler
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Load register page
function loadRegisterPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container">
            <div class="form-container fade-in">
                <h2 class="text-center mb-4">Create New Account</h2>
                <div id="register-alert"></div>
                <form id="register-form">
                    <div class="mb-3">
                        <label for="name" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="phoneNumber" class="form-label">Phone Number</label>
                        <input type="tel" class="form-control" id="phoneNumber" name="phoneNumber" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Register</button>
                </form>
                <div class="text-center mt-3">
                    <p>Already have an account? <a href="#" onclick="loadPage('login')">Login here</a></p>
                    <div class="mt-2">
                        <a href="#" onclick="loadPage('index')" class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-arrow-left me-1"></i>Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add form submit handler
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Load dashboard page
function loadDashboardPage() {
    // Update navbar brand to show Dashboard
    const navbarBrand = document.querySelector('.navbar-brand');
    navbarBrand.textContent = 'Dashboard';
    navbarBrand.onclick = () => loadPage('dashboard');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="row">
                <div class="col-12">
                    <h2 class="mb-4">Welcome, ${currentUser ? currentUser.userName : 'User'}!</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="dashboard-card">
                        <h4><i class="fas fa-plus text-primary"></i> Account Management</h4>
                        <p>Manage new account.</p>
                        <button class="btn btn-primary" onclick="loadPage('addAccount')">
                            Add Account
                        </button>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="dashboard-card">
                        <h4><i class="fas fa-exchange-alt text-primary"></i> Fund Transfer</h4>
                        <p>Transfer funds to other accounts securely.</p>
                        <button class="btn btn-primary" onclick="loadPage('transfer')">
                            Transfer Funds
                        </button>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="dashboard-card">
                        <h4><i class="fas fa-list text-primary"></i> View Accounts</h4>
                        <p>View and manage your existing bank accounts.</p>
                        <button class="btn btn-primary" onclick="loadPage('accounts')">
                            View Accounts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load accounts page
function loadAccountsPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>My Accounts</h2>
                        <a href="#" onclick="loadPage('dashboard')" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div id="accounts-container">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Load accounts data
    loadAccountsData();
}

// Load transfer page with dropdowns
function loadTransferPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Fund Transfer</h2>
                        <a href="#" onclick="loadPage('dashboard')" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-1"></i>Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="form-container">
                        <div id="transfer-alert"></div>
                        <form id="transfer-form">
                            <div class="mb-3">
                                <label for="fromAccount" class="form-label">From Account</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-wallet"></i></span>
                                    <select class="form-select" id="fromAccount" name="fromAccountId" required>
                                        <option value="">Select your account</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="toAccount" class="form-label">To Account</label>
                                <select class="form-select" id="toAccount" name="toAccountId" required>
                                    <option value="">Select Beneficiary Account</option>
                                </select>
                            </div>
                            


                            <div class="mb-3">
    <label class="form-label">Transfer Mode</label>
    <div style="display:flex; gap:20px;">
        <div class="form-check" style="display:flex; flex-direction:column; justify-content:center; align-items:flex-start; border:1px solid #ccc; border-radius:6px; padding:10px; width:200px; height:200px; box-sizing:border-box;">
            <input class="form-check-input" type="radio" name="transferMode" id="neft" value="NEFT" checked>
            <label class="form-check-label" for="neft">
                <strong>NEFT</strong> - National 
                <br><small class="text-muted">Settled in batches, available 24/7</small>
            </label>
        </div>
        <div class="form-check" style="display:flex; flex-direction:column; justify-content:center; align-items:flex-start; border:1px solid #ccc; border-radius:6px; padding:10px; width:200px; height:200px; box-sizing:border-box;">
            <input class="form-check-input" type="radio" name="transferMode" id="rtgs" value="RTGS">
            <label class="form-check-label" for="rtgs">
                <strong>RTGS</strong> - Real Time Gross Settlement
                <br><small class="text-muted">Real-time settlement, minimum ₹2 lakhs</small>
            </label>
        </div>
        <div class="form-check" style="display:flex; flex-direction:column; justify-content:center; align-items:flex-start; border:1px solid #ccc; border-radius:6px; padding:10px; width:200px; height:200px; box-sizing:border-box;">
            <input class="form-check-input" type="radio" name="transferMode" id="imps" value="IMPS">
            <label class="form-check-label" for="imps">
                <strong>IMPS</strong> - Immediate Payment Service
                <br><small class="text-muted">Instant transfer, available 24/7</small>
            </label>
        </div>
    </div>
</div>

                            
                            <div class="mb-3">
                                <label for="amount" class="form-label">Amount (₹)</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-rupee-sign"></i></span>
                                    <input type="number" class="form-control" id="amount" name="amount" 
                                           step="0.01" min="0.01" required 
                                           placeholder="Enter amount in Indian Rupees">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100 mb-3">Verify & Complete Transfer</button>
                        </form>
                        

                    </div>
                </div>
            </div>
        </div>
    `;

    // Load user accounts for dropdowns
    loadTransferAccounts();
    
    // Add form submit handler
    document.getElementById('transfer-form').addEventListener('submit', handleTransfer);
}

// Load transfer confirmation page
function loadTransferConfirmPage() {
    const transferData = JSON.parse(sessionStorage.getItem('transferData') || '{}');
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Confirm Transfer</h2>
                        <a href="#" onclick="loadPage('transfer')" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-1"></i>Back to Transfer
                        </a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <div class="form-container">
                        <div id="confirm-alert"></div>
                        
                        <div class="transaction-details">
                            <div class="detail-row">
                                <span class="detail-label">From Account:</span>
                                <span class="detail-value">${transferData.fromAccount || ''}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">To Account:</span>
                                <span class="detail-value">${transferData.toAccount || ''}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Beneficiary Name:</span>
                                <span class="detail-value">${transferData.beneficiaryName || ''}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Transfer Mode:</span>
                                <span class="detail-value">${transferData.transferMode || ''}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Amount:</span>
                                <span class="detail-value">₹${transferData.amount ? parseFloat(transferData.amount).toLocaleString('en-IN', {minimumFractionDigits: 2}) : ''}</span>
                            </div>
                        </div>

                        <div class="alert alert-info">
                            <strong>OTP for verification:</strong> <span id="otp-display">${transferData.otp || ''}</span>
                            <br><small class="text-muted">(This is for demo purposes only. In production, this would be sent to your registered phone number.)</small>
                        </div>
                        
                        <form id="confirm-form">
                            <div class="mb-3">
                                <label for="otp" class="form-label">Enter OTP</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-key"></i></span>
                                    <input type="text" class="form-control" id="otp" name="otp" 
                                           required maxlength="6" pattern="[0-9]{6}"
                                           placeholder="Enter 6-digit OTP">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100 mb-3">Verify & Complete Transfer</button>
                        </form>
                        

                    </div>
                </div>
            </div>
        </div>
    `;

    // Add form submit handler
    document.getElementById('confirm-form').addEventListener('submit', handleTransferConfirm);
}

// Load add account page
function loadAddAccountPage() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Add New Account</h2>
                        <a href="#" onclick="loadPage('accounts')" class="btn btn-outline-secondary">
                            <i class="fas fa-arrow-left me-1"></i>Back to Accounts
                        </a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mx-auto">
                    <div class="form-container">
                        <div id="add-account-alert"></div>
                        <form id="add-account-form">
                            <div class="mb-3">
                                <label for="accountNumber" class="form-label">Account Number(10-16)Digits.</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-credit-card"></i></span>
                                    <input type="text" class="form-control" id="accountNumber" name="accountNumber" 
                                           placeholder="Enter account number (10-16 digits)">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="initialBalance" class="form-label">Initial Balance (₹)</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fas fa-rupee-sign"></i></span>
                                    <input type="number" class="form-control" id="initialBalance" name="initialBalance" 
                                           step="0.01" min="0"
                                           placeholder="Enter initial balance">
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100 mb-3">Add Account</button>
                        </form>
                        

                    </div>
                </div>
            </div>
        </div>
    `;

    // Add form submit handler
    document.getElementById('add-account-form').addEventListener('submit', handleAddAccount);
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include' // Include cookies for session management
        };

        if (data && method === 'POST') {
            const formData = new URLSearchParams();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            options.body = formData;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertDiv = document.getElementById('login-alert');
    alertDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Logging in...
            </div>
        </div>
    `;

    const result = await apiCall('/login', 'POST', data);
    
    if (result.success) {
        currentUser = result.data;
        sessionStorage.setItem('userData', JSON.stringify(currentUser));
        showUserMenu();
        
        // Update navbar brand
        const navbarBrand = document.querySelector('.navbar-brand');
        navbarBrand.textContent = 'Dashboard';
        navbarBrand.onclick = () => loadPage('dashboard');
        
        loadPage('dashboard');
    } else {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'Login failed'}
            </div>
        `;
    }
}

// Handle register
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    if (data.password !== data.confirmPassword) {
        document.getElementById('register-alert').innerHTML = `
            <div class="alert alert-danger">
                Passwords do not match
            </div>
        `;
        return;
    }
    
    const alertDiv = document.getElementById('register-alert');
    alertDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Creating account...
            </div>
        </div>
    `;

    const result = await apiCall('/register', 'POST', data);
    
    if (result.success) {
        alertDiv.innerHTML = `
            <div class="alert alert-success">
                Account created successfully! Please login.
            </div>
        `;
        setTimeout(() => {
            loadPage('login');
        }, 2000);
    } else {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'Registration failed'}
            </div>
        `;
    }
}

// Load accounts data
async function loadAccountsData() {
    const container = document.getElementById('accounts-container');
    
    const result = await apiCall('/accounts');
    
    if (result.success) {
        const accounts = result.data.accounts;
        const transactions = result.data.transactions;
        
        let html = '';
        
        if (accounts.length === 0) {
            html = `
                <div class="alert alert-info">
                    No accounts found. Please contact support to create an account.
                </div>
            `;
        } else {
            html = `
                <div class="row">
                    ${accounts.map(account => `
                        <div class="col-md-6 mb-3">
                            <div class="balance-card">
                                <h5>Account Number</h5>
                                <div class="balance-amount">${account.accountNumber}</div>
                                <h5>Balance</h5>
                                <div class="balance-amount">₹${account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            if (transactions.length > 0) {
                html += `
                    <div class="mt-4">
                        <h4>Recent Transactions</h4>
                        ${transactions.slice(0, 10).map(transaction => `
                            <div class="transaction-item ${transaction.transactionType === 'CREDIT' ? 'transaction-credit' : 'transaction-debit'}">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>${transaction.transactionType}</strong>
                                        <br>
                                        <small class="text-muted">${transaction.transferMode || 'NEFT'}</small>
                                        <br>
                                        <small class="text-muted">${new Date(transaction.transactionDate).toLocaleDateString()}</small>
                                    </div>
                                    <div class="text-end">
                                        <strong>₹${transaction.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
                                        <br>
                                        <small class="text-muted">${transaction.status}</small>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
        
        container.innerHTML = html;
    } else {
        container.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'Failed to load accounts'}
            </div>
        `;
    }
}

// Load transfer accounts for dropdowns
async function loadTransferAccounts() {
    const fromSelect = document.getElementById('fromAccount');
    const toSelect = document.getElementById('toAccount');
    
    const result = await apiCall('/accounts');
    
    if (result.success) {
        userAccounts = result.data.accounts;
        allAccounts = result.data.allAccounts || [];
        
        // Populate from account dropdown (user's accounts)
        fromSelect.innerHTML = '<option value="">Select your account</option>';
        userAccounts.forEach(account => {
            fromSelect.innerHTML += `
                <option value="${account.accountId}">
                    ${account.accountNumber} - ₹${account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                </option>
            `;
        });
        
        // Populate to account dropdown (all other accounts)
        toSelect.innerHTML = '<option value="">Select Beneficiary Account</option>';
        allAccounts.forEach(account => {
            toSelect.innerHTML += `
                <option value="${account.accountId}">
                    ${account.accountNumber} - ${account.beneficiaryName} (₹${account.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})})
                </option>
            `;
        });
    }
}

// Handle transfer
async function handleTransfer(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertDiv = document.getElementById('transfer-alert');
    alertDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Processing transfer...
            </div>
        </div>
    `;

    const result = await apiCall('/transfer', 'POST', data);
    
    if (result.success) {
        // Store transfer data for confirmation page
        const transferData = {
            fromAccount: userAccounts.find(acc => acc.accountId == data.fromAccountId)?.accountNumber,
            toAccount: allAccounts.find(acc => acc.accountId == data.toAccountId)?.accountNumber,
            beneficiaryName: allAccounts.find(acc => acc.accountId == data.toAccountId)?.beneficiaryName,
            transferMode: data.transferMode,
            amount: data.amount,
            otp: result.data.otp
        };
        sessionStorage.setItem('transferData', JSON.stringify(transferData));
        
        // Redirect to confirmation page
        loadPage('transfer-confirm');
    } else {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'Transfer failed'}
            </div>
        `;
    }
}

// Handle transfer confirmation
async function handleTransferConfirm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertDiv = document.getElementById('confirm-alert');
    alertDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Verifying OTP and completing transfer...
            </div>
        </div>
    `;

    // Call the OTP verification API
    const result = await apiCall('/verifyOtp', 'POST', data);
    
    if (result.success) {
        // Show success confirmation screen
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="row">
                    <div class="col-12">
                        <div class="text-center">
                            <div class="mb-4">
                                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                            </div>
                            <h2 class="text-success mb-3">Transfer Completed Successfully!</h2>
                            <div class="alert alert-success">
                                <h5>Transaction Details</h5>
                                <p><strong>Amount:</strong> ₹${result.data.amount ? parseFloat(result.data.amount).toLocaleString('en-IN', {minimumFractionDigits: 2}) : '0.00'}</p>
                                <p><strong>Transfer Mode:</strong> ${result.data.transferMode || 'NEFT'}</p>
                                <p><strong>Status:</strong> Completed</p>
                                <p class="mb-0">Your money has been transferred successfully. You will receive a confirmation shortly.</p>
                            </div>
                            <div class="mt-4">
                                <a href="#" class="btn btn-primary me-2" onclick="loadPage('dashboard')">Go to Dashboard</a>
                                <a href="#" class="btn btn-outline-primary" onclick="loadPage('accounts')">View Accounts</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Clear transfer data
        sessionStorage.removeItem('transferData');
    } else {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'OTP verification failed'}
            </div>
        `;
    }
}

// Handle add account
async function handleAddAccount(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertDiv = document.getElementById('add-account-alert');
    alertDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                Adding account...
            </div>
        </div>
    `;

    const result = await apiCall('/addAccount', 'POST', data);
    
    if (result.success) {
        alertDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>Account Added Successfully!</h5>
                <p>Your new account has been created with account number: ${data.accountNumber}</p>
            </div>
        `;
        
        // Redirect to accounts page after 3 seconds
        setTimeout(() => {
            loadPage('accounts');
        }, 3000);
    } else {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                ${result.error || 'Failed to add account'}
            </div>
        `;
    }
}

// Load recent activity
async function loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    
    const result = await apiCall('/accounts');
    
    if (result.success && result.data.transactions) {
        const transactions = result.data.transactions.slice(0, 5);
        
        if (transactions.length === 0) {
            container.innerHTML = '<p class="text-muted">No recent activity</p>';
        } else {
            container.innerHTML = transactions.map(transaction => `
                <div class="transaction-item ${transaction.transactionType === 'CREDIT' ? 'transaction-credit' : 'transaction-debit'}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${transaction.transactionType}</strong>
                            <br>
                            <small class="text-muted">${transaction.transferMode || 'NEFT'}</small>
                            <br>
                            <small class="text-muted">${new Date(transaction.transactionDate).toLocaleDateString()}</small>
                        </div>
                        <div class="text-end">
                            <strong>₹${transaction.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } else {
        container.innerHTML = '<p class="text-muted">Unable to load recent activity</p>';
    }
}

// Logout function
async function logout() {
    await apiCall('/logout', 'POST');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('transferData');
    currentUser = null;
    showAuthButtons();
    
    // Reset navbar brand
    const navbarBrand = document.querySelector('.navbar-brand');
    navbarBrand.textContent = 'Online Bank';
    navbarBrand.onclick = () => loadPage('index');
    
    loadPage('index');
} 