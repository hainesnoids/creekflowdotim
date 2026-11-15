const container = document.querySelector("#paths");
const ul = container.querySelector("ul");
const scene = container.querySelector("#paths-scene");

const embers = JSON.parse(localStorage.getItem("purchasedItems"))["rebirth"];
document.querySelector("#ember").textContent = String(embers);
let emberBalance = embers;
let pathsToUnlock = [];

const canvas = document.createElement("canvas");
scene.prepend(canvas);
const ctx = canvas.getContext("2d");
//const byId = new Map(paths.map(node => [node.id, node]));
const children = new Map(paths.map(node => [node.id, []]));
for (const node of paths) {
    if (node.parent && children.has(node.parent)) {
        children.get(node.parent).push(node);
    }
}
const angles = new Map();
let nodeCount = 0;

function assignAngles(node, start, end) {
    const descendants = children.get(node.id);

    if (!descendants.length) {
        angles.set(node.id, start + (end - start) / 2);
        nodeCount++;
        return 1;
    }

    const counts = descendants.map(child =>
        countNodes(child)
    );
    const total = counts.reduce((sum, count) => sum + count, 0);
    let cursor = start;
    let x = 0;
    let y = 0;

    descendants.forEach((child, index) => {
        const slice = (end - start) * counts[index] / total;
        assignAngles(child, cursor, cursor + slice);
        const angle = angles.get(child.id);
        x += Math.cos(angle) * counts[index];
        y += Math.sin(angle) * counts[index];
        cursor += slice;
    });

    angles.set(node.id, Math.atan2(y, x));
    return total;
}

function countNodes(node) {
    const descendants = children.get(node.id);
    return descendants.length
        ? descendants.reduce((sum, child) => sum + countNodes(child), 0)
        : 1;
}

const root = paths.find(node => node.parent === null);
assignAngles(root, -Math.PI / 2, 3 * Math.PI / 2);

function resizeAndRender() {
    //const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = scene.clientWidth;
    const height = scene.clientHeight;
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = 240;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const positions = new Map();

    function positionNode(node) {
        const parentPosition = positions.get(node.id);

        for (const child of children.get(node.id) ?? []) {
            const angle = angles.get(child.id);

            positions.set(child.id, {
                x: parentPosition.x + Math.cos(angle) * maxRadius,
                y: parentPosition.y + Math.sin(angle) * maxRadius
            });

            positionNode(child);
        }
    }
    positions.set(root.id, { x: cx, y: cy });
    positionNode(root);

    ctx.lineWidth = 2;

    function renderLines() {
        ctx.clearRect(0, 0, width, height);
        for (const node of paths) {
            if (!node.parent) continue;
            const from = positions.get(node.parent);
            const to = positions.get(node.id);
            const locked = node.cost > emberBalance | (!unlockedPaths.includes(node.parent) && !pathsToUnlock.includes(node.parent));
            if (locked) {
                ctx.strokeStyle = "#ffffff44";
            } else {
                ctx.strokeStyle = "#ffffffaa";
            }
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
    }
    renderLines();

    ul.replaceChildren();

    for (const node of paths) {
        const { x, y } = positions.get(node.id);
        const li = document.createElement("li");
        const locked = node.cost > emberBalance | (!unlockedPaths.includes(node.parent) && !pathsToUnlock.includes(node.parent));
        const unlocked = node.cost === 0 | unlockedPaths.includes(node.id);

        if (pathsToUnlock.includes(node.id)) li.classList.add("glow");
        else if (unlocked) li.classList.add("unlocked");
        else if (locked && node.id !== "root") li.classList.add("locked");
        li.style.left = `${x}px`;
        li.style.top = `${y}px`;
        li.addEventListener("pointerdown", (e) => {if ((!unlocked && !locked) || pathsToUnlock.includes(node.id)) e.stopPropagation()});
        li.addEventListener("click", () => {soLetsSayYouCanGoHere(node, li)});
        li.title = `<span class="item-title">${node.name}</span>${node.cost>0?`<small class="item-cost${locked ? " locked" : ""}">${node.cost}</small>`:""}<br><span class="item-description">${node.description}</span>`;// we can reuse classnames from items.css for this

        const img = document.createElement("img");
        img.src = `path-data/${node.id}/${node.image}`;

        li.append(img);
        ul.append(li);
    }
}

//new ResizeObserver(resizeAndRender).observe(container);
resizeAndRender();

// viewbox panning
const stars = document.querySelector("#parallax-stars");
let panX = scene.clientWidth / -2 + container.clientWidth / 2;
let panY = scene.clientHeight / -2 + container.clientHeight / 2;
let dragStart = null;

container.addEventListener("pointerdown", event => {
    dragStart = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        panX,
        panY
    };
    //container.classList.add("dragging");
    container.setPointerCapture(event.pointerId);
});

container.addEventListener("pointermove", event => {
    if (!dragStart) return;
    pan(event.clientX, event.clientY);
});

function pan(x=0,y=0) {
    if (dragStart) {
        panX = dragStart.panX + x - dragStart.pointerX;
        panY = dragStart.panY + y - dragStart.pointerY;
    }
    scene.style.transform = `translate(${panX}px, ${panY}px)`;
    stars.style.backgroundPosition = `${panX/8}px ${panY/8}px`;
}
pan();

function stopDragging() {
    dragStart = null;
    //container.classList.remove("dragging");
}

container.addEventListener("pointerup", stopDragging);
container.addEventListener("pointercancel", stopDragging);

// choice processing
function updateRoute() {
    const pathsList = document.querySelector(".paths-list");
    pathsList.textContent = "";
    pathsToUnlock.forEach((path) => {
        const node = paths.find(itm => itm.id === path);
        const li = document.createElement("li");
        li.innerHTML = `${node.name} <span class="item-cost">-${node.cost}</span>`;
        pathsList.append(li);
    });
    const rebirthButton = document.querySelector("#rebirth");
    rebirthButton.disabled = pathsToUnlock.length <= 0;
}
function soLetsSayYouCanGoHere(node) {
    const locked = node.cost > emberBalance | (!unlockedPaths.includes(node.parent) && !pathsToUnlock.includes(node.parent));
    const unlocked = node.cost === 0 | unlockedPaths.includes(node.id);
    if (pathsToUnlock.includes(node.id)) { // player wants to deselect this node
        playAudio("click");
        pathsToUnlock.splice(pathsToUnlock.indexOf(node.id),1);
        emberBalance += node.cost;
        resizeAndRender();
        updateRoute();
    } else if (!locked && !unlocked) { // player wants to select this node
        //li.classList.add("glow");
        playAudio("click");
        pathsToUnlock.push(node.id);
        emberBalance -= node.cost;
        resizeAndRender();
        updateRoute();
    }
}

function myDecisionIsFinal() {
    document.querySelector(".player").pause();
    localStorage.setItem("paths", JSON.stringify(unlockedPaths.concat(pathsToUnlock)));
    localStorage.setItem("pathStage", JSON.parse(localStorage.getItem("purchasedItems"))["rebirth"]); // anticheat measure, kick the user if these two numbers aren't equal in the future
    document.body.classList.add("final"); // literally all the animations are done through css, this is plentiful
    setTimeout(() => {
        localStorage.setItem("creekflows", "0");
        localStorage.setItem("purchasedItems", `{"rebirth": ${embers}}`);
        location.pathname = "/"
    }, 3000)
}
document.querySelector("#rebirth").addEventListener("click", myDecisionIsFinal);