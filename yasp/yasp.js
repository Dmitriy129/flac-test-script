
function appendScript(url, target = document.body,) {
    return new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;

        target.appendChild(script);
    });
}


function loadYasp() {
    var url = 'https://playerweb-ci.s3.mds.yandex.net/video-player-iframe-api/stands/trunk/build/js/yasp.js'
    return appendScript(url)
        .then(() => {
            console.log('script loaded')
        })
        .catch((error) => {
            console.log('script loading errored')
            throw error;
        })

}

function run(t = 5) {

    var audioYasp = document.createElement('audio')
    document.body.appendChild(audioYasp)
    audioYasp.autoplay = true
    audioYasp.id = 'yasp'
    // audio.src = await createMediaSource(audioConfig)

    let currentDASH = 0;
    // var audioYasp = document.getElementById('yasp');
    var tracksDASH = [
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-10252940?container=mp4&codec=flac', // 0
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-10259247?container=mp4&codec=flac', // 1
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-12608102?container=mp4&codec=flac', // 2
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-13447407?container=mp4&codec=flac', // 3
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-13487595?container=mp4&codec=flac', // 4
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-13812230?container=mp4&codec=flac', // 5
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-13858549?container=mp4&codec=flac', // 6
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-14536769?container=mp4&codec=flac', // 7
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-247518?container=mp4&codec=flac', // 8
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-762838?container=mp4&codec=flac', // 9
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-8135003?container=mp4&codec=flac', // 10
        'https://playerweb-stands.s3.yandex.net/mp4-examples/flac-mp4-876383?container=mp4&codec=flac', // 11
        'https://cdn-demo.s3.yandex.net/654d34b5-1c79-4a0b-a24d-af7841e0ee14/STRM-9313-flac-samples/ff-13-fmp4-in-mp4.mp4', // 12
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/1.mp4', // 13
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/2.mp4', // 14
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/3.mp4', // 15
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/4.mp4', // 16
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/5.mp4', // 17
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/6.mp4', // 18
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/7.mp4', // 19
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/8.mp4', // 20
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/aac-sample-1.aac', // 21
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/mp3-in-mp4-320.mp3', // 22
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/acc-in-mp4-192.aac', // 23
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/g64he-in-mp4.aac', // 24
        'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/flac-raw.flac', // 25
    ];
    window.Ya.applyFlags('{}');
    window.Ya.YaspAudioElement.setWorkerConfig({ sourceLimit: 10 });
    var audio = window.Ya.YaspAudioElement.attach(audioYasp);

    function addYaspEventListeners() {
        var ts = performance.now();
        console.log('yasp setsource', 0);
        audio.addEventListener(
            'canplay',
            () => {
                console.log('yasp canplay', performance.now() - ts);
            },
            { once: true },
        );
        audio.addEventListener(
            'play',
            () => {
                console.log('yasp play', performance.now() - ts);
            },
            { once: true },
        );
        audio.addEventListener(
            'timeupdate',
            () => {
                console.log('yasp timeupdate', performance.now() - ts);
            },
            { once: true },
        );
    }


    window.controls = {
        audioYasp,
        audio,
        set(index) {
            currentDASH = index % tracksDASH.length;
            audio.src = tracksDASH[currentDASH];
            console.log(`\n DEB-------------------------[${currentDASH}]-------------------------\n`);
            console.log(`DEB Audio: ${audio.src}`);
            addYaspEventListeners();
        },
        previous() {
            window.controls.set(currentDASH - 1 + tracksDASH.length);
        },
        next() {
            window.controls.set(currentDASH + 1);
        },

    }

    function timer() {
        setTimeout(() => {
            console.log(`DEB Played: ${audio.currentTime}/${t}`);
            if (currentDASH !== tracksDASH.length - 1) {
                window.controls.next()
                timer()
            }
        }, t * 1000)
    }
    window.controls.set(currentDASH);
    timer()

    return window.controls

}

loadYasp().then(() => {
    console.log('controls', run(5))
})



