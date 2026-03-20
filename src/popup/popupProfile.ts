import type { UserProfile } from "../types/UserProfile";

export const EMPTY_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  portfolio: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  gender: "",
  birthDate: "",
  company: "",
  jobTitle: "",
  employmentStartDate: "",
  employmentEndDate: "",
  currentlyWorking: false,
  school: "",
  major: "",
  gradCity: "",
  graduationYear: "",
};

export function mergeWithDefaults(profile?: UserProfile | null): UserProfile {
  return {
    ...EMPTY_PROFILE,
    ...profile,
  };
}

export function isProfileReady(profile: UserProfile) {
  return Boolean(profile.firstName && profile.lastName && profile.email && profile.phone);
}

export function getCompletionRatio(profile: UserProfile) {
  const trackedFields = (Object.keys(EMPTY_PROFILE) as Array<keyof UserProfile>).filter(
    (field) => field !== "currentlyWorking",
  );
  const completed = trackedFields.filter((field) => isFieldCompleted(profile, field)).length;
  return Math.round((completed / trackedFields.length) * 100);
}

function isFieldCompleted(profile: UserProfile, field: keyof UserProfile) {
  if (field === "employmentEndDate" && profile.currentlyWorking) {
    return true;
  }

  const value = profile[field];

  if (typeof value === "string") {
    return Boolean(value.trim());
  }

  return Boolean(value);
}

export function formatFullName(profile: UserProfile) {
  return `${profile.firstName} ${profile.lastName}`.trim();
}

export function formatWebsite(value?: string) {
  if (!value) {
    return "";
  }

  return value.replace(/^https?:\/\//, "");
}
