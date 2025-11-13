import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
  @IsUUID()
  authorId: string;

  @IsUUID()
  postId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(280)
  text: string;
}
