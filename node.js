class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.elements = {
            cartSidebar: document.getElementById('cartSidebar'),
            cartOverlay: document.getElementById('cartOverlay'),
            closeCartBtn: document.getElementById('closeCart'),
            cartItems: document.getElementById('cartItems'),
            cartSubtotal: document.getElementById('cartSubtotal'),
            cartBadge: document.querySelector('.cart-badge')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        
        if (this.elements.cartSidebar?.classList.contains('active')) {
            this.updateCartDisplay();
        }
    }

    setupEventListeners() {
        // Document click handler
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // Close cart button
        if (this.elements.closeCartBtn) {
            this.elements.closeCartBtn.addEventListener('click', () => this.closeCart());
        }
        
        // Cart button in header
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        }
    }

    handleDocumentClick(e) {
        // Close cart when clicking outside
        if (this.elements.cartSidebar?.contains(e.target) || 
            e.target.closest('.cart-btn')) {
            return;
        }
        this.closeCart();
    }

    openCart() {
        this.updateCartDisplay();
        document.body.style.overflow = 'hidden';
        this.elements.cartSidebar?.classList.add('active');
        this.elements.cartOverlay?.classList.add('active');
    }

    closeCart() {
        document.body.style.overflow = '';
        this.elements.cartSidebar?.classList.remove('active');
        this.elements.cartOverlay?.classList.remove('active');
    }

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart`);
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(index, change) {
        const newQuantity = this.cart[index].quantity + change;
        if (newQuantity > 0) {
            this.cart[index].quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    updateCartDisplay() {
        if (!this.elements.cartItems) return;

        if (this.cart.length === 0) {
            this.elements.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            this.elements.cartSubtotal.textContent = '$0.00';
            return;
        }

        this.elements.cartItems.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/80?text=Image+Not+Found';">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <div class="quantity-controls">
                        <button onclick="cart.updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeFromCart(${index})">&times;</button>
            </div>
        `).join('');

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }

    updateCartCount() {
        if (this.elements.cartBadge) {
            const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.elements.cartBadge.textContent = itemCount > 0 ? itemCount : '';
            this.elements.cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
    window.cart = cart; // Make cart globally available
});
