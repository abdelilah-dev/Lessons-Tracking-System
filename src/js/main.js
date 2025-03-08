import './import.js'
import { fetchPlayList } from './fetchData.js';
let listId = "PLDoPjvoNmBAw4eOj58MZPakHjaO3frVMF&si=PNZzKAJuGXbXumwx";
let userInfo = [];
let userProgress = 0;

let lessonVideoSource = document.querySelector(".lesson-video");

let courseProgress = document.querySelector(".course-progress span");
let pro = 10;
courseProgress.setAttribute("prog-value", 10)
courseProgress.style.width = `${courseProgress.getAttribute("prog-value")}%`
let interval = setInterval(() => {
    pro += 5;
    courseProgress.setAttribute("prog-value", pro)
    courseProgress.style.width = `${courseProgress.getAttribute("prog-value")}%`;
    if (pro === 100) {
        clearInterval(interval)
    }
    console.log(pro)

}, 500);

window.onload = async function () {
    if (window.localStorage.userInfo) {
        //
    } else {
        // let playlistdata = await fetchPlayList(listId);
        // let videos = playlistdata.items;
        // lessonVideoSource.innerHTML = `
        //     <iframe width="560" height="315"
        //         src="https://www.youtube.com/embed/${videos[0].snippet.resourceId.videoId}"
        //         title="YouTube video player"
        //         frameborder="0"
        //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        //         allowfullscreen>
        //     </iframe>
        // `;

    }
}

// const video = document.querySelector(".lessonVideo");
// const videoSource = document.querySelector(".lessonVideo source")
// const nextLessonBtn = document.querySelector(".nextLessonBtn");

// video.addEventListener("ended", () => {
//     alert("تهانينا! أكملت الدرس.");
//     nextLessonBtn.disabled = false;
// });

// nextLessonBtn.addEventListener("click", () => {
//     videoSource.src = "/public/videos/glitch_-_27706 (1080p).mp4";
//     video.load();
// });
