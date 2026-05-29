/* =========================================================
   إدارة السلة (تُحفظ في localStorage مفتاح he_cart)
   ملاحظة: localStorage هنا للسلة فقط (تجربة المستخدم) وليس
   لتخزين بيانات الطلبات النهائية.
   ========================================================= */

let cartItems = [];

try {
    const saved = JSON.parse(localStorage.getItem("he_cart"));
    if (Array.isArray(saved)) cartItems = saved;
} catch (e) {
    cartItems = [];
}

function saveCart() {
    localStorage.setItem("he_cart", JSON.stringify(cartItems));
}

/* إيجاد منتج من قائمة المنتجات العامة */
function findProduct(id) {
    const list = window.products || [];
    return list.find(p => p.id === id);
}

function addToCart(id) {
    const product = findProduct(id);
    if (!product) return;

    const existing = cartItems.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCartItems();
    toggleCart(true);
}

function clearCart() {
    cartItems = [];
    saveCart();
    updateCartCount();
    renderCartItems();
    if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
}

function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCartItems();
    if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
}

function increaseQuantity(id) {
    const item = cartItems.find(i => i.id === id);
    if (item) { item.quantity += 1; saveCart(); afterQtyChange(); }
}

function decreaseQuantity(id) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    item.quantity -= 1;
    if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.id !== id);
    }
    saveCart();
    afterQtyChange();
}

function afterQtyChange() {
    updateCartCount();
    renderCartItems();
    if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
}

function cartTotal() {
    return cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function updateCartCount() {
    const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;
}

/* عرض عناصر السلة الجانبية */
function renderCartItems() {
    const container = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("cart-subtotal");

    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-white/50 font-arabic">السلة فارغة</div>`;
        if (subtotalEl) subtotalEl.textContent = "0";
        return;
    }

    const fmt = (typeof formatPrice === "function") ? formatPrice : (n) => n;

    container.innerHTML = cartItems.map(item => `
        <div class="flex gap-4 border-b border-white/10 pb-5">
            <div class="w-20 h-20 bg-[#050505] rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain mix-blend-lighten"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'">
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-white text-sm font-arabic line-clamp-1">${item.name}</h4>
                <p class="text-gold font-bold text-sm mt-1">${fmt(item.price)} EGP</p>
                <div class="flex items-center gap-3 mt-2">
                    <button onclick="decreaseQuantity('${item.id}')" class="w-7 h-7 border border-white/20 text-white/70 rounded hover:border-gold hover:text-gold transition-colors">-</button>
                    <span class="text-white text-sm w-6 text-center">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.id}')" class="w-7 h-7 border border-white/20 text-white/70 rounded hover:border-gold hover:text-gold transition-colors">+</button>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500/80 hover:text-red-500 text-xs font-arabic mr-auto">حذف</button>
                </div>
            </div>
        </div>
    `).join("");

    if (subtotalEl) subtotalEl.textContent = fmt(cartTotal());
}

/* فتح/غلق السلة. مرّر false للإغلاق صراحةً */
function toggleCart(forceOpen) {
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    if (!sidebar || !overlay) return;

    const shouldOpen = (forceOpen === undefined)
        ? !sidebar.classList.contains("open")
        : forceOpen;

    if (shouldOpen) {
        renderCartItems();
        sidebar.classList.add("open");
        overlay.classList.remove("hidden");
        requestAnimationFrame(() => overlay.classList.remove("opacity-0"));
    } else {
        sidebar.classList.remove("open");
        overlay.classList.add("opacity-0");
        setTimeout(() => overlay.classList.add("hidden"), 400);
    }
}
