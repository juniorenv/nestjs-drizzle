import { Type } from "class-transformer";
import { ProfileMetadata } from "./profile-metadata.types";
import { IsObject, ValidateNested } from "class-validator";

export class CreateProfileDto {
  @ValidateNested()
  @Type(() => ProfileMetadata)
  @IsObject()
  metadata: ProfileMetadata;
}
