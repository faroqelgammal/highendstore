/* =========================================================
   categories.js - صفحة الفئة/الفلترة (category.html)
   يقرأ ?cat= و ?gender= من الرابط ثم يطبّق فلاتر الشريط الجانبي.
   ========================================================= */

const catState = {
    category: null,
    gender: "",
    type: "",
    brand: "",
    minPrice: null,
    maxPrice: null
};

function getCatProducts() {
    return window.products || [];
}

/* تعبئة قائمة الماركات حسب الفئة الحالية */
function buildBrandFilters() {
    const box = document.getElementById("sf-brands-list");
    if (!box) return;

    let list = getCatProducts();
    if (catState.category) list = list.filter(p => p.category === catState.category);

    const brands = [...new Set(list.map(p => p.brand))].sort();

    box.innerHTML = `
        <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="sf-brand" value="" onchange="onBrandChange(this.value)" class="accent-[#d4af37]" checked>
            <span class="text-white/70 text-sm font-arabic group-hover:text-gold transition-colors">الكل</span>
        </label>
    ` + brands.map(b => `
        <label class="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="sf-brand" value="${b}" onchange="onBrandChange(this.value)" class="accent-[#d4af37]">
            <span class="text-white/70 text-sm font-arabic group-hover:text-gold transition-colors">${b}</span>
        </label>
    `).join("");
}

function onBrandChange(val) {
    catState.brand = val;
    applyCatFilters();
}

/* قراءة قيم الشريط الجانبي وتطبيق الفلترة */
function applyCatFilters() {
    const genderEl = document.querySelector('input[name="sf-gender"]:checked');
    const typeEl = document.querySelector('input[name="sf-type"]:checked');
    const minEl = document.getElementById("sf-min-price");
    const maxEl = document.getElementById("sf-max-price");

    catState.gender = genderEl ? genderEl.value : "";
    catState.type = typeEl ? typeEl.value : "";
    catState.minPrice = minEl && minEl.value ? Number(minEl.value) : null;
    catState.maxPrice = maxEl && maxEl.value ? Number(maxEl.value) : null;

    let list = getCatProducts();

    if (catState.category) list = list.filter(p => p.category === catState.category);
    if (catState.gender) list = list.filter(p => p.gender === catState.gender);
    if (catState.type) list = list.filter(p => p.type === catState.type);
    if (catState.brand) list = list.filter(p => p.brand === catState.brand);
    if (catState.minPrice != null) list = list.filter(p => p.price >= catState.minPrice);
    if (catState.maxPrice != null) list = list.filter(p => p.price <= catState.maxPrice);

    renderProductGrid("category-grid", list, "لا توجد منتجات مطابقة للفلتر");

    const countEl = document.getElementById("category-count");
    if (countEl) countEl.textContent = `${list.length} منتج`;
}

function resetCatFilters() {
    document.querySelectorAll('input[name="sf-gender"]').forEach(r => r.checked = (r.value === ""));
    document.querySelectorAll('input[name="sf-type"]').forEach(r => r.checked = (r.value === ""));
    document.querySelectorAll('input[name="sf-brand"]').forEach(r => r.checked = (r.value === ""));
    const minEl = document.getElementById("sf-min-price");
    const maxEl = document.getElementById("sf-max-price");
    if (minEl) minEl.value = "";
    if (maxEl) maxEl.value = "";
    catState.brand = "";
    applyCatFilters();
}

document.addEventListener("DOMContentLoaded", async () => {
    if (window.__dataReady && typeof window.__dataReady.then === "function") {
        try { await window.__dataReady; } catch (e) { /* تجاهل */ }
    }
    const params = new URLSearchParams(window.location.search);
    catState.category = params.get("cat");
    const gender = params.get("gender") || "";

    // ضبط عنوان الصفحة
    const titleEl = document.getElementById("category-title");
    if (titleEl) {
        const label = (typeof CATEGORY_LABELS !== "undefined" && CATEGORY_LABELS[catState.category])
            ? CATEGORY_LABELS[catState.category]
            : (catState.category || "كل المنتجات");
        let title = label;
        if (gender) title += gender === "men" ? " - رجالي" : " - نسائي";
        titleEl.textContent = title;
        document.title = `High End | ${title}`;
    }

    // ضبط فلتر النوع المبدئي من الرابط
    if (gender) {
        const genderRadio = document.querySelector(`input[name="sf-gender"][value="${gender}"]`);
        if (genderRadio) genderRadio.checked = true;
    }

    buildBrandFilters();
    applyCatFilters();
});
