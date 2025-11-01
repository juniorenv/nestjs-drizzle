import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentEntity } from "./dto/comment.types";

@Controller("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(":commentId")
  public async findOne(@Param("commentId", ParseUUIDPipe) commentId: string) {
    return this.commentService.findOne(commentId);
  }

  @Post()
  public async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.create(createCommentDto);
  }

  @Delete(":commentId")
  public async delete(
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ): Promise<CommentEntity> {
    return this.commentService.delete(commentId);
  }

  @Patch(":commentId")
  public async update(
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.update(commentId, updateCommentDto);
  }
}
