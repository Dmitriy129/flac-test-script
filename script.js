audioFiles = {
    fmp4Flac: {
        url: 'https://cdn-demo.s3.yandex.net/654d34b5-1c79-4a0b-a24d-af7841e0ee14/STRM-9313-flac-samples/ff-13-fmp4-in-mp4.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 14263,
        maxContentLength: 39859449
    },
    fmp4Flac1: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/1.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 9991,
        maxContentLength: 27097597

    },
    fmp4Flac2: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/2.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 9823,
        maxContentLength: 26742496

    },
    fmp4Flac3: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/3.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 6695,
        maxContentLength: 16788429

    },
    fmp4Flac4: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/4.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 6163,
        maxContentLength: 14384615

    },
    fmp4Flac5: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/5.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 10023,
        maxContentLength: 42410486

    },
    fmp4Flac6: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/6.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 9663,
        maxContentLength: 15919130

    },
    fmp4Flac7: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/7.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 8003,
        maxContentLength: 18879206

    },
    fmp4Flac8: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/8.mp4',
        mimeType: 'audio/mp4; codecs="flac"',
        offset: 7315,
        maxContentLength: 20974562

    },
    rawAac: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/aac-sample-1.aac',
        // url: 'https://strm-test.msermakov.music.dev.yandex.ru/aac-sample-1.aac',
        mimeType: 'audio/aac',
        maxContentLength: 2049390


    },
    mp3InMp4: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/mp3-in-mp4-320.mp3',
        // url: 'https://strm-test.msermakov.music.dev.yandex.ru/mp3-samples/2/mp3-in-mp4-320.mp3',
        mimeType: 'audio/mpeg',
        maxContentLength: 6643461


    },
    aacInMp4: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/acc-in-mp4-192.aac',
        // url: 'https://strm-test.msermakov.music.dev.yandex.ru/acc-samples/2/acc-in-mp4-192.aac',
        mimeType: 'audio/mp4; codecs="mp4a.40.2"',
        maxContentLength: 4136928


    },
    heaacInMp4: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/g64he-in-mp4.aac',
        // url: 'https://strm-test.msermakov.music.dev.yandex.ru/acc-samples/1/g64he-in-mp4.aac',
        mimeType: 'audio/mp4; codecs="mp4a.40.5"',
        maxContentLength: 1427523


    },
    rawFlac: {
        url: 'https://yastatic.net/s3/music-frontend-static/music-test-audio-mp4/flac-raw.flac',
        // url: 'https://strm-test.msermakov.music.dev.yandex.ru/flac-samples/flac-raw/flac-raw.flac',
        mimeType: 'audio/flac',
        maxContentLength: 39829982
    },
}



