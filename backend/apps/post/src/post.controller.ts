import { Controller, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddAttachmentDto, AddCommentDto, CreatePostDto, LikePostDto } from './dto/dto';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) { }

  @MessagePattern({ cmd: 'post.createPost' })
  createPost(@Payload('body') dto: CreatePostDto, @Payload('userId') userId: number) {
    return this.postService.createPost(dto, userId);
  }

  @MessagePattern({cmd:'post.getPostOfUserById'})
  getPostOfUserById(@Payload('userId')userId:number){
    return this.postService.getPostOfUserById(userId);
  }

  @MessagePattern({cmd:'post.getPostById'})
  getPostById(@Payload('postId')id:number){
    return this.postService.getPostById(id);
  }

  @MessagePattern({ cmd: 'post.getfeed' })
  getFeed() {
    return this.postService.getFeed();
  }

  @MessagePattern({ cmd: 'post.like' })
  like(@Payload('body') dto: LikePostDto,@Payload('userId')userId:number) {
    console.log("Inside Post")
    return this.postService.likePost(dto,userId);
  }

  @MessagePattern({ cmd: 'post.unlike' })
  unlike(@Payload('body') dto, @Payload('userId') userId) {
    return this.postService.unlikePost(dto.postId, userId);
  }

  @MessagePattern({ cmd: 'post.addComment' })
  addComment(@Payload('body') dto: AddCommentDto,@Payload('userId')userId:number) {
    return this.postService.addComment(dto,userId);
  }

  @MessagePattern({ cmd: 'post.addAttachment' })
  addAttachment(@Payload() dto: AddAttachmentDto) {
    return this.postService.addAttachment(dto);
  }
}