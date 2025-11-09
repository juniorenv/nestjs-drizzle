import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";

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

class SocialLinksDto {
  @IsOptional()
  @IsUrl({}, { message: "Twitter must be a valid URL" })
  twitter?: string;

  @IsOptional()
  @IsUrl({}, { message: "Linkedin must be a valid URL" })
  linkedin?: string;

  @IsOptional()
  @IsUrl({}, { message: "Github must be a valid URL" })
  github?: string;
}

class PreferencesDto {
  @IsEnum(Theme, { message: "Theme must be light, dark or system" })
  theme: Theme;

  @IsBoolean()
  notifications: boolean;

  @IsEnum(Language, { message: "Language must be en, fr, es, or pt" })
  language: Language;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(1)
  timezone?: string;
}

export class ProfileMetadata {
  @IsString()
  @Length(1, 160)
  bio: string;

  @IsUrl({}, { message: "Avatar must be a valid URL" })
  avatar: string;

  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message:
      "Phone number must be in international format with 7-15 digits (e.g +5577996483728)",
  })
  phone: string;

  @IsString()
  @MinLength(1)
  location: string;

  @IsUrl({}, { message: "Website must be a valid URL" })
  website: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  @IsObject()
  socialLinks?: SocialLinksDto;

  @ValidateNested()
  @Type(() => PreferencesDto)
  @IsObject()
  preferences: PreferencesDto;

  @IsOptional()
  @IsString()
  @MinLength(1)
  occupation?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  company?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  skills?: string[];
}
