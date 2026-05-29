/* =========================================================
   product.js - تعبئة صفحة المنتج ديناميكياً من ?id=
   ========================================================= */

(async function () {
    if (window.__dataReady && typeof window.__dataReady.then === "function") {
        try { await window.__dataReady; } catch (e) { /* تجاهل */ }
    }
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const list = window.products || [];
    const product = list.find(p => p.id === productId);

    const root = document.getElementById("product-page");
    if (!root) return;

    if (!product) {
        root.innerHTML = `
            <div class="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
                <i class="ph-light ph-magnifying-glass text-6xl text-gold/60"></i>
                <h2 class="text-2xl text-white font-arabic">المنتج غير موجود</h2>
                <a href="index.html" class="text-gold hover:underline font-arabic">العودة للرئيسية</a>
            </div>
        `;
        return;
    }

    document.title = `High End | ${product.name}`;

    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    /* الأساسيات */
    setText("product-name", product.name);
    setText("breadcrumb-name", product.name);
    setText("product-brand-text", `${product.brand} Collection`);
    const brandLink = document.getElementById("product-brand");
    if (brandLink) brandLink.href = `brands.html?brand=${encodeURIComponent(product.brand)}`;
    setText("product-price", formatPrice(product.price) + " EGP");
    setText("product-description", product.shortDescription || product.description);
    setText("product-full-description", product.description);

    /* مسار التنقل */
    const crumbCat = document.getElementById("breadcrumb-category");
    if (crumbCat && typeof CATEGORY_LABELS !== "undefined") {
        crumbCat.textContent = CATEGORY_LABELS[product.category] || product.category;
        crumbCat.href = `category.html?cat=${product.category}`;
    }

    /* السعر القديم ونسبة الخصم */
    const oldPrice = document.getElementById("product-old-price");
    const discountBadge = document.getElementById("product-discount");
    if (product.oldPrice && product.oldPrice > product.price) {
        if (oldPrice) oldPrice.textContent = formatPrice(product.oldPrice) + " EGP";
        const pct = Math.round((1 - product.price / product.oldPrice) * 100);
        if (discountBadge) {
            discountBadge.textContent = `خصم ${pct}%`;
            discountBadge.classList.remove("hidden");
        }
    } else {
        if (oldPrice) oldPrice.style.display = "none";
        if (discountBadge) discountBadge.classList.add("hidden");
    }

    /* معرض الصور (افتراضي) */
    const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
    const baseGallery = (product.gallery && product.gallery.length) ? product.gallery : [product.image];

    /* يبني المصغرات والصورة الرئيسية من قائمة صور معطاة */
    function buildGallery(images) {
        const list = (images && images.length) ? images : baseGallery;
        const mainImg = document.getElementById("main-product-image");
        if (mainImg) {
            mainImg.src = list[0];
            mainImg.alt = product.name;
            mainImg.onerror = function () { this.src = fallback; };
        }
        const thumbsContainer = document.getElementById("product-thumbnails");
        if (thumbsContainer) {
            thumbsContainer.innerHTML = list.map((src, i) => `
                <button onclick="setMainImage('${src}', this)"
                        class="thumbnail-btn w-20 h-20 rounded-xl border ${i === 0 ? 'border-[rgba(212,175,55,0.6)] thumb-active' : 'border-white/5 opacity-50'} flex items-center justify-center p-1 transition-all hover:border-gold hover:opacity-100">
                    <img src="${src}" alt="${product.name} ${i + 1}" class="w-full h-full object-contain mix-blend-lighten"
                         onerror="this.src='${fallback}'">
                </button>
            `).join("");
        }
    }
    window.__buildGallery = buildGallery;
    buildGallery(baseGallery);

    /* الألوان كصور مصغرة مرتبطة بالجالري */
    const colorsBox = document.getElementById("product-colors");
    const variants = (product.colorVariants && product.colorVariants.length)
        ? product.colorVariants
        : (product.colors || []).map(c => ({ name: c, swatch: product.image, gallery: baseGallery }));

    if (colorsBox && variants.length) {
        setText("color-name", variants[0].name);
        colorsBox.innerHTML = variants.map((v, i) => `
            <button type="button" onclick='selectColorSwatch(this, ${JSON.stringify(v.name)}, ${JSON.stringify(v.gallery || baseGallery)})'
                    title="${v.name}"
                    class="color-swatch-btn w-14 h-14 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-gold swatch-active' : 'border-white/10'} bg-[#121212] p-1 transition-all hover:border-gold">
                <img src="${v.swatch}" alt="${v.name}" class="w-full h-full object-contain mix-blend-lighten" onerror="this.src='${fallback}'">
            </button>
        `).join("");
    }

    /* المميزات */
    const featuresBox = document.getElementById("product-features");
    if (featuresBox && product.features) {
        featuresBox.innerHTML = product.features.map(f => `
            <span class="bg-[#121212] border border-white/5 text-white/80 px-4 py-2 rounded-full text-sm hover:border-gold/50 transition-colors">${f}</span>
        `).join("");
    }

    /* المواصفات */
    const specsBox = document.getElementById("product-specifications");
    if (specsBox && product.specifications) {
        specsBox.innerHTML = Object.entries(product.specifications).map(([k, v]) => `
            <div class="flex py-4 border-b border-white/5">
                <span class="text-white/60 w-1/3 font-arabic">${k}</span>
                <span class="text-white w-2/3 font-arabic">${v}</span>
            </div>
        `).join("");
    }

    /* زر واتساب */
    const waBtn = document.getElementById("whatsapp-order-btn");
    if (waBtn) {
        waBtn.href = `https://wa.me/201555823657?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن " + product.name)}`;
    }

    /* أضف للسلة بالكمية */
    const addBtn = document.getElementById("add-to-cart-btn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            const qtyInput = document.getElementById("qty-input");
            const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
            for (let i = 0; i < qty; i++) addToCart(product.id);
        });
    }

    /* منتجات ذات صلة (نفس الفئة، باستثناء الحالي) */
    const related = list.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (typeof renderProductGrid === "function") {
        renderProductGrid("related-grid", related.length ? related : list.filter(p => p.id !== product.id).slice(0, 4), "لا توجد منتجات مشابهة");
    }

    /* تخزين القسم لاستخدام الـ breadcrumb في الـ gender */
    const crumbGender = document.getElementById("breadcrumb-gender");
    if (crumbGender) crumbGender.textContent = product.gender === "men" ? "رجالي" : "نسائي";
})();

