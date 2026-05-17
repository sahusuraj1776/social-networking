import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-required',
  imports: [RouterLink],
  templateUrl: './login-required.html',
  styleUrl: './login-required.css',
})
export class LoginRequired {}
