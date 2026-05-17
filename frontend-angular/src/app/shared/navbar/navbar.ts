import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../core/auth/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import { ToastService } from '../../core/services/toast.service';

type NavLink = { name: string; path: string };

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,ReactiveFormsModule,FontAwesomeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  // open state for mobile dropdown
  readonly open = signal(false);

  // Auth signals
  readonly isLoggedIn = this.auth.isLoggedIn;

  // ✅ FontAwesome icon
  readonly faUser = faUser;

  // Nav links
  readonly navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Members', path: '/members' },
    { name: 'Groups', path: '/groups' },
    { name: 'Photos', path: '/photos' },
    { name: 'Profile', path: '/profile' },
  ];

  
  // ✅ Login form (replaces email/password useState)
  readonly loginForm = this.fb.group({
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { validators: [Validators.required] }),
  });

  // Useful for template
  readonly emailCtrl = this.loginForm.controls.email;
  readonly passwordCtrl = this.loginForm.controls.password;

  toggleMenu(): void {
    this.open.update(v => !v);
  }

  closeMenu(): void {
    this.open.set(false);
  }

  // React submitForm()
  submitForm(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();
    
  this.auth.login(email, password).subscribe({
    next: (user) => {
      // ✅ now both token + user are set
      this.toast.success(`Welcome ${user.name}!`);
      this.router.navigateByUrl('/');
      this.open.set(false)
      this.loginForm.controls.email.setValue("")
      this.loginForm.controls.password.setValue("")

    },
    error: (err) => {
      this.toast.error(err.error.message)
    }
  });

  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }

  goToSignup(): void {
    this.closeMenu();
    this.router.navigateByUrl('/signup');
  }
}
