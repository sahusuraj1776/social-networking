import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('post_attachments')
export class PostAttachmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  // Only URL from Media Service ✅
  @Column()
  url: string;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}