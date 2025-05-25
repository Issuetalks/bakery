// DOM Elements
const productContainer = document.getElementById('product-container');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');
const checkoutForm = document.getElementById('checkout-form');
const orderConfirmation = document.getElementById('order-confirmation');
const closeConfirmation = document.querySelector('.close-confirmation');
const orderIdElement = document.getElementById('order-id');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartCount = document.querySelector('.cart-count');

// Product Data (in a real app, this would come from a backend API)
const products = [
    {
        id: 1,
        name: "Sourdough Bread",
        description: "Traditional artisan sourdough with crispy crust",
        price: 5.99,
        category: "bread",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
    },
    {
        id: 2,
        name: "Chocolate Cake",
        description: "Rich chocolate cake with buttercream frosting",
        price: 24.99,
        category: "cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
    },
    {
        id: 3,
        name: "Croissant",
        description: "Buttery French croissant with flaky layers",
        price: 3.50,
        category: "pastry",
        image: "https://images.unsplash.com/photo-1620146344904-097a0002d797"
    },
    {
        id: 4,
        name: "Chocolate Chip Cookies",
        description: "Classic cookies with melty chocolate chips",
        price: 2.99,
        category: "cookie",
        image: "https://images.unsplash.com/photo-1590080874088-eec64895b423"
    },
    {
        id: 5,
        name: "Baguette",
        description: "Traditional French baguette with crisp crust",
        price: 3.99,
        category: "bread",
        image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec"
    },
    {
        id: 6,
        name: "Red Velvet Cake",
        description: "Moist red velvet cake with cream cheese frosting",
        price: 26.99,
        category: "cake",
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f"
    },
    {
        id: 7,
        name: "Cinnamon Roll",
        description: "Sweet roll with cinnamon and cream cheese icing",
        price: 4.25,
        category: "pastry",
        image: "https://images.unsplash.com/photo-1558312651-6009e4825c8d"
    },
    {
        id: 8,
        name: "Macarons",
        description: "French macarons in assorted flavors",
        price: 12.99,
        category: "cookie",
        image: "https://images.unsplash.com/photo-1558326567-98ae2405596b"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Products
function displayProducts(category = 'all') {
    productContainer.innerHTML = '';

    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productContainer.appendChild(productCard);
    });

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Update Cart
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

// Render Cart Items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            const isPlus = e.currentTarget.classList.contains('plus');
            updateQuantity(productId, isPlus);
        });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Update Quantity
function updateQuantity(productId, isPlus) {
    const item = cart.find(item => item.id === productId);

    if (isPlus) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }

    updateCart();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Generate Order ID
function generateOrderId() {
    return 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

// Initialize
displayProducts();

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    renderCartItems();
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // In a real app, you would send this data to your backend
    const orderId = generateOrderId();
    orderIdElement.textContent = orderId;

    // Save order to localStorage (simulating a database)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = {
        id: orderId,
        date: new Date().toISOString(),
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        },
        payment: document.getElementById('payment').value,
        items: cart,
        total: parseFloat(cartTotal.textContent)
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    updateCart();

    // Show confirmation
    checkoutModal.style.display = 'none';
    orderConfirmation.style.display = 'flex';
});

closeConfirmation.addEventListener('click', () => {
    orderConfirmation.style.display = 'none';
});

// Filter Products
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        displayProducts(category);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (e.target === orderConfirmation) {
        orderConfirmation.style.display = 'none';
    }
});

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slide-in 0.5s ease;
    }
    
    .fade-out {
        animation: fade-out 0.5s ease forwards;
    }
    
    @keyframes slide-in {
        from { bottom: -50px; opacity: 0; }
        to { bottom: 20px; opacity: 1; }
    }
    
    @keyframes fade-out {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);