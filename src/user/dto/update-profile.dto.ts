import { OmitType, PartialType } from "@nestjs/mapped-types";
import {
  PreferencesDto,
  ProfileMetadata,
  SocialLinksDto,
} from "./profile-metadata.dto";
import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdatePreferencesDto extends PartialType(PreferencesDto) {}
export class UpdateSocialLinksDto extends PartialType(SocialLinksDto) {}

export class UpdateProfileMetadataDto extends PartialType(
  OmitType(ProfileMetadata, ["preferences", "socialLinks"] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePreferencesDto)
  @IsObject()
  preferences?: UpdatePreferencesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSocialLinksDto)
  @IsObject()
  socialLinks?: UpdateSocialLinksDto;
}

export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileMetadataDto)
  @IsObject()
  metadata?: UpdateProfileMetadataDto;
}
