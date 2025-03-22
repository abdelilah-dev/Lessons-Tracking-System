let courseProgress = document.querySelector(".course-progress span");
let lessonTitle = document.querySelector(".lesson-title");
let weeksContent = document.querySelector(".weeks-content")

let totalSee = 4;

export function updateProgress(totalVideoLessons, currentVideoNumber) {
    let currentProgress = (100 / totalVideoLessons) * currentVideoNumber;
    courseProgress.setAttribute("prog-value", currentProgress);
    courseProgress.style.width = `${courseProgress.getAttribute("prog-value")}%`;
}

export function changeLessonTitle(title) {
    lessonTitle.innerHTML = title;
}

export function changeWeeksContent(totalVideoLessons, playListItems, currentVideo) {
    weeksContent.innerHTML = "";
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
            if (j <= currentVideo) div.classList.add("active");
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
}

export function updateTopics(currentLessonsVideo) {
    let topic = document.querySelectorAll(".topic");
    for (let i = 0; i <= currentLessonsVideo; i++) {
        topic[i].classList.add("active")
    }
}

export function showMoreWeeks(toWeekNumber, totalWeeks) {
    totalSee += totalSee+ toWeekNumber > totalWeeks ? totalWeeks - totalSee : toWeekNumber;
    let week = document.querySelectorAll(".week");
    for (let i = 0; i < totalSee; i++) {
        week[i].classList.add("active");
    }
}
