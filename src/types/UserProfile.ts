export interface UserProfile {
  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  linkedin?: string;
  github?: string;
  portfolio?: string;

  location?: string;

  gender?: string;
  birthDate?: string;
  company?: string;
  jobTitle?: string;
}
