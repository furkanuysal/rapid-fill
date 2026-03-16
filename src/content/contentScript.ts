import { autofillPage } from "../engine/autofillEngine";

declare global {
  interface Window {
    __rapidFillContentScriptLoaded__?: boolean;
  }
}

if (!window.__rapidFillContentScriptLoaded__) {
  window.__rapidFillContentScriptLoaded__ = true;

  console.log("RapidFill content script loaded");

  chrome.runtime.onMessage.addListener((message) => {
    console.log("RapidFill ready on:", window.location.href);
    if (message.type === "AUTOFILL_PAGE") {
      console.log("RapidFill: autofill triggered");
      autofillPage();
    }
  });
}