/* تغيير الصورة الرئيسية من المصغرات */
function setMainImage(src, btn) {
    const mainImg = document.getElementById("main-product-image");
    if (mainImg) mainImg.src = src;
    document.querySelectorAll(".thumbnail-btn").forEach(b => {
        b.classList.remove("thumb-active", "opacity-100");
        b.classList.add("opacity-50");
    });
    if (btn) { btn.classList.add("thumb-active", "opacity-100"); btn.classList.remove("opacity-50"); }
}

/* اختيار اللون كصورة مصغرة + تحديث الجالري */
function selectColorSwatch(btn, name, gallery) {
    const nameEl = document.getElementById("color-name");
    if (nameEl) nameEl.textContent = name;
    document.querySelectorAll(".color-swatch-btn").forEach(b => {
        b.classList.remove("swatch-active", "border-gold");
        b.classList.add("border-white/10");
    });
    btn.classList.add("swatch-active", "border-gold");
    btn.classList.remove("border-white/10");
    if (typeof window.__buildGallery === "function") window.__buildGallery(gallery);
}

/* الكمية */
function productIncreaseQuantity() {
    const q = document.getElementById("qty-input");
    if (q) q.value = parseInt(q.value) + 1;
}
function productDecreaseQuantity() {
    const q = document.getElementById("qty-input");
    if (q && parseInt(q.value) > 1) q.value = parseInt(q.value) - 1;
}

/* الأكورديون */
function toggleAccordion(contentId, btn) {
    const content = document.getElementById(contentId);
    const icon = btn.querySelector("i");
    if (!content) return;
    const expanded = content.classList.toggle("expanded");
    if (icon) {
        icon.classList.toggle("fa-plus", !expanded);
        icon.classList.toggle("fa-minus", expanded);
        icon.classList.toggle("rotate-90", expanded);
    }
}
