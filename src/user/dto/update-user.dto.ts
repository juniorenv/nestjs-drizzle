import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

@AtLeastOneField(["name", "email"])
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ["name", "email"] as const),
) {}
