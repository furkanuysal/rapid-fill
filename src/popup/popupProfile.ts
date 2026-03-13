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

export function getProfileStatus(profile: UserProfile) {
  return profile.firstName && profile.lastName && profile.email && profile.phone
    ? "Profile Ready"
    : "Profile Incomplete";
}

export function getCompletionRatio(profile: UserProfile) {
  const trackedFields = Object.keys(EMPTY_PROFILE) as Array<keyof UserProfile>;
  const completed = trackedFields.filter((field) => profile[field]?.trim()).length;
  return Math.round((completed / trackedFields.length) * 100);
}

export function formatFullName(profile: UserProfile) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  return fullName || "Add your name";
}

export function formatWebsite(value?: string) {
  if (!value) {
    return "Add website";
  }

  return value.replace(/^https?:\/\//, "");
}
