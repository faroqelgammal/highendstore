/* لوحة تحكم Heritage Elegance - بدون كودينج */
(function () {
    "use strict";

    const state = { products: [], slides: [], offers: [] };

    // ===== أدوات مساعدة =====
    const $ = (s) => document.querySelector(s);
    const el = (id) => document.getElementById(id);

    function toast(msg, ok = true) {
        const t = el("toast");
        t.textContent = msg;
        t.classList.remove("hidden");
        t.style.borderColor = ok ? "#c9a227" : "#ef4444";
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.add("hidden"), 2600);
    }

    function escapeHtml(v) {
        return String(v == null ? "" : v)
            .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
    }

    const CATEGORIES = [
        { value: "watches", label: "ساعات" },
        { value: "wallets", label: "محافظ" },
        { value: "perfumes", label: "عطور" },
        { value: "accessories", label: "إكسسوارات" },
    ];
    const GENDERS = [
        { value: "men", label: "رجالي" },
        { value: "women", label: "حريمي" },
        { value: "unisex", label: "للجنسين" },
    ];

    // ===== المصادقة =====
    async function checkSession() {
        try {
            const r = await fetch("/api/admin/session");
            const j = await r.json();
            return !!j.authed;
        } catch { return false; }
    }

    async function showApp() {
        el("loginScreen").classList.add("hidden");
        el("dashboard").classList.remove("hidden");
        await loadAll();
    }

    function showLogin() {
        el("dashboard").classList.add("hidden");
        el("loginScreen").classList.remove("hidden");
    }

    // ===== تحميل البيانات =====
    async function loadAll() {
        try {
            const r = await fetch("/api/admin/data");
            if (r.status === 401) return showLogin();
            const j = await r.json();
            state.products = j.products || [];
            state.slides = j.slides || [];
            state.offers = j.offers || [];
            renderProducts();
            renderSlides();
            renderOffers();
        } catch (e) {
            toast("تعذّر تحميل البيانات", false);
        }
    }

    // ===== عرض المنتجات =====
    function renderProducts() {
        el("productsCount").textContent = state.products.length;
        const wrap = el("productsList");
        if (!state.products.length) {
            wrap.innerHTML = `<p class="text-white/40 text-center py-10">لا توجد منتجات بعد.</p>`;
            return;
        }
        wrap.innerHTML = state.products.map((p) => `
            <div class="bg-card border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <img src="${escapeHtml(p.image)}" alt="" class="w-16 h-16 rounded-lg object-cover bg-darker shrink-0" onerror="this.style.opacity=.2" />
                <div class="flex-1 min-w-0">
                    <div class="font-bold truncate">${escapeHtml(p.name)}</div>
                    <div class="text-sm text-white/50">${escapeHtml(p.price)} ج.م ${p.oldPrice ? `<span class="line-through text-white/30">${escapeHtml(p.oldPrice)}</span>` : ""}</div>
                    <div class="flex gap-1 mt-1 flex-wrap">
                        ${p.featured ? badge("مميز") : ""}${p.isNew ? badge("جديد") : ""}${p.onSale ? badge("خصم") : ""}
                    </div>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                    <button data-edit-product="${escapeHtml(p.id)}" class="text-gold hover:text-gold-light text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-pen"></i></button>
                    <button data-del-product="${escapeHtml(p.id)}" class="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`).join("");
    }

    function badge(t) {
        return `<span class="text-[11px] bg-gold/15 text-gold px-2 py-0.5 rounded">${t}</span>`;
    }

    // ===== عرض السلايدر =====
    function renderSlides() {
        el("slidesCount").textContent = state.slides.length;
        const wrap = el("slidesList");
        if (!state.slides.length) {
            wrap.innerHTML = `<p class="text-white/40 text-center py-10">لا توجد شرائح بعد.</p>`;
            return;
        }
        wrap.innerHTML = state.slides.map((s) => `
            <div class="bg-card border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <img src="${escapeHtml(s.image || s.fallback)}" alt="" class="w-24 h-14 rounded-lg object-cover bg-darker shrink-0" onerror="this.src='${escapeHtml(s.fallback || "")}'" />
                <div class="flex-1 min-w-0">
                    <div class="font-bold truncate">${escapeHtml(s.title || "بدون عنوان")}</div>
                    <div class="text-sm text-white/50 truncate">${escapeHtml(s.subtitle || "")}</div>
                    <div class="text-xs text-white/40 mt-1">${s.link ? `<i class="fa-solid fa-link"></i> ${escapeHtml(s.link)}` : "لا يوجد رابط"} ${s.active ? "" : badgeOff()}</div>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                    <button data-edit-slide="${s.id}" class="text-gold hover:text-gold-light text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-pen"></i></button>
                    <button data-del-slide="${s.id}" class="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`).join("");
    }

    function badgeOff() {
        return `<span class="text-[11px] bg-white/10 text-white/50 px-2 py-0.5 rounded">مخفي</span>`;
    }

    // ===== عرض العروض =====
    function renderOffers() {
        el("offersCount").textContent = state.offers.length;
        const wrap = el("offersList");
        if (!state.offers.length) {
            wrap.innerHTML = `<p class="text-white/40 text-center py-10">لا توجد عروض بعد. أضف عرضاً واربطه بمنتج.</p>`;
            return;
        }
        wrap.innerHTML = state.offers.map((o) => `
            <div class="bg-card border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <div class="w-16 h-16 rounded-lg bg-darker shrink-0 flex items-center justify-center text-gold"><i class="fa-solid fa-tag text-xl"></i></div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold truncate">${escapeHtml(o.title || o.product_name || "عرض")}</div>
                    <div class="text-sm text-white/50 truncate">${escapeHtml(o.subtitle || "")}</div>
                    <div class="text-xs text-white/40 mt-1">${o.product_name ? `<i class="fa-solid fa-box"></i> ${escapeHtml(o.product_name)}` : "غير مرتبط بمنتج"} ${o.badge ? badge(o.badge) : ""} ${o.active ? "" : badgeOff()}</div>
                </div>
                <div class="flex flex-col gap-2 shrink-0">
                    <button data-edit-offer="${o.id}" class="text-gold hover:text-gold-light text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-pen"></i></button>
                    <button data-del-offer="${o.id}" class="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 bg-white/5 rounded-lg"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>`).join("");
    }

    // ===== مكوّنات النموذج =====
    function fText(name, label, value, opts = {}) {
        return `<div class="${opts.col || ""}">
            <label class="block text-sm mb-1.5 text-white/70">${label}</label>
            <input name="${name}" type="${opts.type || "text"}" value="${escapeHtml(value)}" class="field" ${opts.required ? "required" : ""} placeholder="${escapeHtml(opts.ph || "")}" />
        </div>`;
    }
    function fArea(name, label, value) {
        return `<div>
            <label class="block text-sm mb-1.5 text-white/70">${label}</label>
            <textarea name="${name}" rows="3" class="field">${escapeHtml(value)}</textarea>
        </div>`;
    }
    function fSelect(name, label, value, options) {
        return `<div>
            <label class="block text-sm mb-1.5 text-white/70">${label}</label>
            <select name="${name}" class="field">
                ${options.map((o) => `<option value="${escapeHtml(o.value)}" ${o.value === value ? "selected" : ""}>${escapeHtml(o.label)}</option>`).join("")}
            </select>
        </div>`;
    }
    function fCheck(name, label, checked) {
        return `<label class="flex items-center gap-2 cursor-pointer bg-darker border border-white/10 rounded-lg px-3 py-2">
            <input name="${name}" type="checkbox" ${checked ? "checked" : ""} class="accent-gold w-4 h-4" />
            <span class="text-sm">${label}</span>
        </label>`;
    }
    // حقل صورة برفع ملف + معاينة
    function fImage(name, label, value) {
        return `<div>
            <label class="block text-sm mb-1.5 text-white/70">${label}</label>
            <div class="flex items-center gap-3">
                <img data-preview="${name}" src="${escapeHtml(value)}" class="w-16 h-16 rounded-lg object-cover bg-darker border border-white/10 shrink-0" onerror="this.style.opacity=.15" />
                <div class="flex-1">
                    <input name="${name}" type="text" value="${escapeHtml(value)}" class="field mb-2" placeholder="رابط الصورة أو ارفع ملف" />
                    <label class="inline-flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                        <i class="fa-solid fa-upload"></i> رفع صورة
                        <input type="file" accept="image/*" class="hidden" data-upload="${name}" />
                    </label>
                </div>
            </div>
        </div>`;
    }

    // ===== فتح/إغلاق النافذة =====
    function openModal(title, html, onSubmit) {
        el("modalTitle").textContent = title;
        const form = el("modalForm");
        form.innerHTML = html + `
            <div class="flex gap-3 pt-2 border-t border-white/10">
                <button type="submit" class="flex-1 bg-gold hover:bg-gold-light text-dark font-bold py-2.5 rounded-lg transition-colors">حفظ</button>
                <button type="button" data-cancel class="px-5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">إلغاء</button>
            </div>`;
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true; btn.textContent = "جارٍ الحفظ...";
            try { await onSubmit(new FormData(form)); }
            finally { btn.disabled = false; btn.textContent = "حفظ"; }
        };
        form.querySelector("[data-cancel]").onclick = closeModal;
        bindUploads(form);
        el("modal").classList.remove("hidden");
    }
    function closeModal() {
        el("modal").classList.add("hidden");
        el("modalForm").innerHTML = "";
    }

    // رفع الصور داخل النموذج
    function bindUploads(form) {
        form.querySelectorAll("[data-upload]").forEach((input) => {
            input.addEventListener("change", async () => {
                const file = input.files[0];
                if (!file) return;
                const targetName = input.getAttribute("data-upload");
                const fd = new FormData();
                fd.append("file", file);
                toast("جارٍ رفع الصورة...");
                try {
                    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
                    const j = await r.json();
                    if (!r.ok) throw new Error(j.error || "فشل");
                    const txt = form.querySelector(`input[name="${targetName}"]`);
                    const prev = form.querySelector(`[data-preview="${targetName}"]`);
                    if (txt) txt.value = j.url;
                    if (prev) { prev.src = j.url; prev.style.opacity = 1; }
                    toast("تم رفع الصورة");
                } catch (e) { toast(e.message || "فشل الرفع", false); }
            });
        });
    }

    function val(fd, k) { const v = fd.get(k); return v == null ? "" : String(v).trim(); }
    function num(fd, k) { const v = val(fd, k); return v === "" ? null : Number(v); }
    function bool(fd, k) { return fd.get(k) === "on"; }
    function list(fd, k) { return val(fd, k).split(",").map((s) => s.trim()).filter(Boolean); }

    // ===== تحرير المنتج =====
    function editProduct(p) {
        const isNew = !p;
        p = p || { id: "", name: "", category: "watches", gender: "men", type: "", brand: "", price: "", oldPrice: "", image: "", gallery: [], colors: [], shortDescription: "", description: "", features: [], featured: false, isNew: false, onSale: false };
        const html = `
            ${fText("name", "اسم المنتج", p.name, { required: true })}
            <div class="grid grid-cols-2 gap-4">
                ${fText("price", "السعر (ج.م)", p.price, { type: "number", required: true })}
                ${fText("oldPrice", "السعر القديم (اختياري)", p.oldPrice || "", { type: "number" })}
            </div>
            <div class="grid grid-cols-2 gap-4">
                ${fSelect("category", "القسم", p.category, CATEGORIES)}
                ${fSelect("gender", "النوع", p.gender, GENDERS)}
            </div>
            <div class="grid grid-cols-2 gap-4">
                ${fText("brand", "الماركة", p.brand || "")}
                ${fText("type", "الخامة/النوع", p.type || "")}
            </div>
            ${fImage("image", "الصورة الرئيسية", p.image || "")}
            ${fText("gallery", "صور إضافية (روابط مفصولة بفاصلة)", (p.gallery || []).join(", "))}
            ${fText("colors", "الألوان (مفصولة بفاصلة)", (p.colors || []).join(", "))}
            ${fArea("shortDescription", "وصف مختصر", p.shortDescription || "")}
            ${fArea("description", "الوصف الكامل", p.description || "")}
            ${fText("features", "المميزات (مفصولة بفاصلة)", (p.features || []).join(", "))}
            <div class="grid grid-cols-3 gap-3">
                ${fCheck("featured", "مميز", p.featured)}
                ${fCheck("isNew", "جديد", p.isNew)}
                ${fCheck("onSale", "خصم", p.onSale)}
            </div>
            <p class="text-xs text-white/40">العروض تظهر في صفحة العروض عند تفعيلها من تبويب "العروض".</p>
        `;
        openModal(isNew ? "إضافة منتج" : "تحرير منتج", html, async (fd) => {
            const body = {
                id: p.id || undefined,
                name: val(fd, "name"),
                price: num(fd, "price"),
                oldPrice: num(fd, "oldPrice"),
                category: val(fd, "category"),
                gender: val(fd, "gender"),
                brand: val(fd, "brand"),
                type: val(fd, "type"),
                image: val(fd, "image"),
                gallery: list(fd, "gallery"),
                colors: list(fd, "colors"),
                shortDescription: val(fd, "shortDescription"),
                description: val(fd, "description"),
                features: list(fd, "features"),
                featured: bool(fd, "featured"),
                isNew: bool(fd, "isNew"),
                onSale: bool(fd, "onSale"),
            };
            const url = isNew ? "/api/products" : `/api/products/${encodeURIComponent(p.id)}`;
            const method = isNew ? "POST" : "PUT";
            const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const j = await r.json();
            if (!r.ok) return toast(j.error || "فشل الحفظ", false);
            toast("تم حفظ المنتج");
            closeModal();
            loadAll();
        });
    }

    // ===== تحرير الشريحة =====
    function editSlide(s) {
        const isNew = !s;
        s = s || { id: "", image: "", fallback: "", title: "", subtitle: "", link: "", active: true };
        const html = `
            ${fImage("image", "صورة الشريحة", s.image || "")}
            ${fText("fallback", "صورة احتياطية (رابط)", s.fallback || "")}
            ${fText("title", "العنوان", s.title || "")}
            ${fText("subtitle", "الوصف", s.subtitle || "")}
            ${fText("link", "الرابط عند الضغط", s.link || "", { ph: "offers.html أو category.html?cat=watches" })}
            ${fCheck("active", "مفعّلة (تظهر للزوار)", s.active)}
        `;
        openModal(isNew ? "إضافة شريحة" : "تحرير شريحة", html, async (fd) => {
            const body = {
                image: val(fd, "image"), fallback: val(fd, "fallback"),
                title: val(fd, "title"), subtitle: val(fd, "subtitle"),
                link: val(fd, "link"), active: bool(fd, "active"),
            };
            const url = isNew ? "/api/slides" : `/api/slides/${s.id}`;
            const r = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const j = await r.json();
            if (!r.ok) return toast(j.error || "فشل الحفظ", false);
            toast("تم حفظ الشريحة");
            closeModal();
            loadAll();
        });
    }

    // ===== تحرير العرض =====
    function editOffer(o) {
        const isNew = !o;
        o = o || { id: "", product_id: "", title: "", subtitle: "", badge: "", link: "", active: true };
        const productOptions = [{ value: "", label: "— بدون منتج —" }].concat(
            state.products.map((p) => ({ value: p.id, label: p.name }))
        );
        const html = `
            ${fSelect("productId", "المنتج المرتبط", o.product_id || "", productOptions)}
            ${fText("title", "عنوان العرض (اختياري)", o.title || "")}
            ${fText("subtitle", "وصف العرض (اختياري)", o.subtitle || "")}
            ${fText("badge", "شارة (مثل: خصم 20%)", o.badge || "")}
            ${fText("link", "رابط مخصص (اختياري)", o.link || "")}
            ${fCheck("active", "مفعّل (يظهر في صفحة العروض)", o.active)}
            <p class="text-xs text-white/40">إذا تركت العنوان فارغاً سيُستخدم اسم المنتج المرتبط.</p>
        `;
        openModal(isNew ? "إضافة عرض" : "تحرير عرض", html, async (fd) => {
            const body = {
                productId: val(fd, "productId"), title: val(fd, "title"),
                subtitle: val(fd, "subtitle"), badge: val(fd, "badge"),
                link: val(fd, "link"), active: bool(fd, "active"),
            };
            const url = isNew ? "/api/offers" : `/api/offers/${o.id}`;
            const r = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const j = await r.json();
            if (!r.ok) return toast(j.error || "فشل الحفظ", false);
            toast("تم حفظ العرض");
            closeModal();
            loadAll();
        });
    }

    // ===== حذف =====
    async function del(url, msg) {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;
        const r = await fetch(url, { method: "DELETE" });
        if (!r.ok) { const j = await r.json().catch(() => ({})); return toast(j.error || "فشل الحذف", false); }
        toast(msg);
        loadAll();
    }

    // ===== الأحداث =====
    function bindEvents() {
        // الدخول
        el("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const pw = el("loginPassword").value;
            const err = el("loginError");
            err.classList.add("hidden");
            const r = await fetch("/api/admin/login", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pw }),
            });
            if (r.ok) { showApp(); }
            else { err.textContent = "كلمة السر غير صحيحة"; err.classList.remove("hidden"); }
        });

        el("logoutBtn").addEventListener("click", async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            showLogin();
        });

        // التبويبات
        document.querySelectorAll(".tab-btn").forEach((b) => {
            b.addEventListener("click", () => {
                document.querySelectorAll(".tab-btn").forEach((x) => x.classList.remove("active"));
                b.classList.add("active");
                const tab = b.getAttribute("data-tab");
                document.querySelectorAll("[data-panel]").forEach((p) => {
                    p.classList.toggle("hidden", p.getAttribute("data-panel") !== tab);
                });
            });
        });

        // أزرار الإضافة
        el("addProductBtn").addEventListener("click", () => editProduct(null));
        el("addSlideBtn").addEventListener("click", () => editSlide(null));
        el("addOfferBtn").addEventListener("click", () => editOffer(null));

        el("modalClose").addEventListener("click", closeModal);
        el("modal").addEventListener("click", (e) => { if (e.target === el("modal")) closeModal(); });

        // تفويض أحداث القوائم
        document.addEventListener("click", (e) => {
            const t = e.target.closest("[data-edit-product],[data-del-product],[data-edit-slide],[data-del-slide],[data-edit-offer],[data-del-offer]");
            if (!t) return;
            let id;
            if ((id = t.getAttribute("data-edit-product"))) editProduct(state.products.find((p) => p.id === id));
            else if ((id = t.getAttribute("data-del-product"))) del(`/api/products/${encodeURIComponent(id)}`, "تم حذف المنتج");
            else if ((id = t.getAttribute("data-edit-slide"))) editSlide(state.slides.find((s) => String(s.id) === id));
            else if ((id = t.getAttribute("data-del-slide"))) del(`/api/slides/${id}`, "تم حذف الشريحة");
            else if ((id = t.getAttribute("data-edit-offer"))) editOffer(state.offers.find((o) => String(o.id) === id));
            else if ((id = t.getAttribute("data-del-offer"))) del(`/api/offers/${id}`, "تم حذف العرض");
        });
    }

    // ===== البدء =====
    async function init() {
        bindEvents();
        if (await checkSession()) showApp();
        else showLogin();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
