const trackList = [{
        title: "Fanfare",
        album: "Running with the Devil: The Wild World of John McAfee",
        src: "assets/audio/fanfare-running-with-the-devil.mp3",
        index: 0
    },
    {
        title: "End Credits",
        album: "Running with the Devil: The Wild World of John McAfee",
        src: "assets/audio/end-credits-running-with-the-devil.mp3",
        index: 1
    },
    {
        title: "The Race",
        album: "Driven: The Billy Monger Story",
        src: "assets/audio/the-race-driven.mp3",
        index: 2
    },
    {
        title: "Like a Rock Star",
        album: "Paula",
        src: "assets/audio/like-a-rock-star-paula.mp3",
        index: 3
    },
    {
        title: "Gemsbok Chase",
        album: "Animals with Cameras",
        src: "assets/audio/gemsbok-chase-awc.mp3",
        index: 4
    },
    {
        title: "Birth",
        album: "Chris Packham: 7.7 Billion People and Counting",
        src: "assets/audio/birth-horizon.mp3",
        index: 5
    },
    {
        title: "Prelude",
        album: "Being Frank: The Frank Gardner Story",
        src: "assets/audio/prelude-being-frank.mp3",
        index: 6
    },
]

// GLOBAL CONSTANTS

const playBtn = document.getElementById("track-play-btn");
const trackListContainer = document.getElementById("track-list");
const trackPositionSlider = document.getElementById("track-position-slider");
const trackBackBtn = document.getElementById("track-back-btn");
const trackForwardBtn = document.getElementById("track-forward-btn");
const durationField = document.getElementById("duration-counter");
const progressField = document.getElementById("progress-counter");

// GLOBAL VARIABLES

let audioIsPlaying = false;
let trackPlayingIndex = 0;

let audio = document.createElement("audio");
// Load first track in trackList array
audio.src = trackList[0].src;
audio.load();

// PAGE SETUP

function loadTrackInfo() {
    for (const track of trackList) {
        const trackHtml = `
        <div class="track" data-src="${track.src}" data-index="${track.index}" id="track${track.index}">
            <div class="track-title">${track.title}</div>
            <div class="track-album">${track.album}</div>
        </div>
        `
        trackListContainer.innerHTML += trackHtml;
    }
}

loadTrackInfo();
// Get the newly rendered elements
const trackDivs = Array.from(document.getElementsByClassName("track"));

// -- UTILITY FUNCTIONS --

function removeAllActiveClass() {
    for (const div of trackDivs) {
        div.classList.remove("active-track");
    }
}

