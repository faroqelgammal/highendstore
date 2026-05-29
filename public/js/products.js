/* =========================================================
   بيانات المتجر (المصدر الوحيد للحقيقة)
   - category / gender / type كلها أحرف صغيرة (lowercase)
     عشان الفلترة تشتغل بدون مشاكل.
   ========================================================= */

const DEFAULT_PRODUCTS = [
    {
        id: "WT-M-RX-001",
        name: "Rolex Submariner Date",
        category: "watches",
        gender: "men",
        type: "metal",
        brand: "Rolex",
        price: 32999,
        oldPrice: 35999,
        image: "images/products/rolex-submariner.png",
        gallery: [
            "images/products/rolex-submariner.png",
            "images/products/rolex-submariner-2.png"
        ],
        colors: ["أسود", "أزرق", "أخضر"],
        colorVariants: [
            { name: "أسود", swatch: "images/products/rolex-submariner.png", gallery: ["images/products/rolex-submariner.png", "images/products/rolex-submariner-2.png"] },
            { name: "أزرق", swatch: "images/products/rolex-blue.png", gallery: ["images/products/rolex-blue.png"] },
            { name: "أخضر", swatch: "images/products/rolex-green.png", gallery: ["images/products/rolex-green.png"] }
        ],
        shortDescription: "ساعة رولكس فاخرة بتصميم رياضي أنيق.",
        description: "ساعة رولكس سبمارينر من أشهر الساعات الفاخرة في العالم. تتميز بخامات عالية الجودة وتصميم كلاسيكي مناسب للاستخدام اليومي والمناسبات.",
        features: ["ستانلس ستيل", "مقاومة للمياه", "حركة أوتوماتيك", "زجاج مقاوم للخدش"],
        specifications: { "الحركة": "Automatic", "الخامة": "Stainless Steel", "المقاس": "42mm", "مقاومة المياه": "30 ATM", "السوار": "Metal" },
        featured: true, isNew: true, onSale: true
    },
    {
        id: "WT-M-OM-002",
        name: "Omega Seamaster",
        category: "watches",
        gender: "men",
        type: "metal",
        brand: "Omega",
        price: 25500,
        oldPrice: 28000,
        image: "images/products/omega-seamaster.png",
        gallery: ["images/products/omega-seamaster.png"],
        colors: ["أزرق", "أسود"],
        colorVariants: [
            { name: "أزرق", swatch: "images/products/omega-seamaster.png", gallery: ["images/products/omega-seamaster.png"] },
            { name: "أسود", swatch: "images/products/omega-black.png", gallery: ["images/products/omega-black.png"] }
        ],
        shortDescription: "أوميجا سيماستر بتصميم بحري راقٍ.",
        description: "ساعة أوميجا سيماستر تجمع بين الأناقة والأداء، مستوحاة من عالم الغوص بتصميم عصري فاخر.",
        features: ["ستانلس ستيل", "مقاومة للمياه", "إطار دوار"],
        specifications: { "الحركة": "Automatic", "الخامة": "Stainless Steel", "المقاس": "41mm", "مقاومة المياه": "30 ATM", "السوار": "Metal" },
        featured: true, isNew: false, onSale: true
    },
    {
        id: "WT-W-CR-003",
        name: "Cartier Tank",
        category: "watches",
        gender: "women",
        type: "leather",
        brand: "Cartier",
        price: 41000,
        oldPrice: null,
        image: "images/products/cartier-tank.png",
        gallery: ["images/products/cartier-tank.png"],
        colors: ["بني", "أسود"],
        shortDescription: "كارتييه تانك الكلاسيكية للأناقة النسائية.",
        description: "ساعة كارتييه تانك أيقونة الأناقة الكلاسيكية، بتصميم مستطيل راقٍ وسوار جلدي فاخر.",
        features: ["جلد طبيعي", "تصميم كلاسيكي", "حركة كوارتز"],
        specifications: { "الحركة": "Quartz", "الخامة": "Steel", "المقاس": "33mm", "مقاومة المياه": "3 ATM", "السوار": "Leather" },
        featured: true, isNew: true, onSale: false
    },
    {
        id: "WL-M-LV-004",
        name: "Louis Vuitton Wallet",
        category: "wallets",
        gender: "men",
        type: "leather",
        brand: "Louis Vuitton",
        price: 4500,
        oldPrice: 5200,
        image: "images/products/lv-wallet.png",
        gallery: ["images/products/lv-wallet.png"],
        colors: ["بني", "أسود"],
        shortDescription: "محفظة لويس فيتون جلد فاخرة.",
        description: "محفظة لويس فيتون رجالي من الجلد الفاخر بتصميم أنيق وعملي يتسع لكافة احتياجاتك اليومية.",
        features: ["جلد طبيعي", "متعددة الجيوب", "تصميم نحيف"],
        specifications: { "الخامة": "Leather", "اللون": "بني", "عدد الجيوب": "8" },
        featured: false, isNew: true, onSale: true
    },
    {
        id: "PF-M-DR-005",
        name: "Dior Sauvage EDP",
        category: "perfumes",
        gender: "men",
        type: "rubber",
        brand: "Dior",
        price: 3900,
        oldPrice: 4400,
        image: "images/products/dior-sauvage.png",
        gallery: ["images/products/dior-sauvage.png"],
        colors: ["أزرق"],
        shortDescription: "عطر ديور سوفاج الرجالي الأيقوني.",
        description: "عطر ديور سوفاج برائحة منعشة وقوية تدوم طويلاً، مناسب للمناسبات والاستخدام اليومي.",
        features: ["ثبات عالي", "100 مل", "أصلي 100%"],
        specifications: { "الحجم": "100ml", "التركيز": "EDP", "العائلة العطرية": "Woody Aromatic" },
        featured: true, isNew: false, onSale: true
    },
    {
        id: "AC-W-GU-006",
        name: "Gucci Sunglasses",
        category: "accessories",
        gender: "women",
        type: "metal",
        brand: "Gucci",
        price: 5600,
        oldPrice: null,
        image: "images/products/gucci-sunglasses.png",
        gallery: ["images/products/gucci-sunglasses.png"],
        colors: ["ذهبي", "أسود"],
        shortDescription: "نظارة جوتشي شمسية فاخرة.",
        description: "نظارة شمسية من جوتشي بتصميم عصري وحماية كاملة من الأشعة، لمسة أناقة لا غنى عنها.",
        features: ["حماية UV400", "إطار معدني", "أصلية"],
        specifications: { "الخامة": "Metal", "الحماية": "UV400", "النوع": "Sunglasses" },
        featured: false, isNew: true, onSale: false
    }
];

