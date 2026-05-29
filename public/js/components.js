/* =========================================================
   components.js - تحميل المكوّنات المشتركة وتشغيل الصفحة
   يحمّل القطع الموجودة فقط (حسب الـ id الموجود في الصفحة)
   ثم يشغّل: السلايدر + السلة + شبكات المنتجات.
   ========================================================= */

async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return false;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`فشل تحميل ${file}`);
        element.innerHTML = await response.text();
        return true;
    } catch (error) {
        console.error("[v0] loadComponent:", error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // تحميل المكوّنات المشتركة (تُتجاهل القطعة لو حاويتها غير موجودة)
    await Promise.all([
        loadComponent("top-bar-container", "components/topbar.html"),
        loadComponent("navbar-container", "components/navbar.html"),
        loadComponent("footer-container", "components/footer.html"),
        loadComponent("cart-container", "components/cart.html"),
        loadComponent("slider-container-component", "components/slider.html")
    ]);

    // انتظار جلب البيانات من قاعدة البيانات (إن وُجد data-loader)
    if (window.__dataReady && typeof window.__dataReady.then === "function") {
        try { await window.__dataReady; } catch (e) { /* تجاهل */ }
    }

    // تشغيل السلايدر (مرة واحدة فقط عبر initSlider)
    if (typeof initSlider === "function") initSlider();

    // تهيئة السلة بعد تحميل قطعة السلة و navbar
    if (typeof updateCartCount === "function") updateCartCount();
    if (typeof renderCartItems === "function") renderCartItems();

    // عرض شبكات المنتجات في الصفحة الرئيسية
    if (typeof renderHomeProducts === "function") renderHomeProducts();
});
