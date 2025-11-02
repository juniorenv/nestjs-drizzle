import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { groups } from "src/drizzle/schema/groups.schema";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupEntity } from "./dto/group.types";

@Injectable()
export class GroupService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private async checkGroupNameTaken(name: string): Promise<void> {
    const foundGroup = await this.db.query.groups.findFirst({
      where: eq(groups.name, name),
      columns: {
        id: true,
      },
    });

    if (foundGroup) {
      throw new ConflictException(`Group ${name} already exists`);
    }
  }

  public async findOne(groupId: string): Promise<GroupEntity> {
    const foundGroup = await this.db.query.groups.findFirst({
      where: eq(groups.id, groupId),
      with: {
        usersToGroups: {
          columns: { groupId: false, userId: false },
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });

    if (!foundGroup) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return foundGroup;
  }

  public async create(group: CreateGroupDto): Promise<GroupEntity> {
    await this.checkGroupNameTaken(group.name);

    const [createdGroup] = await this.db
      .insert(groups)
      .values(group)
      .returning();

    return createdGroup;
  }

  public async delete(groupId: string): Promise<GroupEntity> {
    const [deletedGroup] = await this.db
      .delete(groups)
      .where(eq(groups.id, groupId))
      .returning();

    if (!deletedGroup) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return deletedGroup;
  }

  public async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    if (updateGroupDto.name) {
      const existingGroup = await this.db.query.groups.findFirst({
        where: eq(groups.name, updateGroupDto.name),
        columns: { id: true },
      });

      if (existingGroup && existingGroup.id !== groupId) {
        throw new ConflictException(
          `Group ${updateGroupDto.name} already exists`,
        );
      }
    }

    const [updatedGroup] = await this.db
      .update(groups)
      .set({ ...updateGroupDto, updatedAt: new Date() })
      .where(eq(groups.id, groupId))
      .returning();

    if (!updatedGroup) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return updatedGroup;
  }
}
