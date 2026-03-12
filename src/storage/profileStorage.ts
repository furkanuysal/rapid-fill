import type { UserProfile } from "../types/UserProfile";

const PROFILE_KEY = "user_profile";

export async function saveProfile(profile: UserProfile): Promise<void> {
  await chrome.storage.local.set({
    [PROFILE_KEY]: profile,
  });
}

export async function getProfile(): Promise<UserProfile | null> {
  const result = await chrome.storage.local.get(PROFILE_KEY);

  if (!result[PROFILE_KEY]) {
    return null;
  }

  return result[PROFILE_KEY] as UserProfile;
}

export async function clearProfile(): Promise<void> {
  await chrome.storage.local.remove(PROFILE_KEY);
}
