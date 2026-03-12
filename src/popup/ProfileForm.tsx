import { useEffect, useState } from "react";
import type { UserProfile } from "../types/UserProfile";
import { saveProfile, getProfile } from "../storage/profileStorage";

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    location: "",
    gender: "",
    birthDate: "",
    company: "",
    jobTitle: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const stored = await getProfile();

      if (stored) {
        setProfile(stored);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof UserProfile, value: string) {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    await saveProfile(profile);
    alert("Profile saved");
  }

  return (
    <div>
      <input
        placeholder="First name"
        value={profile.firstName}
        onChange={(e) => updateField("firstName", e.target.value)}
      />

      <input
        placeholder="Last name"
        value={profile.lastName}
        onChange={(e) => updateField("lastName", e.target.value)}
      />

      <input
        placeholder="Email"
        value={profile.email}
        onChange={(e) => updateField("email", e.target.value)}
      />

      <input
        placeholder="Phone"
        value={profile.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <input
        placeholder="LinkedIn"
        value={profile.linkedin || ""}
        onChange={(e) => updateField("linkedin", e.target.value)}
      />

      <input
        placeholder="GitHub"
        value={profile.github || ""}
        onChange={(e) => updateField("github", e.target.value)}
      />

      <input
        placeholder="Portfolio URL"
        value={profile.portfolio || ""}
        onChange={(e) => updateField("portfolio", e.target.value)}
      />

      <input
        placeholder="Location"
        value={profile.location || ""}
        onChange={(e) => updateField("location", e.target.value)}
      />

      <input
        placeholder="Gender"
        value={profile.gender || ""}
        onChange={(e) => updateField("gender", e.target.value)}
      />

      <input
        placeholder="Birth Date (e.g. 1990-01-01)"
        value={profile.birthDate || ""}
        onChange={(e) => updateField("birthDate", e.target.value)}
      />

      <input
        placeholder="Company"
        value={profile.company || ""}
        onChange={(e) => updateField("company", e.target.value)}
      />

      <input
        placeholder="Job Title"
        value={profile.jobTitle || ""}
        onChange={(e) => updateField("jobTitle", e.target.value)}
      />

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}
