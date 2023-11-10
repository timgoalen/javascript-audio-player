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


const playBtn = document.getElementById("track-play-btn");
const trackListContainer = document.getElementById("track-list");
const trackBackBtn = document.getElementById("track-back-btn");
const trackForwardBtn = document.getElementById("track-forward-btn");
const duration = document.getElementById("duration");

let audioIsPlaying = false;
let trackPlayingIndex = 0;

let audio = document.createElement("audio");
audio.src = trackList[0].src;
audio.load();

function loadTrackInfo() {
    for (const track of trackList) {
        const trackHtml = `
        <div class="track" data-src="${track.src}" data-index="${track.index}">
            <div class="track-title">${track.title}</div>
            <div class="track-album">${track.album}</div>
        </div>
        `
        trackListContainer.innerHTML += trackHtml;
    }
}

loadTrackInfo();

const trackDivs = Array.from(document.getElementsByClassName("track"));

function removeAllActiveClass() {
    trackDivs.forEach(div => {
        div.classList.remove("active-track");
    })
}

trackDivs.forEach(div => {
    div.addEventListener("click", () => {
        const trackSrc = div.dataset.src;
        const selectedTrackIndex = div.dataset.index;
        if (!audioIsPlaying) {
            audio.src = trackSrc;
            audio.load();
            audio.play();
            // duration.textContent = audio.duration;
            let duration = audio.duration
            console.log({
                duration
            })
            audioIsPlaying = true;
            trackPlayingIndex = selectedTrackIndex;
            console.log({
                selectedTrackIndex
            })
            console.log({
                trackPlayingIndex
            })
            removeAllActiveClass();
            div.classList.add("active-track");
            changePlayToPauseBtn();
        } else {
            let source = audio.src;
            // Use 'includes' because src has full domain address
            if (source.includes(trackSrc)) {
                audio.pause();
                removeAllActiveClass();
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
});

function changePlayToPauseBtn() {
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function changePauseToPlayBtn() {
    playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

playBtn.addEventListener("click", () => {
    if (audioIsPlaying) {
        audio.pause();
        changePauseToPlayBtn();
        audioIsPlaying = false;
    } else {
        // audio.src = 
        audio.play();
        changePlayToPauseBtn();
        audioIsPlaying = true;
        const firstTrack = trackDivs[0];
        firstTrack.classList.add("active-track");
    }
});

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

trackForwardBtn.addEventListener("click", () => {
    if (trackPlayingIndex == 6) {
        return
    }
    if (!audioIsPlaying) {
        changePlayToPauseBtn();
    }
    const skipForwardTrack = ++trackPlayingIndex;
    console.log({
        skipForwardTrack
    })
    audio.src = trackList[skipForwardTrack].src;
    trackPlayingIndex = skipForwardTrack;
    audio.load();
    audio.play();
    audioIsPlaying = true;
    removeAllActiveClass();
    const currentTrack = document.querySelector(`div[data-index="${skipForwardTrack}"]`);
    currentTrack.classList.add("active-track");

})