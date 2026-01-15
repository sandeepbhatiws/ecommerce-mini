// ==================== Product Data ====================
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 79.99,
        emoji: '🎧',
        description: 'High-quality sound with noise cancellation'
    },
    {
        id: 2,
        name: 'Smart Watch',
        category: 'electronics',
        price: 199.99,
        emoji: '⌚',
        description: 'Track your fitness and stay connected'
    },
    {
        id: 3,
        name: 'Laptop',
        category: 'electronics',
        price: 899.99,
        emoji: '💻',
        description: 'Powerful performance for work and gaming'
    },
    {
        id: 4,
        name: 'Designer T-Shirt',
        category: 'clothing',
        price: 49.99,
        emoji: '👕',
        description: 'Comfortable and stylish casual wear'
    },
    {
        id: 5,
        name: 'Denim Jeans',
        category: 'clothing',
        price: 59.99,
        emoji: '👖',
        description: 'Classic fit jeans for everyday wear'
    },
    {
        id: 6,
        name: 'Running Shoes',
        category: 'clothing',
        price: 119.99,
        emoji: '👟',
        description: 'Lightweight and supportive athletic shoes'
    },
    {
        id: 7,
        name: 'JavaScript Guide',
        category: 'books',
        price: 39.99,
        emoji: '📖',
        description: 'Complete guide to JavaScript programming'
    },
    {
        id: 8,
        name: 'Web Design Book',
        category: 'books',
        price: 44.99,
        emoji: '📚',
        description: 'Modern web design principles and practices'
    },
    {
        id: 9,
        name: 'Programming Basics',
        category: 'books',
        price: 34.99,
        emoji: '📕',
        description: 'Fundamental concepts for beginners'
    },
    {
        id: 10,
        name: 'Indoor Plant',
        category: 'home',
        price: 29.99,
        emoji: '🌿',
        description: 'Beautiful green plant for your home'
    },
    {
        id: 11,
        name: 'Coffee Maker',
        category: 'home',
        price: 89.99,
        emoji: '☕',
        description: 'Brew perfect coffee every morning'
    },
    {
        id: 12,
        name: 'Desk Lamp',
        category: 'home',
        price: 49.99,
        emoji: '💡',
        description: 'LED lamp with adjustable brightness'
    }
];

// ==================== Shopping Cart ====================
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartDisplay();
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart display
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cartTotal');

    cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.querySelector('.checkout-btn').disabled = true;
    } else {
        cartItemsDiv.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        document.querySelector('.checkout-btn').disabled = false;
    }

    cartTotalSpan.textContent = calculateCartTotal().toFixed(2);
}

// ==================== Cart Sidebar ====================
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target)) {
        cartSidebar.classList.remove('open');
    }
});

// ==================== Products Display ====================
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">No products found</div>';
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== Search and Filter ====================
function filterProducts() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const categoryValue = document.getElementById('categoryFilter').value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchValue) || 
                            product.description.toLowerCase().includes(searchValue);
        const matchesCategory = categoryValue === '' || product.category === categoryValue;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

// Search input listener
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    // Initial display
    displayProducts();
    loadCart();
});

// ==================== Scroll to Products ====================
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    productsSection.scrollIntoView({ behavior: 'smooth' });
}

// ==================== Checkout Modal ====================
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function handleCheckout(event) {
    event.preventDefault();

    // Validate form
    const form = event.target;
    const formData = new FormData(form);

    // Generate order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Close checkout modal
    closeCheckout();

    // Show confirmation modal
    document.getElementById('orderID').textContent = orderId;
    document.getElementById('confirmationModal').classList.add('open');

    // Log order details (in a real app, this would send to a server)
    console.log('Order placed:', {
        orderId: orderId,
        items: cart,
        total: calculateCartTotal(),
        timestamp: new Date().toISOString()
    });
}

function closeConfirmation() {
    document.getElementById('confirmationModal').classList.remove('open');
}

function completeOrder() {
    closeConfirmation();
    cart = [];
    saveCart();
    updateCartDisplay();
    toggleCart();
    displayProducts();
    showNotification('Thank you for your purchase!');
}

// ==================== Contact Form ====================
function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Log form data (in a real app, this would send to a server)
    console.log('Contact form submitted:', {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    });

    showNotification('Thank you for your message! We will get back to you soon.');
    form.reset();
}

// ==================== Notifications ====================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', function(event) {
    // Press Escape to close cart
    if (event.key === 'Escape') {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('checkoutModal').classList.remove('open');
        document.getElementById('confirmationModal').classList.remove('open');
    }
});

// ==================== Smooth Scrolling ====================
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
