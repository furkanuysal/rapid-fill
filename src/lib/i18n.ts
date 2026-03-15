import { en } from "../locales/en";
import { tr } from "../locales/tr";

export type AppLanguage = "en" | "tr";

export interface Translations {
  appName: string;
  appSubtitle: string;
  profileReady: string;
  profileIncomplete: string;
  profileOverview: string;
  completeSuffix: string;
  readyState: string;
  targetRoleFallback: string;
  companySummary: (company: string) => string;
  companySummaryFallback: string;
  autofillButton: string;
  editProfileButton: string;
  helpDocs: string;
  languageLabel: string;
  profileSaved: string;
  back: string;
  profileSetup: string;
  editProfileTitle: string;
  editProfileDescription: string;
  saveProfile: string;
  saving: string;
  cancel: string;
  addName: string;
  addWebsite: string;
  fieldFallbacks: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  overviewLabels: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  formGroups: {
    core: string;
    links: string;
    location: string;
    professional: string;
    personal: string;
  };
  formFields: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    jobTitle: string;
    school: string;
    major: string;
    gradCity: string;
    graduationYear: string;
    gender: string;
    birthDate: string;
  };
  placeholders: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    jobTitle: string;
    school: string;
    major: string;
    gradCity: string;
    graduationYear: string;
    gender: string;
    birthDate: string;
  };
}

export const translations: Record<AppLanguage, Translations> = {
  en,
  tr,
};

export const supportedLanguages: Array<{
  code: AppLanguage;
  label: string;
}> = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

export function resolveInitialLanguage(): AppLanguage {
  const rawLanguage = chrome.i18n.getUILanguage().toLowerCase();
  return rawLanguage.startsWith("tr") ? "tr" : "en";
}
