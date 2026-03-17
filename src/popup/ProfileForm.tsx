import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Translations } from "../lib/i18n";
import type { UserProfile } from "../types/UserProfile";
import { combinePhoneParts, getPhoneParts, PHONE_COUNTRY_OPTIONS } from "./phoneCountryCodes";

interface ProfileFormProps {
  profile: UserProfile;
  onChange: Dispatch<SetStateAction<UserProfile>>;
  onClear: () => Promise<void>;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
  t: Translations;
}

function isCoreFullWidthField(field: keyof UserProfile) {
  return field === "email";
}

const GENDER_VALUES = [
  "male",
  "female",
  "non-binary",
  "prefer-not-to-answer",
] as const;

type ValidationErrors = Partial<Record<keyof UserProfile | "phone", string>>;
type DateFieldKey = "birthDate" | "employmentStartDate" | "employmentEndDate";

export default function ProfileForm({
  profile,
  onChange,
  onClear,
  onSave,
  onCancel,
  isSaving,
  t,
}: ProfileFormProps) {
  const datePickerRefs = useRef<Partial<Record<DateFieldKey, HTMLInputElement | null>>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

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
      title: t.formGroups.experience,
      fields: [
        { key: "company", label: t.formFields.company, placeholder: t.placeholders.company },
        { key: "jobTitle", label: t.formFields.jobTitle, placeholder: t.placeholders.jobTitle },
        {
          key: "employmentStartDate",
          label: t.formFields.employmentStartDate,
          placeholder: t.placeholders.employmentStartDate,
          type: "date",
        },
        {
          key: "employmentEndDate",
          label: t.formFields.employmentEndDate,
          placeholder: t.placeholders.employmentEndDate,
          type: "date",
        },
      ],
    },
    {
      title: t.formGroups.education,
      fields: [
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

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  const phoneParts = getPhoneParts(profile.phone);

  function updatePhoneField(nextDialCode: string, nextNationalNumber: string) {
    updateField("phone", combinePhoneParts(nextDialCode, nextNationalNumber));
  }

  function updateBooleanField(field: "currentlyWorking", value: boolean) {
    onChange((current) => ({
      ...current,
      [field]: value,
      employmentEndDate: value ? "" : current.employmentEndDate,
    }));

    if (value) {
      setErrors((current) => {
        if (!current.employmentEndDate) {
          return current;
        }

        const nextErrors = { ...current };
        delete nextErrors.employmentEndDate;
        return nextErrors;
      });
    }
  }

  function validateField(field: keyof UserProfile, value: string): string | undefined {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    if (field === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue) ? undefined : t.validation.invalidEmail;
    }

    if (field === "linkedin" || field === "github" || field === "portfolio") {
      try {
        const normalizedValue = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
        new URL(normalizedValue);
        return undefined;
      } catch {
        return t.validation.invalidUrl;
      }
    }

    if (field === "graduationYear") {
      return /^\d{4}$/.test(trimmedValue) ? undefined : t.validation.invalidGraduationYear;
    }

    if (field === "birthDate" || field === "employmentStartDate" || field === "employmentEndDate") {
      if (field === "employmentEndDate" && profile.currentlyWorking) {
        return undefined;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
        return t.validation.invalidBirthDate;
      }

      const date = new Date(`${trimmedValue}T00:00:00`);
      return Number.isNaN(date.getTime()) ? t.validation.invalidBirthDate : undefined;
    }

    if (field === "phone") {
      const digits = trimmedValue.replace(/\D/g, "");
      return digits.length >= 7 ? undefined : t.validation.invalidPhone;
    }

    return undefined;
  }

  function handleFieldBlur(field: keyof UserProfile, value: string) {
    const error = validateField(field, value);

    setErrors((current) => {
      if (!error && !current[field]) {
        return current;
      }

      const nextErrors = { ...current };

      if (error) {
        nextErrors[field] = error;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  }

  function validateBeforeSave() {
    const nextErrors: ValidationErrors = {};
    const fieldsToValidate: Array<keyof UserProfile> = [
      "email",
      "linkedin",
      "github",
      "portfolio",
      "graduationYear",
      "birthDate",
      "employmentStartDate",
      "employmentEndDate",
      "phone",
    ];

    for (const field of fieldsToValidate) {
      const error = validateField(field, String(profile[field] ?? ""));
      if (error) {
        nextErrors[field] = error;
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function normalizeBirthDateInput(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 4) {
      return digits;
    }

    if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }

    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
  }

  function openDatePicker(field: DateFieldKey) {
    const input = datePickerRefs.current[field];
    if (input && "showPicker" in input) {
      input.showPicker();
    }
  }

  function renderDateField(field: {
    key: DateFieldKey;
    label: string;
    placeholder: string;
  }) {
    const isDisabled = field.key === "employmentEndDate" && profile.currentlyWorking;

    return (
      <div className="date-field">
        <input
          className={errors[field.key] ? "is-invalid" : ""}
          disabled={isDisabled}
          inputMode="numeric"
          onBlur={(event) => handleFieldBlur(field.key, event.target.value)}
          onChange={(event) => updateField(field.key, normalizeBirthDateInput(event.target.value))}
          placeholder={field.placeholder}
          type="text"
          value={String(profile[field.key] ?? "")}
        />
        <button
          aria-label={field.label}
          className="date-picker-button"
          disabled={isDisabled}
          onClick={() => openDatePicker(field.key)}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 -960 960 960">
            <path
              d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h80v-80h80v80h240v-80h80v80h80q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-360H200v360Zm0-440h560v-120H200v120Zm0 0v-120 120Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <input
          className="date-picker-native"
          disabled={isDisabled}
          onChange={(event) => updateField(field.key, event.target.value)}
          ref={(element) => {
            datePickerRefs.current[field.key] = element;
          }}
          tabIndex={-1}
          type="date"
          value={String(profile[field.key] ?? "")}
        />
      </div>
    );
  }

  return (
    <section className="editor-page">
      <div className="editor-groups">
        {fieldGroups.map((group) => (
          <section className="form-group" key={group.title}>
            <h4>{group.title}</h4>
            <div className="form-grid">
              {group.fields.map((field) => (
                <label
                  className={`field${group.title === t.formGroups.core && isCoreFullWidthField(field.key) ? " field-full" : ""}`}
                  key={field.key}
                >
                  <span>{field.label}</span>
                  {field.key === "gender" ? (
                    <select
                      className={`field-select${errors[field.key] ? " is-invalid" : ""}`}
                      onBlur={(event) => handleFieldBlur(field.key, event.target.value)}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      value={profile.gender ?? ""}
                    >
                      <option value="">{field.placeholder}</option>
                      <option value={GENDER_VALUES[0]}>{t.genderOptions.male}</option>
                      <option value={GENDER_VALUES[1]}>{t.genderOptions.female}</option>
                      <option value={GENDER_VALUES[2]}>{t.genderOptions.nonBinary}</option>
                      <option value={GENDER_VALUES[3]}>{t.genderOptions.preferNotToAnswer}</option>
                    </select>
                  ) : field.key === "birthDate" ||
                    field.key === "employmentStartDate" ||
                    field.key === "employmentEndDate" ? (
                    renderDateField({
                      key: field.key,
                      label: field.label,
                      placeholder: field.placeholder,
                    })
                  ) : (
                    <input
                      className={errors[field.key] ? "is-invalid" : ""}
                      onBlur={(event) => handleFieldBlur(field.key, event.target.value)}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      type={field.type ?? "text"}
                      value={String(profile[field.key] ?? "")}
                    />
                  )}
                  {errors[field.key] ? <small className="field-error">{errors[field.key]}</small> : null}
                </label>
              ))}

              {group.title === t.formGroups.core ? (
                <div className="field field-full">
                  <span id="phone-field-label">{t.formFields.phone}</span>
                  <div
                    className={`phone-control${errors.phone ? " is-invalid" : ""}`}
                    role="group"
                    aria-labelledby="phone-field-label"
                  >
                    <div className="phone-code-field">
                      <span aria-hidden="true" className="phone-code-value">
                        {phoneParts.dialCode || "+"}
                      </span>
                      <select
                        className="field-select"
                        aria-label={t.formFields.phoneCode}
                        id="phone-code"
                        onChange={(event) => updatePhoneField(event.target.value, phoneParts.nationalNumber)}
                        value={phoneParts.dialCode}
                      >
                        <option value="">+</option>
                        {PHONE_COUNTRY_OPTIONS.map((option) => (
                          <option key={option.country} value={option.dialCode}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="phone-number-field">
                      <input
                        autoComplete="tel-national"
                        aria-label={t.formFields.phoneNumber}
                        className={errors.phone ? "is-invalid" : ""}
                        id="phone-number"
                        inputMode="numeric"
                        onBlur={(event) => handleFieldBlur("phone", event.target.value)}
                        onChange={(event) =>
                          updatePhoneField(phoneParts.dialCode, event.target.value.replace(/\D/g, ""))
                        }
                        pattern="[0-9]*"
                        placeholder={t.placeholders.phoneNumber}
                        type="tel"
                        value={phoneParts.nationalNumber}
                      />
                    </div>
                  </div>
                  {errors.phone ? <small className="field-error">{errors.phone}</small> : null}
                </div>
              ) : null}

              {group.title === t.formGroups.experience ? (
                <label className="checkbox-field field-full">
                  <input
                    checked={profile.currentlyWorking}
                    onChange={(event) => updateBooleanField("currentlyWorking", event.target.checked)}
                    type="checkbox"
                  />
                  <span>{t.formFields.currentlyWorking}</span>
                </label>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <div className="editor-actions">
        <button className="ghost-action" onClick={onCancel} type="button">
          {t.cancel}
        </button>
        <button
          className="danger-action danger-icon-action"
          disabled={isSaving}
          onClick={() => void onClear()}
          type="button"
        >
          <svg aria-hidden="true" className="danger-icon" viewBox="0 -960 960 960">
            <path
              d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          className="primary-action"
          disabled={isSaving}
          onClick={() => {
            if (!validateBeforeSave()) {
              return;
            }

            void onSave();
          }}
          type="button"
        >
          {isSaving ? t.saving : t.saveProfile}
        </button>
      </div>
    </section>
  );
}
