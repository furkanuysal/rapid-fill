import ProfileForm from "./ProfileForm";

function autofillCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (!tab || !tab.id) {
      console.warn("RapidFill: No active tab found");
      return;
    }

    chrome.tabs.sendMessage(tab.id, {
      type: "AUTOFILL_PAGE",
    });
  });
}

export default function PopupApp() {
  return (
    <div style={{ padding: 16 }}>
      <h2>RapidFill</h2>

      <ProfileForm />

      <hr style={{ margin: "16px 0" }} />

      <button onClick={autofillCurrentPage}>Autofill this page</button>
    </div>
  );
}