async function testAudio(audioType, chunksCount) {
    const queue = []
    async function createMediaSource({ url, mimeType, offset, maxContentLength }) {
        // Создаем MSE
        const mediaSource = new MediaSource();

        // Полный размер файла
        let size = Math.min(64 * 1024 * chunksCount, maxContentLength);
        // const size = maxContentLength
        const chunkSize = 64 * 1024 * 1

        // Кол-во загруженных байтов
        let loadedBytes = typeof offset !== 'undefined' ? offset : 0;



        const getByteRange = async () => {
            let end = 0;
            if (size === null || loadedBytes + chunkSize < size) {
                end = loadedBytes + chunkSize;
            } else if (loadedBytes + chunkSize >= size) {
                end = size;
            }
            window.cb = window.cb || {}
            let buffer = window.cb[`${audioType}-${loadedBytes}-${end}`]
            if (!buffer) {

                const response = await fetch(url, {
                    headers: {
                        Range: `bytes=${loadedBytes}-${end}`,
                    }
                });

                buffer = await response.arrayBuffer();
                window.cb[`${audioType}-${loadedBytes}-${end}`] = buffer
            }
            loadedBytes = loadedBytes + chunkSize + 1;

            return buffer

        };

        // Предзагружу все, чтоб быть уверенным, что проблема не в сети
        while (loadedBytes < size) {
            // console.log('fetch', loadedBytes, size);
            const buffer = await getByteRange()
            queue.push(buffer)
        }
        // console.log('all loaded');



        // Обработчик открытия SourceBuffer
        const onSourceOpen = async () => {
            try {
                // console.log('onSourceOpen');
                // Создаем sourceBuffer, в который будем складывать чанки байт
                const sourceBuffer = mediaSource.addSourceBuffer(mimeType);

                // Обработчик добавления чанка байт
                const onUpdateEnd = () => {
                    try {

                        // console.log('onUpdateEnd', queue.length, sourceBuffer.updating);
                        if (queue.length > 0 && !sourceBuffer.updating) {
                            // console.log('sourceBuffer.appendBuffer', queue.length);
                            sourceBuffer.appendBuffer(queue.shift())
                        } else {
                            mediaSource.removeEventListener('sourceopen', onSourceOpen);
                            sourceBuffer.removeEventListener('updateend', onUpdateEnd);
                            mediaSource.endOfStream();
                            // console.log('endOfStream');
                        }
                    } catch (error) {
                        console.error("    [onUpdateEndError]", error)
                    }
                };

                // sourceBuffer.addEventListener('update', () => console.log('update'));
                sourceBuffer.addEventListener('updateend', onUpdateEnd);
                sourceBuffer.appendBuffer(queue.shift())
                sourceBuffer.addEventListener('error', (error) => { console.error("    [sourceBufferError]", error) });

            } catch (error) {
                console.error("    [onSourceOpenError]", error)
            }
        };

        mediaSource.addEventListener('sourceopen', onSourceOpen);
        return URL.createObjectURL(mediaSource);
    }


    const audioConfig = audioFiles[audioType]


    /* Запускаем */

    const audio = document.createElement('audio')
    document.body.appendChild(audio)
    audio.autoplay = true
    audio.src = await createMediaSource(audioConfig)
    // audio.src = audioConfig.url

    // const audio = document.createElement('audio')
    // document.body.appendChild(audio)
    // audio.autoplay = true
    // audio.src = 'https://cdn-demo.s3.yandex.net/654d34b5-1c79-4a0b-a24d-af7841e0ee14/STRM-9313-flac-samples/ff-13-fmp4-in-mp4.mp4'

    // audio.play()

    return {
        MediaSourceSupported: MediaSource.isTypeSupported(audioConfig.mimeType),
        AudioSupported: audio.canPlayType(audioConfig.mimeType),
        config: audioConfig,
        element: audio

    }

}


function run(timer = 10, chunksCount = timer + 2) {
    // const audioTypes = Object.keys(audioFiles)
    const audioTypes = ['aacInMp4']
    // const audioTypes = ['rawAac']
    // const audioTypes = ['fmp4Flac1']
    // const audioTypes = [
    //     'fmp4Flac',
    //     'fmp4Flac1',
    //     'fmp4Flac2',
    //     'fmp4Flac3',
    //     'fmp4Flac4',
    //     'fmp4Flac5',
    //     'fmp4Flac6',
    //     'fmp4Flac7',
    //     'fmp4Flac8',
    // ]
    const testPromises = audioTypes.map((audioType) => () => {
        return new Promise(async (resolve) => {
            console.log(`${audioType}`);
            const result = await testAudio(audioType, chunksCount)
            console.log(`    MediaSourceSupported: ${result.MediaSourceSupported}`);
            console.log(`    AudioSupported: ${result.AudioSupported}`);
            setTimeout(() => {
                result.element.pause()
                console.log(`    audio.error: ${result.element.error && JSON.stringify({ code: result.element.error.code, message: result.element.error.message })}`);
                console.log(`    played: ${result.element.currentTime}/${timer}`);
                console.log(`    config: ${JSON.stringify(result.config)}`);
                resolve()
            }, timer * 1000)
        })
    })

    const result = testPromises.reduce((p, fn,) => p.then(fn), Promise.resolve())
    return result
}

run(5)


