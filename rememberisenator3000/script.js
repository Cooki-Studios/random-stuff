let part = 0;
let data = null;
fetch("remember/stuf.json").then((res) => res.json()).then((json) => {
    document.getElementById("file").remove();
    data = json;
    main();
});

document.getElementById("file").onchange = (e) => {
    if (e.target.files.length > 0)
    {
        const reader = new FileReader();

        reader.addEventListener('load', function() {
            const result = JSON.parse(reader.result);
            document.getElementById("file").remove();
            data = result;
            main();
        });

        reader.readAsText(e.target.files[0]);
    }
}

function main() {
    part = Math.floor((Math.random() * data.content.length));
    let name = "";
    let remove = false;

    document.getElementsByClassName("fill-in-the-blanks")[0].setAttribute("type", data.type);
    if (data.type === "script") {
        skipAllowed = true;
        for (const line of data.content[part]) {
            if (line.name) {
                if (name !== line.name) {
                    document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML += "<h1>" + line.name.toUpperCase() + "</h1>";
                }
                if (localStorage.getItem("part") && localStorage.getItem("part").includes(part)) {
                    remove = (data.name.includes(line.name) || data.name.includes("All"));
                }
                name = line.name;
            }
            if (line.action) {
                document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML += "<p class='action'>(" + line.action + ")</p>";
            }
            if (line.title) {
                document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML += "<p class='title'>" + line.title + "</p>";
            }
            if (line.line) {
                if (remove) {
                    const words = line.line.replace(/_(\w+)_/g, (_, word) =>
                        word.split("").map(char => char + "\u035F").join("").slice(0, -1)
                    ).replaceAll("...", "…").split(" ");
                    replaceWords(words);
                    skipAllowed = false;
                } else {
                    document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML +=
                        "<p>" +
                        line.line.replace(/_(\w+)_/g, (_, word) =>
                            word.split("").map(char => char + "\u035F").join("").slice(0, -1)
                        ).replaceAll("...", "…")
                        + "</p>";
                }
            }
            if (line.singing) {
                if (remove) {
                    const words = line.singing.split(" ");
                    replaceWords(words);
                } else {
                    document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML += "<p class='singing'>" + line.singing.toUpperCase() + "</p>";
                }
            }
        }
    }

    setTimeout(() => {
        if (document.querySelectorAll("input")[0]) {
            document.querySelectorAll("input")[0].focus();
        }
    }, 100);
}

function replaceWords(words) {
    let temp = "<p>"
    let numWordsToReplace = 0;
    if (localStorage.getItem("part")) {
        numWordsToReplace = (localStorage.getItem("part").match(new RegExp(String(part), "g")) || "0").length;
    }
    const randomIndexes = new Set();
    while (randomIndexes.size < numWordsToReplace && randomIndexes.size < words.length) {
        randomIndexes.add(Math.floor(Math.random() * words.length));
    }

    words.forEach((word, index) => {
        if (randomIndexes.has(index)) {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = '_'.repeat(word.length);
            input.style.width = `${word.length * 13}px`;
            input.setAttribute('size',String(input.getAttribute('placeholder').length));
            input.placeholder = '';
            input.setAttribute("correct", word);
            let also = word.toLowerCase().trim().replace(/[^a-zA-Z ]/g, "");
            if (also === "") {
                input.setAttribute("also", " ");
            } else {
                input.setAttribute("also", word.toLowerCase().trim().replace(/[^a-zA-Z ]/g, ""));
            }
            input.setAttribute("onkeydown", `if (event.code === 'Backspace') {if (!backspaceHeld) {backspaceHeld = true; if (this.value === '') {this.setAttribute('data-empty', 'true')}}}`);
            input.setAttribute("onkeyup", `if (event.code === 'Backspace') {backspaceHeld = false; if (this.getAttribute('data-empty') === 'true' && this.value === '') {moveToNextInput(this, true);}this.removeAttribute('data-empty');} else if (event.code === 'Enter' || event.code === 'Space') {moveToNextInput(this)}`);
            input.setAttribute("oninput", "this.removeAttribute('data-empty')");

            temp += input.outerHTML.toString()+" ";
        } else {
            temp += word+" ";
        }
    });
    temp += "</p>";
    document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML += temp;
}

