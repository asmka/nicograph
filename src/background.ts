const isNicovideoTab = (tab: chrome.tabs.Tab): boolean => {
  return !!tab.url?.startsWith("https://www.nicovideo.jp/watch");
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!isNicovideoTab(tab)) return;
  if (changeInfo.status !== "complete") return;

  try {
    await chrome.tabs.sendMessage(tabId, {
      message: "updateCompleted",
      url: tab.url,
    });
  } catch (error) {
    console.debug("sendMessage is failed");
    console.debug(error);
  }
});

chrome.tabs.onActivated.addListener(async (activateInfo) => {
  const tab = await chrome.tabs.get(activateInfo.tabId);
  if (!isNicovideoTab(tab)) return;

  try {
    await chrome.tabs.sendMessage(activateInfo.tabId, {
      message: "activated",
      url: tab.url,
    });
  } catch (error) {
    console.debug("sendMessage is failed");
    console.debug(error);
  }
});