/* بيانات السلايدر */
/* ملاحظة: النص دائماً على اليمين (موحّد) عبر textSide في slider.js */
const DEFAULT_SLIDER = [
    {
        image: "images/slider/slide-1.png",
        fallback: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1600&q=80",
        title: "Timeless Luxury",
        subtitle: "اكتشف أرقى مجموعات الساعات الفاخرة",
        link: "category.html?cat=watches"
    },
    {
        image: "images/slider/slide-2.png",
        fallback: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1600&q=80",
        title: "Signature Style",
        subtitle: "محافظ وإكسسوارات تعكس ذوقك الرفيع",
        link: "category.html?cat=wallets"
    },
    {
        image: "images/slider/slide-3.png",
        fallback: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&q=80",
        title: "Pure Essence",
        subtitle: "عطور فاخرة برائحة تدوم طويلاً",
        link: "category.html?cat=perfumes"
    },
    {
        image: "images/slider/slide-4.png",
        fallback: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1600&q=80",
        title: "Bold Accessories",
        subtitle: "إكسسوارات تكمل إطلالتك بأناقة",
        link: "category.html?cat=accessories"
    }
];

/* بيانات الماركات (تُستخدم في صفحة brands.html) */
const DEFAULT_BRANDS = [
    { name: "Rolex", tagline: "ساعات سويسرية أيقونية" },
    { name: "Omega", tagline: "إرث من الدقة والأناقة" },
    { name: "Cartier", tagline: "فخامة فرنسية خالدة" },
    { name: "Louis Vuitton", tagline: "جلود ومحافظ راقية" },
    { name: "Dior", tagline: "عطور فرنسية فاخرة" },
    { name: "Gucci", tagline: "أناقة إيطالية عصرية" }
];

/* قائمة المحافظات (للـ checkout) */
const EGYPT_GOVERNORATES = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية",
    "المنوفية", "الغربية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد",
    "الإسماعيلية", "السويس", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
    "المنيا", "بني سويف", "الفيوم", "مطروح", "شمال سيناء", "جنوب سيناء",
    "البحر الأحمر", "الوادي الجديد"
];

/* أسماء الفئات بالعربي للعرض */
const CATEGORY_LABELS = {
    watches: "الساعات",
    wallets: "المحافظ",
    perfumes: "العطور",
    accessories: "الإكسسوارات"
};
