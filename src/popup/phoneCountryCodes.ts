import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";

export interface PhoneCountryOption {
  country: string;
  dialCode: string;
  label: string;
}

const displayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export const PHONE_COUNTRY_OPTIONS: PhoneCountryOption[] = getCountries()
  .map((country) => {
    const dialCode = `+${getCountryCallingCode(country)}`;
    const countryName = displayNames?.of(country) ?? country;

    return {
      country,
      dialCode,
      label: `${countryName} (${dialCode})`,
    };
  })
  .sort((left, right) => left.label.localeCompare(right.label, "en"));

export function getPhoneParts(rawValue: string): {
  dialCode: string;
  nationalNumber: string;
} {
  if (!rawValue) {
    return {
      dialCode: "",
      nationalNumber: "",
    };
  }

  const parsed = parsePhoneNumberFromString(rawValue);

  if (parsed) {
    return {
      dialCode: `+${parsed.countryCallingCode}`,
      nationalNumber: parsed.nationalNumber,
    };
  }

  const digits = rawValue.replace(/\D/g, "");

  if (!rawValue.startsWith("+") || !digits) {
    return {
      dialCode: "",
      nationalNumber: digits,
    };
  }

  const matchedOption = [...PHONE_COUNTRY_OPTIONS]
    .sort((left, right) => right.dialCode.length - left.dialCode.length)
    .find((option) => digits.startsWith(option.dialCode.slice(1)));

  if (!matchedOption) {
    return {
      dialCode: "",
      nationalNumber: digits,
    };
  }

  return {
    dialCode: matchedOption.dialCode,
    nationalNumber: digits.slice(matchedOption.dialCode.length - 1),
  };
}

export function combinePhoneParts(dialCode: string, nationalNumber: string): string {
  const sanitizedNumber = nationalNumber.replace(/\D/g, "");
  const sanitizedDialCode = dialCode.startsWith("+")
    ? `+${dialCode.slice(1).replace(/\D/g, "")}`
    : dialCode.replace(/\D/g, "");

  if (!sanitizedNumber) {
    return sanitizedDialCode;
  }

  return sanitizedDialCode ? `${sanitizedDialCode}${sanitizedNumber}` : sanitizedNumber;
}
