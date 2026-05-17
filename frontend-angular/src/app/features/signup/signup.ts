import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { HttpClient } from '@angular/common/http';


type SignupFormValue = {
  name: string;
  email: string;
  password: string;
};

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService)

  // Read returnUrl if present (from guard redirect)
  private readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
  
  // ✅ Reactive form (typed)
  readonly form = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required] }),
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', { validators: [Validators.required, Validators.minLength(4)] }),
  });
  
  // convenience getters (optional)
  get name() { return this.form.controls.name; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  handleSubmit(): void {
    // Touch all controls to show any errors
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      alert('All fields are required!');
      return;
    }

    const value: SignupFormValue = this.form.getRawValue();
    this.http.post('http://localhost:4000/api/auth/register',value).subscribe({
      next:()=> {
        this.toast.success('User Registered Successfully')
      },
      error:(err)=> {
        this.toast.error(err.error.message)
        return ;
      },

    })
    // ✅ Auto login (same as your AuthContext.login)
    // this.auth.login(value.email, value.password).subscribe({
    //   next: (user) => {
    //     // ✅ now both token + user are set
    //     this.toast.success(`Welcome ${user.name}!`);
    //     this.router.navigateByUrl('/');
    //   },
    //   error: (err) => {
    //     this.toast.error(err.error.message)
    //   }
    // })

    // ✅ Redirect after signup:
    // If user came from a protected page -> go back there
    // else -> go to "/"
    this.router.navigateByUrl(this.returnUrl);
  }

  // Matches your "Login" click behavior
  goToLogin(): void {
    // In your React, clicking "Login" navigates to "/"
    // Here we do same. If not logged in, guard will redirect to login-required.
    this.router.navigateByUrl('/');
  }


}
