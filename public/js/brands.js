/* =========================================================
   brands.js - صفحة الماركات (brands.html)
   - بدون ?brand=  : تعرض شبكة كل الماركات
   - مع ?brand=النص : تعرض منتجات تلك الماركة
   ========================================================= */

(function () {
    const params = new URLSearchParams(window.location.search);
    const activeBrand = params.get("brand");

    function start() {
        const products = window.products || [];
        const brandsMeta = window.brands || [];

        // عدد المنتجات وصورة تمثيلية لكل ماركة
        function brandInfo(name) {
            const items = products.filter(p => p.brand === name);
            const meta = brandsMeta.find(b => b.name === name) || {};
            return {
                name,
                count: items.length,
                image: items.length ? items[0].image : "",
                tagline: meta.tagline || ""
            };
        }

        if (activeBrand) {
            renderBrandProducts(activeBrand, products);
        } else {
            renderBrandsGrid(brandsMeta, products, brandInfo);
        }
    }

    /* عرض شبكة كل الماركات */
    function renderBrandsGrid(brandsMeta, products, brandInfo) {
        const titleEl = document.getElementById("brands-title");
        const subEl = document.getElementById("brands-subtitle");
        if (titleEl) titleEl.textContent = "ماركاتنا";
        if (subEl) subEl.textContent = "تسوّق حسب أرقى الماركات العالمية";
        document.title = "High End | الماركات";

        // اجمع الماركات من البيانات + الميتا (لتجنّب أي ماركة ناقصة)
        const names = [...new Set([
            ...brandsMeta.map(b => b.name),
            ...products.map(p => p.brand)
        ])];

        const grid = document.getElementById("brands-content");
        if (!grid) return;
        grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
        grid.innerHTML = names.map(name => {
            const info = brandInfo(name);
            const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";
            return `
                <a href="brands.html?brand=${encodeURIComponent(name)}"
                   class="group bg-[#0a0a0a] border border-[rgba(212,175,55,0.15)] rounded-2xl overflow-hidden hover:border-gold hover:-translate-y-1.5 transition-all duration-400 flex flex-col">
                    <div class="h-44 bg-[#050505] flex items-center justify-center p-6 overflow-hidden">
                        ${info.image
                            ? `<img src="${info.image}" alt="${name}" class="h-full object-contain mix-blend-lighten opacity-90 group-hover:scale-105 transition-transform duration-500" onerror="this.src='${fallback}'">`
                            : `<i class="fa-solid fa-gem text-5xl text-gold/40"></i>`}
                    </div>
                    <div class="p-5 text-center border-t border-[rgba(212,175,55,0.1)]">
                        <h3 class="font-cinzel text-gold text-xl tracking-widest mb-1">${name}</h3>
                        <p class="text-white/50 text-sm font-arabic mb-2">${info.tagline}</p>
                        <span class="text-white/30 text-xs font-arabic">${info.count} منتج</span>
                    </div>
                </a>
            `;
        }).join("");
    }

    /* عرض منتجات ماركة محددة */
    function renderBrandProducts(brand, products) {
        const titleEl = document.getElementById("brands-title");
        const subEl = document.getElementById("brands-subtitle");
        if (titleEl) titleEl.textContent = brand;
        if (subEl) subEl.textContent = "كل منتجات هذه الماركة";
        document.title = `High End | ${brand}`;

        // زر الرجوع لكل الماركات
        const backEl = document.getElementById("brands-back");
        if (backEl) {
            backEl.classList.remove("hidden");
            backEl.innerHTML = `<a href="brands.html" class="inline-flex items-center gap-2 text-gold hover:text-white transition-colors font-arabic"><i class="fa-solid fa-arrow-right"></i> كل الماركات</a>`;
        }

        const list = products.filter(p => p.brand === brand);
        const grid = document.getElementById("brands-content");
        if (!grid) return;
        grid.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5";
        if (typeof renderProductGrid === "function") {
            renderProductGrid("brands-content", list, "لا توجد منتجات لهذه الماركة حالياً");
        }
    }

    document.addEventListener("DOMContentLoaded", async () => {
        if (window.__dataReady && typeof window.__dataReady.then === "function") {
            try { await window.__dataReady; } catch (e) { /* تجاهل */ }
        }
        start();
    });
})();
