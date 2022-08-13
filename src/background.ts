chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url?.startsWith("https://www.nicovideo.jp") &&
    changeInfo.status === "complete"
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: "movie_loaded",
      url: tab.url,
    });
  }
});
