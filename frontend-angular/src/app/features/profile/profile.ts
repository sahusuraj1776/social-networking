import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { MainLayout } from '../../core/layout/main-layout/main-layout';
import { HttpClient } from '@angular/common/http';
import { AUTH_TOKEN_KEY, AuthUser } from '../../core/auth/auth.model';
import { ToastService } from '../../core/services/toast.service';

/* ======================
   TYPES
====================== */

type WallAttachment = {
  url: string;   // preview URL
  type: string;  // mime type
};

type UserProfile = {
  name: string;
  email: string;
  city: string | null;
  gender: string | null;
  profession: string | null;
  profileUrl: string | null;
};

@Component({
  selector: 'app-profile',
  imports: [FontAwesomeModule, ReactiveFormsModule, MainLayout],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  /* ======================
     INJECTIONS
  ====================== */

  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  /* ======================
     ICONS
  ====================== */

  readonly faUser = faUser;

  /* ======================
     SIGNAL STATES
  ====================== */

  readonly photoVersion = signal(Date.now());

  readonly user = signal<UserProfile>({
    name: '',
    email: '',
    city: '',
    gender: '',
    profession: '',
    profileUrl: null,
  });

  readonly isEditing = signal(false);
  readonly editPhoto = signal<string | null>(null);
  readonly editPhotoFile = signal<File | null>(null);

  // ✅ WALL (HOME‑LIKE)
  readonly wallText = signal('');

  // ✅ For UI PREVIEW (same as Home)
  readonly wallAttachments = signal<WallAttachment[]>([]);

  // ✅ For BACKEND UPLOAD
  readonly wallFileAttachments = signal<File[]>([]);

  /* ======================
     REACTIVE FORM
  ====================== */

  readonly editForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    city: this.fb.control<string | null>('', Validators.required),
    gender: this.fb.control<UserProfile['gender']>('Male', Validators.required),
    profession: this.fb.control<string | null>('', Validators.required),
  });

  /* ======================
     INIT
  ====================== */

  ngOnInit(): void {
    this.http.get<AuthUser>(
      'http://localhost:4000/api/user/me',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        }
      }
    ).subscribe({
      next: (user) => {
        const v = Date.now();
        this.photoVersion.set(v);
        this.user.set({
          ...user,
          profileUrl: user.profileUrl
            ? `http://localhost:4000/media/${user.profileUrl}?v=${v}`
            : null
        });
      },
      error: err => {
        this.toast.error(err?.error?.message ?? 'Failed to load profile');
      }
    });
  }

  /* ======================
     PROFILE EDIT
  ====================== */

  handleEdit(): void {
    const u = this.user();

    this.editForm.reset({
      name: u.name,
      email: u.email,
      city: u.city,
      gender: u.gender,
      profession: u.profession,
    });

    this.editPhoto.set(u.profileUrl);
    this.isEditing.set(true);
  }

  handleCancel(): void {
    this.editPhoto.set(this.user().profileUrl);
    this.isEditing.set(false);
  }

  handlePhotoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.editPhoto.set(URL.createObjectURL(file));
    this.editPhotoFile.set(file);
    input.value = '';
  }

  handleSave(): void {
    const value = this.editForm.getRawValue();
    const fd = new FormData();

    fd.append('name', value.name);
    fd.append('city', value.city ?? '');
    fd.append('gender', value.gender ?? '');
    fd.append('profession', value.profession ?? '');

    if (this.editPhotoFile()) {
      fd.append('file', this.editPhotoFile()!);
    }

    this.http.patch<AuthUser>(
      'http://localhost:4000/api/user',
      fd,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
        }
      }
    ).subscribe({
      next: updated => {
        const v = Date.now();
        this.photoVersion.set(v);

        this.user.set({
          name: updated.name,
          email: updated.email,
          city: updated.city,
          gender: updated.gender,
          profession: updated.profession,
          profileUrl: updated.profileUrl
            ? `http://localhost:4000/media/${updated.profileUrl}?v=${v}`
            : null
        });

        this.isEditing.set(false);
        this.editPhotoFile.set(null);
        this.editPhoto.set(this.user().profileUrl);

        this.toast.success('Profile updated successfully ✅');
      },
      error: err => {
        this.toast.error(err?.error?.message ?? 'Update failed');
      }
    });
  }

  /* ======================
     WALL (HOME‑LIKE)
  ====================== */

  onWallTextInput(event: Event): void {
    this.wallText.set((event.target as HTMLTextAreaElement).value);
  }

  handleWallUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // ✅ UI PREVIEW (same as Home)
    this.wallAttachments.update(list => [
      ...list,
      {
        url: URL.createObjectURL(file),
        type: file.type,
      }
    ]);

    // ✅ REAL FILE FOR UPLOAD
    this.wallFileAttachments.update(list => [...list, file]);

    input.value = '';
  }

  uploadAttachment(postId: number, file: File) {
    const fd = new FormData();
    fd.append('postId', postId.toString());
    fd.append('file', file);

    return this.http.post(
      'http://localhost:4000/api/post/attachment',
      fd,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`
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
      next: res => {
        const postId = res.id;

        if (this.wallFileAttachments().length === 0) {
          this.onPostSuccess();
          return;
        }

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
            error: () => this.toast.error('Attachment upload failed')
          });
        });
      },
      error: err => {
        this.toast.error(err?.error?.message ?? 'Post creation failed');
      }
    });
  }

  private onPostSuccess(): void {
    this.toast.success('Post Added Successfully ✅');
    this.wallText.set('');
    this.wallAttachments.set([]);
    this.wallFileAttachments.set([]);
  }
}