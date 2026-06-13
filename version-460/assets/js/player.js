(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var video = document.querySelector(".movie-video");
    var button = document.querySelector(".player-start");

    if (!video || !button) {
      return;
    }

    var url = video.getAttribute("src");
    var prepared = false;

    function prepare() {
      if (prepared || !url) {
        return;
      }
      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function play() {
      prepare();
      button.classList.add("is-hidden");
      var playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(function () {
          button.classList.remove("is-hidden");
        });
      }
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener("play", function () {
      button.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
      button.classList.remove("is-hidden");
    });
  });
})();
