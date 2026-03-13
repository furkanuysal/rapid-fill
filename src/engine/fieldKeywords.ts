import type { ProfileField } from "./fieldDetector";

export const EXCLUDED_KEYWORDS = [
  // Third-party person references
  "reference",
  "referral",
  "emergency",
  "spouse",
  "parent",
  "guardian",
  "manager",
  "boss",
  "supervisor",
  "friend",
  "colleague",
  "partner",

  // Authentication & security — never autofill these
  "password",
  "passwd",
  "passphrase",
  "pin",
  "secret",
  "security question",
  "security_question",
  "secret question",
  "answer",
  "captcha",

  // Sensitive personal data
  "ssn",
  "social security",
  "national id",
  "national_id",
  "passport",
  "tax id",
  "tax_id",
  "credit card",
  "card number",
  "cvv",
  "cvc",
];

export const FIELD_KEYWORDS: Record<ProfileField, string[]> = {
  firstName: ["first", "given", "fname", "first_name", "given_name", "firstname"],

  lastName: [
    "last",
    "surname",
    "family",
    "lname",
    "lastname",
    "last_name",
    "family_name",
  ],

  email: ["email", "e-mail", "emailaddress", "email_address", "e mail", "mail_address"],

  phone: ["phone", "mobile", "telephone", "tel", "phone_number", "cell", "contact_number", "contact number"],

  linkedin: ["linkedin", "linked in", "linkedin_url", "linkedin profile"],

  github: ["github", "git hub", "github_url", "github profile"],

  portfolio: ["portfolio", "website", "personal_site", "personal website", "portfolio_url", "website_url", "personal web"],

  // NOTE: "city" is intentionally kept generic here. Graduation-specific fields
  // (gradCity, school, major) have their own dedicated keywords which will score
  // higher than the generic 'location' match when the form contains 'grad' context.
  address: [
    "address", "street", "street address", "address_line", "address line",
    "addr", "street_address", "address1", "address_1",
  ],

  city: [
    "city", "town", "municipality",
  ],

  state: [
    "state", "province", "region",
  ],

  postalCode: [
    "zip", "zipcode", "postal", "postal code", "zip code",
    "postcode", "post_code", "zip_code", "postal_code",
  ],

  country: [
    "country", "country_region", "country region", "nation",
  ],

  gender: ["gender", "sex"],

  birthDate: ["birth", "dob", "date of birth", "birthday", "birth_date", "birthdate"],

  company: ["company", "organization", "employer", "current company"],

  jobTitle: ["job", "title", "position", "role", "profession", "occupation", "job_title", "job title"],

  school: [
    "school", "university", "college", "institution", "institute",
    "school_name", "college_name", "university_name",
  ],

  major: [
    "major", "field of study", "field_of_study", "degree", "program",
    "department", "discipline", "study", "specialization",
  ],

  gradCity: [
    "grad_city", "gradcity", "grad city", "graduation_city", "graduation city",
    "school_city", "schoolcity", "college_city", "university_city",
  ],

  graduationYear: [
    "graduation_year", "graduationyear", "grad_year", "grad year",
    "year of graduation", "class year", "classyear", "class of",
  ],
};
