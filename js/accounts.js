// Accounts page specific functions

let userAccounts = [];
let allAccounts = [];

// Load user accounts
async function loadUserAccounts() {
    const accountsList = document.getElementById('accounts-list');
    if (!accountsList) return;
    
    showLoading('accounts-list', 'Loading your accounts...');
    
    try {
        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        
        const accounts = await accountAPI.getUserAccounts(user.userId);
        userAccounts = accounts;
        
        if (accounts && accounts.length > 0) {
            displayUserAccounts(accounts);
        } else {
            showEmptyAccountsList();
        }
        
    } catch (error) {
        console.error('Error loading accounts:', error);
        handleApiError(error, 'accounts-alert');
        
        accountsList.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error loading accounts. Please try refreshing the page.
            </div>
        `;
    }
}

// Display user accounts
function displayUserAccounts(accounts) {
    const accountsList = document.getElementById('accounts-list');
    if (!accountsList) return;
    
    let totalBalance = 0;
    let accountsHtml = '';
    
    // Summary header
    accounts.forEach(account => {
        totalBalance += parseFloat(account.balance || 0);
    });
    
    accountsHtml += `
        <div class="row mb-4">
            <div class="col-12">
                <div class="accounts-summary-card">
                    <div class="row text-center">
                        <div class="col-md-4">
                            <h3 class="text-primary">${accounts.length}</h3>
                            <p class="text-muted mb-0">Total Accounts</p>
                        </div>
                        <div class="col-md-4">
                            <h3 class="text-success">${formatCurrency(totalBalance)}</h3>
                            <p class="text-muted mb-0">Total Balance</p>
                        </div>
                        <div class="col-md-4">
                            <h3 class="text-info">${formatCurrency(totalBalance / accounts.length)}</h3>
                            <p class="text-muted mb-0">Average Balance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Individual account cards
    accountsHtml += '<div class="row">';
    
    accounts.forEach(account => {
        const balanceClass = parseFloat(account.balance || 0) < 100 ? 'text-warning' : 'text-success';
        
        accountsHtml += `
            <div class="col-lg-6 mb-4">
                <div class="account-card">
                    <div class="account-header">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="account-name">${account.accountName || 'Account'}</h5>
                                <p class="account-number text-muted mb-0">
                                    ${formatAccountNumber(account.accountNumber)}
                                </p>
                            </div>
                            <span class="badge bg-primary account-type">${account.accountType || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="account-balance">
                        <h3 class="${balanceClass}">${formatCurrency(account.balance || 0)}</h3>
                        <small class="text-muted">Available Balance</small>
                    </div>
                    
                    <div class="account-actions">
                        <div class="btn-group w-100" role="group">
                            <button type="button" class="btn btn-outline-primary" 
                                    onclick="viewAccountDetails('${account.accountId}')">
                                <i class="fas fa-eye me-1"></i>Details
                            </button>
                            <button type="button" class="btn btn-outline-success" 
                                    onclick="quickTransfer('${account.accountId}')">
                                <i class="fas fa-paper-plane me-1"></i>Transfer
                            </button>
                            <button type="button" class="btn btn-outline-info" 
                                    onclick="copyAccountNumber('${account.accountNumber}')">
                                <i class="fas fa-copy me-1"></i>Copy #
                            </button>
                        </div>
                    </div>
                    
                    <div class="account-footer">
                        <small class="text-muted">
                            <i class="fas fa-calendar me-1"></i>
                            Opened: ${formatDate(account.createdDate || new Date())}
                        </small>
                    </div>
                </div>
            </div>
        `;
    });
    
    accountsHtml += '</div>';
    accountsList.innerHTML = accountsHtml;
    
    // Add animation to cards
    setTimeout(() => {
        const cards = accountsList.querySelectorAll('.account-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// Show empty accounts list
function showEmptyAccountsList() {
    const accountsList = document.getElementById('accounts-list');
    if (!accountsList) return;
    
    accountsList.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-piggy-bank fa-5x text-muted mb-4"></i>
            <h3>No Accounts Yet</h3>
            <p class="text-muted mb-4">You haven't created any bank accounts yet. Get started by creating your first account.</p>
            <a href="add-account.html" class="btn btn-primary btn-lg">
                <i class="fas fa-plus me-2"></i>Create Your First Account
            </a>
        </div>
    `;
}

// View account details
function viewAccountDetails(accountId) {
    const account = userAccounts.find(acc => acc.accountId === accountId);
    if (!account) return;
    
    // Create modal or detailed view
    const modalHtml = `
        <div class="modal fade" id="accountDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Account Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="detail-group">
                                    <label>Account Name:</label>
                                    <p>${account.accountName || 'N/A'}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Account Number:</label>
                                    <p>${account.accountNumber || 'N/A'}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Account Type:</label>
                                    <p>${account.accountType || 'N/A'}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="detail-group">
                                    <label>Current Balance:</label>
                                    <p class="h4 text-success">${formatCurrency(account.balance || 0)}</p>
                                </div>
                                <div class="detail-group">
                                    <label>Account Status:</label>
                                    <p><span class="badge bg-success">Active</span></p>
                                </div>
                                <div class="detail-group">
                                    <label>Date Opened:</label>
                                    <p>${formatDate(account.createdDate || new Date())}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="quickTransfer('${account.accountId}')">
                            <i class="fas fa-paper-plane me-2"></i>Transfer From This Account
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('accountDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('accountDetailsModal'));
    modal.show();
}

// Quick transfer from specific account
function quickTransfer(accountId) {
    // Store the selected account and redirect to transfer page
    setSessionStorageItem('selectedFromAccount', accountId);
    window.location.href = 'transfer.html';
}

// Copy account number to clipboard
function copyAccountNumber(accountNumber) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            // Show temporary success message
            showTemporaryMessage('Account number copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showTemporaryMessage('Failed to copy account number', 'danger');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = accountNumber;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showTemporaryMessage('Account number copied to clipboard!', 'success');
        } catch (err) {
            showTemporaryMessage('Failed to copy account number', 'danger');
        }
        document.body.removeChild(textArea);
    }
}

// Show temporary message
function showTemporaryMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Filter accounts by type
function filterAccountsByType(type) {
    if (type === 'all') {
        displayUserAccounts(userAccounts);
    } else {
        const filteredAccounts = userAccounts.filter(account => 
            account.accountType && account.accountType.toLowerCase() === type.toLowerCase()
        );
        displayUserAccounts(filteredAccounts);
    }
}

// Search accounts
function searchAccounts(query) {
    if (!query.trim()) {
        displayUserAccounts(userAccounts);
        return;
    }
    
    const filteredAccounts = userAccounts.filter(account => 
        (account.accountName && account.accountName.toLowerCase().includes(query.toLowerCase())) ||
        (account.accountNumber && account.accountNumber.includes(query)) ||
        (account.accountType && account.accountType.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayUserAccounts(filteredAccounts);
}

// Initialize accounts page
function initializeAccountsPage() {
    // Add search functionality if search input exists
    const searchInput = document.getElementById('account-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchAccounts(e.target.value);
        }, 300));
    }
    
    // Add filter functionality if filter select exists
    const filterSelect = document.getElementById('account-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            filterAccountsByType(e.target.value);
        });
    }
    
    // Add refresh functionality
    const refreshBtn = document.getElementById('refresh-accounts');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadUserAccounts);
    }
}

// Export functions for use in other files
window.accountsFunctions = {
    loadUserAccounts,
    viewAccountDetails,
    quickTransfer,
    copyAccountNumber,
    filterAccountsByType,
    searchAccounts
};
