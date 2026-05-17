import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostAttachmentEntity } from './entity/attachment.entity';
import { PostEntity } from './entity/post.entity';
import { PostCommentEntity } from './entity/comment.entity';
import { PostLikeEntity } from './entity/post-like.entity';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {name:'USER_SERVICE',transport:Transport.TCP,options:{host:'localhost',port:4002}}
    ]),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:DB_PORT,
      database:DB_DATABASE,
      entities:[PostAttachmentEntity,PostEntity,PostCommentEntity,PostLikeEntity],
      username:DB_USERNAME,
      password:DB_PASSWORD,
      synchronize:true
    }),
    TypeOrmModule.forFeature([PostAttachmentEntity,PostEntity,PostCommentEntity,PostLikeEntity]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
