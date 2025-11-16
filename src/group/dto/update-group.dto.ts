import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateGroupDto } from "./create-group.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

@AtLeastOneField(["name"])
export class UpdateGroupDto extends PartialType(
  PickType(CreateGroupDto, ["name"] as const),
) {}
