(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var mobileNav = document.querySelector(".mobile-nav");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                var open = mobileNav.hasAttribute("hidden");
                if (open) {
                    mobileNav.removeAttribute("hidden");
                } else {
                    mobileNav.setAttribute("hidden", "");
                }
                menuButton.setAttribute("aria-expanded", String(open));
            });
        }

        initHero();
        initFilters();
        initSearchPageQuery();
    });

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");

        if (!slides.length) {
            return;
        }

        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-slide") || 0));
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        start();
    }

    function textOf(card) {
        return [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.getAttribute("data-region"),
            card.getAttribute("data-category"),
            card.getAttribute("data-genre"),
            card.textContent
        ].join(" ").toLowerCase();
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));

        panels.forEach(function (panel) {
            var section = panel.parentElement;
            var container = section ? section.querySelector(".filter-target") : null;
            var cards = container ? Array.prototype.slice.call(container.querySelectorAll(".searchable-card")) : [];
            var search = panel.querySelector(".filter-search");
            var type = panel.querySelector(".filter-type");
            var year = panel.querySelector(".filter-year");
            var sort = panel.querySelector(".sort-select");
            var count = panel.querySelector(".result-count");

            if (!cards.length) {
                return;
            }

            cards.forEach(function (card, index) {
                card.setAttribute("data-default-order", String(index));
            });

            function update() {
                var query = search ? search.value.trim().toLowerCase() : "";
                var typeValue = type ? type.value : "";
                var yearValue = year ? year.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var matchQuery = !query || textOf(card).indexOf(query) !== -1;
                    var matchType = !typeValue || (card.getAttribute("data-type") || "").indexOf(typeValue) !== -1;
                    var matchYear = !yearValue || String(card.getAttribute("data-year") || "").indexOf(yearValue) === 0;
                    var matched = matchQuery && matchType && matchYear;
                    card.classList.toggle("is-filtered-out", !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (sort && container) {
                    var sorted = cards.slice().sort(function (a, b) {
                        var mode = sort.value;
                        if (mode === "newest") {
                            return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                        }
                        if (mode === "oldest") {
                            return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
                        }
                        if (mode === "title") {
                            return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                        }
                        return Number(a.getAttribute("data-default-order") || 0) - Number(b.getAttribute("data-default-order") || 0);
                    });
                    sorted.forEach(function (card) {
                        container.appendChild(card);
                    });
                }

                if (count) {
                    count.textContent = "共 " + visible + " 部";
                }
            }

            [search, type, year, sort].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", update);
                    control.addEventListener("change", update);
                }
            });

            update();
        });
    }

    function initSearchPageQuery() {
        var params = new URLSearchParams(window.location.search);
        var keyword = params.get("q");
        var input = document.querySelector(".filter-search");

        if (keyword && input) {
            input.value = keyword;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }
})();
