import type { Dispatch, SetStateAction } from "react";
import type { UserProfile } from "../types/UserProfile";
import ProfileForm from "./ProfileForm";

interface PopupEditPageProps {
  profile: UserProfile;
  isSaving: boolean;
  onChange: Dispatch<SetStateAction<UserProfile>>;
  onSave: () => Promise<void>;
  onBack: () => void;
}

export default function PopupEditPage({
  profile,
  isSaving,
  onChange,
  onSave,
  onBack,
}: PopupEditPageProps) {
  return (
    <div className="page-frame page-frame-edit">
      <header className="edit-page-header">
        <button className="back-button" onClick={onBack} type="button">
          <span aria-hidden="true">&lt;</span>
          <span>Back</span>
        </button>

        <div className="edit-page-heading">
          <span className="eyebrow">Profile Setup</span>
          <h2>Edit Your Autofill Data</h2>
          <p>Update your details here, save, then return to the main popup screen.</p>
        </div>
      </header>

      <ProfileForm
        isSaving={isSaving}
        onCancel={onBack}
        onChange={onChange}
        onSave={onSave}
        profile={profile}
      />
    </div>
  );
}
