import type { Dispatch, SetStateAction } from "react";
import type { UserProfile } from "../types/UserProfile";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: Dispatch<SetStateAction<UserProfile>>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const FIELD_GROUPS: Array<{
  title: string;
  fields: Array<{
    key: keyof UserProfile;
    label: string;
    placeholder: string;
    type?: string;
  }>;
}> = [
  {
    title: "Core Profile",
    fields: [
      { key: "firstName", label: "First Name", placeholder: "Alex" },
      { key: "lastName", label: "Last Name", placeholder: "Chen" },
      { key: "email", label: "Email", placeholder: "alex@dev.io", type: "email" },
      { key: "phone", label: "Phone", placeholder: "+1 555 0123", type: "tel" },
    ],
  },
  {
    title: "Links",
    fields: [
      { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/alexchen", type: "url" },
      { key: "github", label: "GitHub", placeholder: "github.com/alex-dev", type: "url" },
      { key: "portfolio", label: "Portfolio", placeholder: "alexchen.dev", type: "url" },
    ],
  },
  {
    title: "Location",
    fields: [
      { key: "address", label: "Street Address", placeholder: "221B Baker Street" },
      { key: "city", label: "City", placeholder: "London" },
      { key: "state", label: "State / Province", placeholder: "Greater London" },
      { key: "postalCode", label: "Postal Code", placeholder: "NW1 6XE" },
      { key: "country", label: "Country", placeholder: "United Kingdom" },
    ],
  },
  {
    title: "Professional",
    fields: [
      { key: "company", label: "Company", placeholder: "OpenAI" },
      { key: "jobTitle", label: "Job Title", placeholder: "Frontend Engineer" },
      { key: "school", label: "School", placeholder: "MIT" },
      { key: "major", label: "Major", placeholder: "Computer Science" },
      { key: "gradCity", label: "Graduation City", placeholder: "Cambridge" },
      { key: "graduationYear", label: "Graduation Year", placeholder: "2024", type: "number" },
    ],
  },
  {
    title: "Personal",
    fields: [
      { key: "gender", label: "Gender", placeholder: "Optional" },
      { key: "birthDate", label: "Birth Date", placeholder: "1990-01-01", type: "date" },
    ],
  },
];

export default function ProfileForm({
  profile,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: ProfileFormProps) {
  function updateField(field: keyof UserProfile, value: string) {
    onChange((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section className="editor-page">
      <div className="editor-groups">
        {FIELD_GROUPS.map((group) => (
          <section className="form-group" key={group.title}>
            <h4>{group.title}</h4>
            <div className="form-grid">
              {group.fields.map((field) => (
                <label className="field" key={field.key}>
                  <span>{field.label}</span>
                  <input
                    onChange={(event) => updateField(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    type={field.type ?? "text"}
                    value={profile[field.key] ?? ""}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="editor-actions">
        <button className="ghost-action" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="primary-action" disabled={isSaving} onClick={() => void onSave()} type="button">
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </section>
  );
}
