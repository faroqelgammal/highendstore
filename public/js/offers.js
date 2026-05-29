/* =========================================================
   offers.js - صفحة العروض (offers.html)
   تجلب العروض المختارة يدوياً من /api/offers
   - بنرات علوية للعروض ذات صورة/عنوان
   - شبكة منتجات لكل العروض المرتبطة بمنتج
   ========================================================= */

(function () {
    const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

    async function loadOffers() {
        let offers = [];
        try {
            const res = await fetch("/api/offers", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                offers = Array.isArray(data.offers) ? data.offers : [];
            }
        } catch (e) {
            console.error("[v0] offers: تعذّر جلب العروض", e);
        }
        renderBanners(offers);
        renderOffersGrid(offers);
    }

    /* البنرات: تعرض العروض التي لها عنوان أو صورة مخصصة */
    function renderBanners(offers) {
        const box = document.getElementById("offers-banners");
        if (!box) return;

        const banners = offers.filter(o => o.title || o.image);
        if (!banners.length) { box.innerHTML = ""; return; }

        box.innerHTML = banners.map(o => {
            const img = o.image || (o.product && o.product.image) || fallback;
            const link = o.link || (o.product ? `product.html?id=${o.product.id}` : "#");
            const title = o.title || (o.product ? o.product.name : "عرض خاص");
            const subtitle = o.subtitle || (o.product ? o.product.shortDescription || "" : "");
            return `
                <a href="${link}" class="group relative rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.2)] bg-[#0a0a0a] hover:border-gold transition-all duration-400 min-h-[220px] flex">
                    <img src="${img}" alt="${title}" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500" onerror="this.src='${fallback}'">
                    <div class="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent"></div>
                    <div class="relative z-10 p-7 flex flex-col justify-center">
                        ${o.badge ? `<span class="inline-block self-start bg-gold text-black text-xs font-bold px-3 py-1 rounded-full mb-3 font-arabic">${o.badge}</span>` : ""}
                        <h3 class="text-white font-serif text-2xl md:text-3xl mb-2 text-balance">${title}</h3>
                        ${subtitle ? `<p class="text-white/70 font-arabic text-sm md:text-base max-w-md leading-relaxed text-pretty">${subtitle}</p>` : ""}
                        <span class="mt-4 inline-flex items-center gap-2 text-gold font-arabic text-sm group-hover:gap-3 transition-all">
                            تسوّق الآن <i class="fa-solid fa-arrow-left"></i>
                        </span>
                    </div>
                </a>
            `;
        }).join("");
    }

    /* الشبكة: منتجات العروض المرتبطة بمنتج فعلي */
    function renderOffersGrid(offers) {
        const products = offers.map(o => o.product).filter(Boolean);

        // إزالة التكرار حسب معرّف المنتج
        const seen = new Set();
        const unique = products.filter(p => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        const countEl = document.getElementById("offers-count");
        if (countEl) countEl.textContent = `${unique.length} منتج`;

        if (typeof renderProductGrid === "function") {
            renderProductGrid("offers-grid", unique, "لا توجد عروض متاحة حالياً. تابعنا قريباً!");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        // لا نحتاج انتظار __dataReady لأننا نجلب العروض مباشرة من API
        loadOffers();
    });
})();
