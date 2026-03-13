import { useEffect, useState } from "react";
import "./App.css";
import { getProfile, saveProfile } from "./storage/profileStorage";
import type { UserProfile } from "./types/UserProfile";
import PopupEditPage from "./popup/PopupEditPage";
import PopupHomePage from "./popup/PopupHomePage";
import { EMPTY_PROFILE, mergeWithDefaults } from "./popup/popupProfile";

type PopupView = "home" | "edit";

function autofillCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    if (!tab?.id) {
      console.warn("RapidFill: No active tab found");
      return;
    }

    chrome.tabs.sendMessage(tab.id, {
      type: "AUTOFILL_PAGE",
    });
  });
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [view, setView] = useState<PopupView>("home");
  const [renderedView, setRenderedView] = useState<PopupView>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const stored = mergeWithDefaults(await getProfile());
      setProfile(stored);
      setDraftProfile(stored);
    }

    void loadProfile();
  }, []);

  useEffect(() => {
    if (renderedView === view) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRenderedView(view);
    }, 340);

    return () => window.clearTimeout(timeoutId);
  }, [renderedView, view]);

  function openEditPage() {
    setSaveMessage("");
    setDraftProfile(profile);
    setRenderedView("edit");
    window.requestAnimationFrame(() => {
      setView("edit");
    });
  }

  function closeEditPage() {
    setDraftProfile(profile);
    setRenderedView("home");
    window.requestAnimationFrame(() => {
      setView("home");
    });
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      await saveProfile(draftProfile);
      setProfile(draftProfile);
      setSaveMessage("Profile saved");
      setRenderedView("home");
      window.requestAnimationFrame(() => {
        setView("home");
      });
    } finally {
      setIsSaving(false);
    }
  }

  const shouldShowHome = renderedView === "home" || view === "home";
  const shouldShowEdit = renderedView === "edit" || view === "edit";

  return (
    <div className="popup-shell">
      <section className="popup-card">
        <div className="page-stage">
          {shouldShowHome ? (
            <div
              aria-hidden={view !== "home"}
              className={`page-layer page-layer-home ${view === "home" ? "is-active" : "is-exiting"}`}
            >
              <PopupHomePage
                onAutofill={autofillCurrentPage}
                onEdit={openEditPage}
                profile={profile}
                saveMessage={saveMessage}
              />
            </div>
          ) : null}

          {shouldShowEdit ? (
            <div
              aria-hidden={view !== "edit"}
              className={`page-layer page-layer-edit ${view === "edit" ? "is-active" : "is-exiting"}`}
            >
              <PopupEditPage
                isSaving={isSaving}
                onBack={closeEditPage}
                onChange={setDraftProfile}
                onSave={handleSave}
                profile={draftProfile}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
