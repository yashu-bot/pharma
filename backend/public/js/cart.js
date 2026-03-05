// Cart Management
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, productName, price, maxStock) {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= maxStock) {
            showAlert(`Cannot add more. Maximum stock available: ${maxStock}`, 'warning');
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            productId,
            productName,
            price,
            quantity: 1,
            maxStock
        });
    }
    
    saveCart(cart);
    showAlert(`${productName} added to cart`, 'success');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else if (quantity > item.maxStock) {
            showAlert(`Maximum stock available: ${item.maxStock}`, 'warning');
            return;
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
    }
}

function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return axios.get('/gst')
        .then(response => {
            const { sgst_percentage, cgst_percentage } = response.data.data;
            const sgst = (subtotal * sgst_percentage) / 100;
            const cgst = (subtotal * cgst_percentage) / 100;
            const grandTotal = subtotal + sgst + cgst;
            
            return {
                subtotal,
                sgst,
                cgst,
                sgst_percentage,
                cgst_percentage,
                grandTotal
            };
        })
        .catch(error => {
            console.error('Error fetching GST:', error);
            // Return default values if API fails
            const sgst = (subtotal * 9) / 100;
            const cgst = (subtotal * 9) / 100;
            const grandTotal = subtotal + sgst + cgst;
            
            return {
                subtotal,
                sgst,
                cgst,
                sgst_percentage: 9,
                cgst_percentage: 9,
                grandTotal
            };
        });
}
