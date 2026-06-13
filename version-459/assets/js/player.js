import { H as Hls } from "./hls.esm.js";

export function setupPlayer(sourceUrl) {
    var video = document.getElementById("moviePlayer");
    var button = document.getElementById("playButton");
    var overlay = document.querySelector(".player-cover");
    var attached = false;
    var hls = null;

    if (!video || !sourceUrl) {
        return;
    }

    function hideOverlay() {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    }

    function attachSource() {
        if (attached) {
            return;
        }
        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = sourceUrl;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(sourceUrl);
            hls.attachMedia(video);
            return;
        }

        video.src = sourceUrl;
    }

    function playVideo() {
        attachSource();
        hideOverlay();
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener("click", playVideo);
    }

    if (overlay) {
        overlay.addEventListener("click", playVideo);
    }

    video.addEventListener("play", hideOverlay);
    video.addEventListener("loadedmetadata", function () {
        if (hls) {
            hls.startLoad(-1);
        }
    });
}
