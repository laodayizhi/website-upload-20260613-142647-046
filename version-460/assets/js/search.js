(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "<article class=\"movie-card\" data-title=\"" + escapeHtml(movie.title) + "\" data-genre=\"" + escapeHtml(movie.genre) + "\" data-year=\"" + escapeHtml(movie.year) + "\" data-region=\"" + escapeHtml(movie.region) + "\">" +
      "<a class=\"poster-link\" href=\"" + escapeHtml(movie.file) + "\">" +
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"play-badge\">▶</span><span class=\"year-badge\">" + escapeHtml(movie.year) + "</span></a>" +
      "<div class=\"movie-card-body\"><div class=\"meta-line\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>" +
      "<h3><a href=\"" + escapeHtml(movie.file) + "\">" + escapeHtml(movie.title) + "</a></h3>" +
      "<p>" + escapeHtml(movie.oneLine) + "</p><div class=\"tag-row\">" + tags + "</div>" +
      "<a class=\"card-action\" href=\"" + escapeHtml(movie.file) + "\">立即播放</a></div></article>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("search-page-input");
    var summary = document.getElementById("search-summary");
    var results = document.getElementById("search-results");
    var query = getQuery();

    if (input) {
      input.value = query;
    }

    if (!results || !Array.isArray(window.SITE_MOVIES)) {
      return;
    }

    var normalized = query.toLowerCase();
    var matched = window.SITE_MOVIES.filter(function (movie) {
      if (!normalized) {
        return true;
      }
      return [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.oneLine,
        (movie.tags || []).join(" ")
      ].join(" ").toLowerCase().indexOf(normalized) !== -1;
    });

    var limited = matched.slice(0, 120);
    results.innerHTML = limited.map(movieCard).join("");

    if (summary) {
      if (query) {
        summary.textContent = "与“" + query + "”相关的高清剧集内容";
      } else {
        summary.textContent = "热门高清剧集推荐";
      }
    }
  });
})();
