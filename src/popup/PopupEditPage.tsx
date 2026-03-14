import type { Dispatch, SetStateAction } from "react";
import type { Translations } from "../lib/i18n";
import type { UserProfile } from "../types/UserProfile";
import ProfileForm from "./ProfileForm";

interface PopupEditPageProps {
  profile: UserProfile;
  isSaving: boolean;
  t: Translations;
  onChange: Dispatch<SetStateAction<UserProfile>>;
  onSave: () => Promise<void>;
  onBack: () => void;
}

export default function PopupEditPage({
  profile,
  isSaving,
  t,
  onChange,
  onSave,
  onBack,
}: PopupEditPageProps) {
  return (
    <div className="page-frame page-frame-edit">
      <header className="edit-page-header">
        <div className="edit-topbar">
          <button className="back-button" onClick={onBack} type="button">
            <span aria-hidden="true">&lt;</span>
            <span>{t.back}</span>
          </button>
        </div>

        <div className="edit-page-heading">
          <span className="eyebrow">{t.profileSetup}</span>
          <h2>{t.editProfileTitle}</h2>
          <p>{t.editProfileDescription}</p>
        </div>
      </header>

      <ProfileForm
        isSaving={isSaving}
        onCancel={onBack}
        onChange={onChange}
        onSave={onSave}
        profile={profile}
        t={t}
      />
    </div>
  );
}
