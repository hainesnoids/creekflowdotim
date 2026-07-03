let sounds = {
    'creekflow': {
        aC: new AudioContext(),
        aB: null,
        vol: 0.3
    },
    'itemRedeem': {
        aC: new AudioContext(),
        aB: null
    },
    'stoneMove': {
        aC: new AudioContext(),
        aB: null
    },
    'wolfkeerc': {
        aC: new AudioContext(),
        aB: null,
        vol: 0.1
    },
    'money': {
        aC: new AudioContext(),
        aB: null
    }
}

async function loadAudio(group, url) {
    const lAC = sounds[group];
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    lAC.aB = await lAC.aC.decodeAudioData(arrayBuffer);
}

function playAudio(group) {
    const lAC = sounds[group];
    let gainNode = lAC.aC.createGain();
    gainNode.gain.value = lAC.vol ?? 1;
    gainNode.connect(lAC.aC.destination);
    const soundSource = lAC.aC.createBufferSource();
    soundSource.buffer = lAC.aB;
    soundSource.connect(gainNode);
    soundSource.start(0);
}

async function promiseAudio(group) {
    return new Promise((resolve, reject) => {
        try {
            const lAC = sounds[group];
            let gainNode = lAC.aC.createGain();
            gainNode.gain.value = lAC.vol ?? 1;
            gainNode.connect(lAC.aC.destination);
            const soundSource = lAC.aC.createBufferSource();
            soundSource.buffer = lAC.aB;
            soundSource.connect(gainNode);
            soundSource.start(0);
            soundSource.onended = () => {
                try {
                    gainNode.disconnect();
                } catch (e) {}
                resolve();
            };
        } catch (err) {
            reject(err);
        }
    })
}

loadAudio('creekflow', 'raw/creekflow.opus');
loadAudio('itemRedeem', 'raw/click_fairytail.opus');
loadAudio('stoneMove', 'raw/moving-stone.opus');
loadAudio('wolfkeerc', 'raw/click.opus');
loadAudio('money', 'raw/money.opus');