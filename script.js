"use strict";

let downloadedList = document.querySelector("#downloaded-list");
let availableList = document.querySelector("#available-videos");
let videoPlayer = document.querySelector("video");

refreshDownloadedList()

downloadedList.addEventListener("click", async event => {
    if (event.target.tagName !== "BUTTON") return;
    let file = await event.target.src.getFile();
    const url = URL.createObjectURL(file);
    videoPlayer.hidden = false;
    videoPlayer.src = url;
    videoPlayer.load();
});

availableList.addEventListener("click", async event => {
    if (event.target.tagName !== "BUTTON") return;
    const anchor = event.target.previousElementSibling;
    const name = anchor.text;
    const src = anchor.href;
    const request = await fetch(src);
    let blob = await request.blob();
    const opfsRoot = await navigator.storage.getDirectory();
    const fileHandle = await opfsRoot.getFileHandle(name, {
        create: true,
    });
    const writer = await fileHandle.createWritable();
    await writer.write(blob);
    await writer.close();
    await refreshDownloadedList()
});

async function refreshDownloadedList() {
    downloadedList.innerHTML = "";
    const opfsRoot = await navigator.storage.getDirectory();
    const entries = await opfsRoot.entries();
    for await (let entry of entries) {
        let liElement = document.createElement("li");
        let buttonElement = document.createElement("button");
        buttonElement.innerText = `Play ${entry[0]}`;
        liElement.appendChild(buttonElement);
        downloadedList.appendChild(liElement);
        buttonElement.src = entry[1];
    }
}

// async function playvideotest() {
//     const request = await fetch("/offline-video-pwa/vid/around.webm");
//     let blob = await request.blob();
//     const url = URL.createObjectURL(blob);
//     videoPlayer.hidden = false;
//     videoPlayer.src = url;
//     videoPlayer.load();
// }
//
// playvideotest();
