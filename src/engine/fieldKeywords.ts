import type { ProfileField } from "./fieldDetector";

export const EXCLUDED_KEYWORDS = [
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

  location: ["location", "city", "address", "country", "zip", "postal", "state", "province"],

  gender: ["gender", "sex"],

  birthDate: ["birth", "dob", "date of birth", "birthday", "birth_date", "birthdate"],

  company: ["company", "organization", "employer", "current company"],

  jobTitle: ["job", "title", "position", "role", "profession", "occupation", "job_title", "job title"],
};
