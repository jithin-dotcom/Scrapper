// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.action === "getImages") {
//     (async function () {
//       // Scroll to load lazy images
//       const autoScroll = () => {
//         return new Promise((resolve) => {
//           let totalHeight = 0;
//           const distance = 300;
//           const timer = setInterval(() => {
//             window.scrollBy(0, distance);
//             totalHeight += distance;
//             if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
//               clearInterval(timer);
//               resolve();
//             }
//           }, 300);
//         });
//       };

//       await autoScroll();
//       await new Promise(res => setTimeout(res, 2000)); // wait for lazy images

//       const images = Array.from(document.querySelectorAll("img")).map(img =>
//         img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy")
//       ).filter(Boolean);

//       sendResponse({ images });
//     })();

//     return true; // keep message channel open
//   }
// });





chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getImages") {
    (async function () {
      // Scroll to load more images lazily
      const autoScroll = () => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const maxScroll = 5000; // Scroll max this much (you can increase)
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;

            // End scroll if we reach bottom or maxScroll limit
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
      await new Promise((res) => setTimeout(res, 2000)); // Allow time for images to load

      const images = Array.from(document.querySelectorAll("img")).map(img =>
        img.src || img.getAttribute("data-src") || img.getAttribute("data-lazy")
      ).filter(Boolean);

      sendResponse({ images });
    })();

    return true; // Keep message channel open
  }
});
