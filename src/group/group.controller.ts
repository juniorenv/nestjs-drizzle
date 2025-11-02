import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ParseUUIDPipe,
  Body,
} from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupEntity } from "./dto/group.types";

@Controller("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(":groupId")
  public async findOne(@Param("groupId", ParseUUIDPipe) groupId: string) {
    return this.groupService.findOne(groupId);
  }

  @Post()
  public async create(@Body() group: CreateGroupDto): Promise<GroupEntity> {
    return this.groupService.create(group);
  }

  @Delete(":groupId")
  public async delete(
    @Param("groupId", ParseUUIDPipe) groupId: string,
  ): Promise<GroupEntity> {
    return this.groupService.delete(groupId);
  }

  @Patch(":groupId")
  public async update(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    return this.groupService.update(groupId, updateGroupDto);
  }
}
