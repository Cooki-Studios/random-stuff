const story = document.getElementById("story");
const form = document.querySelector(".fill-in-the-blanks #content");
const bonusData = {};

story.onchange = (e) => {
    const storySelected = e.currentTarget.value;

    if (storySelected !== "Select a story") {
        fetch(`stories/${storySelected}.md`).then((response) => {
            response.text().then((data) => {
                if (marked) {
                    form.innerHTML = marked.parse(data.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""));
                    for (const child of form.childNodes) {
                        for (const childClass of child.classList) {
                            if (!bonusData[childClass]) {
                                fetch(`stories/${storySelected}/${childClass}s.txt`).then((response) => {
                                    response.text().then((data) => {
                                        bonusData[childClass] = data.replaceAll("\r","").split("\n");
                                        child.textContent = bonusData[childClass][Math.floor(Math.random()*bonusData[childClass].length)];
                                        child.innerHTML = extractKeyValues(child.textContent);
                                    })
                                });
                            } else {
                                child.textContent = bonusData[childClass][Math.floor(Math.random()*bonusData[childClass].length)];
                                child.innerHTML = extractKeyValues(child.textContent);
                            }
                        }
                    }
                } else {
                    alert("Error: Marked.js is missing!");
                }
            })
        });
    } else {
        form.innerHTML = "";
    }
}

function extractKeyValues(text) {
    const regex = /\{([a-zA-Z_]+)(\d+)}/g;
    let matches;
    let result = "";
    let temp = document.createElement("h1");

    while ((matches = regex.exec(text)) !== null) {
        if (result === "") {
            const placeholder = matches[1].replaceAll("_", " ")
                // .replace(/\b\w/g, char => char.toUpperCase())
                // .charAt(0).toUpperCase() + matches[1].replaceAll("_", " ").slice(1);

            temp.textContent = placeholder;
            temp.style.width = "fit-content";
            temp.style.whiteSpace = "pre-wrap";
            temp.className = "temp";
            form.appendChild(temp);

            result = matches.input.replace(matches[0],`
                <input type='text'
                placeholder="${placeholder}"
                id="${matches[1]}${parseInt(matches[2])}"
                style="width: ${temp.clientWidth}px"
                oninput="resizeInput(event.target)"
                autocomplete="off">`
            );
        } else {
            const placeholder = matches[1].replaceAll("_", " ")
                // .replace(/\b\w/g, char => char.toUpperCase())
                // .charAt(0).toUpperCase() + matches[1].replaceAll("_", " ").slice(1);

            temp.textContent = placeholder;
            temp.style.width = "fit-content";
            temp.style.whiteSpace = "pre-wrap";
            temp.className = "temp";
            form.appendChild(temp);

            result = result.replace(matches[0],`
                <input type='text'
                placeholder="${placeholder}"
                id="${matches[1]}${parseInt(matches[2])}"
                style="width: ${temp.clientWidth}px"
                oninput="resizeInput(event.target)"
                autocomplete="off">`
            );
        }
    }
    temp.remove();

    return result;
}

function resizeInput(input) {
    saveInput(input);

    if (input.value === "") {
        let temp = document.createElement("h1");
        temp.textContent = input.placeholder;
        temp.style.width = "fit-content";
        temp.style.whiteSpace = "pre-wrap";
        temp.className = "temp";
        form.appendChild(temp);

        input.style.width = `${temp.clientWidth}px`;
        temp.remove();
    } else {
        let temp = document.createElement("h1");
        temp.textContent = input.value;
        temp.style.width = "fit-content";
        temp.style.whiteSpace = "pre-wrap";
        temp.className = "temp";
        form.appendChild(temp);

        input.style.width = `${temp.clientWidth}px`;
        temp.remove();
    }
}

function resizeInputs() {
    for (const input of document.getElementsByTagName("input")) {
        resizeInput(input);
    }
}
window.onresize = resizeInputs;

function saveInput(input) {
    let storedData = JSON.parse(localStorage.getItem("fill-in-the-blanks")) || [];

    let index = storedData.findIndex(item => item.placeholder === input.placeholder && item.id === input.id);

    if (index !== -1) {
        storedData[index].value = input.value;
    } else {
        storedData.push({
            placeholder: input.placeholder,
            id: input.id,
            value: input.value
        });
    }

    localStorage.setItem("fill-in-the-blanks", JSON.stringify(storedData));
}

window.oncontextmenu = (e) => {
    e.preventDefault();
}