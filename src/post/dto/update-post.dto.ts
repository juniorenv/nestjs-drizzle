import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

@AtLeastOneField(["title", "content"])
export class UpdatePostDto extends PartialType(CreatePostDto) {}
