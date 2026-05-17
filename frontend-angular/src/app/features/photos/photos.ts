import { Component, inject, Inject, signal } from '@angular/core';
import { MainLayout } from '../../core/layout/main-layout/main-layout';
import { HttpClient } from '@angular/common/http';
import { AUTH_TOKEN_KEY } from '../../core/auth/auth.model';


type Photo = {
  id: number;
  url: string;
  type:string;
};

type Attachment = {
  id:number;
  url: string;
  type: string;
};

type User = {
  id: number;
  name: string;
  profileUrl: string | null;
  email: string;
}

type Post = {
  id: number;
  userid: number;
  text: string | null;
  likeCount: number;
  user: User;
  showAll: boolean;
  attachment: Attachment[];
  likedUsersIds: number[];
}

@Component({
  selector: 'app-photos',
  imports: [MainLayout],
  templateUrl: './photos.html',
  styleUrl: './photos.css',
})
export class Photos {
  // ✅ Dummy photos array (same as React)
  private readonly http = inject(HttpClient)

  readonly photos = signal<Photo[]>([]);

ngOnInit() {
  this.http.get<Post[]>(
    'http://localhost:4000/api/post/user',
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
      }
    }
  ).subscribe({
    next: (posts) => {
      this.photos.update(current => {
        const newPhotos: Photo[] = [];

        posts.forEach(post => {
          post?.attachment?.forEach(a => {
            newPhotos.push({
              id: a.id,
              url: a.url,
              type: a.type
            });
          });
        });

        return [...current, ...newPhotos];
      });
    }
  });
}
}
