import { ProfileMetadata } from "./profile-metadata.types";

export class CreateProfileDto {
  userId: string;
  metadata: ProfileMetadata;
}