function changePlayToPauseBtn() {
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function changePauseToPlayBtn() {
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

function formatSeconds(seconds) {
    if (seconds < 10) {
        return `0${seconds}`;
    } else {
        return seconds;
    }
}

// Time display

function displayTimeRemaining() {
    const trackDuration = audio.duration;
    const trackProgress = audio.currentTime;
    const timeRemaining = trackDuration - trackProgress;
    const timeRemainingInMinutes = Math.floor(timeRemaining / 60);
    const timeRemainingInSeconds = Math.floor(timeRemaining % 60);
    durationField.textContent = `0${timeRemainingInMinutes}:${formatSeconds(timeRemainingInSeconds)}`;
}

function displayCurrentTime() {
    const currentTime = audio.currentTime;
    const currentTimeInMinutes = Math.floor(currentTime / 60);
    const currentTimeInSeconds = Math.floor(currentTime % 60);
    progressField.textContent = `0${currentTimeInMinutes}:${formatSeconds(currentTimeInSeconds)}`;
}

// Slider display & functionality

function updateProgressSlider() {
    const progress = (audio.currentTime / audio.duration) * 100;
    trackPositionSlider.value = progress;
}

function skipToSelectedTime() {
    const chosenPosition = trackPositionSlider.value;
    const totalDuration = audio.duration;
    const skipToTime = (chosenPosition / 100) * totalDuration;
    audio.currentTime = skipToTime;
}

// TRACK CLICKABLE DIVS

for (const div of trackDivs) {
    div.addEventListener("click", () => {
        const trackSrc = div.dataset.src;
        const selectedTrackIndex = div.dataset.index;
        // If there's no music playing:
        if (!audioIsPlaying) {
            audio.src = trackSrc;
            audio.load();
            audio.play();
            audioIsPlaying = true;
            trackPlayingIndex = selectedTrackIndex;
            removeAllActiveClass();
            div.classList.add("active-track");
            changePlayToPauseBtn();
        } else {
            // If there is music playing:
            // Get the src of what is playing
            const source = audio.src;
            // Use 'includes' because src has full domain address
            if (source.includes(trackSrc)) {
                audio.pause();
                audioIsPlaying = false;
                changePauseToPlayBtn();
            } else {
                audio.src = trackSrc;
                audio.load();
                audio.play();
                audioIsPlaying = true;
                trackPlayingIndex = selectedTrackIndex;
                removeAllActiveClass();
                div.classList.add("active-track");
                changePlayToPauseBtn();
            }
        }
    });
}

// UI Player Buttons

trackBackBtn.addEventListener("click", () => {
    if (trackPlayingIndex > 0) {
        return
    }
    const skipBackTrack = --trackPlayingIndex;
    audio.src = trackList[skipBackTrack].src;
    trackPlayingIndex = skipBackTrack;
    audio.load();
    audio.play();
    audioIsPlaying = true;
    removeAllActiveClass();
    const currentTrack = document.querySelector(`div[data-index="${skipBackTrack}"]`);
    currentTrack.classList.add("active-track");
    if (!audioIsPlaying) {
        changePlayToPauseBtn();
    }
})

playBtn.addEventListener("click", () => {
    if (audioIsPlaying) {
        audio.pause();
        changePauseToPlayBtn();
        audioIsPlaying = false;
    } else {
        audio.play();
        changePlayToPauseBtn();
        audioIsPlaying = true;
        const firstTrack = trackDivs[0];
        firstTrack.classList.add("active-track");
    }
});

trackForwardBtn.addEventListener("click", () => {
    if (trackPlayingIndex == 6) {
        return
    }
    if (!audioIsPlaying) {
        changePlayToPauseBtn();
    }
    const skipForwardTrack = ++trackPlayingIndex;
    audio.src = trackList[skipForwardTrack].src;
    trackPlayingIndex = skipForwardTrack;
    audio.load();
    audio.play();
    audioIsPlaying = true;
    removeAllActiveClass();
    const currentTrack = document.querySelector(`div[data-index="${skipForwardTrack}"]`);
    currentTrack.classList.add("active-track");
})

// needed??:
// audio.addEventListener("loadedmetadata", () => {
//     if (audio.buffered) {
//         alert("biffered");
//     }
//     updateTimeFields();
// });

function updateTimeFields() {
    audio.addEventListener("timeupdate", () => {
        displayTimeRemaining();
        displayCurrentTime();
        updateProgressSlider();
    });
}

audio.addEventListener("durationchange", () => {
    updateTimeFields();
});

trackPositionSlider.addEventListener("input", skipToSelectedTime);

// ADDITIONAL FUNCTIONALITY

function autoPlayNextTrack() {
    if (trackPlayingIndex < trackList.length - 1) {
        trackPlayingIndex++;
        audio.src = trackList[trackPlayingIndex].src;
        audio.load();
        audio.play();
        audioIsPlaying = true;
        removeAllActiveClass();
        const nextTrack = document.getElementById(`track${trackPlayingIndex}`);
        nextTrack.classList.add("active-track");
    }
}

audio.addEventListener("ended", autoPlayNextTrack)

// Space bar to stop and start
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.key === " ") {
        if (!audioIsPlaying) {
            audio.play();
            audioIsPlaying = true;
            changePlayToPauseBtn();
        } else {
            audio.pause();
            audioIsPlaying = false;
            changePauseToPlayBtn();
        }
    }
});