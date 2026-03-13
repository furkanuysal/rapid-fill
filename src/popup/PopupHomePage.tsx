import type { UserProfile } from "../types/UserProfile";
import {
  formatFullName,
  formatWebsite,
  getCompletionRatio,
  getProfileStatus,
} from "./popupProfile";

interface PopupHomePageProps {
  profile: UserProfile;
  saveMessage: string;
  onAutofill: () => void;
  onEdit: () => void;
}

export default function PopupHomePage({
  profile,
  saveMessage,
  onAutofill,
  onEdit,
}: PopupHomePageProps) {
  const overviewItems = [
    { label: "Full Name", value: formatFullName(profile), muted: !profile.firstName && !profile.lastName },
    { label: "Email Address", value: profile.email || "Add email", muted: !profile.email },
    { label: "Phone", value: profile.phone || "Add phone", muted: !profile.phone },
    { label: "LinkedIn", value: profile.linkedin || "Add LinkedIn", muted: !profile.linkedin },
    { label: "GitHub", value: profile.github || "Add GitHub", muted: !profile.github },
    { label: "Portfolio", value: formatWebsite(profile.portfolio), muted: !profile.portfolio },
  ];

  const completionRatio = getCompletionRatio(profile);

  return (
    <div className="page-frame">
      <header className="popup-header">
        <div className="brand-block">
          <div className="brand-icon" aria-hidden="true">
            <span />
          </div>
          <div className="brand-copy">
            <h1>RapidFill</h1>
            <p>Application autofill assistant</p>
          </div>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          <span>{getProfileStatus(profile)}</span>
        </div>
      </header>

      <div className="section-heading">
        <span>Profile Overview</span>
        <span>{completionRatio}% complete</span>
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
        <div>
          <span className="eyebrow">Ready State</span>
          <h2>{profile.jobTitle || "Set your target role"}</h2>
          <p>
            {profile.company
              ? `Current company: ${profile.company}`
              : "Add role and company details to improve field matching on job forms."}
          </p>
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
          Autofill This Page
        </button>

        <button className="secondary-action" onClick={onEdit} type="button">
          Edit Profile Data
        </button>
      </div>

      {saveMessage ? <p className="save-message">{saveMessage}</p> : null}

      <footer className="popup-footer">
        <span>Help & Docs</span>
        <span>v0.2 popup refresh</span>
      </footer>
    </div>
  );
}
