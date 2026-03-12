import { scoreFieldMatch } from "./fieldScorer";
import type { FormElement } from "./formScanner";

export type ProfileField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "linkedin"
  | "github"
  | "portfolio"
  | "location"
  | "gender"
  | "birthDate"
  | "company"
  | "jobTitle";

export type FieldSignals = {
  name: string;
  id: string;
  placeholder: string;
  ariaLabel: string;
  type: string;
  autocomplete: string;
  className: string;
  datasetType: string;
  surroundingText: string;
};

function getSurroundingText(input: FormElement): string {
  const texts: string[] = [];

  // 1. Check for associated <label> elements (via id or wrapping)
  if (input.labels && input.labels.length > 0) {
    for (const label of Array.from(input.labels)) {
      if (label.textContent) texts.push(label.textContent);
    }
  }

  // 2. Previous and Next sibling text
  if (input.previousElementSibling?.textContent) {
    texts.push(input.previousElementSibling.textContent);
  }
  if (input.nextElementSibling?.textContent) {
    texts.push(input.nextElementSibling.textContent);
  }

  // 3. Parent element text (but limit to direct narrow parents to prevent grabbing the whole form)
  // Grabbing parent directly can grab the input text too, but it's safe enough for keyword matching
  if (input.parentElement && input.parentElement.tagName !== "FORM" && input.parentElement.tagName !== "BODY") {
      const parentText = input.parentElement.textContent || "";
      // Keep only first 100 chars to avoid grabbing huge block of unrelated text
      texts.push(parentText.substring(0, 100));
  }

  const rawText = texts.filter(Boolean).join(" ");
  
  // Normalize text: replace newlines, tabs and multiple spaces with a single space
  const normalizedText = rawText.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();

  return normalizedText.toLowerCase();
}

function getSignals(input: FormElement): FieldSignals {
  return {
    name: (input.name || "").toLowerCase(),
    id: (input.id || "").toLowerCase(),
    placeholder: ((input as any).placeholder || "").toLowerCase(),
    ariaLabel: (input.getAttribute("aria-label") || "").toLowerCase(),
    type: (input.type || "").toLowerCase(),
    autocomplete: ((input as any).autocomplete || "").toLowerCase(),
    className: (input.className || "").toLowerCase(),
    datasetType: (input.dataset.type || "").toLowerCase(),
    surroundingText: getSurroundingText(input),
  };
}

export function detectField(input: FormElement): ProfileField | null {
  const signals = getSignals(input);

  return scoreFieldMatch(signals);
}
