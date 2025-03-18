let courseProgress = document.querySelector(".course-progress span");
let lessonTitle = document.querySelector(".lesson-title");
let weeksContent = document.querySelector(".weeks-content")
export function updateProgress(totalVideoLessons, currentVideoNumber) {
    let currentProgress = (100 / totalVideoLessons) * currentVideoNumber;
    courseProgress.setAttribute("prog-value", currentProgress);
    courseProgress.style.width = `${courseProgress.getAttribute("prog-value")}%`;
}

export function changeLessonTitle(LessonObject) {
    lessonTitle.innerHTML = LessonObject.snippet.title;
}

export function changeWeeksContent(totalVideoLessons, playListItems, currentVideo) {
    weeksContent.innerHTML = "";
    console.log(playListItems)
    let totlaWeeks = Math.ceil(totalVideoLessons / 7)
    for (let i = 0; i < totlaWeeks; i++) {
        let week = document.createElement("div");
        week.className = `week-${i + 1} week`;
        week.innerHTML = `
                <h4><span></span>
                    Week ${i + 1}
                    <span></span>
                </h4>
                ` ;
        let topics = document.createElement("div");
        topics.className = "topics";
        for (let j = i * 7; j < 7 + i * 7; j++) {
            let div = document.createElement("div");
            div.className = j <= currentVideo ? "topic active" : "topic";
            div.setAttribute("videoId", playListItems[j].snippet.resourceId.videoId)
            div.innerHTML = `
                <div class="${j> currentVideo? "text-black-50": ""}">
                    <i class="fa-solid fa-file-lines"></i>
                    ${playListItems[j].snippet.title}
                    ${j}
                </div>
                <i class="${j > currentVideo ? "fa-solid fa-lock": ""}"></i>
            `
            topics.appendChild(div);
            if (j === totalVideoLessons - 1) break;
        }
        week.appendChild(topics);
        weeksContent.appendChild(week);
    }
}