let done = false;
document.getElementsByClassName("fill-in-the-blanks")[0].onsubmit = (e) => {
    e.preventDefault();
    if (done) {
        if (!incorrectInputs.some(element => element.includes("<span style='color: red;'>"))) {
            document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "<h1>ALL CORRECT!</h1>";
            if (Math.random() > 0.5) {
                document.getElementById("confetti1").style.visibility = "visible";
            } else {
                document.getElementById("confetti2").style.visibility = "visible";
            }
        } else {
            document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "<h1>Incorrect inputs:<br><br></h1>";
            for (const incorrectInput of incorrectInputs) {
                document.getElementsByClassName("fill-in-the-blanks")[0].querySelector("h1").innerHTML += incorrectInput+"<br><br>";
            }
        }
        incorrectInputs = [];
        if (document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML === "<h1>ALL CORRECT!</h1>") {
            setTimeout(() => {
                document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "";
                document.getElementsByClassName("fill-in-the-blanks")[0].scrollTop = 0;
                document.getElementById("confetti1").style.visibility = "hidden";
                document.getElementById("confetti2").style.visibility = "hidden";
                main();
            }, 1000);
        } else {
            const next = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "";
                    document.getElementsByClassName("fill-in-the-blanks")[0].scrollTop = 0;
                    document.getElementById("confetti1").style.visibility = "hidden";
                    document.getElementById("confetti2").style.visibility = "hidden";
                    document.body.removeEventListener("keyup", next);
                    main();
                }
            }
            setTimeout(() => {
                document.body.addEventListener("keyup", next);
            }, 1000);

            const next_click = () => {
                document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "";
                document.getElementsByClassName("fill-in-the-blanks")[0].scrollTop = 0;
                document.getElementById("confetti1").style.visibility = "hidden";
                document.getElementById("confetti2").style.visibility = "hidden";
                document.body.removeEventListener("pointerup", next_click);
                main();
            }
            setTimeout(() => {
                document.body.addEventListener("pointerup", next_click);
            }, 1000);
        }
    }
}

let backspaceHeld = false;
let incorrectInputs = [];
function moveToNextInput(current, back) {
    const form = current.closest('form');
    const inputs = Array.from(form.querySelectorAll('input'));
    const currentIndex = inputs.indexOf(current);
    let nextInput;

    if (back) {
        if (currentIndex > 0 && current.getAttribute('data-empty') === 'true') {
            nextInput = inputs[currentIndex - 1];
        } else {
            nextInput = inputs[currentIndex];
        }
        current.removeAttribute('data-empty'); // Reset for next time
    } else {
        current.value = current.value.trimEnd();
        nextInput = inputs[currentIndex + 1];
    }

    if (nextInput) {
        nextInput.focus();
    } else {
        for (const input of inputs) {
            if (input.value.toLowerCase().trim() === input.getAttribute("correct").toLowerCase().trim() ||
                input.value.toLowerCase().trim().replace(/[^a-zA-Z ]/g, "") === input.getAttribute("also").toLowerCase().trim()) {
                input.style.backgroundColor = "green";
            } else {
                input.style.backgroundColor = "red";
            }
            input.value = input.getAttribute("correct");
        }

        for (const input of inputs) {
            let content = '';
            input.parentElement.childNodes.forEach(element => {
                if (element.tagName === 'INPUT') {
                    if (element.style.backgroundColor === "red") {
                        content += "<span style='color: red;'>" + element.getAttribute('correct') + "</span>";
                    } else {
                        content += element.getAttribute('correct');
                    }
                } else {
                    content += element.textContent;
                }
            });

            if (!incorrectInputs.includes(content)) {
                incorrectInputs.push(content);
            }
        }

        localStorage.setItem("part", localStorage.getItem("part") + part);
        // setTimeout(() => {
            const input = document.createElement("input");
            input.style.visibility = "hidden";
            input.type = "submit";
            input.value = "Loading...";
            document.getElementsByClassName("fill-in-the-blanks")[0].appendChild(input);
            done = true;
            input.click();
        // }, 1000);
    }
}

document.getElementById("reset").onclick = (e) => {
    localStorage.removeItem("part");
    window.location.reload();
}

let skipAllowed = false;
document.body.onkeyup = (e) => {
    if (skipAllowed && (e.key === "Enter" || e.key === " ")) {
        document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "";
        document.getElementsByClassName("fill-in-the-blanks")[0].scrollTop = 0;
        document.getElementById("confetti1").style.visibility = "hidden";
        document.getElementById("confetti2").style.visibility = "hidden";
        localStorage.setItem("part", part);
        main();
    } else if (e.key === "Control" || ((os === "Mac OS" || os === "iOS") && e.key === "Meta")) {
        document.getElementById("reset").style.visibility = "hidden";
    }
}

document.body.onpointerup = (e) => {
    if (skipAllowed && e.target.tagName === "MAIN") {
        document.getElementsByClassName("fill-in-the-blanks")[0].innerHTML = "";
        document.getElementsByClassName("fill-in-the-blanks")[0].scrollTop = 0;
        document.getElementById("confetti1").style.visibility = "hidden";
        document.getElementById("confetti2").style.visibility = "hidden";
        localStorage.setItem("part", part);
        main();
    } else if (os !== "iOS" && os !== "Android") {
        document.getElementById("reset").style.visibility = "hidden";
    }
}

let os = "unknown";
function getOS() {
    const userAgent = window.navigator.userAgent;
    const platform =
        window.navigator?.userAgentData?.platform || window.navigator.platform;
    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const iosPlatforms = ["iPhone", "iPad", "iPod"];

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
    } else if (/Android/.test(userAgent)) {
        os = "Android";
    } else if (/Linux/.test(platform)) {
        os = "Linux";
    }

    return os;
}
getOS();

if (os === "iOS" || os === "Android") {
    document.getElementById("reset").style.visibility = "visible";
}

document.body.onkeydown = (e) => {
    if (e.key === "Control" || ((os === "Mac OS" || os === "iOS") && e.key === "Meta")) {
        document.getElementById("reset").style.visibility = "visible";
    }
}
