import './../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import '@fortawesome/fontawesome-free/js/all.min.js';
import { fetchPlayList, fetchMoreVideos } from './fetchData.js';
import { updateProgress, changeLessonTitle, changeWeeksContent, updateTopics, showMoreWeeks, courseMaterials, updateComment } from './dom.js';
let previewBtn = document.querySelector(".previewBtn");
let nextBtn = document.querySelector(".nextBtn");
let weeksContent = document.querySelector(".weeks-content");
let commentInput = document.querySelector(".comment-input");
let commentContent = document.querySelector(".comment-content");
let addCommentBtn = document.querySelector(".add-comment");
let allStars = document.querySelectorAll(".star");

let userInfo = {};
let userComment = [];
userInfo.playListId = "PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv";
let totalStarSelected = 0;
// PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF&si=PNZzKAJuGXbXumwx

window.onload = async function () {
    if (window['YT'] && window['YT'].Player) {
        onYouTubeIframeAPIReady();
    } else {
        setTimeout(() => {
            if (window['YT'] && window['YT'].Player) onYouTubeIframeAPIReady();
        }, 1000);
    }
    if (window.localStorage.userInfo) {
        userInfo = JSON.parse(window.localStorage.userInfo);
        if (Object.values(userInfo).length < 7) {
            window.localStorage.clear();
            window.location.reload()
        }
    }
    else {
        let playlistdata = await fetchPlayList(userInfo.playListId);
        userInfo.currentLessonsVideo = 0;
        userInfo.totalLessons = playlistdata.items.length;
        userInfo.nextPageToken = playlistdata.nextPageToken || null;
        userInfo.allLessonId = [...playlistdata.items].map((ele) => ele.snippet.resourceId.videoId);
        userInfo.totalVideos = playlistdata.pageInfo.totalResults;
        userInfo.allLessonsTitle = [...playlistdata.items].map((ele) => ele.snippet.title);
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo))
    }
    if (window.localStorage.userComment) {
        userComment = JSON.parse(window.localStorage.userComment);
        getDefaultComments();
        updateComment(userComment);
    } else {
        getDefaultComments();
        updateComment(userComment);
    }
    updateDom();
};

previewBtn.addEventListener("click", event => {
    event.preventDefault();
    LoadPreviousLesson();
})

nextBtn.addEventListener("click", event => {
    event.preventDefault();
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
        window.scrollTo(0, 0)
        player.loadVideoById(parentTopicClass.getAttribute("videoid"));
        changeLessonTitle(userInfo.allLessonsTitle[parentTopicClass.getAttribute("videoindex")]);
        userInfo.currentLessonsVideo = parentTopicClass.getAttribute("videoindex");
        updateTopics(userInfo.currentLessonsVideo);
    }
    if (event.target.classList.contains("load-more-btn")) {
        showMoreWeeks(4, Math.ceil(userInfo.totalVideos / 7));
        let activeWeeks = document.querySelectorAll(".week.active");
        if (activeWeeks.length == Math.ceil(userInfo.totalVideos / 7)) {
            event.target.classList.remove("active")
        }
    }
})
commentContent.addEventListener('click', event => {
    event.preventDefault();
    let deletbtn = event.target.closest(".delete-comment")
    if (deletbtn) {
        let parentComment = event.target.closest(".user-comment")
        userComment = userComment.filter((ele) => ele.id !== +parentComment.getAttribute("data-id"));
        updateComment(userComment);
        window.localStorage.setItem("userComment", JSON.stringify(userComment));

    }
})
addCommentBtn.onclick = function (e) {
    allStars.forEach((ele) => {
        ele.classList.remove("selected")
    })
    let date = new Date();
    if (commentInput.value != "") {
        userComment.push({
            name: "You",
            content: commentInput.value,
            date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
            stars: totalStarSelected,
            id: randomId(),
            profileImg: "/image/comment-01.jpg"
        })
        commentInput.value = "";
        window.localStorage.setItem("userComment", JSON.stringify(userComment));
        updateComment(userComment);
        totalStarSelected = 0;
    } else {
        window.alert("The Comment is Empty! please fill it :)");
    }
    e.preventDefault();
}

allStars.forEach((ele, index) => {
    ele.addEventListener("click", (event) => {
        event.preventDefault();
        allStars.forEach(e => {
            e.classList.remove("selected")
        });
        for (let i = 0; i <= index; i++) {
            allStars[i].classList.add("selected")
        }
        totalStarSelected = index + 1;
    })
    ele.addEventListener("mouseover", (e) => {
        for (let i = 0; i <= index; i++) {
            allStars[i].classList.add("hovering")
        }
    })
    ele.addEventListener("mouseout", (e) => {
        for (let i = 0; i <= index; i++) {
            allStars[i].classList.remove("hovering")
        }
    })
})

function getDefaultComments() {
    userComment.unshift({
        name: "Student Name",
        content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit Id atque ipsa pariatur unde libero dolore accusantium iure suscipit vero fugiat neque",
        date: `28-2-2025`,
        stars: 4,
        id: randomId(),
        profileImg: "/image/comment-01.jpg"
    })
    userComment.unshift({
        name: "Student Name",
        content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit Id atque ipsa pariatur unde libero dolore accusantium iure suscipit vero fugiat neque",
        date: `5-11-2024`,
        stars: 5,
        id: randomId(),
        profileImg: "/image/comment-02.jpg",
    })
}

var player;
async function onYouTubeIframeAPIReady() {
    let playerContainer = document.querySelector(".player-container");
    player = new YT.Player('player', {
        height: `${playerContainer.clientWidth * 9 / 16}`,
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
    window.addEventListener("resize", () => {
        player.setSize(playerContainer.clientWidth, playerContainer.clientWidth * 9 / 16);
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
    changeLessonTitle(playlistdata.items[userInfo.currentLessonsVideo || 0].snippet.title);
    return playlistdata.items[userInfo.currentLessonsVideo || 0].snippet.resourceId.videoId;
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
        updateTopics(userInfo.currentLessonsVideo, userInfo.currentLessonsVideo);
    }
}
async function LoadPreviousLesson() {
    userInfo.currentLessonsVideo--;
    if (userInfo.currentLessonsVideo >= 0) {
        player.loadVideoById(await getCurrentVideoId())
        updateTopics(userInfo.currentLessonsVideo, userInfo.currentLessonsVideo);
    }
}

function updateData() {
    window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
}

async function updateDom(createAgain = true) {
    let allvideoslist = await fetchMoreVideos(userInfo.playListId);
    if (createAgain) {
        changeWeeksContent(userInfo.totalVideos, allvideoslist, userInfo.currentLessonsVideo);
    } else {
        updateTopics(userInfo.currentLessonsVideo, userInfo.currentLessonsVideo);
    }
    updateProgress(userInfo.totalVideos, userInfo.currentLessonsVideo + 1);
    courseMaterials(userInfo.totalVideos, "202K", "Arabic")
}

function randomId(min = 100, max = 999) {
    return Math.floor(Math.random() * (max - min) + min)

}
