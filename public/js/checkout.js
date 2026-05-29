/* =========================================================
   checkout.js - ملخص الطلب وإرساله عبر واتساب
   ========================================================= */

const SHIPPING_FEE = 70;
const COD_FEE = 30;                // رسوم الدفع عند الاستلام
const ONLINE_DISCOUNT_RATE = 0.005; // خصم 0.5% للدفع أونلاين

function getPaymentMethod() {
    const checked = document.querySelector('input[name="payment_method"]:checked');
    return checked ? checked.value : "online";
}

/* عرض ملخص الطلب في صفحة الـ checkout */
function renderCheckoutSummary() {
    const container = document.getElementById("checkout-items");
    if (!container) return; // لسنا في صفحة الدفع

    if (!cartItems || cartItems.length === 0) {
        container.innerHTML = `<div class="text-center py-8 text-white/60 font-arabic">السلة فارغة</div>`;
    } else {
        container.innerHTML = cartItems.map(item => `
            <div class="flex gap-4 border-b border-white/10 pb-4">
                <div class="w-20 h-20 bg-[#050505] rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain mix-blend-lighten"
                         onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'">
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="text-white text-sm font-arabic line-clamp-1">${item.name}</h4>
                    <p class="text-gold text-sm mt-1">${formatPrice(item.price)} EGP</p>
                    <div class="flex items-center gap-3 mt-2 text-white/70">
                        <button onclick="decreaseQuantity('${item.id}')" class="w-6 h-6 border border-white/20 rounded hover:border-gold hover:text-gold transition-colors">-</button>
                        <span class="text-sm">${item.quantity}</span>
                        <button onclick="increaseQuantity('${item.id}')" class="w-6 h-6 border border-white/20 rounded hover:border-gold hover:text-gold transition-colors">+</button>
                        <button onclick="removeFromCart('${item.id}')" class="text-red-500/80 hover:text-red-500 text-xs font-arabic mr-auto">حذف</button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    const subtotal = cartTotal();
    const method = getPaymentMethod();
    const shipping = cartItems.length ? SHIPPING_FEE : 0;

    let discount = 0;
    let cod = 0;

    if (method === "online" && subtotal > 0) {
        discount = Math.min(Math.max(subtotal * ONLINE_DISCOUNT_RATE, 5), 250);
    } else if (method === "cash" && subtotal > 0) {
        cod = COD_FEE;
    }

    const total = subtotal + shipping - discount + cod;

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = formatPrice(val); };
    setText("checkout-subtotal", subtotal);
    setText("checkout-shipping", shipping);
    setText("checkout-discount", Math.round(discount));
    setText("checkout-cod", cod);
    setText("checkout-total", Math.round(total));

    // إظهار/إخفاء صفوف الخصم والـ COD
    const discountRow = document.getElementById("discount-row");
    const codRow = document.getElementById("cod-row");
    if (discountRow) discountRow.classList.toggle("hidden", discount <= 0);
    if (codRow) codRow.classList.toggle("hidden", cod <= 0);
}

/* تعبئة قائمة المحافظات */
function populateGovernorates() {
    const select = document.getElementById("checkout-governorate");
    if (!select || typeof EGYPT_GOVERNORATES === "undefined") return;
    EGYPT_GOVERNORATES.forEach(gov => {
        const opt = document.createElement("option");
        opt.value = gov;
        opt.textContent = gov;
        select.appendChild(opt);
    });
}

/* إرسال الطلب عبر واتساب */
function checkoutWhatsApp() {
    if (!cartItems || cartItems.length === 0) {
        alert("السلة فارغة، أضف منتجات أولاً");
        return;
    }

    const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };

    const name = val("checkout-name");
    const phone1 = val("checkout-phone1");
    const phone2 = val("checkout-phone2");
    const governorate = val("checkout-governorate");
    const region = val("checkout-region");
    const address = val("checkout-address");
    const housing = val("checkout-housing");
    const floor = val("checkout-floor");
    const landmark = val("checkout-landmark");

    if (!name || !phone1 || !governorate || !region || !address || !housing || !floor || !landmark) {
        alert("برجاء استكمال جميع البيانات المطلوبة");
        return;
    }

    const subtotal = cartTotal();
    const method = getPaymentMethod();
    const shipping = SHIPPING_FEE;
    let discount = 0, cod = 0;
    if (method === "online") discount = Math.min(Math.max(subtotal * ONLINE_DISCOUNT_RATE, 5), 250);
    else cod = COD_FEE;
    const total = Math.round(subtotal + shipping - discount + cod);

    let productsText = "";
    cartItems.forEach(item => {
        productsText += `• ${item.name}\nالكمية: ${item.quantity}\nالسعر: ${formatPrice(item.price)} EGP\n\n`;
    });

    // إنشاء رقم طلب وحفظه محلياً لإمكانية التتبع
    const orderNumber = "HE" + Date.now().toString().slice(-8);
    const order = {
        orderNumber,
        date: new Date().toISOString(),
        name, phone1, governorate, region, address,
        method,
        items: cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal, shipping, discount: Math.round(discount), cod, total,
        status: "pending"
    };
    saveOrder(order);

    const message =
`طلب جديد من متجر High End

رقم الطلب: ${orderNumber}
الاسم: ${name}
الهاتف: ${phone1}${phone2 ? `\nهاتف إضافي: ${phone2}` : ""}
المحافظة: ${governorate}
المنطقة: ${region}
العنوان: ${address}
نوع السكن: ${housing}
الدور/الشقة: ${floor}
علامة مميزة: ${landmark}

---------------------
المنتجات:

${productsText}---------------------
طريقة الدفع: ${method === "online" ? "أونلاين" : "عند الاستلام"}
الإجمالي: ${formatPrice(total)} EGP`;

    const whatsapp = "201555823657";
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // تفريغ السلة وتحويل المستخدم لصفحة التتبع برقم طلبه
    if (typeof clearCart === "function") clearCart();
    window.location.href = `track-order.html?order=${encodeURIComponent(orderNumber)}`;
}

/* حفظ الطلب في التخزين المحلي */
function saveOrder(order) {
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem("highend_orders") || "[]"); } catch (e) { orders = []; }
    orders.push(order);
    localStorage.setItem("highend_orders", JSON.stringify(orders));
}

document.addEventListener("DOMContentLoaded", () => {
    populateGovernorates();
    renderCheckoutSummary();
});
