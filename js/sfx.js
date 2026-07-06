// noinspection JSIgnoredPromiseFromCall

let sounds = {
    'creekflow': {
        vol: 0.3
    },
    'wolfkeerc': {
        vol: 0.1
    }
}

async function loadAudio(group, url) {
    if (!sounds[group]) sounds[group] = {}
    const lAC = sounds[group];
    lAC.aC = new AudioContext();
    lAC.aB = null;
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
    return {soundSource, gainNode};
}

async function promiseAudio(group) {
    return new Promise((resolve, reject) => {
        try {
            const {soundSource, gainNode} = playAudio(group);
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