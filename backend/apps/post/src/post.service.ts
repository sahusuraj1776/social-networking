import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { In, Repository } from 'typeorm';
import { PostCommentEntity } from './entity/comment.entity';
import { PostAttachmentEntity } from './entity/attachment.entity';
import { AddAttachmentDto, AddCommentDto, CreatePostDto, LikePostDto } from './dto/dto';
import { PostLikeEntity } from './entity/post-like.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,

    @InjectRepository(PostCommentEntity)
    private commentRepo: Repository<PostCommentEntity>,

    @InjectRepository(PostAttachmentEntity)
    private attachmentRepo: Repository<PostAttachmentEntity>,

    @InjectRepository(PostLikeEntity)
    private likeRepo: Repository<PostLikeEntity>,

    @Inject('USER_SERVICE') private readonly userClient:ClientProxy,
  ) {}

  // ✅ Create post
  async createPost(dto: CreatePostDto,userId) {
    const post = this.postRepo.create({text:dto.text,userId});
    return await this.postRepo.save(post);
  }

  async getPostOfUserById(userId:number){
    const posts = await this.postRepo.find({where:{userId}});
    const attachment = await this.attachmentRepo.find({where:{postId: In(posts.map(p=>p.id))}})
    return posts.map(p=>({
      ...p,
      attachment:attachment.filter(a=>p.id===a.postId)
    }))
  }

  // ✅ Get feed
  async getFeed() {
    const posts = await this.postRepo.find({
      order: { createdAt: 'DESC' },
    });

    const postIds = posts.map(p => p.id);

    const userIds = posts.map(p=>p.userId);

    const users:any[] = await firstValueFrom(this.userClient.send({cmd:'user.findUsersByIds'},{ids:userIds}))

    const comments = await this.commentRepo.find({
      where: { postId: In(postIds) },
    });

    const attachments = await this.attachmentRepo.find({
      where: { postId: In(postIds) },
    });

    const likedBy = await this.likeRepo.find();
    return posts.map(post => ({
      ...post,
      user:users.filter(u=>u.id === post.userId).at(0),
      comments: comments.filter(c => c.postId === post.id),
      attachments: attachments.filter(a => a.postId === post.id),
      likedUsersIds: likedBy.filter(l=>l.postId === post.id).map(val => val.userId)
    }));
  }

  async getPostById(id:number){
    return await this.postRepo.findOne({where:{id}})
  }

  // ✅ Add comment
  async addComment(dto: AddCommentDto,userId:number) {
    const comment = this.commentRepo.create({...dto,userId});
    await this.commentRepo.save(comment);

    await this.postRepo.increment(
      { id: dto.postId },
      'commentCount',
      1,
    );

    return comment;
  }

  // ✅ Attach media (URL only)
  async addAttachment(dto: AddAttachmentDto) {
    const attachment = this.attachmentRepo.create(dto);
    return this.attachmentRepo.save(attachment);
  }

  async likePost(dto: LikePostDto,userId:number) {
  try {
    const likedPost = await this.likeRepo.findOne({where:{postId:dto.postId,userId}})
  if(likedPost){
    throw new RpcException({message:"You Already liked this Post",status:HttpStatus.BAD_REQUEST})
  }
    const like = this.likeRepo.create({postId:dto.postId,userId});
    await this.likeRepo.save(like);

    // ✅ increment only once
    await this.postRepo.increment(
      { id: dto.postId },
      'likeCount',
      1,
    );

  } catch (err) {
    // ✅ user already liked — ignore
    if (err.code !== '23505') { // postgres unique violation
      throw err;
    }
    throw new RpcException(err.error)

  }

  return await this.postRepo.findOneBy({ id: dto.postId });
}

async unlikePost(postId: number, userId: number) {
  const likedPost = await this.likeRepo.findOne({where:{postId,userId}})
  if(!likedPost){
    throw new RpcException({message:"You didn't liked this Post",status:HttpStatus.BAD_REQUEST})
  }
  const result = await this.likeRepo.delete({ postId, userId });

  if (result.affected) {
    await this.postRepo.decrement(
      { id: postId },
      'likeCount',
      1,
    );
  }
  return await this.postRepo.findOne({where:{id:postId}})

}
}