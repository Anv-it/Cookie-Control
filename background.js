console.log("Background script loaded!");
chrome.cookies.onChanged.addListener((changeInfo) => {
    console.log("Cookie changed:", changeInfo);
  });