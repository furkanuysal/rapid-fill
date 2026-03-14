import type { Dispatch, SetStateAction } from "react";
import type { Translations } from "../lib/i18n";
import type { UserProfile } from "../types/UserProfile";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: Dispatch<SetStateAction<UserProfile>>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  t: Translations;
}

export default function ProfileForm({
  profile,
  onChange,
  onSave,
  onCancel,
  isSaving,
  t,
}: ProfileFormProps) {
  const fieldGroups: Array<{
    title: string;
    fields: Array<{
      key: keyof UserProfile;
      label: string;
      placeholder: string;
      type?: string;
    }>;
  }> = [
    {
      title: t.formGroups.core,
      fields: [
        { key: "firstName", label: t.formFields.firstName, placeholder: t.placeholders.firstName },
        { key: "lastName", label: t.formFields.lastName, placeholder: t.placeholders.lastName },
        { key: "email", label: t.formFields.email, placeholder: t.placeholders.email, type: "email" },
        { key: "phone", label: t.formFields.phone, placeholder: t.placeholders.phone, type: "tel" },
      ],
    },
    {
      title: t.formGroups.links,
      fields: [
        { key: "linkedin", label: t.formFields.linkedin, placeholder: t.placeholders.linkedin, type: "url" },
        { key: "github", label: t.formFields.github, placeholder: t.placeholders.github, type: "url" },
        { key: "portfolio", label: t.formFields.portfolio, placeholder: t.placeholders.portfolio, type: "url" },
      ],
    },
    {
      title: t.formGroups.location,
      fields: [
        { key: "address", label: t.formFields.address, placeholder: t.placeholders.address },
        { key: "city", label: t.formFields.city, placeholder: t.placeholders.city },
        { key: "state", label: t.formFields.state, placeholder: t.placeholders.state },
        { key: "postalCode", label: t.formFields.postalCode, placeholder: t.placeholders.postalCode },
        { key: "country", label: t.formFields.country, placeholder: t.placeholders.country },
      ],
    },
    {
      title: t.formGroups.professional,
      fields: [
        { key: "company", label: t.formFields.company, placeholder: t.placeholders.company },
        { key: "jobTitle", label: t.formFields.jobTitle, placeholder: t.placeholders.jobTitle },
        { key: "school", label: t.formFields.school, placeholder: t.placeholders.school },
        { key: "major", label: t.formFields.major, placeholder: t.placeholders.major },
        { key: "gradCity", label: t.formFields.gradCity, placeholder: t.placeholders.gradCity },
        {
          key: "graduationYear",
          label: t.formFields.graduationYear,
          placeholder: t.placeholders.graduationYear,
          type: "number",
        },
      ],
    },
    {
      title: t.formGroups.personal,
      fields: [
        { key: "gender", label: t.formFields.gender, placeholder: t.placeholders.gender },
        { key: "birthDate", label: t.formFields.birthDate, placeholder: t.placeholders.birthDate, type: "date" },
      ],
    },
  ];

  function updateField(field: keyof UserProfile, value: string) {
    onChange((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <section className="editor-page">
      <div className="editor-groups">
        {fieldGroups.map((group) => (
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
          {t.cancel}
        </button>
        <button className="primary-action" disabled={isSaving} onClick={() => void onSave()} type="button">
          {isSaving ? t.saving : t.saveProfile}
        </button>
      </div>
    </section>
  );
}
