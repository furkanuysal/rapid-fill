import { supportedLanguages, type AppLanguage, type Translations } from "../lib/i18n";
import type { UserProfile } from "../types/UserProfile";
import {
  formatFullName,
  formatWebsite,
  getCompletionRatio,
} from "./popupProfile";

interface PopupHomePageProps {
  extensionVersion: string;
  language: AppLanguage;
  profile: UserProfile;
  saveMessage: string;
  t: Translations;
  onAutofill: () => void;
  onEdit: () => void;
  onLanguageChange: (language: AppLanguage) => void;
}

export default function PopupHomePage({
  extensionVersion,
  language,
  profile,
  saveMessage,
  t,
  onAutofill,
  onEdit,
  onLanguageChange,
}: PopupHomePageProps) {
  const fullName = formatFullName(profile) || t.addName;
  const website = formatWebsite(profile.portfolio) || t.addWebsite;
  const completionRatio = getCompletionRatio(profile);
  const completionStatus =
    completionRatio === 100 ? "ready" : completionRatio === 0 ? "empty" : "incomplete";

  const overviewItems = [
    { label: t.overviewLabels.fullName, value: fullName, muted: !profile.firstName && !profile.lastName },
    { label: t.overviewLabels.email, value: profile.email || t.fieldFallbacks.email, muted: !profile.email },
    { label: t.overviewLabels.phone, value: profile.phone || t.fieldFallbacks.phone, muted: !profile.phone },
    {
      label: t.overviewLabels.linkedin,
      value: profile.linkedin || t.fieldFallbacks.linkedin,
      muted: !profile.linkedin,
    },
    { label: t.overviewLabels.github, value: profile.github || t.fieldFallbacks.github, muted: !profile.github },
    { label: t.overviewLabels.portfolio, value: website, muted: !profile.portfolio },
  ];

  return (
    <div className="page-frame">
      <header className="popup-header">
        <div className="brand-block">
          <img
            alt=""
            aria-hidden="true"
            className="brand-icon"
            height="32"
            src="/icons/32x32.png"
            width="32"
          />
          <div className="brand-copy">
            <h1>{t.appName}</h1>
            <p>{t.appSubtitle}</p>
          </div>
        </div>
      </header>

      <div className="section-heading">
        <span>{t.profileOverview}</span>
        <div className={`status-pill status-pill-${completionStatus}`}>
          <span className="status-dot" />
          {completionRatio}% {t.completeSuffix}
        </div>
      </div>

      <div className="overview-grid">
        {overviewItems.map((item) => (
          <button className="overview-tile overview-tile-button" key={item.label} onClick={onEdit} type="button">
            <span>{item.label}</span>
            <strong className={item.muted ? "is-muted" : undefined}>{item.value}</strong>
          </button>
        ))}
      </div>

      <button className="insight-panel insight-panel-button" onClick={onEdit} type="button">
        <div className="insight-copy">
          <span className="eyebrow">{t.readyState}</span>
          <h2>{profile.jobTitle || t.targetRoleFallback}</h2>
          <p>{profile.company ? t.companySummary(profile.company) : t.companySummaryFallback}</p>
        </div>

        <div
          className="completion-ring"
          aria-hidden="true"
          style={{ ["--progress" as string]: completionRatio }}
        >
          <span>{completionRatio}%</span>
        </div>
      </button>

      <div className="action-stack">
        <button className="primary-action" onClick={onAutofill} type="button">
          {t.autofillButton}
        </button>

        <button className="secondary-action" onClick={onEdit} type="button">
          {t.editProfileButton}
        </button>
      </div>

      {saveMessage ? <p className="save-message">{saveMessage}</p> : null}

      <footer className="popup-footer">
        <div className="footer-meta">
          <a
            className="footer-link"
            href="https://github.com/furkanuysal/rapid-fill"
            rel="noreferrer"
            target="_blank"
          >
            {t.helpDocs}
          </a>
          <span>v{extensionVersion}</span>
        </div>

        <label className="language-field">
          <span className="language-label">{t.languageLabel}</span>
          <select
            className="language-select"
            onChange={(event) => onLanguageChange(event.target.value as AppLanguage)}
            value={language}
          >
            {supportedLanguages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </footer>
    </div>
  );
}
