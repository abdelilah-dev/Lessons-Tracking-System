import './import.js';
import { fetchPlayList } from './fetchData.js';
import { checkYouTubeAPI, loadVideosFromPlaylist } from './youtube.js';
import { updateProgress, changeLessonTitle, changeWeeksContent } from './dom.js';

let courseProgress = document.querySelector(".course-progress span");
let previewBtn = document.querySelector(".previewBtn");

let userInfo = {};
userInfo.playListId = "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF&si=PNZzKAJuGXbXumwx";
let userProgress = 1;

window.onload = async function () {
    if (window['YT'] && window['YT'].Player) {
        onYouTubeIframeAPIReady();
    }
    else {
        setTimeout(() => {
            if (window['YT'] && window['YT'].Player) {
                onYouTubeIframeAPIReady();
            }
        }, 1000);
    }
    if (window.localStorage.userInfo) {
        userInfo = JSON.parse(window.localStorage.userInfo);
        console.log(userInfo);
        updateDom();
    }
    else {
        let playlistdata = await fetchPlayList(userInfo.playListId);
        let videos = playlistdata.items;
        userInfo.currentLessonsVideo = 0;
        userInfo.totalLessons = videos.length;
        updateDom();
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }
    updateDom();
};

previewBtn.addEventListener("click", event => {
    event.preventDefault();
    LoadPreviousLesson();
})

var player;
async function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '100%',
        videoId: await getCurrentVideoId(),
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

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        compleatLessonsVideo();
    }
}

async function getCurrentVideoId() {
    let playlistdata = await fetchPlayList(userInfo.playListId);
    let videos = playlistdata.items;
    changeLessonTitle(videos[userInfo.currentLessonsVideo]);
    return videos[userInfo.currentLessonsVideo].snippet.resourceId.videoId;
}

async function compleatLessonsVideo() {
    userInfo.currentLessonsVideo++;
    if (userInfo.currentLessonsVideo < userInfo.totalLessons) {
        player.loadVideoById(await getCurrentVideoId())
    }
    if (window.localStorage.userInfo) {
        if (JSON.parse(window.localStorage.userInfo).currentLessonsVideo < userInfo.currentLessonsVideo) {
            updateData();
            updateDom();
        }
    } else {
        if (userInfo.currentLessonsVideo < userInfo.totalLessons) {
            updateData();
            updateDom();
        }
    }
}

async function LoadPreviousLesson() {
    userInfo.currentLessonsVideo--;
    if (userInfo.currentLessonsVideo >= 0) {
        player.loadVideoById(await getCurrentVideoId())
    }
}

function updateData() {
    window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

async function updateDom() {
    let playlistdata = await fetchPlayList(userInfo.playListId);
    let videosList = playlistdata.items;
    changeWeeksContent(userInfo.totalLessons, videosList, userInfo.currentLessonsVideo);
    updateProgress(userInfo.totalLessons, userInfo.currentLessonsVideo + 1);
}
