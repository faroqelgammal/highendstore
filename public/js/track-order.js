/* =========================================================
   track-order.js - تتبع الطلب (track-order.html)
   يقرأ الطلبات المحفوظة محلياً (highend_orders) ويعرض حالتها.
   ========================================================= */

const ORDER_STATUSES = [
    { key: "pending",   label: "قيد المراجعة", icon: "fa-clipboard-check" },
    { key: "confirmed", label: "تم التأكيد",   icon: "fa-circle-check" },
    { key: "shipped",   label: "تم الشحن",     icon: "fa-truck-fast" },
    { key: "delivered", label: "تم التوصيل",   icon: "fa-box-open" }
];

function getOrders() {
    try { return JSON.parse(localStorage.getItem("highend_orders") || "[]"); }
    catch (e) { return []; }
}

function findOrder(num) {
    return getOrders().find(o => o.orderNumber.toLowerCase() === String(num).toLowerCase());
}

function trackOrder(num) {
    const result = document.getElementById("track-result");
    if (!result) return;

    const query = (num || (document.getElementById("track-input") || {}).value || "").trim();
    if (!query) {
        result.innerHTML = msgBox("fa-circle-exclamation", "برجاء إدخال رقم الطلب");
        return;
    }

    const order = findOrder(query);
    if (!order) {
        result.innerHTML = msgBox("fa-circle-xmark", `لم نجد طلباً بالرقم «${query}». تأكد من الرقم أو تواصل معنا عبر واتساب.`);
        return;
    }

    const fmt = (typeof formatPrice === "function") ? formatPrice : (n) => n;
    const statusIndex = Math.max(0, ORDER_STATUSES.findIndex(s => s.key === (order.status || "pending")));

    const steps = ORDER_STATUSES.map((s, i) => {
        const active = i <= statusIndex;
        return `
            <div class="flex-1 flex flex-col items-center text-center gap-2">
                <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 ${active ? 'bg-gold border-gold text-black' : 'border-white/15 text-white/30'} transition-colors">
                    <i class="fa-solid ${s.icon}"></i>
                </div>
                <span class="text-xs font-arabic ${active ? 'text-gold' : 'text-white/40'}">${s.label}</span>
            </div>
            ${i < ORDER_STATUSES.length - 1 ? `<div class="flex-1 h-0.5 mt-6 ${i < statusIndex ? 'bg-gold' : 'bg-white/10'}"></div>` : ''}
        `;
    }).join("");

    const itemsHtml = (order.items || []).map(it => `
        <div class="flex justify-between py-2 border-b border-white/5 text-sm">
            <span class="text-white/80 font-arabic">${it.name} <span class="text-white/40">×${it.quantity}</span></span>
            <span class="text-gold">${fmt(it.price * it.quantity)} EGP</span>
        </div>
    `).join("");

    const date = new Date(order.date).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });

    result.innerHTML = `
        <div class="bg-[#0a0a0a] border border-[rgba(212,175,55,0.18)] rounded-2xl p-6 md:p-8 text-right">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-white/10 pb-5">
                <div>
                    <p class="text-white/40 text-xs font-arabic mb-1">رقم الطلب</p>
                    <p class="text-gold font-bold text-lg font-inter tracking-wide" dir="ltr">${order.orderNumber}</p>
                </div>
                <div class="text-left">
                    <p class="text-white/40 text-xs font-arabic mb-1">تاريخ الطلب</p>
                    <p class="text-white/80 text-sm font-arabic">${date}</p>
                </div>
            </div>

            <div class="flex items-start justify-between mb-10">${steps}</div>

            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 class="text-white font-arabic font-bold mb-3">بيانات الشحن</h4>
                    <p class="text-white/60 text-sm font-arabic leading-relaxed">${order.name}<br>${order.governorate} - ${order.region}<br>${order.address}<br><span dir="ltr">${order.phone1}</span></p>
                </div>
                <div>
                    <h4 class="text-white font-arabic font-bold mb-3">ملخص الطلب</h4>
                    ${itemsHtml}
                    <div class="flex justify-between mt-4 pt-2 text-sm">
                        <span class="text-white/60 font-arabic">الشحن</span>
                        <span class="text-white/80">${fmt(order.shipping)} EGP</span>
                    </div>
                    <div class="flex justify-between mt-2 text-base font-bold">
                        <span class="text-white font-arabic">الإجمالي</span>
                        <span class="text-gold">${fmt(order.total)} EGP</span>
                    </div>
                    <p class="text-white/40 text-xs font-arabic mt-2">طريقة الدفع: ${order.method === "online" ? "أونلاين" : "عند الاستلام"}</p>
                </div>
            </div>
        </div>
    `;
}

function msgBox(icon, text) {
    return `
        <div class="bg-[#0a0a0a] border border-[rgba(212,175,55,0.15)] rounded-2xl p-10 text-center">
            <i class="fa-solid ${icon} text-4xl text-gold/60 mb-4"></i>
            <p class="text-white/70 font-arabic">${text}</p>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get("order");
    if (order) {
        const input = document.getElementById("track-input");
        if (input) input.value = order;
        trackOrder(order);
    }
});
