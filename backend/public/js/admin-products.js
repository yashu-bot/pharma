checkAuth('admin');

let sections = [];
let products = [];
let productMasterList = [];

// Load product master list for dropdown
async function loadProductMaster() {
    try {
        const response = await axios.get('/product-master');
        productMasterList = response.data.data;
        
        const productNameSelect = document.getElementById('productNameSelect');
        if (productNameSelect) {
            productNameSelect.innerHTML = '<option value="">Select Product</option>' + 
                productMasterList.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
            
            // Initialize Select2 with search functionality
            $(productNameSelect).select2({
                theme: 'bootstrap-5',
                placeholder: 'Search and select product',
                allowClear: true,
                dropdownParent: $('#productModal')
            });
        }
    } catch (error) {
        console.error('Error loading product master:', error);
    }
}

// Calculate selling price based on MRP and discount percentage
function calculateSellingPrice() {
    const mrp = parseFloat(document.getElementById('mrp_per_sheet').value) || 0;
    const discount = parseFloat(document.getElementById('discount_percentage').value) || 0;
    
    if (mrp > 0 && discount >= 0) {
        const sellingPrice = mrp - (mrp * discount / 100);
        document.getElementById('selling_price').value = sellingPrice.toFixed(2);
    }
}

async function loadSections() {
    try {
        const response = await axios.get('/sections');
        sections = response.data.data;
        
        const sectionFilter = document.getElementById('sectionFilter');
        const sectionSelect = document.getElementById('sectionSelect');
        
        sectionFilter.innerHTML = '<option value="">All Sections</option>' + 
            sections.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        
        sectionSelect.innerHTML = '<option value="">Select Section</option>' + 
            sections.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading sections:', error);
    }
}

async function loadProducts() {
    try {
        const section_id = document.getElementById('sectionFilter').value;
        const search = document.getElementById('searchInput').value;
        
        const response = await axios.get('/products/all', {
            params: { section_id, search }
        });
        products = response.data.data;
        
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = products.map(p => {
            let statusBadge = '';
            if (p.expiry_status === 'expired') {
                statusBadge = '<span class="badge bg-danger">Expired</span>';
            } else if (p.expiry_status === 'expiring_soon') {
                statusBadge = '<span class="badge bg-warning">Expiring Soon</span>';
            } else {
                statusBadge = '<span class="badge bg-success">Valid</span>';
            }
            
            let stockBadge = p.stock_status === 'low' ? 
                '<span class="badge bg-danger">Low Stock</span>' : 
                '<span class="badge bg-success">' + p.stock_quantity + '</span>';
            
            return `
                <tr>
                    <td>${p.product_name}</td>
                    <td>${p.mg || '-'}</td>
                    <td>${formatCurrency(p.mrp_per_sheet)}</td>
                    <td>${formatCurrency(p.selling_price)}</td>
                    <td>${stockBadge}</td>
                    <td>${formatDate(p.exp_date)}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('discount_percentage').value = '';
    document.getElementById('modalTitle').textContent = 'Add Product';
    loadProductMaster(); // Reload product master list
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    
    const form = document.getElementById('productForm');
    
    // Set Select2 value for product name
    $('#productNameSelect').val(product.product_name).trigger('change');
    
    form.mg.value = product.mg || '';
    form.mrp_per_sheet.value = product.mrp_per_sheet;
    form.selling_price.value = product.selling_price;
    form.scheme.value = product.scheme || '';
    form.section_id.value = product.section_id;
    form.mfg_date.value = product.mfg_date ? product.mfg_date.split('T')[0] : '';
    form.exp_date.value = product.exp_date ? product.exp_date.split('T')[0] : '';
    form.batch_number.value = product.batch_number || '';
    form.stock_quantity.value = product.stock_quantity;
    
    // Calculate and show discount percentage
    if (product.mrp_per_sheet > 0 && product.selling_price > 0) {
        const discount = ((product.mrp_per_sheet - product.selling_price) / product.mrp_per_sheet * 100).toFixed(2);
        document.getElementById('discount_percentage').value = discount;
    }
    
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await axios.delete(`/products/${id}`);
        showAlert('Product deleted successfully', 'success');
        loadProducts();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Error deleting product', 'danger');
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = document.getElementById('productId').value;
    
    // Remove empty optional fields to avoid validation errors
    if (!data.mg || data.mg.trim() === '') delete data.mg;
    if (!data.scheme || data.scheme.trim() === '') delete data.scheme;
    if (!data.mfg_date || data.mfg_date.trim() === '') delete data.mfg_date;
    if (!data.exp_date || data.exp_date.trim() === '') delete data.exp_date;
    if (!data.batch_number || data.batch_number.trim() === '') delete data.batch_number;
    
    try {
        if (id) {
            await axios.put(`/products/${id}`, data);
            showAlert('Product updated successfully', 'success');
        } else {
            await axios.post('/products', data);
            showAlert('Product added successfully', 'success');
        }
        
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        loadProducts();
    } catch (error) {
        showAlert(error.response?.data?.message || 'Error saving product', 'danger');
    }
});

loadSections();
loadProducts();
loadProductMaster();
