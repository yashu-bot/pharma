// Production API URL - Updated for deployment
const API_URL = 'https://pharma-backend-fbsr.onrender.com/api';

// Axios configuration
axios.defaults.baseURL = API_URL;

// Add token to all requests
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle unauthorized responses
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login.html';
        }
        return Promise.reject(error);
    }
);

// Utility functions
const showAlert = (message, type = 'success') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

const logout = () => {
    localStorage.clear();
    window.location.href = '/login.html';
};

// Back button function
const goBack = () => {
    window.history.back();
};

// Check authentication
const checkAuth = (requiredRole) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.role) {
        window.location.href = '/login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = '/login.html';
        return false;
    }
    
    return true;
};
