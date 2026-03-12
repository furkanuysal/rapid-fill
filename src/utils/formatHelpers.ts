import type { FormElement } from "../engine/formScanner";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatDateForInput(input: FormElement, rawValue: string): string {
  if (!rawValue || !rawValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return rawValue;
  }

  const [year, month, day] = rawValue.split("-");

  if (input instanceof HTMLInputElement && input.type === "date") {
    return rawValue;
  }

  const hints = [
    (input as HTMLInputElement).placeholder,
    input.getAttribute("aria-label"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (hints.includes("dd/mm") || hints.includes("dd.mm") || hints.includes("dd-mm")) {
    return `${day}/${month}/${year}`;
  }

  if (hints.includes("mm/dd") || hints.includes("mm.dd") || hints.includes("mm-dd")) {
    return `${month}/${day}/${year}`;
  }

  if (hints.includes("yyyy/mm") || hints.includes("yyyy.mm") || hints.includes("yyyy-mm")) {
    return `${year}/${month}/${day}`;
  }

  return `${month}/${day}/${year}`;
}

export function formatPhoneForInput(input: FormElement, rawValue: string): string {
  if (!rawValue) return rawValue;

  const phoneNumber = parsePhoneNumberFromString(rawValue);

  if (!phoneNumber) {
    const isPlus = rawValue.startsWith("+");
    const digits = rawValue.replace(/\D/g, "");
    return isPlus ? `+${digits}` : digits;
  }

  const fullInternational = phoneNumber.number;
  const nationalNumber = phoneNumber.nationalNumber;
  
  const hints = [
    (input as HTMLInputElement).placeholder,
    input.getAttribute("aria-label"),
    input.getAttribute("title"),
  ].filter(Boolean).join(" ").toLowerCase();

  const maxLength = (input as HTMLInputElement).maxLength;
  const wantsNoZeroOrCode = hints.includes("without country code") || hints.includes("excluding country code") || hints.includes("no zero");

  const fullDigitsLength = fullInternational.length - 1; 
  const diff = fullDigitsLength - maxLength;
  const wantsShorterNumber = maxLength && maxLength > 0 && diff > 0 && diff <= 4; 

  if (wantsNoZeroOrCode || wantsShorterNumber) {
     if (wantsShorterNumber) {
        return nationalNumber.slice(-maxLength);
     }
     return nationalNumber;
  }

  return fullInternational;
}
