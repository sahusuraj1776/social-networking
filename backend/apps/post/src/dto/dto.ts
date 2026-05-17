export class CreatePostDto {
  text?: string;
}

export class AddCommentDto {
  postId: number;
  text: string;
}

export class AddAttachmentDto {
  postId: number;
  url: string;
  type: string;
}


export class LikePostDto {
  postId: number;
}
