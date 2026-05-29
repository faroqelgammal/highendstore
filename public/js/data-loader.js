/* =========================================================
   data-loader.js
   - يجلب المنتجات والسلايدر من قاعدة البيانات (API)
   - يحدّث window.products و sliderData قبل عرض الصفحة
   - في حال فشل الاتصال يستخدم البيانات الافتراضية الموجودة
   يجب تحميله بعد main.js و slider.js وقبل components.js
   ========================================================= */

window.__dataReady = (async function () {
    try {
        const [pRes, sRes] = await Promise.all([
            fetch("/api/products", { cache: "no-store" }),
            fetch("/api/slides", { cache: "no-store" }),
        ]);

        if (pRes.ok) {
            const { products: dbProducts } = await pRes.json();
            if (Array.isArray(dbProducts) && dbProducts.length) {
                window.products = dbProducts;
                // products متغيّر عام في main.js — نحدّثه أيضاً إن وُجد
                try { products = dbProducts; } catch (e) { /* ignore */ }
            }
        }

        if (sRes.ok) {
            const { slides: dbSlides } = await sRes.json();
            if (Array.isArray(dbSlides) && dbSlides.length) {
                // sliderData متغيّر عام مُعرّف في slider.js
                try { sliderData = dbSlides; } catch (e) { /* ignore */ }
                window.sliderData = dbSlides;
            }
        }
    } catch (err) {
        console.error("[v0] data-loader: تعذّر جلب البيانات من القاعدة، سيتم استخدام البيانات الافتراضية", err);
    }
})();
