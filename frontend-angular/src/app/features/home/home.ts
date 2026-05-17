import { Component, inject, signal } from '@angular/core';
import { MainLayout } from "../../core/layout/main-layout/main-layout";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { AUTH_TOKEN_KEY } from '../../core/auth/auth.model';
import { Auth } from '../../core/auth/auth';



type Attachment = {
  url: string;
  type: string;
};

type User = {
  id: number;
  name: string;
  profileUrl: string | null;
  email: string;
}
type Comment = {
  id: number;
  postId: number;
  userId: number;
  text: string;
}
type newPost = {
  id: number;
  userid: number;
  text: string | null;
  likeCount: number;
  user: User;
  comments: Comment[];
  showAll: boolean;
  attachments: Attachment[];
  likedUsersIds: number[];
}

@Component({
  selector: 'app-home',
  imports: [MainLayout, FontAwesomeModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(Auth);

  readonly user = this.auth.user;
  // ✅ Icons
  readonly faUser = faUser;
  // ✅ POSTS (useState → signal)
  readonly posts = signal<newPost[]>([]);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts(): void {
    this.http.get<newPost[]>(
      'http://localhost:4000/api/post',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        }
      }
    ).subscribe({
      next: posts => {
        this.posts.set(posts); // 🔥 rerender happens here
      },
      error: err => this.toast.error(err.message)
    });
  }
  // ✅ Comment input per post
  readonly commentText = signal<Record<number, string>>({});

  // ✅ Wall post
  readonly wallText = signal('');
  readonly wallAttachments = signal<Attachment[]>([]);
  readonly wallFileAttachments = signal<File[]>([]);
  // -----------------------------
  // WALL HANDLERS
  // -----------------------------
  onWallTextInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.wallText.set(value);
  }

  handleWallFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.wallAttachments.update(list => [
      ...list,
      { url: URL.createObjectURL(file), type: file.type },
    ]);
    this.wallFileAttachments.update(prevFile => [...prevFile, file])
    input.value = '';
  }

  // submitWallPost(): void {
  //           console.log(this.wallFileAttachments())
  //   if (!this.wallText().trim() && this.wallAttachments().length === 0) return;

  //   this.http.post<{id:number}>(`http://localhost:4000/api/post`,{text:this.wallText()},{headers:{Authorization:`Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
  //     next:(value)=> {
  //       console.log(this.wallAttachments().length)
  //       if(this.wallAttachments().length > 0){
  //         console.log(value)
  //         let i = 0;
  //         while(this.wallAttachments().length > i){
  //           console.log(this.wallFileAttachments())
  //           this.http.post(`http://localhost:4000/api/post/attachment`,{postId:value.id,file:this.wallFileAttachments()[i]},{headers:{Authorization:`Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
  //           next:(value)=> {
  //             this.toast.success("Post Added Successfully!!")
  //           },
  //           error:(err)=> {
  //             this.toast.error(err.message)
  //           },
  //         })
  //         i++;
  //         }
  //       }else{
  //         this.toast.success("Post Added Successfully!!")
  //   this.wallText.set('');
  //   this.wallAttachments.set([]);
  //   this.wallFileAttachments.set([]);
  //       }
  //     },
  //     error:(err)=> {
  //       this.toast.error(err.message)
  //   this.wallText.set('');
  //   this.wallAttachments.set([]);
  //   this.wallFileAttachments.set([]);
  //     },
  //   })
  // }
  uploadAttachment(postId: number, file: File) {
    const formData = new FormData();
    formData.append('postId', postId.toString());
    formData.append('file', file); // VERY IMPORTANT

    return this.http.post(
      'http://localhost:4000/api/post/attachment',
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
          // ❌ DON'T set Content-Type manually
        }
      }
    );
  }
  submitWallPost(): void {
    if (!this.wallText().trim() && this.wallFileAttachments().length === 0) return;

    this.http.post<{ id: number }>(
      'http://localhost:4000/api/post',
      { text: this.wallText() },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        }
      }
    ).subscribe({
      next: (res) => {
        const postId = res.id;

        // ✅ If no attachments, finish immediately
        if (this.wallFileAttachments().length === 0) {
          this.onPostSuccess();
          return;
        }

        // ✅ Upload all attachments
        let uploaded = 0;
        const total = this.wallFileAttachments().length;

        this.wallFileAttachments().forEach(file => {
          this.uploadAttachment(postId, file).subscribe({
            next: () => {
              uploaded++;
              if (uploaded === total) {
                this.onPostSuccess();
              }
            },
            error: err => {
              this.toast.error('Attachment upload failed');
              console.error(err);
            }
          });
        });
      },
      error: err => {
        this.toast.error(err.message);
      }
    });
  }

  private onPostSuccess(): void {
    this.toast.success('Post Added Successfully!!');

    this.wallText.set('');
    this.wallAttachments.set([]);
    this.wallFileAttachments.set([]);

    this.loadPosts(); // ✅ THIS triggers rerender
  }
  // =============================
  // POST ACTIONS
  // =============================

  likePost(postId: number): void {
    this.http.post(`http://localhost:4000/api/post/like`,{postId},{headers:{Authorization: `Bearer: ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
     next:(value)=> {
    //   this.posts.update(posts =>
    //   posts.map(p =>
    //     p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p
    //   )
    // );
    this.loadPosts()
     }, 
     error:(err)=> {
       this.toast.error(err.message)
     },
    })
  }

  unlikePost(postId: number): void {
    this.http.post(`http://localhost:4000/api/post/unlike`,{postId},{headers:{Authorization: `Bearer: ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
     next:(value)=> {
    //   this.posts.update(posts =>
    //   posts.map(p =>
    //     p.id === postId ? { ...p, likeCount: p.likeCount - 1 } : p
    //   )
    // );
    this.loadPosts()
     }, 
     error:(err)=> {
       this.toast.error(err.message)
     },
    })
  }

  toggleComments(postId: number): void {
    this.posts.update(posts =>
      posts.map(p =>
        p.id === postId ? { ...p, showAll: !p.showAll } : p
      )
    );
  }

  // ✅ Template-safe getter for comment input value
  commentValue(postId: number): string {
    return this.commentText()[postId] ?? '';
  }

  // ✅ Template-safe setter for comment input
  onCommentInput(postId: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.commentText.update(map => ({ ...map, [postId]: value }));
  }

  addComment(postId: number): void {
    this.http.post(`http://localhost:4000/api/post/comment`,{postId,text:this.commentText()[postId]},{headers:{Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
      next:(value)=> {
        this.commentText()[postId] = ""
        this.loadPosts()
      },
      error:(err)=>{this.toast.error(err.message)}
    })
  }

  handleFileUpload(postId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file',file);
    formData.append('postId',postId.toString());
    this.http.post(`http://localhost:4000/api/post/attachment`,formData,{headers: {Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`}}).subscribe({
      next:(value)=> {
        this.toast.success("Posted Successfully")
        this.loadPosts()
      },
      error:(err)=> {
        this.toast.error(err.message)
      },
    })
    input.value = '';
  }

}
