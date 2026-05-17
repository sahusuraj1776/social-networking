import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('post_likes')
@Unique(['postId', 'userId'])
export class PostLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}