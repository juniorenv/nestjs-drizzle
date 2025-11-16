import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateCommentDto } from "./create-comment.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

@AtLeastOneField(["text"])
export class UpdateCommentDto extends PartialType(
  PickType(CreateCommentDto, ["text"] as const),
) {}
