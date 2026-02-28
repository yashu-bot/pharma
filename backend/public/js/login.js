// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await axios.post('/auth/admin/login', data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = 'admin/dashboard.html';
    } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
    }
});

// Worker Login
document.getElementById('workerLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await axios.post('/auth/worker/login', data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = 'worker/dashboard.html';
    } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
    }
});

// User Login
document.getElementById('userLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await axios.post('/auth/user/login', data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = 'user/dashboard.html';
    } catch (error) {
        alert(error.response?.data?.message || 'Login failed');
    }
});
