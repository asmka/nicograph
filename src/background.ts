chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.url?.startsWith("https://www.nicovideo.jp/watch") &&
    changeInfo.status === "complete"
  ) {
    chrome.tabs.sendMessage(tabId, {
      message: "video_loaded",
      url: tab.url,
    });
  }
});
