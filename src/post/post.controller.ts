import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  Patch,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostEntity } from "./dto/post.types";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(":postId")
  public async findOne(
    @Param("postId", ParseUUIDPipe) postId: string,
  ): Promise<PostEntity> {
    return this.postService.findOne(postId);
  }

  @Post(":authorId")
  public async create(
    @Param("authorId", ParseUUIDPipe) authorId: string,
    @Body() post: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postService.create(authorId, post);
  }

  @Delete(":postId")
  public async delete(
    @Param("postId", ParseUUIDPipe) postId: string,
  ): Promise<PostEntity> {
    return this.postService.delete(postId);
  }

  @Patch(":postId")
  public async update(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.update(postId, updatePostDto);
  }
}
