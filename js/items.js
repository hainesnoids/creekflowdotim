let items = [];
let purchasedItems = {};

foo = {
    clicker1() {
        setInterval(() => {
            flow(1);
            playAudio("wolfkeerc");
            save_data();
        },1000);
    },
    clicker2() {
        setInterval(() => {
            flow(2);
            playAudio("wolfkeerc");
            save_data();
        },900);
    },
    clicker3() {
        setInterval(() => {
            flow(3);
            playAudio("wolfkeerc");
            save_data();
        },800);
    },
    clicker4() {
        setInterval(() => {
            flow(4);
            playAudio("wolfkeerc");
            save_data();
        },700);
    },
    clicker5() {
        setInterval(() => {
            flow(5);
            playAudio("wolfkeerc");
            save_data();
        },600);
    },
    power1() {
        glow(1);
    },
    power2() {
        glow(2);
    },
    power3() {
        glow(4);
    },
    power4() {
        glow(8);
    },
    power5() {
        glow(16);
    },
    album() {
        document.querySelector("#widgets > div.music").classList.remove("hidden");
    },
    crude_oil() {
        console.info("I can't stop drinking oil! I can't stop drinking oil! I just can't stop, I can't stop drinking crude oil! You know the black stuff, it comes it barrels, I can't stop drinking it! I just can't! It's tantalising, it's addicting, it is a delicacy. I love it! I can't stop drinking oil, crude oil! I can't stop guzzling it, gulping it down! I can't stop drinking crude oil-");
        const elm_crudeOilWidget = document.querySelector("#widgets > div.crudeoil");
        const elm_crudeOilBase = document.querySelector("#widgets > div.crudeoil > div");
        const elm_crudeOil = document.querySelector("#widgets > div.crudeoil .crude-oil");
        const elm_crudeOilShadow = document.querySelector("#widgets > div.crudeoil .crude-oil-shadow");
        const cooldown_max = 120;
        let cooldown = cooldown_max;
        elm_crudeOilWidget.classList.remove("hidden");
        const keyframes = [
            { height: "100%" },
            { height: "0%" },
        ]
        const properties = {
            duration: cooldown_max * 1000,
            iterations: 1,
            fill: "forwards"
        };
        function redeemOil() {
            playAudio("money");
            flow(4000);
            oilCooldown();
        }
        function oilCooldown() {
            elm_crudeOilShadow.animate(keyframes, properties);
            cooldown = cooldown_max;
            elm_crudeOilBase.style.cursor = "not-allowed";
            elm_crudeOil.style.filter = "brightness(0.7)";
            let e = setInterval(() => {
                cooldown--;
                if (cooldown === 0) {
                    clearInterval(e);
                    elm_crudeOilBase.style.cursor = "";
                    elm_crudeOil.style.filter = "";
                }
            },1000)
        }
        elm_crudeOilBase.addEventListener("click", () => {
            if (cooldown === 0) {
                redeemOil();
            }
        });
        oilCooldown();
    },
    microwaved_popcorn() {
        console.info("hi!");
    }
}

// load a user's items from save data
function load_items() {
    purchasedItems = JSON.parse(localStorage.getItem("purchasedItems")) || {};
    for (const [key, value] of Object.entries(purchasedItems)) {
        for (let i = 0; i < value; i++) {
            foo[key]();
        }
    }
}

// load available items
async function fetch_items() {
    const itemsData = await fetch("items.json")
        .then(async (r) => {return await r.json()});
    itemsData.sort((a, b) => a["cost"] - b["cost"]);
    itemsData.forEach((itm) => {
        items.push(itm);
        render_item(itm);
    })
}

const elm_itemlist = document.querySelector("#items ul");

// render available items
function render_item(itm) {
    const id = itm["id"];
    const elm_li = document.createElement("li");
    elm_li.setAttribute("title", itm["description"]);
    const elm_title = document.createElement("span");
    elm_title.classList.add("item-title");
    elm_title.innerHTML = itm["name"];
    const elm_cost = document.createElement("span");
    elm_cost.classList.add("item-cost");
    elm_cost.innerHTML = creekfill(itm["cost"]);
    const elm_image = document.createElement("img");
    elm_image.classList.add("item-image");
    elm_image.src = `item-data/${id}/${itm["icon"]}`;
    const elm_count = document.createElement("span");
    elm_count.classList.add("item-count");
    elm_count.innerHTML = !purchasedItems[id] || itm["redeemOnce"] ? "" : purchasedItems[id];
    elm_li.append(elm_title,elm_cost,elm_image,elm_count);
    elm_li.addEventListener("click",async () => {
        if (creekflows >= itm["cost"] && !(itm["redeemOnce"] === true && Object.keys(purchasedItems).includes(id))) {
            playAudio("itemRedeem");
            purchasedItems[id] ? purchasedItems[id]++ : purchasedItems[id] = 1;
            flow(itm["cost"]*-1);
            save_data();
            console.log("loaded item " + id);
            foo[id]();
            if (itm["redeemOnce"] === true) {
                elm_li.classList.add("unlocked");
            } else {
                elm_count.innerHTML = purchasedItems[id];
            }
        }
    });
    if (creekflows < itm["cost"]) {
        elm_li.classList.add("locked");
    } else if (itm["redeemOnce"] === true && Object.keys(purchasedItems).includes(id)) {
        elm_li.classList.add("unlocked");
    }
    document.addEventListener("creekflow", () => {
        if (creekflows >= itm["cost"]) {
            elm_li.classList.remove("locked");
        } else if (creekflows < itm["cost"]) {
            elm_li.classList.add("locked");
        }
    });
    elm_itemlist.appendChild(elm_li);
}

fetch_items().then();
load_items();