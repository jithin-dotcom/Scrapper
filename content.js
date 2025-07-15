

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getImages") {
    (async function () {
      // Scroll to load more images lazily
      const autoScroll = () => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const maxScroll = 5000;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;

           
            if (
              totalHeight >= document.body.scrollHeight - window.innerHeight ||
              totalHeight >= maxScroll
            ) {
              clearInterval(timer);
              resolve();
            }
          }, 300);
        });
      };

      await autoScroll();
      await new Promise((res) => setTimeout(res, 2000)); 

      const images = Array.from(document.querySelectorAll("img")).map(img =>
        img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy")
      ).filter(Boolean);

      sendResponse({ images });
    })();

    return true; 
  }
});
