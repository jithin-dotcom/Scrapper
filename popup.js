

let loadedImages = new Set();

document.getElementById("fetch-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "getImages" }, (response) => {
    const container = document.getElementById("image-container");

    let newCount = 0;

    response.images.forEach((src, i) => {
      if (!loadedImages.has(src)) {
        loadedImages.add(src);
        newCount++;

        const wrapper = document.createElement("div");
        wrapper.className = "image-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.value = src;

        const img = document.createElement("img");
        img.src = src;
        img.alt = `img-${loadedImages.size}`;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(img);
        container.appendChild(wrapper);
      }
    });

    console.log(`Added ${newCount} new images.`);
  });
});

document.getElementById("stop-btn").addEventListener("click", () => {
  const selected = document.querySelectorAll("input[type='checkbox']:checked");

  if (selected.length === 0) {
    alert("No images selected.");
    return;
  }

  const folderName = prompt("Enter folder name for downloads:");

  if (!folderName || folderName.trim() === "") {
    alert("Folder name is required.");
    return;
  }

  selected.forEach((checkbox, i) => {
    const url = checkbox.value;
    const filename = `${folderName.trim()}/image-${i}.jpg`;

    chrome.downloads.download({
      url,
      filename,
      conflictAction: "uniquify"
    }, (id) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log(`Downloaded ${filename}`);
      }
    });
  });
});
