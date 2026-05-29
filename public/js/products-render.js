/* =========================================================
   products-render.js - بناء كروت المنتجات وعرض الشبكات
   ========================================================= */

/* كارت منتج واحد */
function buildCard(product) {
    let discountHtml = "";
    let priceHtml = `
        <span class="text-gold font-bold text-lg">${formatPrice(product.price)} EGP</span>
    `;

    if (product.oldPrice && product.oldPrice > product.price) {
        const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
        discountHtml = `
            <div class="absolute top-3 left-3 bg-[#4a3b22] text-white text-[11px] px-2 py-0.5 rounded-sm z-10">
                -${discount}%
            </div>
        `;
        priceHtml = `
            <div class="flex items-center justify-center gap-2 text-sm">
                <span class="text-gold font-bold text-[15px]">${formatPrice(product.price)} EGP</span>
                <span class="text-[#777] line-through text-[11px]">${formatPrice(product.oldPrice)} EGP</span>
            </div>
        `;
    }

    const productUrl = `product.html?id=${encodeURIComponent(product.id)}`;

    return `
        <div class="bg-[#121212] border border-[rgba(212,175,55,0.15)] rounded-[18px] overflow-hidden group hover:border-gold hover:-translate-y-2 transition-all duration-400 flex flex-col relative pb-4">
            ${discountHtml}
            <a href="${productUrl}" class="relative h-[220px] overflow-hidden cursor-pointer bg-[#050505] p-4 flex items-center justify-center">
                <img src="${product.image}" alt="${product.name}"
                     class="w-full h-full object-contain mix-blend-lighten opacity-95 group-hover:scale-105 transition-transform duration-500"
                     onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'">
            </a>
            <div class="px-5 pt-4 flex flex-col flex-grow text-center">
                <a href="${productUrl}" class="text-white font-medium text-[15px] mb-2 cursor-pointer hover:text-gold transition-colors line-clamp-1">
                    ${product.name}
                </a>
                <div class="mb-3">${priceHtml}</div>
                <div class="mt-auto">
                    <button onclick="addToCart('${product.id}')"
                            class="w-full border border-gold text-gold hover:bg-gold hover:text-black py-2.5 text-sm transition-colors duration-400 rounded">
                        أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    `;
}

/* عرض شبكة منتجات داخل عنصر بمعرّف معيّن */
function renderProductGrid(gridId, list, emptyMessage) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (!list || list.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-[#888] font-arabic">${emptyMessage || "لا توجد منتجات"}</div>`;
        return;
    }

    grid.innerHTML = list.map(buildCard).join("");
}

/* شبكات الصفحة الرئيسية: الأكثر مبيعاً + أحدث الإضافات */
function renderHomeProducts() {
    const list = window.products || [];

    // الأكثر مبيعاً: المميزة أولاً ثم الباقي
    const bestSellers = [...list].sort((a, b) => (b.featured === true) - (a.featured === true)).slice(0, 10);
    renderProductGrid("products-grid", bestSellers);

    // أحدث الإضافات: المعلّمة isNew أو آخر ما أُضيف
    const latest = [...list].filter(p => p.isNew).slice(0, 5);
    renderProductGrid("latest-products-grid", latest.length ? latest : [...list].reverse().slice(0, 5));
}
