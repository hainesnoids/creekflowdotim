function createVideo(src, wrapper) {
    const video = document.createElement('video');

    video.setAttribute('class', 'video-js vjs-big-play-centered vjs-paused vjs-controls-enabled vjs-workinghover vjs-v8 vjs-user-active')
    video.setAttribute('controls', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('autoplay', 'true');
    video.setAttribute('preload', 'auto');
    video.setAttribute('poster', 'about:blank');
    video.setAttribute('width', '100%');
    video.setAttribute('height', '100%');

    const source = document.createElement('source');
    source.src = src;
    source.type = 'video/webm';

    video.appendChild(source);
    wrapper.appendChild(video);
    videojs(video);
    return video;
}
function initVideo(wrapper) {
    const video = document.createElement('video');

    video.setAttribute('class', 'video-js vjs-big-play-centered vjs-paused vjs-controls-enabled vjs-workinghover vjs-v8 vjs-user-active')
    video.setAttribute('controls', 'true');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('autoplay', 'false');
    video.setAttribute('preload', 'auto');
    video.setAttribute('poster', 'about:blank');
    video.setAttribute('width', '100%');
    video.setAttribute('height', '100%');

    wrapper.appendChild(video);

    return video;
}
function setVideoSource(src, video) {
    video.src = src;
    videojs(video);
}