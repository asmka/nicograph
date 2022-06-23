(() => {
  const exid = chrome.runtime.id;
  const elid = exid + "-script";

  if (document.getElementById(elid)) return;

  const scr = document.createElement("script");
  scr.id = elid;
  scr.src = chrome.runtime.getURL("script.js");
  scr.type = "module";
  document.head.append(scr);
})();
