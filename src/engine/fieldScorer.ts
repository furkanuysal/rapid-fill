import { FIELD_KEYWORDS, EXCLUDED_KEYWORDS } from "./fieldKeywords";
import type { ProfileField } from "./fieldDetector";
import type { FieldSignals } from "./fieldDetector";

const WEIGHTS = {
  name: 10,
  id: 8,
  autocomplete: 12,
  ariaLabel: 6,
  placeholder: 4,
  className: 2,
  datasetType: 4,
  surroundingText: 3, // moderate score since it can catch surrounding labels and nearby helpful context
};

// A minimum score is required to confirm a field match to avoid false positives 
// (e.g., matching a generic "class" text that happens to have the word "name")
const SCORE_THRESHOLD = 5;

export function scoreFieldMatch(signals: FieldSignals): ProfileField | null {
  const combinedRawSignals = Object.values(signals).join(" ");
  
  for (const exclude of EXCLUDED_KEYWORDS) {
    if (combinedRawSignals.includes(exclude)) {
      return null;
    }
  }

  let bestField: ProfileField | null = null;
  let bestScore = 0;

  for (const field in FIELD_KEYWORDS) {
    const keywords = FIELD_KEYWORDS[field as ProfileField];

    let score = 0;

    for (const keyword of keywords) {
      if (signals.name.includes(keyword)) score += WEIGHTS.name;
      if (signals.id.includes(keyword)) score += WEIGHTS.id;
      if (signals.autocomplete.includes(keyword)) score += WEIGHTS.autocomplete;
      if (signals.ariaLabel.includes(keyword)) score += WEIGHTS.ariaLabel;
      if (signals.placeholder.includes(keyword)) score += WEIGHTS.placeholder;
      if (signals.className.includes(keyword)) score += WEIGHTS.className;
      if (signals.datasetType.includes(keyword)) score += WEIGHTS.datasetType;
      if (signals.surroundingText.includes(keyword)) score += WEIGHTS.surroundingText;
    }

    if (score > bestScore) {
      bestScore = score;
      bestField = field as ProfileField;
    }
  }

  return bestScore >= SCORE_THRESHOLD ? bestField : null;
}
