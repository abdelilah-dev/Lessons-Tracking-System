export function checkYouTubeAPI() {
    if (window['YT'] && window['YT'].Player) {
        onYouTubeIframeAPIReady();
        console.log(window);
        console.log(window['YT']);
    }
    else {
        setTimeout(() => {
            if (window['YT'] && window['YT'].Player) {
                onYouTubeIframeAPIReady();
                console.log(window);
                console.log(window['YT']);
            }
        }, 1000);
    }
}
export function loadVideosFromPlaylist(listVideos) {
}
console.log("welcom from youtube.ts");
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '100%',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerReady(event) {
    event.target.playVideo();
}
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
    if (event.data == YT.PlayerState.ENDED) {
        window.alert("Video has ended");
    }
}
function stopVideo() {
    player.stopVideo();
}
