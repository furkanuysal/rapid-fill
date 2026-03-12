import { getProfile } from "../storage/profileStorage";
import { detectField } from "./fieldDetector";
import { scanFormElements } from "./formScanner";
import type { FormElement } from "./formScanner";
import type { ProfileField } from "./fieldDetector";
import {
  formatDateForInput,
  formatPhoneForInput,
} from "../utils/formatHelpers";

function fillInput(input: FormElement, value: string, field: ProfileField) {
  input.focus();

  if (input instanceof HTMLSelectElement) {
    // Handling Select Dropdowns
    let matchedOption = Array.from(input.options).find(
      (opt) =>
        opt.value.toLowerCase() === value.toLowerCase() ||
        opt.text.toLowerCase().includes(value.toLowerCase()),
    );

    let finalValue =
      field === "birthDate" ? formatDateForInput(input, value) : value;

    if (matchedOption) {
      input.value = matchedOption.value;
    } else {
      input.value = finalValue;
    }
  } else if (
    input instanceof HTMLInputElement &&
    (input.type === "radio" || input.type === "checkbox")
  ) {
    // Handling Radios and Checkboxes
    // Typically, a radio button has a predefined value. If the profile's value matches the radio's value, we check it.
    if (
      input.value.toLowerCase() === value.toLowerCase() ||
      input.id.toLowerCase().includes(value.toLowerCase())
    ) {
      input.checked = true;
    }
  } else {
    // Standard Text Inputs & Textareas
    let finalValue = value;
    if (field === "birthDate") {
      finalValue = formatDateForInput(input, value);
    } else if (field === "phone") {
      finalValue = formatPhoneForInput(input, value);
    }
    input.value = finalValue;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export async function autofillPage() {
  const profile = await getProfile();

  if (!profile) {
    console.warn("RapidFill: no profile found");
    return;
  }

  const elements = scanFormElements();

  elements.forEach((element) => {
    // 1. Skip if element is disabled or readonly
    if (
      (element as HTMLInputElement).disabled ||
      (element as HTMLInputElement).readOnly
    ) {
      return;
    }

    // 2. Skip if element is hidden
    if (
      element.type === "hidden" ||
      element.style.display === "none" ||
      element.style.visibility === "hidden"
    ) {
      return;
    }

    // 3. Skip if the element already has a meaningful value (don't overwrite user input)
    if (
      element.value &&
      element.value.trim() !== "" &&
      !(element instanceof HTMLSelectElement) // Let selects be overridden safely, or keep them if you prefer
    ) {
      return;
    }

    const field = detectField(element);
    console.log("RapidFill scanning:", element);
    console.log("Detected field:", field);

    if (!field) return;

    const value = profile[field];

    if (!value) return;

    fillInput(element, value, field);
  });
}
