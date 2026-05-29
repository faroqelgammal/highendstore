/* =========================================================
   السلايدر الرئيسي
   - يقرأ البيانات من DEFAULT_SLIDER (في products.js)
   - يُبنى مرة واحدة عبر initSlider() التي تستدعيها components.js
   ========================================================= */

let sliderData = (typeof DEFAULT_SLIDER !== "undefined") ? DEFAULT_SLIDER : [];

let currentSlide = 0;
let slideInterval = null;
let sliderReady = false;

function buildSlider() {
    const container = document.getElementById("slider-container");
    const dotsContainer = document.getElementById("slider-dots");
    if (!container || !dotsContainer) return;

    container.innerHTML = "";
    dotsContainer.innerHTML = "";

    sliderData.forEach((slide, index) => {
        const cta = slide.link
            ? `onclick="window.location.href='${slide.link}'"`
            : `onclick="document.getElementById('best-sellers')?.scrollIntoView({behavior:'smooth'})"`;
        container.innerHTML += `
            <div class="slide" id="slide-${index}">
                <img src="${slide.image}" alt="${slide.title}" class="absolute inset-0 w-full h-full object-cover"
                     onerror="this.src='${slide.fallback || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600'}'">
                <!-- التعتيم دائماً أعمق من جهة اليمين حيث النص -->
                <div class="absolute inset-0 bg-gradient-to-l from-black/90 via-black/50 to-transparent"></div>
                <!-- صندوق النص ثابت على اليمين في كل الشرائح -->
                <div class="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 z-10 text-right" dir="rtl">
                    <h4 class="text-gold tracking-[0.3em] text-xs md:text-sm font-cinzel mb-3 uppercase" dir="ltr">
                        HIGH END COLLECTION
                    </h4>
                    <h2 class="font-serif text-4xl md:text-6xl text-white mb-4 font-semibold tracking-wide drop-shadow-lg" dir="ltr">
                        ${slide.title}
                    </h2>
                    <p class="text-[#ddd] font-arabic text-base md:text-xl mb-10">
                        ${slide.subtitle}
                    </p>
                    <div>
                        <button ${cta}
                                class="border border-gold text-gold hover:bg-gold hover:text-black transition-colors duration-500 px-8 py-3 text-sm rounded font-arabic">
                            تسوق الآن
                        </button>
                    </div>
                </div>
            </div>
        `;

        dotsContainer.innerHTML += `
            <button class="h-1 rounded-full transition-all duration-300 bg-white/30 w-4 hover:bg-gold/80"
                    id="dot-${index}" onclick="goToSlide(${index})" aria-label="شريحة ${index + 1}"></button>
        `;
    });
}

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.getElementById("slider-dots");
    if (slides.length === 0 || !dotsContainer) return;

    const dots = dotsContainer.children;

    slides.forEach(s => s.classList.remove("active"));
    Array.from(dots).forEach(d => {
        d.classList.remove("bg-gold", "w-8");
        d.classList.add("bg-white/30", "w-4");
    });

    slides[index].classList.add("active");
    dots[index].classList.remove("bg-white/30", "w-4");
    dots[index].classList.add("bg-gold", "w-8");

    currentSlide = index;
}

function nextSlide() {
    let next = currentSlide + 1;
    if (next >= sliderData.length) next = 0;
    showSlide(next);
    resetSlideInterval();
}

function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) prev = sliderData.length - 1;
    showSlide(prev);
    resetSlideInterval();
}

function goToSlide(index) {
    showSlide(index);
    resetSlideInterval();
}

function startSlideInterval() {
    clearInterval(slideInterval);
    if (sliderData.length > 1) {
        slideInterval = setInterval(nextSlide, 5000);
    }
}

function resetSlideInterval() {
    startSlideInterval();
}

/* نقطة دخول واحدة آمنة من التكرار */
function initSlider() {
    if (sliderReady) return;
    const container = document.getElementById("slider-container");
    if (!container) return;
    buildSlider();
    showSlide(0);
    startSlideInterval();
    sliderReady = true;
}
