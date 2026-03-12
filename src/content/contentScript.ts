import { autofillPage } from "../engine/autofillEngine";

console.log("RapidFill content script loaded");

chrome.runtime.onMessage.addListener((message) => {
  console.log("RapidFill ready on:", window.location.href);
  if (message.type === "AUTOFILL_PAGE") {
    console.log("RapidFill: autofill triggered");

    autofillPage();
  }
});
