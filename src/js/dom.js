let courseProgress = document.querySelector(".course-progress span");
let lessonTitle = document.querySelector(".lesson-title");
let weeksContent = document.querySelector(".weeks-content")

let totalSee = 4;

export function updateProgress(totalVideoLessons, currentVideoNumber) {
    let currentProgress = (100 / totalVideoLessons) * currentVideoNumber;
    courseProgress.setAttribute("prog-value", currentProgress.toFixed(1));
    courseProgress.style.width = `${courseProgress.getAttribute("prog-value")}%`;
}

export function changeLessonTitle(title) {
    lessonTitle.innerHTML = title;
}

export function changeWeeksContent(totalVideoLessons, playListItems, currentVideo) {
    weeksContent.innerHTML = "";
    totalSee = Math.ceil(currentVideo / 7) > 4 ? Math.ceil(currentVideo / 7) : 4;
    let totlaWeeks = Math.ceil(totalVideoLessons / 7)
    for (let i = 0; i < totlaWeeks; i++) {
        let week = document.createElement("div");
        week.className = `accordion-item week-${i + 1} week ${i < totalSee ? "active" : ""}`;
        week.innerHTML = `
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapse${i}" aria-expanded="false" aria-controls="flush-collapseOne">
                    Week ${i + 1}
                </button>
            </h2>` ;
        let topics = document.createElement("div");
        topics.className = "accordion-collapse collapse topics";
        topics.id = `flush-collapse${i}`;
        topics.setAttribute("data-bs-parent", "#accordionFlushExample")
        for (let j = i * 7; j < 7 + i * 7; j++) {
            let div = document.createElement("div");
            div.className = "topic accordion-body";
            div.setAttribute("videoId", playListItems[j].snippet.resourceId.videoId)
            div.setAttribute("videoIndex", j)
            div.innerHTML = `
                <div>
                    <i class="fa-solid fa-file-lines"></i>
                    ${playListItems[j].snippet.title}
                </div>
                <i class="fa-solid fa-lock"></i>
            `
            topics.appendChild(div);
            if (j === totalVideoLessons - 1) break;
        }
        week.appendChild(topics);
        weeksContent.appendChild(week);
    }
    let loadMorebtn = document.createElement("button");
    loadMorebtn.className = "load-more-btn active";
    loadMorebtn.appendChild(document.createTextNode("Load More"))
    weeksContent.appendChild(loadMorebtn);
    updateTopics(currentVideo, currentVideo);
}

export function courseMaterials(totalVideos, studentsCount, lang) {
    let duration = document.querySelector(".duration-value")
    let lessons = document.querySelector(".lesson-count")
    let enrolled = document.querySelector(".enrolled-value")
    let language = document.querySelector(".language")
    duration.innerHTML = `${Math.ceil(totalVideos / 7)} Weeks`
    lessons.innerHTML = `${totalVideos}`;
    enrolled.innerHTML = `${studentsCount} Student`;
    language.innerHTML = lang;
}

export function updateTopics(lessonOpened, currentLessonsVideo = null) {
    let topic = document.querySelectorAll(".topic");
    topic.forEach(ele => {
        if (ele === topic[lessonOpened]) {
            let weekParent = ele.closest(".week");
            weekParent.classList.contains(".active") ? null : weekParent.classList.add("active");
            let btn = ele.closest(".week").children[0].children[0];
            if (btn.getAttribute("aria-expanded") === "false") btn.click();
            ele.classList.add("open")
        }
        else ele.classList.remove("open")
    })
    topic[lessonOpened].classList.add("open")
    if (currentLessonsVideo != null) {
        for (let i = 0; i <= currentLessonsVideo; i++) {
            topic[i].classList.add("active")
        }
    }

}

export function showMoreWeeks(toWeekNumber, totalWeeks) {
    totalSee += totalSee + toWeekNumber > totalWeeks ? totalWeeks - totalSee : toWeekNumber;
    let week = document.querySelectorAll(".week");
    for (let i = 0; i < totalSee; i++) {
        week[i].classList.add("active");
    }
}
