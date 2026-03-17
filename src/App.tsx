import { useEffect, useState } from "react";
import "./App.css";
import { resolveInitialLanguage, translations, type AppLanguage } from "./lib/i18n";
import PopupEditPage from "./popup/PopupEditPage";
import PopupHomePage from "./popup/PopupHomePage";
import { EMPTY_PROFILE, mergeWithDefaults } from "./popup/popupProfile";
import { getLanguage, saveLanguage } from "./storage/languageStorage";
import { clearProfile, getProfile, saveProfile } from "./storage/profileStorage";
import type { UserProfile } from "./types/UserProfile";

type PopupView = "home" | "edit";

function autofillCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];

    if (!tab?.id) {
      console.warn("RapidFill: No active tab found");
      return;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["contentScript.js"],
      });

      await chrome.tabs.sendMessage(tab.id, {
        type: "AUTOFILL_PAGE",
      });
    } catch (error) {
      console.error("RapidFill: Failed to inject content script", error);
    }
  });
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [language, setLanguage] = useState<AppLanguage>(resolveInitialLanguage());
  const [extensionVersion] = useState(() => chrome.runtime.getManifest().version);
  const [view, setView] = useState<PopupView>("home");
  const [renderedView, setRenderedView] = useState<PopupView>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    async function loadPopupState() {
      const [storedProfile, storedLanguage] = await Promise.all([getProfile(), getLanguage()]);
      const mergedProfile = mergeWithDefaults(storedProfile);

      setProfile(mergedProfile);
      setDraftProfile(mergedProfile);

      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    }

    void loadPopupState();
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

  function handleLanguageChange(nextLanguage: AppLanguage) {
    setLanguage(nextLanguage);
    void saveLanguage(nextLanguage);
  }

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
      setSaveMessage(translations[language].profileSaved);
      setRenderedView("home");
      window.requestAnimationFrame(() => {
        setView("home");
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleClearProfile() {
    setIsSaving(true);

    try {
      await clearProfile();
      setProfile(EMPTY_PROFILE);
      setDraftProfile(EMPTY_PROFILE);
      setSaveMessage(translations[language].profileCleared);
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
  const copy = translations[language];

  return (
    <div className="popup-shell" lang={language}>
      <section className="popup-card">
        <div className="page-stage">
          {shouldShowHome ? (
            <div
              aria-hidden={view !== "home"}
              className={`page-layer page-layer-home ${view === "home" ? "is-active" : "is-exiting"}`}
            >
              <PopupHomePage
                extensionVersion={extensionVersion}
                language={language}
                onAutofill={autofillCurrentPage}
                onEdit={openEditPage}
                onLanguageChange={handleLanguageChange}
                profile={profile}
                saveMessage={saveMessage}
                t={copy}
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
                onClear={handleClearProfile}
                onSave={handleSave}
                profile={draftProfile}
                t={copy}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
