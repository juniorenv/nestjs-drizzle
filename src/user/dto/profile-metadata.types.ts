export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum Language {
  EN = "en",
  FR = "fr",
  ES = "es",
  PT = "pt",
}

export interface ProfileMetadata {
  bio: string;
  avatar: string;
  phone: string;
  location: string;
  website: string;
  sociallinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: {
    theme: Theme;
    notifications: boolean;
    language: Language;
    emailNotifications?: boolean;
    timezone?: string;
  };
  occupation?: string;
  company?: string;
  skills?: string[];
}
