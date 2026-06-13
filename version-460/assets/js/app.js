(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector(".menu-button");
    var navPanel = document.querySelector(".nav-panel");

    if (menuButton && navPanel) {
      menuButton.addEventListener("click", function () {
        navPanel.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }

    var filterInput = document.querySelector(".filter-input");
    var filterSelect = document.querySelector(".filter-select");
    var filterCards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function cardText(card) {
      return normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.textContent
      ].join(" "));
    }

    function applyFilter() {
      var keyword = normalize(filterInput ? filterInput.value : "");
      var year = filterSelect ? filterSelect.value : "";

      filterCards.forEach(function (card) {
        var text = cardText(card);
        var cardYear = card.getAttribute("data-year") || "";
        var keywordMatch = !keyword || text.indexOf(keyword) !== -1;
        var yearMatch = !year || cardYear === year || (year === "2020" && Number(cardYear) <= 2020);
        card.classList.toggle("is-hidden", !(keywordMatch && yearMatch));
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", applyFilter);
    }

    if (filterSelect) {
      filterSelect.addEventListener("change", applyFilter);
    }
  });
})();
