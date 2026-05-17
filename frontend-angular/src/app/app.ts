import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./shared/navbar/navbar";
import { filter } from 'rxjs';
import { Footer } from "./shared/footer/footer";
import { Auth } from './core/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  // Track current url (similar to useLocation().pathname)
  readonly currentUrl = signal<string>(this.router.url);

  // Hide navbar ONLY on /signup
  readonly hideNavbar = computed(() => this.currentUrl() === '/signup');

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e) => this.currentUrl.set(e.urlAfterRedirects));


    if (this.auth.token() && !this.auth.user()) {
      this.auth.getUser().subscribe();
    }

    // ✅ AUTO-REDIRECT ON LOGOUT (even without navigation)
    effect(() => {
      const loggedIn = this.auth.isLoggedIn();
      const url = this.currentUrl();

      const isPublic = url.startsWith('/signup') || url.startsWith('/login-required');
      if (!loggedIn && !isPublic) {
        this.router.navigateByUrl('/login-required');
      }
    });
  }

}
