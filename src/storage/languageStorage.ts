import type { AppLanguage } from "../lib/i18n";

const LANGUAGE_KEY = "app_language";

export async function saveLanguage(language: AppLanguage): Promise<void> {
  await chrome.storage.local.set({
    [LANGUAGE_KEY]: language,
  });
}

export async function getLanguage(): Promise<AppLanguage | null> {
  const result = await chrome.storage.local.get(LANGUAGE_KEY);
  const language = result[LANGUAGE_KEY];

  if (language === "tr" || language === "en") {
    return language;
  }

  return null;
}
