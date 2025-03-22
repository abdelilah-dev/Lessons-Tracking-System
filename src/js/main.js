import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import '@fortawesome/fontawesome-free/js/all.min.js';
import { fetchPlayList, fetchMoreVideos } from './fetchData.js';
import { checkYouTubeAPI, loadVideosFromPlaylist } from './youtube.js';
import { updateProgress, changeLessonTitle, changeWeeksContent, updateTopics, showMoreWeeks } from './dom.js';

let courseProgress = document.querySelector(".course-progress span");
let previewBtn = document.querySelector(".previewBtn");
let nextBtn = document.querySelector(".nextBtn");
let weeksContent = document.querySelector(".weeks-content");

let userInfo = {};
let playListInto = {};
userInfo.playListId = "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv";
// PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF&si=PNZzKAJuGXbXumwx
let userProgress = 1;

window.onload = async function () {
    if (window['YT'] && window['YT'].Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(() => {
            if (window['YT'] && window['YT'].Player) {
                onYouTubeIframeAPIReady();
            }
        }, 1000);
    }
    if (window.localStorage.userInfo) {
        userInfo = JSON.parse(window.localStorage.userInfo);
        updateDom();
    }
    else {
        let playlistdata = await fetchPlayList(userInfo.playListId);
        userInfo.currentLessonsVideo = 0;
        userInfo.totalLessons = playlistdata.items.length;
        userInfo.nextPageToken = playlistdata.nextPageToken || null;
        userInfo.allLessonId = [...playlistdata.items].map((ele) => ele.snippet.resourceId.videoId);
        userInfo.totalVideos = playlistdata.pageInfo.totalResults;
        userInfo.allLessonsTitle = [...playlistdata.items].map((ele) => ele.snippet.title);
        updateDom();
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }
    updateDom();
    console.log(userInfo)
};
console.log(userInfo);
previewBtn.addEventListener("click", event => {
    event.preventDefault();
    LoadPreviousLesson();
})

nextBtn.addEventListener("click", event => {
    event.preventDefault();
    console.log();
    if (userInfo.currentLessonsVideo < JSON.parse(window.localStorage.userInfo).currentLessonsVideo) {
        loadNextLesson();
        nextBtn.style.color = "#0d6efd";
    } else {
        nextBtn.style.color = "red";
    }
})

weeksContent.addEventListener("click", async event => {
    let parentTopicClass = event.target.closest(".topic");
    if (parentTopicClass && parentTopicClass.classList.contains("active")) {
        player.loadVideoById(parentTopicClass.getAttribute("videoid"));
        let playlistdata = await fetchPlayList(userInfo.playListId);
        changeLessonTitle(userInfo.allLessonsTitle[parentTopicClass.getAttribute("videoindex")]);
        userInfo.currentLessonsVideo = parentTopicClass.getAttribute("videoindex");
    }
    if (event.target.className === "load-more-btn") {
        console.log("loading more videos");
        showMoreWeeks(4)
    }
})

var player;
async function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
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

async function getCurrentVideoId(videoIndex = undefined) {
    let playlistdata = await fetchPlayList(userInfo.playListId);
    let videos = playlistdata.items;
    changeLessonTitle(videos[userInfo.currentLessonsVideo].snippet.title);
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
            updateDom(false);

        }
    } else {
        if (userInfo.currentLessonsVideo < userInfo.totalLessons) {
            updateData();
            updateDom(false);
        }
    }
}
async function loadNextLesson() {
    userInfo.currentLessonsVideo++;
    if (userInfo.currentLessonsVideo < userInfo.totalLessons) {
        player.loadVideoById(await getCurrentVideoId());
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

async function updateDom(createAgain = true) {
    let allvideoslist = await fetchMoreVideos(userInfo.playListId);
    console.log(allvideoslist);
    if (createAgain) {
        changeWeeksContent(userInfo.totalVideos, allvideoslist, userInfo.currentLessonsVideo);
    } else {
        updateTopics(userInfo.currentLessonsVideo);
    }
    updateProgress(userInfo.totalLessons, userInfo.currentLessonsVideo + 1);
}
