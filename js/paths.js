let unlockedPaths = JSON.parse(localStorage.getItem("paths")) || ["root"];
const paths = [
    {
        "id": "root",
        "parent": null,
        "cost": 0,
        "name": "Creekflow",
        "description": "relesaed i forget when",
        "image": "item.png"
    },
    {
        "id": "clicker_1",
        "parent": "root",
        "cost": 1,
        "name": "Clicker Upgrade",
        "description": "Every simulated click is worth double.",
        "image": "item.svg"
    },
    {
        "id": "oil_1",
        "parent": "root",
        "cost": 1,
        "name": "Oil Upgrade",
        "description": "Crude oil gives twice as many points.",
        "image": "item.png"
    },
    {
        "id": "clicker_2",
        "parent": "clicker_1",
        "cost": 3,
        "name": "Clicker Upgrade 2",
        "description": "Every simulated click is worth triple.",
        "image": "item.svg"
    },
    {
        "id": "mouse_1",
        "parent": "root",
        "cost": 1,
        "name": "Mouse Upgrade",
        "description": "Mouse clicks are worth double.",
        "image": "item.svg"
    },
    {
        "id": "mouse_2",
        "parent": "mouse_1",
        "cost": 3,
        "name": "Mouse Upgrade 2",
        "description": "Mouse clicks are worth double.",
        "image": "item.svg"
    }
];

let fMult = 1;
let gMult = 1;
let oMult = 1;
bar = {
    root() {},
    clicker_1() {
        fMult = 2;
    },
    clicker_2() {
        fMult = 3;
    },
    clicker_3() {
        fMult = 4;
    },
    clicker_4() {
        fMult = 5;
    },
    clicker_5() {
        fMult = 10;
    },
    mouse_1() {
        gMult = 2;
    },
    mouse_2() {
        gMult = 3;
    },
    mouse_3() {
        gMult = 4;
    },
    mouse_4() {
        gMult = 5;
    },
    mouse_5() {
        gMult = 10;
    },
    oil_1() {
        oMult = 2;
    }
}
function load_paths() {
    purchasedItems = JSON.parse(localStorage.getItem("paths")) || {};
    for (const key of unlockedPaths) {
        (async () => {
            try {
                bar[key]();
            } catch(e) {
                console.warn(`path "${key}" was found in the save file but does not have a function associated with it.`)
            }
        })()
    }
}

load_paths();