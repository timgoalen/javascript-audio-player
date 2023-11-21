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
];

// -- GLOBAL CONSTANTS --

const playBtn = document.getElementById("track-play-btn");
const trackListContainer = document.getElementById("track-list");
const trackPositionSlider = document.getElementById("track-position-slider");
const trackBackBtn = document.getElementById("track-back-btn");
const trackForwardBtn = document.getElementById("track-forward-btn");
const durationField = document.getElementById("duration-counter");
const progressField = document.getElementById("progress-counter");

// -- GLOBAL VARIABLES --

let audioIsPlaying = false;
let trackPlayingIndex = 0;

// Create the audio element
let audio = document.createElement("audio");

// -- PAGE SETUP --

function loadTrackInfo() {
    for (const track of trackList) {
        const trackHtml = `
<div class="track" data-src="${track.src}" data-index="${track.index}" id="track${track.index}">
    <div class="track-title">${track.title}</div>
    <div class="track-album">${track.album}</div>
</div>
`;
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

function changePlayToPauseIcon() {
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function changePauseToPlayIcon() {
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

function formatSeconds(seconds) {
    if (seconds < 10) {
        return `0${seconds}`;
    } else {
        return seconds;
    }
}

// -- MAIN FUNCTIONS --

function playAudio(src) {
    audio.src = src;
    audio.load();
    audio.play();
    audioIsPlaying = true;
}

function pauseAudio() {
    audio.pause();
    audioIsPlaying = false;
}

function updateUiToPlaying() {
    changePlayToPauseIcon();
    removeAllActiveClass();
    trackDivs[trackPlayingIndex].classList.add("active-track");
}

function updateUiToPaused() {
    changePauseToPlayIcon();
}

function checkIfTrackIsLoaded() {
    if (audio.src) {
        return;
    } else {
        // Load first track in trackList array
        audio.src = trackList[0].src;
        audio.load();
    }
}

// -- CLICK HANDLERS --

function playBtnClickHandler() {
    if (audioIsPlaying) {
        pauseAudio();
        updateUiToPaused();
    } else {
        checkIfTrackIsLoaded();
        audio.play();
        audioIsPlaying = true;
        updateUiToPlaying();
    }
}

function handleTrackBackClick() {
    if (trackPlayingIndex === 0) {
        return;
    }
    --trackPlayingIndex;
    const src = trackList[trackPlayingIndex].src;
    playAudio(src);
    updateUiToPlaying();
}

function handleTrackForwardClick() {
    if (trackPlayingIndex == trackList.length - 1) {
        return;
    }
    ++trackPlayingIndex;
    const src = trackList[trackPlayingIndex].src;
    playAudio(src);
    updateUiToPlaying();
}

function trackDivClickHandler(index) {
    const targetDivSrc = trackList[index].src;
    if (!audioIsPlaying) {
        trackPlayingIndex = parseInt(index);
        playAudio(targetDivSrc);
        updateUiToPlaying();
    } else {
        const currentTrackPlaying = audio.src;
        // If selected track is playing
        // (use 'includes' because full URL includes domain name)
        if (currentTrackPlaying.includes(targetDivSrc)) {
            pauseAudio();
            updateUiToPaused();
        } else {
            trackPlayingIndex = parseInt(index);
            playAudio(targetDivSrc);
            updateUiToPlaying();
        }
    }
}

// Display 'time elapsed' & 'time remaining'

function displayTimeElapsed() {
    const currentTimeInMinutes = Math.floor(audio.currentTime / 60);
    const currentTimeInSeconds = Math.floor(audio.currentTime % 60);
    progressField.textContent = `0${currentTimeInMinutes}:${formatSeconds(currentTimeInSeconds)}`;
}

function displayTimeRemaining() {
    if (isNaN(audio.duration)) {
        return;
    }
    const timeRemaining = audio.duration - audio.currentTime;
    const timeRemainingInMinutes = Math.floor(timeRemaining / 60);
    const timeRemainingInSeconds = Math.floor(timeRemaining % 60);
    durationField.textContent = `0${timeRemainingInMinutes}:${formatSeconds(timeRemainingInSeconds)}`;
}

function updateTimeFields() {
    displayTimeElapsed();
    displayTimeRemaining();
    updateProgressSlider();
}

// Slider display & functionality

function updateProgressSlider() {
    audio.addEventListener("loadedmetadata", () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        trackPositionSlider.value = progress;
    });

}

function skipToSelectedTime() {
    const chosenPosition = trackPositionSlider.value;
    const totalDuration = audio.duration;
    const skipToTime = (chosenPosition / 100) * totalDuration;
    audio.currentTime = skipToTime;
}

// Extra functionality

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

function spaceBarToStopOrStart(event) {
    if (event.code === "Space" || event.key === " ") {
        if (!audioIsPlaying) {
            checkIfTrackIsLoaded();
            audio.play();
            audioIsPlaying = true;
            updateUiToPlaying();
        } else {
            pauseAudio();
            updateUiToPaused();
        }
    }
}

// -- EVENT LISTENERS -

playBtn.addEventListener("click", playBtnClickHandler);

trackBackBtn.addEventListener("click", handleTrackBackClick);

trackForwardBtn.addEventListener("click", handleTrackForwardClick);

trackDivs.forEach((div) => {
    div.addEventListener("click", () => {
        const index = div.dataset.index;
        trackDivClickHandler(index);
    });
});

trackPositionSlider.addEventListener("input", skipToSelectedTime);

audio.addEventListener("timeupdate", () => {
    updateProgressSlider();
    updateTimeFields();
});

document.addEventListener("keydown", spaceBarToStopOrStart);

audio.addEventListener("ended", autoPlayNextTrack);