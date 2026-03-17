export interface UserProfile {
  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;

  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  gender?: string;
  birthDate?: string;
  company?: string;
  jobTitle?: string;
  employmentStartDate?: string;
  employmentEndDate?: string;
  currentlyWorking: boolean;

  school?: string;
  major?: string;
  gradCity?: string;
  graduationYear?: string;
}
