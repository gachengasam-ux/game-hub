// Game data
const games = [
    {
        id: 1,
        name: "Cyber Runner",
        price: 25.00,
        category: "action",
        image: "assets/images/game 1.jpg",
        description: "Fast-paced cyberpunk runner with intense action!"
    },
    {
        id: 2,
        name: "Mystic Quest",
        price: 24.99,
        category: "rpg",
        image: " assets/images/Black-Myth.jpg" ,
        description: "Epic RPG adventure in a magical world."
    },
    {
        id: 3,
        name: "Pixel Puzzle",
        price: 9.99,
        category: "puzzle",
        image: "assets/images/download (3).jpg  ",
        description: "Challenging pixel art puzzles for all ages."
    },
    {
        id: 4,
        name: "Shadow Fighter",
        price: 29.99,
        category: "action",
        image: "assets/images/gameplay 2.webp",
        description: "Brutal fighting game with deep combat system."
    },
    {
        id: 5,
        name: "Lost Temple",
        price: 14.99,
        category: "adventure",
        image: "assets/images/download (4).jpg ",
        description: "Explore ancient ruins and solve mysteries."
    },
    {
        id: 6,
        name: "Dragon Saga",
        price: 34.99,
        category: "rpg",
        image: "assets/images/dragon.jpg",
        description: "Become a dragon rider in this epic RPG."
    }
];

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelectorAll('#cart-count');
    const modalCartCount = document.getElementById('modal-cart-count');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.forEach(count => {
        count.textContent = totalItems;
    });
    
    if (modalCartCount) {
        modalCartCount.textContent = totalItems;
    }
}

// Add to cart
function addToCart(gameId) {
    const game = games.find(g => g.id === gameId);
    const existingItem = cart.find(item => item.id === gameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...game, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${game.name} added to cart!`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #00b894, #00cec9);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,184,148,0.4);
        z-index: 3000;
        font-weight: bold;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load featured games
function loadFeaturedGames() {
    const featuredContainer = document.getElementById('featured-games');
    if (!featuredContainer) return;
    
    const featuredGames = games.slice(0, 3);
    featuredContainer.innerHTML = featuredGames.map(game => `
        <div class="game-card" onclick="addToCart(${game.id})">
            <img src="${game.image}" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
                <div class="game-price">$${game.price}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Load store games
function loadStoreGames(gamesToShow = games) {
    const storeContainer = document.getElementById('store-games');
    if (!storeContainer) return;
    
    storeContainer.innerHTML = gamesToShow.map(game => `
        <div class="game-card" onclick="addToCart(${game.id})">
            <img src="${game.image}" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
                <div class="game-price">$${game.price}</div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Filter games
function filterGames() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    
    if (!categoryFilter || !searchInput) return;
    
    const category = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredGames = games.filter(game => {
        const matchesCategory = category === 'all' || game.category === category;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    loadStoreGames(filteredGames);
}

// Cart modal functionality
function openCartModal() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #ccc;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>$${item.price} x ${item.quantity}</small>
                </div>
                <div>
                    $${(item.price * item.quantity).toFixed(2)}
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; background: #ff4757; border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    modal.style.display = 'block';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    openCartModal(); // Refresh modal
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}\n\n(Checkout functionality would be implemented here)`);
    
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closeCartModal();
}

// Form handlers
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const message = document.getElementById('messageInput').value;
        
        alert(`Thank you, ${name}! Your message has been sent.\n\nTo: support@gamehub.com\nMessage: ${message}`);
        form.reset();
    });
}

function handleReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = document.getElementById('ratingSelect').value;
        const review = document.getElementById('reviewText').value;
        
        alert(`Thank you for your ${rating} star review!\n\n"${review}"\n\nReview submitted successfully!`);
        form.reset();
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on load
    updateCartCount();
    
    // Load games based on page
    if (document.getElementById('featured-games')) {
        loadFeaturedGames();
    }
    
    if (document.getElementById('store-games')) {
        loadStoreGames();
        document.getElementById('category-filter').addEventListener('change', filterGames);
        document.getElementById('search-input').addEventListener('input', filterGames);
    }
    
    // Cart functionality
    const cartIcons = document.querySelectorAll('#cart-count');
    cartIcons.forEach(icon => {
        icon.closest('div').addEventListener('click', openCartModal);
    });
    
    // Modal close functionality
    const modal = document.getElementById('cartModal');
    if (modal) {
        window.onclick = function(event) {
            if (event.target === modal) {
                closeCartModal();
            }
        }
        
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = closeCartModal;
        }
    }
    
    // Form handlers
    handleContactForm();
    handleReviewForm();
});