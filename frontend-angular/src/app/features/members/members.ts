import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { MainLayout } from '../../core/layout/main-layout/main-layout';
import { AUTH_TOKEN_KEY } from '../../core/auth/auth.model';
import { ToastService } from '../../core/services/toast.service';
import { Auth } from '../../core/auth/auth';

type Member = {
  id: number;
  name: string;
  email: string;
  city: string;
  gender: string;
  profession: string;
  profileUrl: string;
};

@Component({
  selector: 'app-members',
  imports: [MainLayout, FontAwesomeModule],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  readonly faUser = faUser;

  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly toast = inject(ToastService);

  readonly members = signal<Member[]>([]);
  readonly user = this.auth.user;

  readonly followers = signal<Member[]>([]);
  readonly followings = signal<Member[]>([]);

  // ✅ Busy state per member (prevents double click)
  readonly busyIds = signal<Set<number>>(new Set<number>());

  // ✅ Fast lookup by id (fixes your incorrect includes())
  readonly followerIds = computed(() => new Set(this.followers().map(m => Number(m.id))));
  readonly followingIds = computed(() => new Set(this.followings().map(m => Number(m.id))));

  isFollower(memberId: number): boolean {
    return this.followerIds().has(Number(memberId));
  }

  isFollowing(memberId: number): boolean {
    return this.followingIds().has(Number(memberId));
  }

  isBusy(memberId: number): boolean {
    return this.busyIds().has(Number(memberId));
  }

  private headers() {
    return { Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY) ?? ''}` };
  }

  ngOnInit() {
    this.loadMembers();
    this.refreshFollowLists();
  }

  private loadMembers() {
    this.http.get<Member[]>('http://localhost:4000/api/user/', { headers: this.headers() })
      .subscribe({
        next: (response) => {
          const myId = this.user()?.id;
          this.members.set(myId ? response.filter(mem => mem.id !== myId) : response);
        },
        error: (err) => this.toast.error(err?.error?.message ?? 'Failed to load members'),
      });
  }

  private refreshFollowLists() {
    this.http.get<Member[]>('http://localhost:4000/api/follow/follower', { headers: this.headers() })
      .subscribe({
        next: (resp) => this.followers.set(resp),
        error: (err) => this.toast.error(err?.error?.message ?? 'Failed to load followers'),
      });

    this.http.get<Member[]>('http://localhost:4000/api/follow/following', { headers: this.headers() })
      .subscribe({
        next: (resp) => this.followings.set(resp),
        error: (err) => this.toast.error(err?.error?.message ?? 'Failed to load followings'),
      });
  }

  // ✅ Helper to mark busy
  private setBusy(memberId: number, busy: boolean) {
    this.busyIds.update(prev => {
      const next = new Set(prev);
      if (busy) next.add(Number(memberId));
      else next.delete(Number(memberId));
      return next;
    });
  }

  // -------------------------
  // ✅ FOLLOW / UNFOLLOW (your methods + UI updates)
  // -------------------------
  follow(memberId: number) {
    if (this.isBusy(memberId)) return;

    this.setBusy(memberId, true);

    this.http.post<{ message: string }>(
      'http://localhost:4000/api/follow/follow',
      { id: memberId },
      { headers: this.headers() }
    ).subscribe({
      next: (response) => {
        this.toast.success(response.message);

        // ✅ Option A (recommended): refresh from backend (truth)
        this.refreshFollowLists();

        // ✅ Option B (optimistic): update followings locally (uncomment if you want instant without refetch)
        // const m = this.members().find(x => x.id === memberId);
        // if (m) this.followings.update(list => list.some(x => x.id === memberId) ? list : [...list, m]);
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Follow failed'),
      complete: () => this.setBusy(memberId, false),
    });
  }

  unfollow(memberId: number) {
    if (this.isBusy(memberId)) return;

    this.setBusy(memberId, true);

    this.http.post<{ message: string }>(
      'http://localhost:4000/api/follow/unfollow',
      { id: memberId },
      { headers: this.headers() }
    ).subscribe({
      next: (response) => {
        this.toast.success(response.message);

        // ✅ Option A: refresh from backend
        this.refreshFollowLists();

        // ✅ Option B (optimistic): remove locally
        // this.followings.update(list => list.filter(x => x.id !== memberId));
      },
      error: (err) => this.toast.error(err?.error?.message ?? 'Unfollow failed'),
      complete: () => this.setBusy(memberId, false),
    });
  }

  // ✅ Single click handler based on current relationship
  toggleFollow(member: Member) {
    if (this.isFollowing(member.id)) this.unfollow(member.id);
    else this.follow(member.id);
  }
}