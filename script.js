document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutPopup = document.getElementById('checkout-popup');
    const closePopup = document.querySelector('.close-popup');
    const cartTotalContainer = document.getElementById('cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('open');
        }

        if (mainNav.classList.contains('nav-open') && !mainNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            mainNav.classList.remove('nav-open');
        }
    });

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('nav-open')) {
                mainNav.classList.remove('nav-open');
            }
        });
    });

    document.querySelectorAll('.add-to-cart').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productElement = event.target.closest('.product');
            const product = {
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                img: productElement.dataset.img,
            };
            addToCart(product);
            cartDropdown.classList.add('open');
        });
    });

    cartItemsContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = e.target;
        const itemName = target.dataset.name;
        if (!itemName) return;
        
        const itemIndex = cart.findIndex(item => item.name === itemName);
        if (itemIndex === -1) return;
        
        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
            }
            updateCart();
        }

        if (target.classList.contains('delete-btn')) {
            cart.splice(itemIndex, 1);
            updateCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            if(checkoutPopup) checkoutPopup.style.display = 'block';
        } else {
            window.location.href = 'checkout.html';
            cart = [];
            updateCart();
            cartDropdown.classList.remove('open');
        }
    });

    if (closePopup) {
        closePopup.addEventListener('click', () => {
            checkoutPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (checkoutPopup && e.target == checkoutPopup) {
            checkoutPopup.style.display = 'none';
        }
    });

    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (cart.length === 0) {
            if(emptyCartMessage) emptyCartMessage.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            if(checkoutBtn) checkoutBtn.style.display = 'block';
            if(cartTotalContainer) cartTotalContainer.style.display = 'none';
        } else {
            if(emptyCartMessage) emptyCartMessage.style.display = 'none';
            if(checkoutBtn) checkoutBtn.style.display = 'block';
            if(cartTotalContainer) cartTotalContainer.style.display = 'block';

            let total = 0;
            cartItemsContainer.innerHTML = cart.map((item) => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                return `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <p class="item-name">${item.name}</p>
                            <p class="item-price">$${item.price.toFixed(2)}</p>
                            <p class="subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
                        </div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-name="${item.name}" data-action="decrease">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn" data-name="${item.name}" data-action="increase">+</button>
                            <button class="delete-btn" data-name="${item.name}"></button>
                        </div>
                    </div>
                `;
            }).join('');

            if(cartTotalContainer) cartTotalContainer.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        }
    }
    
    updateCart();
});
