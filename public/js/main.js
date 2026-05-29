/* =========================================================
   main.js - أدوات عامة مشتركة بين كل الصفحات
   ========================================================= */

/* تحميل المنتجات (المصدر: DEFAULT_PRODUCTS، ويمكن استبدالها من localStorage) */
let products = [];
try {
    const stored = JSON.parse(localStorage.getItem("he_data_products"));
    products = (Array.isArray(stored) && stored.length > 0) ? stored : DEFAULT_PRODUCTS;
} catch (e) {
    products = DEFAULT_PRODUCTS;
}
window.products = products;
window.brands = (typeof DEFAULT_BRANDS !== "undefined") ? DEFAULT_BRANDS : [];

/* تنسيق الأسعار بفواصل الآلاف */
function formatPrice(price) {
    if (price === undefined || price === null) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* قائمة الموبايل */
function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    menu.classList.toggle("translate-x-full");
}
