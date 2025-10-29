import { ProfileMetadata } from "./profile-metadata.types";

export class UpdateProfileDto {
  metadata?: Partial<ProfileMetadata>;
}
