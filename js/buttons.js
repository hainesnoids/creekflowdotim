const volumeSliders = {
    "buttons": {
        "default": 1,
        "targets": {
            "creekflow": 0.3,
            "itemRedeem": 1,
            "money": 1
        }
    },
    "click": {
        "default": 0.1,
        "targets": {
            "wolfkeerc": 1
        }
    },
    "background": {
        "default": 0.3,
        "targets": {
            "stoneMove": 1
        }
    }
}
const itemVolumes = JSON.parse(localStorage.getItem("itemVolumes")) ?? {};
function setVolumesForGroup(group) {
    const vol = itemVolumes[group];
    Object.entries(volumeSliders[group].targets).forEach(([key, value]) => {
        sounds[key].vol = value * vol;
    });
}
Object.entries(volumeSliders).forEach(([key, value]) => {
    const slider = document.querySelector("#volume-" + key);
    if (!itemVolumes[key]) {
        itemVolumes[key] = value.default
    } else {
        slider.value = itemVolumes[key] * 100;
    }
    setVolumesForGroup(key);
    slider.addEventListener("input", () => {
        itemVolumes[key] = slider.value/100;
        setVolumesForGroup(key);
        save_data();
    })
})
document.querySelectorAll('button[sfx="true"]').forEach((button) => {
    button.addEventListener("click", () => {
        playAudio("itemRedeem");
    })
})