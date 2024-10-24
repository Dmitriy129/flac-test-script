
let currentMP4 = 0;
var tracksMP4 = [
    'https://cdn-demo.s3.yandex.net/654d34b5-1c79-4a0b-a24d-af7841e0ee14/STRM-9313-flac-samples/ff-12.mp4',
    'https://playerweb-stands.s3.yandex.net/cloud-stat-dash/Aaron_Smith_-_Dancin_73039632.mp4',
    'https://playerweb-stands.s3.yandex.net/cloud-stat-dash/Kygo_-_Firestone_48061504.mp4',
];
var audioMP4 = document.createElement('audio')
window.audioMP4 = audioMP4
document.body.appendChild(audioMP4)
audioMP4.autoplay = true

audioMP4.src = tracksMP4[currentMP4];
addAudioEventListeners();

function addAudioEventListeners() {
    var ts = performance.now();
    console.log('audioMP4 setsource', 0);
    audioMP4.addEventListener(
        'canplay',
        () => {
            console.log('audioMP4 canplay', performance.now() - ts);
        },
        { once: true },
    );
    audioMP4.addEventListener(
        'play',
        () => {
            console.log('audioMP4 play', performance.now() - ts);
        },
        { once: true },
    );
    audioMP4.addEventListener(
        'timeupdate',
        () => {
            console.log('audioMP4 timeupdate', performance.now() - ts);
        },
        { once: true },
    );
}
function previousMP4() {
    currentMP4 = (currentMP4 - 1 + tracksMP4.length) % tracksMP4.length;
    audioMP4.src = tracksMP4[currentMP4];

    addAudioEventListeners();
}
function nextMP4() {
    currentMP4 = (currentMP4 + 1) % tracksMP4.length;
    audioMP4.src = tracksMP4[currentMP4];

    addAudioEventListeners();
}
