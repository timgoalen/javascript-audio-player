let animationRequestId;
let audioElement;
let context;
let analyser;

async function initVisualizer() {
    // audioElement = document.querySelector("audio");

    const canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    //   canvas.height = 300;

    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    //   analyser = audioContext.createAnalyser();
    //   const source = audioContext.createMediaElementSource(audioElement);
    //   source.connect(analyser);
    //   analyser.connect(audioContext.destination);

    // audio.play();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    requestAnimationFrame(loopingFunction);

    function loopingFunction() {
        analyser.getByteFrequencyData(data);
        draw(data);

        // Continue the animation loop
        animationRequestId = requestAnimationFrame(loopingFunction);
    }

    // canvas.width = 800;
    // canvas.height = 100;

    function draw(data) {
        data = [...data];
        context.clearRect(0, 0, canvas.width, canvas.height);
        // let space = canvas.width / data.length;
        let space = 400 / data.length;
        data.forEach((value, i) => {
            context.beginPath();
            context.moveTo(space * i, canvas.height);
            context.lineTo(space * i, canvas.height - value);
            context.strokeStyle = "#58b7ef";
            context.stroke();
        });
    }
}

// function stopVisualizer() {
//   // Stop the audio stream
//   if (stream) {
//     const tracks = stream.getTracks();
//     tracks.forEach((track) => track.stop());
//   }
//   // Cancel the animation loop
//   cancelAnimationFrame(animationRequestId);
// }