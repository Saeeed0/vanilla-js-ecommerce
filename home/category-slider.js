function useCategorySlider() {
  let xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      const categories = JSON.parse(xhr.responseText);

      const track = document.querySelector("#sliderTrack");
      const prevBtn = document.querySelector("#categorySlider .prev");
      const nextBtn = document.querySelector("#categorySlider .next");

      let index = 0;
      let cardsPerView = 4;

      // إنشاء الكروت الأصلية
      for (const category of categories) {
        track.innerHTML += `
          <a href="#">
              <div class="card">
              <img src="${category.image}" alt="${category.name}" />
              <p>${category.name}</p>
              </div>
          </a>
        `;
      }

      let cards = track.querySelectorAll(".card");

      // نسخ أول وآخر كروت لعمل لوب سلس
      const firstClones = Array.from(cards)
        .slice(0, cardsPerView)
        .map((card) => card.cloneNode(true));

      const lastClones = Array.from(cards)
        .slice(-cardsPerView)
        .map((card) => card.cloneNode(true));

      // إضافة النسخ
      lastClones.forEach((clone) =>
        track.insertBefore(clone, track.firstChild)
      );
      firstClones.forEach((clone) => track.appendChild(clone));

      // تحديث القائمة بعد النسخ
      cards = track.querySelectorAll(".card");
      index = cardsPerView; // نبدأ بعد النسخ الأمامية

      function getCardWidth() {
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        return cards[0].offsetWidth + gap;
      }

      function updateSlider(animate = true) {
        const cardWidth = getCardWidth();
        track.style.transition = animate ? "transform 0.3s ease" : "none";
        track.style.transform = `translateX(-${index * cardWidth}px)`;
      }

      function goNext() {
        index++;
        updateSlider(true);
      }

      function goPrev() {
        index--;
        updateSlider(true);
      }

      track.addEventListener("transitionend", () => {
        if (index >= cards.length - cardsPerView) {
          index = cardsPerView;
          updateSlider(false);
        } else if (index < cardsPerView) {
          index = cards.length - cardsPerView * 2;
          updateSlider(false);
        }
      });

      // أزرار
      nextBtn.addEventListener("click", goNext);
      prevBtn.addEventListener("click", goPrev);

      // أوتوبلاي
      let autoPlayInterval = setInterval(goNext, 2000);


      // ضبط الوضع المبدئي
      updateSlider(false);
    }
  };
  xhr.open("GET", "http://localhost:3000/categories");
  xhr.send();
}

useCategorySlider();
